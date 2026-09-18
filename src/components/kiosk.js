/**
 * ==========================================================================
 * KOMPONEN VANILLA JS: KIOSK
 * ==========================================================================
 * Kelas utama yang mengelola seluruh state dan logika aplikasi kiosk
 * Kriukology. Menggunakan pola State Machine untuk navigasi antar layar.
 *
 * Alur navigasi (state machine):
 * screensaver → preferensi → menu → keranjang → pengiriman → pembayaran → sukses → struk → (auto-reset ke screensaver)
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
    this.tipePesanan = 'dine'
    this.kategoriAktif = 'rekomendasi'
    this.keranjang = []
    this.itemSaatIni = null
    this.tampilModal = false
    this.tampilToast = false
    this.kustomisasi = { potongan: '', minuman: '', saus: '' }
    this.metodePengiriman = ''
    this.nomorMeja = ''
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

  /** Mengecek apakah nomor meja valid (1-99) */
  apakahMejaValid() {
    const nomor = Number(this.nomorMeja)
    return nomor >= 1 && nomor <= 99
  }

  /** Mengecek apakah pengguna bisa lanjut ke pembayaran */
  apakahBisaBayar() {
    return this.metodePengiriman === 'kasir' ||
      (this.metodePengiriman === 'meja' && this.apakahMejaValid())
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

  /** Membuka modal kustomisasi untuk item tertentu */
  bukaMenu(item) {
    this.itemSaatIni = item
    this.kustomisasi = { potongan: '', minuman: '', saus: '' }
    this.tampilModal = true
    mainkanSuara()
    this.render()
  }

  /** Menambahkan item yang sudah dikustomisasi ke keranjang */
  tambahKeKeranjang() {
    if (!this.kustomisasi.potongan || !this.kustomisasi.minuman || !this.kustomisasi.saus) return

    this.keranjang.push({
      ...this.itemSaatIni,
      kustomisasi: { ...this.kustomisasi },
      jumlah: 1,
      kunci: Date.now(),
    })

    this.tampilModal = false
    this.tampilToast = true
    mainkanSuara()
    this.render()

    setTimeout(() => {
      this.tampilToast = false
      this.render()
    }, 1800)
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
      this.navigasiKe('menu')
    } else {
      this.render()
    }
  }

  /** Menangani input nomor meja dari keypad virtual */
  tekanKeypad(tombol) {
    if (tombol === 'clear') {
      this.nomorMeja = ''
    } else if (tombol === 'delete') {
      this.nomorMeja = this.nomorMeja.slice(0, -1)
    } else if (this.nomorMeja.length < 2) {
      this.nomorMeja += String(tombol)
    }
    mainkanSuara()
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
    this.kategoriAktif = 'rekomendasi'
    this.itemSaatIni = null
    this.tampilModal = false
    this.metodePengiriman = ''
    this.nomorMeja = ''
    this.metodePembayaran = ''
    this.kustomisasi = { potongan: '', minuman: '', saus: '' }
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

      case 'setKategori':
        this.kategoriAktif = argumen
        mainkanSuara()
        this.render()
        break

      case 'bukaMenu': {
        const id = Number(argumen)
        const item = daftarMenu.find(m => m.id === id)
        if (item) this.bukaMenu(item)
        break
      }

      case 'setKustomisasi': {
        const [jenis, nilai] = argumen.split('=')
        this.kustomisasi[jenis] = nilai
        mainkanSuara()
        this.render()
        break
      }

      case 'tambahKeKeranjang':
        this.tambahKeKeranjang()
        break

      case 'tutupModal':
        this.tampilModal = false
        this.render()
        break

      case 'ubahJumlah': {
        const [indeks, jumlah] = argumen.split(',').map(Number)
        this.ubahJumlah(indeks, jumlah)
        break
      }

      case 'setMetodePengiriman':
        this.metodePengiriman = argumen
        if (argumen === 'kasir') this.nomorMeja = ''
        mainkanSuara()
        this.render()
        break

      case 'tekanKeypad': {
        const nilaiTombol = argumen === 'delete' ? 'delete'
          : argumen === 'clear' ? 'clear'
          : Number(argumen)
        this.tekanKeypad(nilaiTombol)
        break
      }

      case 'setMetodePembayaran':
        this.metodePembayaran = argumen
        mainkanSuara()
        this.render()
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
    this.renderPengiriman()
    this.renderPembayaran()
    this.renderStruk()
    this.renderSukses()
    this.renderModal()
    this.renderToast()
  }

  // ── HELPER: PEMBUATAN HTML ──────────────────────────────────────────

  /** Membuat HTML tombol kategori */
  buatHTMLKategori(kategori) {
    const aktif = this.kategoriAktif === kategori.id
    const kelasAktif = aktif ? 'bg-[#d51f32] text-white shadow-md' : 'text-stone-500'
    return `
      <button data-action="setKategori:${kategori.id}"
        class="w-full rounded-xl px-2 py-3 text-[10px] font-bold leading-3 transition ${kelasAktif}">
        <i class="${kategori.icon} block text-base mb-1"></i>
        <span>${kategori.label[this.bahasa]}</span>
      </button>`
  }

  /** Membuat HTML kartu item menu */
  buatHTMLItemMenu(item) {
    const tagHTML = item.tag
      ? `<span class="absolute top-2 left-2 bg-[#f5bd27] px-2 py-1 rounded-full text-[8px] font-black text-[#4c2a14]">${item.tag}</span>`
      : ''

    return `
      <button data-action="bukaMenu:${item.id}"
        class="text-left rounded-2xl bg-white overflow-hidden border border-stone-100 shadow-sm hover:-translate-y-0.5 transition">
        <div class="h-28 relative flex items-center justify-center mini-food overflow-hidden">
          <img src="/assets/menu-placeholder.svg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-80">
          ${tagHTML}
          <span class="relative text-4xl drop-shadow-lg">${item.emoji}</span>
        </div>
        <div class="p-3">
          <p class="font-black text-xs leading-4">${item.nama}</p>
          <p class="text-[10px] text-stone-500 mt-1 truncate">${item.deskripsi}</p>
          <div class="mt-3 flex justify-between items-center">
            <span class="text-xs font-black text-[#d51f32]">${formatRupiah(item.harga)}</span>
            <span class="h-6 w-6 bg-[#d51f32] text-white rounded-full inline-flex items-center justify-center">
              <i class="fa-solid fa-plus text-[10px]"></i>
            </span>
          </div>
        </div>
      </button>`
  }

  /** Membuat HTML item di keranjang */
  buatHTMLItemKeranjang(baris, indeks) {
    const detailKustomisasi = `${baris.kustomisasi.potongan} · ${baris.kustomisasi.minuman} · ${baris.kustomisasi.saus}`
    return `
      <article class="bg-white rounded-2xl p-4 mb-3 border border-stone-100">
        <div class="flex gap-3">
          <div class="mini-food h-12 w-12 rounded-xl flex items-center justify-center text-2xl">🍗</div>
          <div class="flex-1">
            <p class="font-black text-sm">${baris.nama}</p>
            <p class="text-[10px] text-stone-500 mt-1">${detailKustomisasi}</p>
            <p class="font-black text-[#d51f32] text-sm mt-2">${formatRupiah(baris.harga * baris.jumlah)}</p>
          </div>
          <div class="flex items-end gap-2">
            <button data-action="ubahJumlah:${indeks},-1"
              class="h-7 w-7 rounded-full bg-stone-100">
              <i class="fa-solid fa-minus text-[10px]"></i>
            </button>
            <span class="font-black text-sm">${baris.jumlah}</span>
            <button data-action="ubahJumlah:${indeks},1"
              class="h-7 w-7 rounded-full bg-[#d51f32] text-white">
              <i class="fa-solid fa-plus text-[10px]"></i>
            </button>
          </div>
        </div>
      </article>`
  }

  /** Membuat HTML metode pembayaran */
  buatHTMLMetodePembayaran(metode) {
    const aktif = this.metodePembayaran === metode.id
    const kelasAktif = aktif
      ? 'bg-[#d51f32] text-white border-[#d51f32]'
      : 'bg-white border-stone-200'
    return `
      <button data-action="setMetodePembayaran:${metode.id}"
        class="rounded-xl border p-3 text-center ${kelasAktif}">
        <i class="${metode.icon} text-lg"></i>
        <span class="block text-[10px] font-bold mt-2">${metode.label}</span>
      </button>`
  }

  /** Membuat HTML preview area pembayaran berdasarkan metode yang dipilih */
  buatHTMLPreviewPembayaran() {
    const t = (kunci) => this.terjemahkan(kunci)

    if (this.metodePembayaran === 'qris') {
      const selQR = Array.from({ length: 49 }, (_, i) => {
        const kelas = (i + 1) % 3 === 0 || (i + 1) % 5 === 0 ? 'bg-[#231f20]' : 'bg-stone-100'
        return `<i class="${kelas} rounded-[1px]"></i>`
      }).join('')
      return `
        <div class="w-36 h-36 bg-white rounded-xl p-3 grid grid-cols-7 gap-1 mx-auto">${selQR}</div>
        <p class="font-black mt-5">${t('scan')}</p>`
    }

    if (this.metodePembayaran === 'cash') {
      return `
        <i class="fa-solid fa-money-bill-wave text-6xl text-[#f5bd27]"></i>
        <p class="font-black mt-5">${t('cash')}</p>`
    }

    if (this.metodePembayaran && this.metodePembayaran !== 'qris' && this.metodePembayaran !== 'cash') {
      return `
        <i class="fa-solid fa-mobile-screen-button text-6xl text-[#f5bd27]"></i>
        <p class="font-black mt-5">Ikuti instruksi<br>di HP Anda</p>`
    }

    return `
      <div class="text-white/40">
        <i class="fa-solid fa-arrow-up text-3xl"></i>
        <p class="font-bold mt-3">Pilih metode pembayaran</p>
      </div>`
  }

  /** Membuat HTML item di struk digital */
  buatHTMLItemStruk(baris) {
    const detailKustomisasi = `${baris.kustomisasi.potongan} · ${baris.kustomisasi.minuman} · ${baris.kustomisasi.saus}`
    return `
      <div class="mb-3">
        <div class="flex justify-between font-bold">
          <span>${baris.nama} × ${baris.jumlah}</span>
          <span>${formatRupiah(baris.harga * baris.jumlah)}</span>
        </div>
        <p class="text-[10px] text-stone-500 mt-1">${detailKustomisasi}</p>
      </div>`
  }

  // ── RENDER PER LAYAR ────────────────────────────────────────────────

  /** Render layar preferensi */
  renderPreferensi() {
    const el = document.querySelector('[data-screen="preferensi"]')
    if (!el) return

    // Perbarui status aktif tombol bahasa
    el.querySelectorAll('[data-aktif-bahasa]').forEach(tombol => {
      const aktif = tombol.dataset.aktifBahasa === this.bahasa
      tombol.classList.toggle('border-[#d51f32]', aktif)
      tombol.classList.toggle('bg-red-50', aktif)
      tombol.classList.toggle('border-stone-200', !aktif)
    })

    // Perbarui status aktif tombol tipe pesanan
    el.querySelectorAll('[data-aktif-tipe]').forEach(tombol => {
      const aktif = tombol.dataset.aktifTipe === this.tipePesanan
      tombol.classList.toggle('bg-[#d51f32]', aktif)
      tombol.classList.toggle('text-white', aktif)
      tombol.classList.toggle('bg-white', !aktif)
      tombol.classList.toggle('border', !aktif)
      tombol.classList.toggle('border-stone-200', !aktif)
    })
  }

  /** Render layar menu */
  renderMenu() {
    const el = document.querySelector('[data-screen="menu"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    // Perbarui tipe pesanan di header
    const headerTipe = el.querySelector('[data-bind="tipePesanan"]')
    if (headerTipe) {
      headerTipe.textContent = this.tipePesanan === 'dine' ? t('dine') : t('take')
    }

    // Render daftar kategori
    const wadahKategori = el.querySelector('[data-list="kategori"]')
    if (wadahKategori) {
      wadahKategori.innerHTML = daftarKategori.map(kat => this.buatHTMLKategori(kat)).join('')
    }

    // Render grid menu
    const wadahMenu = el.querySelector('[data-list="menuTampil"]')
    if (wadahMenu) {
      const itemMenu = this.dapatkanMenuTampil()
      wadahMenu.innerHTML = itemMenu.map(item => this.buatHTMLItemMenu(item)).join('')
    }

    // Perbarui tombol keranjang mini
    const tombolKeranjang = el.querySelector('[data-bind="keranjangMini"]')
    if (tombolKeranjang) {
      const adaItem = this.keranjang.length > 0
      tombolKeranjang.classList.toggle('bg-[#231f20]', adaItem)
      tombolKeranjang.classList.toggle('text-white', adaItem)
      tombolKeranjang.classList.toggle('bg-stone-200', !adaItem)
      tombolKeranjang.classList.toggle('text-stone-400', !adaItem)
      tombolKeranjang.querySelector('[data-bind="jumlahItemMenu"]').textContent =
        this.dapatkanJumlahItem() + ' ' + t('items')
      tombolKeranjang.querySelector('[data-bind="totalHargaMenu"]').textContent =
        formatRupiah(this.dapatkanTotalHarga())
      tombolKeranjang.querySelector('[data-bind="viewCartText"]').textContent = t('viewCart')
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

  /** Render layar pengiriman */
  renderPengiriman() {
    const el = document.querySelector('[data-screen="pengiriman"]')
    if (!el) return

    // Perbarui status aktif tombol metode pengiriman
    el.querySelectorAll('[data-aktif-metode]').forEach(tombol => {
      const aktif = tombol.dataset.aktifMetode === this.metodePengiriman
      tombol.classList.toggle('bg-[#d51f32]', aktif)
      tombol.classList.toggle('text-white', aktif)
      tombol.classList.toggle('bg-white', !aktif)
      tombol.classList.toggle('border', !aktif)
      tombol.classList.toggle('border-stone-200', !aktif)
    })

    // Tampilkan/sembunyikan keypad berdasarkan metode pengiriman
    const wadahKeypad = el.querySelector('[data-bind="keypadSection"]')
    if (wadahKeypad) {
      wadahKeypad.style.display = this.metodePengiriman === 'meja' ? '' : 'none'

      if (this.metodePengiriman === 'meja') {
        const tampilan = wadahKeypad.querySelector('[data-bind="mejaDisplay"]')
        if (tampilan) tampilan.textContent = this.nomorMeja || '—'

        const error = wadahKeypad.querySelector('[data-bind="mejaError"]')
        if (error) error.style.display = this.nomorMeja && !this.apakahMejaValid() ? '' : 'none'
      }
    }

    // Perbarui status tombol pembayaran
    const tombolBayar = el.querySelector('[data-bind="payBtn"]')
    if (tombolBayar) {
      const bisaBayar = this.apakahBisaBayar()
      tombolBayar.disabled = !bisaBayar
      tombolBayar.classList.toggle('disabled:bg-stone-300', !bisaBayar)
      tombolBayar.classList.toggle('bg-[#231f20]', bisaBayar)
    }
  }

  /** Render layar pembayaran */
  renderPembayaran() {
    const el = document.querySelector('[data-screen="pembayaran"]')
    if (!el) return

    // Render grid metode pembayaran
    const wadahMetode = el.querySelector('[data-list="metodePembayaran"]')
    if (wadahMetode) {
      wadahMetode.innerHTML = daftarMetodePembayaran
        .map(metode => this.buatHTMLMetodePembayaran(metode))
        .join('')
    }

    // Render area preview instruksi pembayaran
    const wadahPreview = el.querySelector('[data-bind="paymentPreview"]')
    if (wadahPreview) {
      const htmlPreview = this.buatHTMLPreviewPembayaran()
      const htmlTotal = `<p class="mt-7 text-2xl font-black text-[#f5bd27]">${formatRupiah(this.dapatkanTotalHarga())}</p>`
      wadahPreview.innerHTML = htmlPreview + htmlTotal
    }

    // Perbarui status tombol simulasi
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

    // Perbarui info pengiriman
    const elPengiriman = el.querySelector('[data-bind="deliveryInfo"]')
    if (elPengiriman) {
      elPengiriman.textContent = this.metodePengiriman === 'meja'
        ? t('served') + ' ' + this.nomorMeja
        : t('counter')
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

  /** Render modal kustomisasi item */
  renderModal() {
    const overlay = document.querySelector('[data-bind="modalOverlay"]')
    if (!overlay) return
    overlay.style.display = this.tampilModal ? '' : 'none'

    if (this.tampilModal && this.itemSaatIni) {
      // Perbarui nama item
      const namaEl = overlay.querySelector('[data-bind="modalNama"]')
      if (namaEl) namaEl.textContent = this.itemSaatIni.nama

      // Perbarui status aktif tombol kustomisasi
      overlay.querySelectorAll('[data-kustomisasi]').forEach(tombol => {
        const [jenis, nilai] = tombol.dataset.kustomisasi.split('=')
        const aktif = this.kustomisasi[jenis] === nilai
        tombol.classList.toggle('bg-[#d51f32]', aktif)
        tombol.classList.toggle('text-white', aktif)
        tombol.classList.toggle('bg-white', !aktif)
        tombol.classList.toggle('border', !aktif)
        tombol.classList.toggle('border-stone-200', !aktif)
      })

      // Perbarui status tombol tambah ke keranjang
      const tombolTambah = overlay.querySelector('[data-bind="addCartBtn"]')
      if (tombolTambah) {
        const semuaDipilih = this.kustomisasi.potongan && this.kustomisasi.minuman && this.kustomisasi.saus
        tombolTambah.disabled = !semuaDipilih
      }
    }
  }

  /** Render toast notifikasi */
  renderToast() {
    const toast = document.querySelector('[data-bind="toast"]')
    if (!toast) return
    toast.style.display = this.tampilToast ? '' : 'none'
    const teksToast = toast.querySelector('[data-bind="toastText"]')
    if (teksToast) teksToast.textContent = this.terjemahkan('added')
  }
}

export default KioskApp
