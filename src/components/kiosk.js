/**
 * ==========================================================================
 * KOMPONEN VANILLA JS: KIOSK
 * ==========================================================================
 * Kelas utama yang mengelola seluruh state dan logika aplikasi kiosk
 * Kriukology. Menggunakan pola State Machine untuk navigasi antar layar.
 *
 * Alur navigasi (state machine):
 * screensaver → preferensi → menu → keranjang → pembayaran → sukses → struk → (auto-reset ke screensaver)
 *
 * Arsitektur rendering:
 * - Semua template di-inject sebagai HTML string ke DOM
 * - Setiap state change memanggil render() yang update DOM secara imperatif
 * - Event handling via document-level delegation (data-action attributes)
 * - Text binding via data-text attributes
 * - Conditional rendering via data-screen + style.display
 * ==========================================================================
 */

import daftarMenu from '../data/menu.js'
import daftarKategori from '../data/kategori.js'
import daftarMetodePembayaran from '../data/pembayaran.js'
import kamus from '../data/kamus.js'
import formatRupiah from '../utils/format.js'
import mainkanSuara from '../utils/audio.js'

class KioskApp {
  constructor() {
    // ── State Aplikasi ─────────────────────────────────────────────────
    this.langkah = 'screensaver'
    this.bahasa = 'id'
    this.tipePesanan = ''
    this.kategoriAktif = 'promotion'
    this.keranjang = []
    this.tampilKonfirmasiBatal = false
    this.metodePembayaran = ''
    this.nomorAntrean = 'PD-001'
    this.timerIdle = null
    this.timerStruk = null
    this.timerPoster = null
    this.detikStruk = 15

    this.resetWaktuIdle()
    this.bindPeristiwa()
    this.render()
  }

  // ── PROPERTI TURUNAN (Computed) ─────────────────────────────────────

  /** Mendapatkan daftar menu berdasarkan kategori aktif */
  dapatkanMenuTampil() {
    return daftarMenu.filter(item => item.kategori === this.kategoriAktif)
  }

  /** Menghitung total harga seluruh item di keranjang */
  dapatkanTotalHarga() {
    return this.keranjang.reduce((jumlah, baris) => jumlah + baris.harga * baris.jumlah, 0)
  }

  /** Menghitung total jumlah item di keranjang */
  dapatkanJumlahItem() {
    return this.keranjang.reduce((jumlah, baris) => jumlah + baris.jumlah, 0)
  }

  // ── METODE INTI ─────────────────────────────────────────────────────

  /** Mengambil teks terjemahan dari kamus berdasarkan key */
  terjemahkan(kunci) {
    return kamus[this.bahasa][kunci] || kunci
  }

  /** Memulai pemesanan dari screensaver */
  mulaiPesan() {
    clearInterval(this.timerPoster)
    this.navigasiKe('preferensi')
  }

  /** Memulai rotasi poster screensaver dengan efek sliding */
  mulaiRotasiPoster() {
    clearInterval(this.timerPoster)
    let indeksSekarang = 0
    const semuaPoster = document.querySelectorAll('.poster-slide')
    if (semuaPoster.length <= 1) return

    this.timerPoster = setInterval(() => {
      // Poster saat ini keluar ke kiri
      semuaPoster[indeksSekarang].classList.remove('aktif')
      semuaPoster[indeksSekarang].classList.add('sebelumnya')

      // Poster berikutnya masuk dari kanan
      indeksSekarang = (indeksSekarang + 1) % semuaPoster.length
      semuaPoster[indeksSekarang].classList.remove('sebelumnya')
      semuaPoster[indeksSekarang].classList.add('aktif')

      // Setelah transisi selesai, reset poster yang keluar tanpa animasi
      const indeksBersihkan = (indeksSekarang - 1 + semuaPoster.length) % semuaPoster.length
      setTimeout(() => {
        // Disable transisi agar snap ke posisi awal (kanan, off-screen)
        semuaPoster[indeksBersihkan].style.transition = 'none'
        semuaPoster[indeksBersihkan].classList.remove('sebelumnya')
        // Force reflow agar posisi langsung diterapkan
        semuaPoster[indeksBersihkan].offsetHeight
        // Enable transisi lagi untuk cycle berikutnya
        semuaPoster[indeksBersihkan].style.transition = ''
      }, 850)
    }, 6000)
  }

  /** Navigasi ke layar tertentu */
  navigasiKe(langkahBerikutnya) {
    mainkanSuara()
    if (langkahBerikutnya === 'preferensi') {
      this.tipePesanan = ''
    }
    this.langkah = langkahBerikutnya
    this.resetWaktuIdle()
    this.render()
  }

  /** Reset timer idle timeout (60 detik) */
  resetWaktuIdle() {
    clearTimeout(this.timerIdle)
    const layarTanpaIdle = ['screensaver', 'sukses', 'struk']
    if (!layarTanpaIdle.includes(this.langkah)) {
      this.timerIdle = setTimeout(() => this.aturUlang(), 60000)
    }
  }

  /** Menambah atau mengurangi jumlah item di keranjang */
  ubahJumlah(indeks, jumlah) {
    const jumlahBaru = this.keranjang[indeks].jumlah + jumlah
    if (jumlahBaru < 1) {
      this.keranjang.splice(indeks, 1)
    } else {
      this.keranjang[indeks].jumlah = jumlahBaru
    }
    mainkanSuara()
    if (!this.keranjang.length) {
      this.tampilKonfirmasiBatal = false
      this.navigasiKe('menu')
    } else {
      this.render()
    }
  }

  /** Mendapatkan jumlah item tertentu di keranjang (by id produk) */
  dapatkanQtyItem(id) {
    const baris = this.keranjang.find(baris => baris.id === id)
    return baris ? baris.jumlah : 0
  }

  /** Menambahkan item langsung ke keranjang (tanpa modal kustomisasi) */
  tambahItemLangsung(id) {
    const item = daftarMenu.find(m => m.id === id)
    if (!item || item.habis) return

    const baris = this.keranjang.find(baris => baris.id === id)
    if (baris) {
      baris.jumlah += 1
    } else {
      this.keranjang.push({
        ...item,
        kustomisasi: { potongan: '', minuman: '', saus: '' },
        jumlah: 1,
        kunci: Date.now(),
      })
    }

    mainkanSuara()
    this.render()
  }

  /** Mengurangi jumlah item; jika 0, hapus dari keranjang */
  kurangiItemLangsung(id) {
    const indeks = this.keranjang.findIndex(baris => baris.id === id)
    if (indeks === -1) return

    this.keranjang[indeks].jumlah -= 1
    if (this.keranjang[indeks].jumlah <= 0) {
      this.keranjang.splice(indeks, 1)
    }

    mainkanSuara()
    this.render()
  }

  /** Membuka konfirmasi pembatalan pesanan */
  mintaBatalkanPesanan() {
    if (!this.keranjang.length) return
    this.tampilKonfirmasiBatal = true
    mainkanSuara()
    this.render()
  }

  /** Membatalkan seluruh pesanan setelah konfirmasi */
  batalkanPesanan() {
    this.keranjang = []
    this.tampilKonfirmasiBatal = false
    mainkanSuara()
    this.render()
  }

  /** Menutup konfirmasi pembatalan */
  tutupKonfirmasiBatalkan() {
    this.tampilKonfirmasiBatal = false
    this.render()
  }

  /** Memproses pesanan selesai */
  selesaikanPesanan() {
    mainkanSuara()
    const angkaAcak = Math.floor(Math.random() * 900) + 100
    this.nomorAntrean = `PD-${String(angkaAcak)}`
    this.langkah = 'sukses'
    this.render()

    setTimeout(() => {
      this.langkah = 'struk'
      this.mulaiTimerStruk()
      this.render()
    }, 2500)
  }

  /** Memulai timer countdown struk (15 detik) */
  mulaiTimerStruk() {
    this.detikStruk = 15
    clearInterval(this.timerStruk)
    this.timerStruk = setInterval(() => {
      this.detikStruk--
      this.perbaruiDetikStruk()
      if (this.detikStruk <= 0) {
        clearInterval(this.timerStruk)
        this.aturUlang()
      }
    }, 1000)
  }

  /** Reset seluruh state ke kondisi awal */
  aturUlang() {
    clearTimeout(this.timerIdle)
    clearInterval(this.timerStruk)
    this.langkah = 'screensaver'
    this.keranjang = []
    this.kategoriAktif = 'promotion'
    this.tampilKonfirmasiBatal = false
    this.metodePembayaran = ''
    this.render()
  }

  // ── PEMBEKUAN PERISTIWA (Event Binding) ─────────────────────────────

  /** Membekukan seluruh peristiwa klik dan keyboard */
  bindPeristiwa() {
    document.addEventListener('click', (e) => {
      const tombol = e.target.closest('[data-action]')
      if (!tombol) return
      this.tanganiAksi(tombol.dataset.action)
    })

    window.addEventListener('keydown', () => this.resetWaktuIdle())
  }

  /** Menangani aksi dari elemen yang diklik */
  tanganiAksi(aksi) {
    const [metode, argumen] = aksi.split(':')

    switch (metode) {
      case 'navigasiKe':
        if (argumen === 'keranjang' && !this.keranjang.length) return
        this.navigasiKe(argumen)
        break

      case 'mulaiPesan':
        this.mulaiPesan()
        break

      case 'aturUlang':
        this.aturUlang()
        break

      case 'setBahasa':
        this.bahasa = argumen
        mainkanSuara()
        this.render()
        break

      case 'setTipePesanan':
        this.tipePesanan = argumen
        mainkanSuara()
        this.render()
        break

      case 'setTipePesananDanLanjut':
        this.tipePesanan = argumen
        mainkanSuara()
        this.render()
        // Brief delay for visual feedback before navigating
        setTimeout(() => this.navigasiKe('menu'), 250)
        break

      case 'setKategori':
        this.kategoriAktif = argumen
        mainkanSuara()
        this.render()
        break

      case 'tambahItem': {
        this.tambahItemLangsung(Number(argumen))
        break
      }

      case 'kurangiItem': {
        this.kurangiItemLangsung(Number(argumen))
        break
      }

      case 'mintaBatalkan':
        this.mintaBatalkanPesanan()
        break

      case 'konfirmasiBatalkan':
        this.batalkanPesanan()
        break

      case 'batalKonfirmasi':
        this.tutupKonfirmasiBatalkan()
        break

      case 'kembaliPreferensi':
        this.tampilKonfirmasiBatal = false
        this.navigasiKe('preferensi')
        break

      case 'ubahJumlah': {
        const [indeks, jumlah] = argumen.split(',').map(Number)
        this.ubahJumlah(indeks, jumlah)
        break
      }

      case 'setMetodePembayaran':
        this.metodePembayaran = argumen
        mainkanSuara()
        this.render()
        setTimeout(() => this.selesaikanPesanan(), 300)
        break

      case 'selesaikanPesanan':
        this.selesaikanPesanan()
        break

      case 'hentiPenyebaran':
        break

      default:
        break
    }
  }

  // ── RENDERING ───────────────────────────────────────────────────────

  /** Render utama: memperbarui seluruh tampilan DOM */
  render() {
    const t = (kunci) => this.terjemahkan(kunci)

    // Sembunyikan semua layar, tampilkan hanya yang aktif
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.style.display = el.dataset.screen === this.langkah ? '' : 'none'
    })

    // Mulai rotasi poster jika di screensaver
    if (this.langkah === 'screensaver') {
      this.mulaiRotasiPoster()
    }

    // Perbarui semua teks berdasarkan data-text
    document.querySelectorAll('[data-text]').forEach(el => {
      const kunci = el.dataset.text
      if (kunci) el.textContent = t(kunci)
      el.style.display = ''
    })

    // Panggil render per layar
    this.renderPreferensi()
    this.renderMenu()
    this.renderKeranjang()
    this.renderPembayaran()
    this.renderStruk()
    this.renderSukses()
  }

  // ── HELPER: PEMBUATAN HTML ──────────────────────────────────────────

  /** Membuat HTML tombol kategori — clean borderless, teks merah saat aktif */
  buatHTMLKategori(kategori) {
    const aktif = this.kategoriAktif === kategori.id
    const kelasTeks = aktif
      ? 'text-[#d51f32] font-black'
      : 'text-[#231f20] font-semibold opacity-85 hover:opacity-100'
    const bgAktif = aktif ? 'bg-red-50/80 border-l-4 border-[#d51f32]' : 'hover:bg-stone-50'
    return `
      <button data-action="setKategori:${kategori.id}"
        class="w-full px-2 py-2 flex items-center gap-2.5 text-left transition rounded-lg ${bgAktif}">
        <i class="${kategori.icon} text-[#d51f32] text-base shrink-0 w-5 text-center"></i>
        <span class="text-[11px] leading-tight ${kelasTeks}">${kategori.label[this.bahasa]}</span>
      </button>`
  }

  /** Membuat HTML kartu item menu — lonjong ke bawah (vertical portrait), foto Unsplash besar eye-catching, ultra minimalist & clean */
  buatHTMLItemMenu(item) {
    const qty = this.dapatkanQtyItem(item.id)
    const habis = Boolean(item.habis)

    const overlayHabis = habis
      ? `<div class="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center rounded-t-2xl z-10">
           <span class="text-white font-black text-[10px] tracking-wider uppercase px-2 py-0.5 bg-black/50 rounded" data-text="stockOut">${this.terjemahkan('stockOut')}</span>
         </div>`
      : ''

    let kontrolBawah = ''
    if (habis) {
      kontrolBawah = `
        <button disabled
          class="w-full h-8 rounded-xl bg-stone-100 text-stone-400 font-bold text-[11px] border border-stone-200 cursor-not-allowed">
          <span data-text="add">${this.terjemahkan('add')}</span>
        </button>`
    } else if (qty > 0) {
      kontrolBawah = `
        <div class="flex items-center justify-end gap-3">
          <button data-action="kurangiItem:${item.id}" aria-label="kurangi"
            class="h-8 w-8 shrink-0 rounded-full border-2 border-[#d51f32] text-[#d51f32] flex items-center justify-center bg-white active:bg-[#d51f32]/10 transition">
            <i class="fa-solid fa-minus text-xs"></i>
          </button>
          <span class="min-w-5 text-center font-black text-lg text-[#d51f32] tabular-nums">${qty}</span>
          <button data-action="tambahItem:${item.id}" aria-label="tambah"
            class="h-8 w-8 shrink-0 rounded-full border-2 border-[#d51f32] text-[#d51f32] flex items-center justify-center bg-white active:bg-[#d51f32]/10 transition">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>`
    } else {
      kontrolBawah = `
        <button data-action="tambahItem:${item.id}"
          class="w-full h-8 rounded-xl bg-[#d51f32] text-white font-bold text-[11px] active:scale-[0.98] transition hover:bg-[#b81828] shadow-xs">
          <span data-text="add">${this.terjemahkan('add')}</span>
        </button>`
    }

    const srcGambar = item.gambar || '/assets/menu-placeholder.svg'

    return `
      <article class="rounded-2xl bg-white overflow-hidden border border-stone-100 shadow-[0_4px_16px_rgba(42,36,36,0.06)] flex flex-col justify-between transition-all duration-200 hover:shadow-md ${habis ? 'opacity-60 grayscale' : ''}">
        <div class="h-36 sm:h-40 relative overflow-hidden bg-stone-100 rounded-t-2xl shrink-0">
          <img src="${srcGambar}" alt="${item.nama}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
          ${overlayHabis}
        </div>
        <div class="p-2.5 flex flex-col flex-1 justify-between min-h-[85px]">
          <div>
            <p class="font-bold text-xs leading-snug text-[#231f20] line-clamp-2">${item.nama}</p>
            <p class="text-xs mt-1 font-black text-[#d51f32] tabular-nums">${formatRupiah(item.harga)}</p>
          </div>
          <div class="mt-2">
            ${kontrolBawah}
          </div>
        </div>
      </article>`
  }

  /** Membuat HTML detail kustomisasi (kosong jika tanpa modal) */
  buatDetailKustomisasi(kustomisasi) {
    if (!kustomisasi) return ''
    const bagian = [kustomisasi.potongan, kustomisasi.minuman, kustomisasi.saus]
      .filter(Boolean)
    return bagian.length ? bagian.join(' · ') : ''
  }

  /** Membuat HTML item di keranjang */
  buatHTMLItemKeranjang(baris, indeks) {
    const detail = this.buatDetailKustomisasi(baris.kustomisasi)
    const barisDetail = detail
      ? `<p class="text-[10px] leading-tight text-stone-500 mt-1">${detail}</p>`
      : ''
    return `
      <article class="flex items-center gap-3 min-h-[104px] rounded-[30px] bg-white px-3 py-3 shadow-[0_8px_22px_rgba(42,36,36,0.18)]">
        <div class="mini-food relative h-[72px] w-[78px] shrink-0 overflow-hidden rounded-2xl flex items-center justify-center">
          <img src="/assets/menu-placeholder.svg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-80">
          <span class="relative text-3xl drop-shadow">${baris.emoji || '🍗'}</span>
        </div>
        <div class="min-w-0 flex-1 self-stretch flex flex-col justify-between py-0.5">
          <div class="flex items-start justify-between gap-2">
            <p class="min-w-0 font-semibold text-sm leading-tight text-[#231f20]">${baris.nama}</p>
            <p class="shrink-0 font-semibold text-sm leading-tight text-[#231f20] tabular-nums">${formatRupiah(baris.harga * baris.jumlah)}</p>
          </div>
          ${barisDetail}
          <div class="flex items-center justify-end gap-3">
            <button data-action="ubahJumlah:${indeks},-1"
              aria-label="Kurangi ${baris.nama}"
              class="h-8 w-8 shrink-0 rounded-full border-2 border-[#d51f32] text-[#d51f32] flex items-center justify-center bg-white active:bg-[#d51f32]/10 transition">
              <i class="fa-solid fa-minus text-xs"></i>
            </button>
            <span class="min-w-5 text-center font-black text-lg text-[#d51f32] tabular-nums">${baris.jumlah}</span>
            <button data-action="ubahJumlah:${indeks},1"
              aria-label="Tambah ${baris.nama}"
              class="h-8 w-8 shrink-0 rounded-full border-2 border-[#d51f32] text-[#d51f32] flex items-center justify-center bg-white active:bg-[#d51f32]/10 transition">
              <i class="fa-solid fa-plus text-xs"></i>
            </button>
          </div>
        </div>
      </article>`
  }

  /** Membuat HTML 3 metode pembayaran (QRIS, Tunai, Debit) persis seperti sketsa layout */
  buatHTMLMetodePembayaran(metode) {
    const aktif = this.metodePembayaran === metode.id
    const kelasAktif = aktif
      ? 'bg-red-50/90 border-[#d51f32] text-[#d51f32] shadow-md ring-2 ring-[#d51f32]/25 scale-[1.03]'
      : 'bg-stone-50/40 hover:bg-stone-50 border-stone-100 text-[#231f20] hover:shadow-sm'

    let visualIcon = ''
    if (metode.id === 'qris') {
      visualIcon = `<div class="h-16 flex items-center justify-center">
        <div class="px-2.5 py-1 bg-[#231f20] text-white font-black text-sm tracking-tighter rounded-md flex items-center gap-1 border border-stone-700 shadow-xs">
          <i class="fa-solid fa-qrcode text-base text-[#d51f32]"></i>
          <span>QRIS</span>
        </div>
      </div>`
    } else if (metode.id === 'cash') {
      visualIcon = `<div class="h-16 flex items-center justify-center relative">
        <div class="w-12 h-8 rounded-md bg-emerald-100 border border-emerald-500 flex items-center justify-center shadow-xs">
          <span class="text-[10px] font-black text-emerald-800">Rp</span>
        </div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border border-amber-500 flex items-center justify-center shadow-xs">
          <span class="text-[9px] font-bold text-amber-950">$</span>
        </div>
      </div>`
    } else if (metode.id === 'debit') {
      visualIcon = `<div class="h-16 flex items-center justify-center relative">
        <div class="w-12 h-8 rounded-lg bg-amber-400 border border-amber-500 transform -rotate-12 absolute shadow-xs"></div>
        <div class="w-12 h-8 rounded-lg bg-sky-500 border border-sky-600 flex flex-col justify-between p-1 shadow-md relative z-10">
          <div class="w-2.5 h-2 bg-amber-300 rounded-xs"></div>
          <div class="flex justify-between items-center text-[7px] text-white">
            <span>••••</span>
          </div>
        </div>
      </div>`
    }

    return `
      <button data-action="setMetodePembayaran:${metode.id}"
        class="rounded-xl p-3 flex flex-col items-center justify-between text-center transition-all duration-200 border cursor-pointer ${kelasAktif}">
        ${visualIcon}
        <span class="text-xs sm:text-sm font-extrabold tracking-wide mt-2">${metode.label}</span>
      </button>`
  }

  /** Membuat HTML item di struk digital */
  buatHTMLItemStruk(baris) {
    const detail = this.buatDetailKustomisasi(baris.kustomisasi)
    const barisDetail = detail
      ? `<p class="text-[10px] text-stone-500 mt-1">${detail}</p>`
      : ''
    return `
      <div class="mb-3">
        <div class="flex justify-between font-bold">
          <span>${baris.nama} × ${baris.jumlah}</span>
          <span>${formatRupiah(baris.harga * baris.jumlah)}</span>
        </div>
        ${barisDetail}
      </div>`
  }

  // ── RENDER PER LAYAR ────────────────────────────────────────────────

  /** Render layar preferensi */
  renderPreferensi() {
    const el = document.querySelector('[data-screen="preferensi"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    // Perbarui subtitle dengan highlight merah
    const subEl = el.querySelector('[data-bind="welcomeSub"]')
    if (subEl) {
      const teks = t('welcomeSub')
      if (this.bahasa === 'id') {
        subEl.innerHTML = teks.replace('berkriuk!', '<span class="text-[#d51f32]">berkriuk!</span>')
      } else {
        subEl.innerHTML = teks.replace('eat?', '<span class="text-[#d51f32]">eat?</span>')
      }
    }

    // Perbarui status aktif tombol bendera bahasa
    el.querySelectorAll('[data-aktif-bahasa]').forEach(tombol => {
      const aktif = tombol.dataset.aktifBahasa === this.bahasa
      tombol.classList.toggle('flag-aktif', aktif)
    })

    // Perbarui status aktif tombol tipe pesanan
    el.querySelectorAll('[data-aktif-tipe]').forEach(tombol => {
      const aktif = this.tipePesanan && tombol.dataset.aktifTipe === this.tipePesanan
      tombol.classList.toggle('card-aktif', aktif)
    })
  }

  /** Render layar menu — rebuild total sesuai sketsa */
  renderMenu() {
    const el = document.querySelector('[data-screen="menu"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    // Judul kategori aktif
    const judulKategori = el.querySelector('[data-bind="judulKategori"]')
    if (judulKategori) {
      const kategori = daftarKategori.find(kat => kat.id === this.kategoriAktif)
      judulKategori.textContent = kategori
        ? kategori.label[this.bahasa]
        : t('menu')
    }

    // Sidebar kategori
    const wadahKategori = el.querySelector('[data-list="kategori"]')
    if (wadahKategori) {
      wadahKategori.innerHTML = daftarKategori.map(kat => this.buatHTMLKategori(kat)).join('')
    }

    // Grid card produk (2 kolom)
    const wadahMenu = el.querySelector('[data-list="menuTampil"]')
    if (wadahMenu) {
      const itemMenu = this.dapatkanMenuTampil()
      wadahMenu.innerHTML = itemMenu.map(item => this.buatHTMLItemMenu(item)).join('')
    }

    // Status pesanan: slide in/out + count + total
    const statusEl = el.querySelector('[data-bind="statusPesanan"]')
    const jumlah = this.dapatkanJumlahItem()
    el.classList.toggle('punya-pesanan', jumlah > 0)

    if (statusEl) {
      statusEl.classList.toggle('status-aktif', jumlah > 0)

      const countEl = statusEl.querySelector('[data-bind="countBucket"]')
      if (countEl) countEl.textContent = String(jumlah)

      const totalEl = statusEl.querySelector('[data-bind="totalHargaMenu"]')
      if (totalEl) totalEl.textContent = formatRupiah(this.dapatkanTotalHarga())
    }

    // Perbarui status aktif tombol bahasa di utility dock sidebar
    el.querySelectorAll('[data-aktif-bahasa]').forEach(tombol => {
      const aktif = tombol.dataset.aktifBahasa === this.bahasa
      tombol.classList.toggle('flag-aktif', aktif)
    })

    // Modal konfirmasi batalkan
    const konfirmasiEl = el.querySelector('[data-bind="konfirmasiBatal"]')
    if (konfirmasiEl) {
      konfirmasiEl.style.display = this.tampilKonfirmasiBatal ? '' : 'none'
    }
  }

  /** Render layar keranjang */
  renderKeranjang() {
    const el = document.querySelector('[data-screen="keranjang"]')
    if (!el) return

    // Render daftar item keranjang
    const wadahItem = el.querySelector('[data-list="keranjangItems"]')
    if (wadahItem) {
      wadahItem.innerHTML = this.keranjang
        .map((baris, indeks) => this.buatHTMLItemKeranjang(baris, indeks))
        .join('')
    }

    // Perbarui total harga
    const totalEl = el.querySelector('[data-bind="totalHargaKeranjang"]')
    if (totalEl) totalEl.textContent = formatRupiah(this.dapatkanTotalHarga())
  }

  /** Render layar pembayaran */
  renderPembayaran() {
    const el = document.querySelector('[data-screen="pembayaran"]')
    if (!el) return

    // Perbarui teks total harga di card Total Pembayaran
    const elTotal = el.querySelector('[data-bind="totalHargaBayar"]')
    if (elTotal) {
      elTotal.textContent = formatRupiah(this.dapatkanTotalHarga())
    }

    // Render grid metode pembayaran
    const wadahMetode = el.querySelector('[data-list="metodePembayaran"]')
    if (wadahMetode) {
      wadahMetode.innerHTML = daftarMetodePembayaran
        .map(metode => this.buatHTMLMetodePembayaran(metode))
        .join('')
    }

    // Perbarui status tombol simulasi selesaikan pembayaran
    const tombolSimulasi = el.querySelector('[data-bind="simulateBtn"]')
    if (tombolSimulasi) {
      tombolSimulasi.disabled = !this.metodePembayaran
    }
  }

  /** Render layar sukses */
  renderSukses() {
    const el = document.querySelector('[data-screen="sukses"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    const elTerimaKasih = el.querySelector('[data-bind="thankText"]')
    if (elTerimaKasih) elTerimaKasih.textContent = t('thank')

    const elProses = el.querySelector('[data-bind="processingText"]')
    if (elProses) elProses.textContent = t('processing')
  }

  /** Render layar struk digital */
  renderStruk() {
    const el = document.querySelector('[data-screen="struk"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    // Perbarui teks antrean
    const elAntrean = el.querySelector('[data-bind="queueText"]')
    if (elAntrean) elAntrean.textContent = t('queue')

    // Perbarui nomor antrean
    const elNomor = el.querySelector('[data-bind="nomorAntrean"]')
    if (elNomor) elNomor.textContent = this.nomorAntrean

    // Render daftar item di struk
    const wadahItem = el.querySelector('[data-list="strukItems"]')
    if (wadahItem) {
      wadahItem.innerHTML = this.keranjang
        .map(baris => this.buatHTMLItemStruk(baris))
        .join('')
    }

    // Perbarui tipe pesanan
    const elTipe = el.querySelector('[data-bind="deliveryInfo"]')
    if (elTipe) {
      elTipe.textContent = this.tipePesanan === 'take' ? t('take') : t('dine')
    }

    // Perbarui status pembayaran
    const elStatus = el.querySelector('[data-bind="statusPembayaran"]')
    if (elStatus) {
      elStatus.textContent = this.metodePembayaran === 'cash' ? 'PENDING' : 'PAID'
      elStatus.classList.add('text-[#268c57]')
    }

    // Perbarui total harga
    const elTotal = el.querySelector('[data-bind="totalHargaStruk"]')
    if (elTotal) elTotal.textContent = formatRupiah(this.dapatkanTotalHarga())
  }

  /** Memperbarui tampilan detik countdown struk */
  perbaruiDetikStruk() {
    const el = document.querySelector('[data-bind="detikStruk"]')
    if (el) el.textContent = this.detikStruk
  }
}

export default KioskApp
