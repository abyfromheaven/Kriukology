/**
 * ==========================================================================
 * KOMPONEN VANILLA JS: KIOSK
 * ==========================================================================
 * Kelas utama yang mengelola seluruh state dan logika aplikasi kiosk
 * Kriukology. Menggunakan pola State Machine untuk navigasi antar layar.
 *
 * Alur navigasi (state machine):
 * screensaver → preferensi → menu → keranjang → pembayaran → qris → sukses → struk → (auto-reset ke screensaver)
 * ==========================================================================
 */

import daftarMetodePembayaran from '../data/pembayaran.js'
import kamus from '../data/kamus.js'
import formatRupiah from '../utils/format.js'
import mainkanSuara, { mainkanSuaraCash } from '../utils/audio.js'

// ── KONFIGURASI QRIS ────────────────────────────────────────────────
// Fallback kalau server tidak dapat dihubungi (mode offline). Nilai
// sesungguhnya diambil dari GET /api/qris/info saat start.
const QRIS_INFO_DEFAULT = {
  danuUrl: '/danu.html',
  pollMs: 1500,
  timeoutS: 180,
}

class KioskApp {
  constructor() {
    // ── State Aplikasi ─────────────────────────────────────────────────
    this.langkah = 'screensaver'
    this.layarAktif = null
    this.layarBaruTadi = false
    this.kategoriAktifRendered = null
    this.bahasa = 'id'
    this.tipePesanan = ''
    this.kategoriAktif = null
    this.daftarKategori = []
    this.daftarMedia = []
    this.daftarMenu = []
    this.keranjang = []
    this.tampilKonfirmasiBatal = false
    this.tampilKonfirmasiBayar = ''
    this.metodePembayaran = ''
    this.timerBuble = null
    this.tanggalServer = null
    this.nomorAntrean = 'KL-01'
    this.timerIdle = null
    this.timerStruk = null
    this.timerPoster = null
    this.detikStruk = 10

    // ── State Alert Idle (AFK Anti Reset Zonk) ──────────────────────────
    this.timerAlertIdle = null
    this.alertIdleAktif = false
    this.detikAlertIdle = 15

    // ── State QRIS ─────────────────────────────────────────────────────
    this.statusQris = 'menunggu' // 'menunggu' | 'sukses' | 'timeout'
    this.qrInstance = null
    this.urlQrisTerakhir = ''
    this.tokenQris = null           // token unik per sesi QRIS
    this.timerQrisPolling = null     // interval cek status ke server
    this.timerQrisHitungMundur = null // interval countdown batas waktu
    this.detikQrisSisa = 0
    this.qrisInfo = { ...QRIS_INFO_DEFAULT }

    this.muatMenuFromAPI()
    this.muatInfoQris()
    this.resetWaktuIdle()
    this.bindPeristiwa()
    this.render()
  }

  /** Memuat kategori + menu terkini dari API backend Laravel */
  async muatMenuFromAPI() {
    try {
      const response = await fetch('/api/menu')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()

      this.daftarKategori = (data.categories || []).map(kat => ({
        id: kat.id,
        slug: kat.slug,
        icon: kat.icon || 'fa-solid fa-utensils',
        emoji: kat.emoji || '🍗',
        label: { id: kat.label_id, en: kat.label_en }
      }))

      this.daftarMedia = (data.posters || []).filter(p => p.image)

      this.daftarMenu = (data.products || []).map(item => ({
        id: item.id,
        nama: item.name,
        kategoriId: item.category_id,
        harga: item.price,
        gambar: item.image || '/assets/menu-placeholder.svg',
        stock: item.stock,
        habis: item.stock <= 0 || !item.is_available,
        emoji: item.category?.emoji || '🍗'
      }))

      // Kategori aktif ngikuti kategori pertama yang tersedia. Kalau kategori
      // aktif lama dihapus manajer di CMS, pindah ke yang pertama.
      if (!this.daftarKategori.some(kat => kat.id === this.kategoriAktif)) {
        this.kategoriAktif = this.daftarKategori[0]?.id ?? null
      }

      this.render()
    } catch (error) {
      console.error('Gagal memuat menu dari API server:', error)
    }
  }

  /**
   * Ambil konfigurasi QRIS dari server: alamat halaman Danu, kecepatan cek,
   * dan batas waktu menunggu. Alamat Danu disusun server memakai IP jaringan
   * supaya HP bisa membukanya (localhost tidak bisa dipakai di HP).
   */
  async muatInfoQris() {
    try {
      const response = await fetch('/api/qris/info')
      if (!response.ok) return
      const data = await response.json()

      this.qrisInfo = {
        danuUrl: data.danu_url || QRIS_INFO_DEFAULT.danuUrl,
        pollMs: Number(data.poll_ms) || QRIS_INFO_DEFAULT.pollMs,
        timeoutS: Number(data.timeout_s) || QRIS_INFO_DEFAULT.timeoutS,
      }
    } catch (error) {
      console.error('Gagal mengambil konfigurasi QRIS:', error)
    }
  }

  /**
   * Mulai menunggu pembayaran QRIS: cek status ke server tiap pollMs, plus
   * countdown batas waktu. Dipanggil tiap kali layar QRIS dibuka.
   */
  mulaiTungguQris() {
    this.stopTungguQris()
    this.statusQris = 'menunggu'
    this.detikQrisSisa = this.qrisInfo.timeoutS
    this.perbaruiCountdownQris()

    if (this.tokenQris) {
      this.timerQrisPolling = setInterval(() => this.cekStatusQris(), this.qrisInfo.pollMs)
    }
    this.timerQrisHitungMundur = setInterval(() => {
      this.detikQrisSisa--
      this.perbaruiCountdownQris()

      if (this.detikQrisSisa <= 0) {
        this.stopTungguQris()
        this.statusQris = 'timeout'
        this.tampilkanBuble('Waktu pembayaran QRIS habis. Silakan pilih metode pembayaran lain.', 4000)
        this.langkah = 'pembayaran'
        this.render()
      }
    }, 1000)
  }

  /** Berhentikan semua timer QRIS (polling + countdown) */
  stopTungguQris() {
    clearInterval(this.timerQrisPolling)
    clearInterval(this.timerQrisHitungMundur)
    this.timerQrisPolling = null
    this.timerQrisHitungMundur = null
  }

  /** Tanya server: sudah ada pembayaran untuk token sesi ini? */
  async cekStatusQris() {
    if (this.langkah !== 'qris' || this.statusQris !== 'menunggu' || !this.tokenQris) return

    try {
      const response = await fetch(`/api/qris/status/${this.tokenQris}`)
      if (!response.ok) return

      const data = await response.json()
      if (!data.paid) return

      const totalHarga = this.dapatkanTotalHarga()
      const dibayar = Number(data.amount) || 0

      // nominally kurang → tetap tunggu, tampilkan penjelasannya
      if (dibayar > 0 && dibayar < totalHarga) {
        const txtStatus = document.querySelector('[data-bind="qrisStatusText"]')
        if (txtStatus) {
          txtStatus.textContent = `Pembayaran Kurang (${formatRupiah(dibayar)} < ${formatRupiah(totalHarga)})`
        }
        return
      }

      // Pembayaran sudah masuk -> langsung proses. TIDAK lewat layar Metode
      // Pembayaran: dari layar QRIS langsung loncat ke Layar Sukses.
      this.stopTungguQris()
      this.statusQris = 'sukses'
      this.render()
      this.selesaikanPesanan()
    } catch (error) {
      // Server sempat tidak terjangkau — coba lagi di cek berikutnya
      console.warn('Gagal cek status QRIS:', error)
    }
  }

  /** Perbarui teks countdown di layar QRIS */
  perbaruiCountdownQris() {
    const el = document.querySelector('[data-bind="qrisCountdown"]')
    if (!el) return
    const sisa = Math.max(this.detikQrisSisa, 0)
    const menit = Math.floor(sisa / 60)
    const detik = String(sisa % 60).padStart(2, '0')
    el.textContent = `${menit}:${detik}`
  }

  // ── PROPERTI TURUNAN (Computed) ─────────────────────────────────────

  /** Mendapatkan daftar menu berdasarkan kategori aktif */
  dapatkanMenuTampil() {
    return (this.daftarMenu || []).filter(item => item.kategoriId === this.kategoriAktif)
  }

  /** Menghitung total harga seluruh item di keranjang */
  dapatkanTotalHarga() {
    return this.keranjang.reduce((jumlah, baris) => jumlah + baris.harga * baris.jumlah, 0)
  }

  /** Menghitung total jumlah item di keranjang */
  dapatkanJumlahItem() {
    return this.keranjang.reduce((jumlah, baris) => jumlah + baris.jumlah, 0)
  }

  /**
   * Bangun URL tujuan scan QRIS.
   * Alamat dasarnya datang dari server (IP jaringan, bukan localhost), lalu
   * ditambahkan ?amount=<tagihan> &token=<token unik sesi ini>.
   */
  dapatkanUrlQris(total) {
    const dasar = this.qrisInfo.danuUrl
    if (!dasar) return '/danu.html'

    const pemisah = dasar.includes('?') ? '&' : '?'
    return `${dasar}${pemisah}amount=${total}&token=${this.tokenQris || ''}`
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

  /**
   * Gambar ulang media screensaver (gambar & video) dari data server.
   * Dipanggil saat start dan setiap kali menu di-muat ulang, supaya media
   * yang baru diunggah manajer langsung tampil tanpa refresh halaman.
   */
  renderPosterScreensaver() {
    const wadah = document.querySelector('[data-bind="posterWadah"]')
    if (!wadah || !this.daftarMedia.length) return   // kosong = pakai fallback di template

    wadah.innerHTML = this.daftarMedia
      .map((item, i) => item.type === 'video'
        // Video: autoplay + loop + muted (browser hanya izinkan autoplay tanpa suara)
        ? `<video src="${item.image}" class="poster-slide${i === 0 ? ' aktif' : ''}" autoplay muted loop playsinline preload="auto"></video>`
        : `<img src="${item.image}" alt="Promosi Kriukology" class="poster-slide${i === 0 ? ' aktif' : ''}">`)
      .join('')
  }

  /** Pause semua video screensaver (dipakai saat layar ditinggalkan) */
  hentikanVideoScreensaver() {
    document.querySelectorAll('[data-bind="posterWadah"] video').forEach(v => v.pause())
  }

  /** Memulai rotasi poster screensaver dengan efek sliding */
  mulaiRotasiPoster() {
    clearInterval(this.timerPoster)
    this.renderPosterScreensaver()
    // Playwright/HP bisa memblokir autoplay -> play() mengembalikan promise
    document.querySelectorAll('[data-bind="posterWadah"] video').forEach(v => {
      const hasil = v.play()
      if (hasil && typeof hasil.catch === 'function') hasil.catch(() => {})
    })
    let indeksSekarang = 0
    const semuaPoster = document.querySelectorAll('.poster-slide')
    if (semuaPoster.length <= 1) return

    this.timerPoster = setInterval(() => {
      semuaPoster[indeksSekarang].classList.remove('aktif')
      semuaPoster[indeksSekarang].classList.add('sebelumnya')

      indeksSekarang = (indeksSekarang + 1) % semuaPoster.length
      semuaPoster[indeksSekarang].classList.remove('sebelumnya')
      semuaPoster[indeksSekarang].classList.add('aktif')

      const indeksBersihkan = (indeksSekarang - 1 + semuaPoster.length) % semuaPoster.length
      setTimeout(() => {
        semuaPoster[indeksBersihkan].style.transition = 'none'
        semuaPoster[indeksBersihkan].classList.remove('sebelumnya')
        semuaPoster[indeksBersihkan].offsetHeight
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

    // Berhenti menunggu QRIS begitu pelanggan meninggalkan layar QRIS
    if (this.langkah === 'qris' && langkahBerikutnya !== 'qris') {
      this.stopTungguQris()
    }

    // Video screensaver dihentikan saat pelanggan mulai pesan, supaya tidak
    // tetap berjalan di belakang layar.
    if (this.langkah === 'screensaver' && langkahBerikutnya !== 'screensaver') {
      this.hentikanVideoScreensaver()
    }

    // Sesi QRIS baru HARUS dibuat SEBELUM render(). renderQris() menggambar
    // QR dari tokenQris — kalau token dibuat setelah render, QR berisi token
    // kosong (sesi pertama) atau token sesi lama, dan pembayaran dari HP tidak
    // pernah sampai ke server.
    if (langkahBerikutnya === 'qris') {
      this.mulaiSesiQris()
    }

    this.langkah = langkahBerikutnya
    this.resetWaktuIdle()
    this.render()
  }

  /**
   * Sesi QRIS baru: token unik supaya pembayaran tidak ketuker dengan
   * pesanan lain yang nilainya sama, lalu mulai polling & countdown.
   */
  mulaiSesiQris() {
    this.tokenQris = this.buatTokenQris()
    this.urlQrisTerakhir = ''   // paksa QR di-render ulang dengan token baru
    this.mulaiTungguQris()
  }

  /** Token acak 32 karakter hex - mustahil ditebak, aman dari pembayaran palsu */
  buatTokenQris() {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /** Durasi idle (detik) yang sadar-konteks sesuai layar aktif */
  dapatkanDetikIdle() {
    // Fase 3 (Menu) & Fase 4 (Keranjang): masa melamun lebih lama
    if (this.langkah === 'menu' || this.langkah === 'keranjang') return 120
    // Fase 2 (Preferensi), Fase 5 (Pembayaran & QRIS)
    return 90
  }

  /** Reset timer idle, sekaligus menutup alert bila sedang terbuka */
  resetWaktuIdle() {
    clearTimeout(this.timerIdle)

    // Skenario A: ada sentuhan → keranjang aman, hitung mundur dibatalkan
    if (this.alertIdleAktif) {
      clearInterval(this.timerAlertIdle)
      this.alertIdleAktif = false
      this.perbaruiAlertIdle()
    }

    // 'qris' sengaja ikut masuk: pelanggan sedang bayar di HP, jadi diamnya
    // bukan abandonment. Kalau timer idle bunyi di tengah, pesanan terhapus.
    const layarTanpaIdle = ['screensaver', 'sukses', 'struk', 'qris']
    if (layarTanpaIdle.includes(this.langkah)) return

    this.timerIdle = setTimeout(
      () => this.tampilkanAlertIdle(),
      this.dapatkanDetikIdle() * 1000
    )
  }

  /** Menampilkan modal peringatan hitung mundur (15 detik) sebelum reset */
  tampilkanAlertIdle() {
    this.alertIdleAktif = true
    this.detikAlertIdle = 15
    this.perbaruiAlertIdle()

    clearInterval(this.timerAlertIdle)
    this.timerAlertIdle = setInterval(() => {
      this.detikAlertIdle--
      this.perbaruiAlertIdle()
      if (this.detikAlertIdle <= 0) this.skenarioIdleHabis()
    }, 1000)
  }

  /** Memperbarui visibilitas modal alert & angka hitung mundurnya */
  perbaruiAlertIdle() {
    const modal = document.querySelector('[data-bind="alertIdleModal"]')
    if (modal) modal.style.display = this.alertIdleAktif ? '' : 'none'

    const angka = document.querySelector('[data-bind="alertIdleDetik"]')
    if (angka) angka.textContent = String(Math.max(this.detikAlertIdle, 0))
  }

  /** Skenario A: pelanggan menekan "Ya, Saya Masih Pesan" → pesanan aman */
  lanjutkanIdle() {
    this.resetWaktuIdle()
  }

  /** Skenario B: hitung mundur habis → bersihkan pesanan & ke Screensaver */
  skenarioIdleHabis() {
    clearInterval(this.timerAlertIdle)
    this.alertIdleAktif = false
    this.perbaruiAlertIdle()
    this.aturUlang()
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
    const baris = this.keranjang.find(baris => String(baris.id) === String(id))
    return baris ? baris.jumlah : 0
  }

  /** Menambahkan item langsung ke keranjang */
  tambahItemLangsung(id) {
    const item = (this.daftarMenu || []).find(m => String(m.id) === String(id))
    if (!item || item.habis) return

    const baris = this.keranjang.find(baris => String(baris.id) === String(id))
    if (baris) {
      if (baris.jumlah + 1 > item.stock) return
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
    const indeks = this.keranjang.findIndex(baris => String(baris.id) === String(id))
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

  /** Menutup modal konfirmasi metode pembayaran */
  tutupKonfirmasiBayar() {
    this.tampilKonfirmasiBayar = ''
    this.render()
  }

  /**
   * Notifikasi bubble di atas layar — muncul sebentar lalu hilang sendiri.
   * Dipakai untuk metode yang tidak bisa dipilih (mis. debit maintenance).
   */
  tampilkanBuble(pesan, durasiMs = 3200) {
    const buble = document.querySelector('[data-bind="bubleNotif"]')
    const teks = document.querySelector('[data-bind="bubleNotifTeks"]')
    if (!buble || !teks) return

    clearTimeout(this.timerBuble)
    teks.textContent = pesan
    buble.style.display = ''
    // Restart animasi supaya bubble berikutnya tidak langsung selesai
    const kartu = buble.querySelector('.buble-notif')
    kartu.classList.remove('buble-masuk')
    void buble.offsetWidth
    kartu.classList.add('buble-masuk')

    this.timerBuble = setTimeout(() => {
      buble.style.display = 'none'
    }, durasiMs)
  }

  /** Memproses pesanan selesai dan mengirim checkout ke API backend */
  async selesaikanPesanan() {
    // Bersihkan seluruh timer agar tidak menembak saat layar Sukses/Struk
    clearTimeout(this.timerIdle)
    clearInterval(this.timerAlertIdle)
    this.alertIdleAktif = false
    this.perbaruiAlertIdle()

    // Efek suara sukses (cash register) untuk splash Fase 6
    mainkanSuaraCash()

    if (this.keranjang.length > 0) {
      try {
        const payload = {
          order_type: this.tipePesanan === 'take' ? 'take_away' : 'dine_in',
          payment_method: this.metodePembayaran || 'cash',
          items: this.keranjang.map(item => ({
            product_id: item.id,
            quantity: item.jumlah,
            options: this.buatDetailKustomisasi(item.kustomisasi) || null
          }))
        }

        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const data = await res.json()
        if (res.ok && data.success) {
          this.nomorAntrean = data.order_number || data.order?.order_number || this.nomorAntrean
          // Tanggal struk pakai waktu server, bukan jam perangkat kiosk
          if (data.server_date) this.tanggalServer = data.server_date
        } else {
          console.warn('Checkout warning:', data.message)
        }
      } catch (err) {
        console.error('Error saat checkout:', err)
      }
    }

    // Muat ulang stok produk dari API backend
    await this.muatMenuFromAPI()

    this.langkah = 'sukses'
    this.render()

    // Tahan 2.6 detik (animasi masuk ~1.3s + baca), lalu 0.7 detik animasi
    // keluar sebelum pindah ke struk.
    setTimeout(() => {
      const elSukses = document.querySelector('[data-screen="sukses"]')
      elSukses?.classList.add('sukses-keluar')

      setTimeout(() => {
        // Bersihkan kelas animasi, kalau tidak layar ini "tertinggal" fade
        // dan tidak bisa tampil normal di pesanan berikutnya.
        elSukses?.classList.remove('sukses-keluar')
        this.langkah = 'struk'
        this.mulaiTimerStruk()
        this.render()
      }, 700)
    }, 2600)
  }

  /** Memulai timer countdown struk (10 detik) */
  mulaiTimerStruk() {
    this.detikStruk = 10
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
    clearInterval(this.timerAlertIdle)
    this.stopTungguQris()
    clearTimeout(this.timerBuble)
    this.alertIdleAktif = false
    this.perbaruiAlertIdle()
    this.langkah = 'screensaver'
    this.keranjang = []
    this.kategoriAktif = this.daftarKategori[0]?.id ?? null
    this.tampilKonfirmasiBatal = false
    this.tampilKonfirmasiBayar = ''
    this.metodePembayaran = ''
    this.statusQris = 'menunggu'
    this.tokenQris = null
    this.render()
  }

  // ── PEMBEKUAN PERISTIWA (Event Binding) ─────────────────────────────

  /** Membekukan seluruh peristiwa klik dan keyboard */
  bindPeristiwa() {
    document.addEventListener('click', (e) => {
      // Setiap sentuhan/klik layar mereset timer idle (AFK anti reset zonk)
      this.resetWaktuIdle()

      const tombol = e.target.closest('[data-action]')
      if (!tombol) return
      this.tanganiAksi(tombol.dataset.action)
    })

    window.addEventListener('keydown', () => this.resetWaktuIdle())
  }

  /** Melewati timer struk: langsung ke Layar Preferensi (tanpa Screensaver) */
  lewatiStruk() {
    clearInterval(this.timerStruk)
    this.stopTungguQris()
    clearInterval(this.timerAlertIdle)
    this.alertIdleAktif = false
    this.perbaruiAlertIdle()

    // Bersihkan memori belanjaan pelanggan sebelumnya
    this.keranjang = []
    this.kategoriAktif = this.daftarKategori[0]?.id ?? null
    this.tampilKonfirmasiBatal = false
    this.tampilKonfirmasiBayar = ''
    this.metodePembayaran = ''
    this.statusQris = 'menunggu'

    this.navigasiKe('preferensi')
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
        setTimeout(() => this.navigasiKe('menu'), 300)
        break

      case 'setKategori':
        this.kategoriAktif = Number(argumen)
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

      case 'setMetodePembayaran': {
        // Metode maintenance tidak bisa dipilih — hanya memunculkan bubble
        const metode = daftarMetodePembayaran.find(m => m.id === argumen)
        if (metode?.maintenance) {
          this.tampilkanBuble('Mohon maaf, metode pembayaran ini sedang dalam masa maintenance')
          return
        }
        // Konfirmasi dulu sebelum lanjut, biar tidak salah pilih
        this.tampilKonfirmasiBayar = argumen
        this.render()
        return
      }

      case 'batalKonfirmasiBayar':
        this.tutupKonfirmasiBayar()
        break

      case 'konfirmasiBayarLanjut': {
        const metode = this.tampilKonfirmasiBayar
        this.tutupKonfirmasiBayar()
        if (!metode) break
        this.metodePembayaran = metode
        mainkanSuara()
        if (metode === 'qris') {
          // navigasiKe('qris') akan memulai sesi QRIS baru (token + polling)
          this.navigasiKe('qris')
        } else {
          this.render()
          setTimeout(() => this.selesaikanPesanan(), 300)
        }
        break
      }

      case 'selesaikanPesanan':
        this.selesaikanPesanan()
        break

      case 'lewatiStruk':
        this.lewatiStruk()
        break

      case 'lanjutkanIdle':
        this.lanjutkanIdle()
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

    // Transisi masuk layar — diputar sekali setiap kali layar berganti, bukan
    // setiap render (kalau tidak, animasi berputar ulang tiap state berubah).
    if (this.langkah !== this.layarAktif) {
      this.layarAktif = this.langkah
      // Layar ini baru saja dibuka — dipakai renderKeranjang/sukses untuk
      // menyalakan animasi masuk sekaligus saja.
      this.layarBaruTadi = true
      const elBaru = document.querySelector(`[data-screen="${this.langkah}"]`)
      if (elBaru) {
        elBaru.classList.remove('layar-masuk')
        void elBaru.offsetWidth
        elBaru.classList.add('layar-masuk')
      }
    } else {
      this.layarBaruTadi = false
    }

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
    this.renderQris()
    this.renderStruk()
    this.renderSukses()

    // Jaga visibilitas modal alert idle tetap sinkron
    this.perbaruiAlertIdle()
  }

  // ── HELPER: PEMBUATAN HTML ──────────────────────────────────────────

  /** Membuat HTML tombol kategori */
  buatHTMLKategori(kategori) {
    const aktif = this.kategoriAktif === kategori.id
    // Kategori aktif: warna merah + sedikit membesar (tanpa garis merah samping)
    const kelasTeks = aktif
      ? 'text-[#d51f32] font-black'
      : 'text-[#231f20] font-semibold opacity-85 hover:opacity-100'
    return `
      <button data-action="setKategori:${kategori.id}" aria-current="${aktif ? 'true' : 'false'}"
        class="kategori-tab w-full px-2 py-2.5 flex items-center justify-center text-center rounded-lg ${aktif ? 'is-aktif' : 'hover:bg-stone-50'}">
        <span class="text-[12px] leading-tight transition-transform ${kelasTeks}">${kategori.label[this.bahasa]}</span>
      </button>`
  }

  /** Membuat HTML kartu item menu */
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
      <article class="reveal-card rounded-2xl bg-white overflow-hidden border border-stone-100 shadow-[0_4px_16px_rgba(42,36,36,0.06)] flex flex-col justify-between transition-all duration-200 hover:shadow-md ${habis ? 'opacity-60 grayscale' : ''}">
        <div class="aspect-square relative overflow-hidden bg-white rounded-t-2xl shrink-0">
          <img src="${srcGambar}" alt="${item.nama}" class="w-full h-full object-contain transition-transform duration-300 hover:scale-105" loading="lazy" />
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

  /** Membuat HTML detail kustomisasi */
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
    const srcGambar = baris.gambar || '/assets/menu-placeholder.svg'

    return `
      <article class="reveal-card flex items-center gap-3 min-h-[104px] rounded-[30px] bg-white px-3 py-3 shadow-[0_8px_22px_rgba(42,36,36,0.18)]">
        <div class="mini-food relative h-[72px] w-[78px] shrink-0 overflow-hidden rounded-2xl flex items-center justify-center">
          <img src="${srcGambar}" alt="" class="absolute inset-0 h-full w-full object-contain">
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

  /** Membuat HTML 3 metode pembayaran */
  buatHTMLMetodePembayaran(metode) {
    const aktif = this.metodePembayaran === metode.id
    // Metode maintenance (debit): tampil redup + label, tidak bisa dipilih
    const maintenance = Boolean(metode.maintenance)

    // Metode maintenance: gelap/redup seperti produk habis, tanpa abu-abu
    const kelasKartu = maintenance
      ? 'opacity-60 cursor-not-allowed shadow-[0_6px_18px_rgba(42,36,36,0.07)]'
      : aktif
        ? 'bg-red-50/70 text-[#d51f32] shadow-[0_10px_24px_rgba(213,31,50,0.16)] ring-2 ring-[#d51f32]/30 scale-[1.03] cursor-pointer'
        : 'bg-white text-[#231f20] hover:bg-stone-50 shadow-[0_6px_18px_rgba(42,36,36,0.07)] hover:shadow-[0_10px_24px_rgba(42,36,36,0.10)] cursor-pointer'

    const gambar = `/assets/${metode.id}.png`

    // Label maintenance melayang di tengah kartu, sama seperti label stok habis
    const labelMaintenance = maintenance
      ? `<div class="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
           <span class="text-white font-black text-[10px] tracking-wider uppercase px-2 py-0.5 bg-black/50 rounded">Maintenance</span>
         </div>`
      : ''

    return `
      <button data-action="setMetodePembayaran:${metode.id}"${maintenance ? ' aria-disabled="true"' : ''}
        class="relative rounded-2xl px-2 py-4 sm:py-5 flex flex-col items-center gap-3 text-center transition-all duration-200 ${kelasKartu}">
        <span class="h-24 sm:h-28 w-full flex items-center justify-center">
          <img src="${gambar}" alt="${metode.label}" loading="lazy"
            class="max-h-full max-w-full object-contain drop-shadow-sm" />
        </span>
        <span class="text-base sm:text-lg font-extrabold tracking-wide">${metode.label}</span>
        ${labelMaintenance}
      </button>`
  }

  /** Membuat HTML item di struk digital: jumlah | nama | harga satuan */
  buatHTMLItemStruk(baris, indeks) {
    const detail = this.buatDetailKustomisasi(baris.kustomisasi)
    const barisDetail = detail
      ? `<p class="text-[13px] leading-tight opacity-60 mt-0.5">${detail}</p>`
      : ''

    return `
      <div class="struk-baris flex items-start gap-3 text-[15px] leading-snug py-1" style="--i:${indeks + 2}">
        <span class="w-5 shrink-0 tabular-nums">${baris.jumlah}</span>
        <span class="min-w-0 flex-1">
          ${baris.nama}
          ${barisDetail}
        </span>
        <span class="shrink-0 tabular-nums">${formatRupiah(baris.harga)}</span>
      </div>`
  }

  // ── RENDER PER LAYAR ────────────────────────────────────────────────

  /** Render layar preferensi */
  renderPreferensi() {
    const el = document.querySelector('[data-screen="preferensi"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    const subEl = el.querySelector('[data-bind="welcomeSub"]')
    if (subEl) {
      const teks = t('welcomeSub')
      if (this.bahasa === 'id') {
        subEl.innerHTML = teks.replace('berkriuk!', '<span class="text-[#d51f32]">berkriuk!</span>')
      } else {
        subEl.innerHTML = teks.replace('eat?', '<span class="text-[#d51f32]">eat?</span>')
      }
    }

    el.querySelectorAll('[data-aktif-bahasa]').forEach(tombol => {
      const aktif = tombol.dataset.aktifBahasa === this.bahasa
      tombol.classList.toggle('flag-aktif', aktif)
    })

    el.querySelectorAll('[data-aktif-tipe]').forEach(tombol => {
      const aktif = this.tipePesanan && tombol.dataset.aktifTipe === this.tipePesanan
      tombol.classList.toggle('card-aktif', aktif)
    })
  }

  /** Render layar menu */
  renderMenu() {
    const el = document.querySelector('[data-screen="menu"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    const judulKategori = el.querySelector('[data-bind="judulKategori"]')
    if (judulKategori) {
      const kategori = this.daftarKategori.find(kat => kat.id === this.kategoriAktif)
      judulKategori.textContent = kategori
        ? kategori.label[this.bahasa]
        : t('menu')
    }

    const wadahKategori = el.querySelector('[data-list="kategori"]')
    if (wadahKategori) {
      // Kategori kosong tetap muncul sebagai tab — kalau tidak ada produk pun
      // kategori itu masih bisa dipilih (kategori dibuat duluan di CMS).
      wadahKategori.innerHTML = this.daftarKategori.map(kat => this.buatHTMLKategori(kat)).join('')
    }

    // Reveal hanya diputar saat layar baru dibuka atau kategori diganti. Kalau
    // tidak, setiap kali jumlah di keranjang bertambah semua card akan
    // mengulang animasi dari awal dan terasa berat (lag).
    const baruMuncul = this.layarBaruTadi || this.kategoriAktif !== this.kategoriAktifRendered
    this.kategoriAktifRendered = this.kategoriAktif

    const wadahMenu = el.querySelector('[data-list="menuTampil"]')
    if (wadahMenu) {
      const itemMenu = this.dapatkanMenuTampil()
      wadahMenu.innerHTML = itemMenu.map((item, i) => {
        const html = this.buatHTMLItemMenu(item)
        return baruMuncul
          ? html.replace('reveal-card', `reveal-card stagger-${(i % 12) + 1}`)
          : html.replace('reveal-card', 'reveal-card-off')
      }).join('')
    }

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

    el.querySelectorAll('[data-aktif-bahasa]').forEach(tombol => {
      const aktif = tombol.dataset.aktifBahasa === this.bahasa
      tombol.classList.toggle('flag-aktif', aktif)
    })

    const konfirmasiEl = el.querySelector('[data-bind="konfirmasiBatal"]')
    if (konfirmasiEl) {
      konfirmasiEl.style.display = this.tampilKonfirmasiBatal ? '' : 'none'
    }
  }

  /** Render layar keranjang */
  renderKeranjang() {
    const el = document.querySelector('[data-screen="keranjang"]')
    if (!el) return

    // Reveal hanya diputar saat layar baru dibuka. Kalau tidak, tiap ubah
    // jumlah akan memicu animasi dari awal dan card berkedip.
    const baruMuncul = this.layarAktif === 'keranjang' && this.layarBaruTadi

    const wadahItem = el.querySelector('[data-list="keranjangItems"]')
    if (wadahItem) {
      wadahItem.innerHTML = this.keranjang
        .map((baris, indeks) => {
          const html = this.buatHTMLItemKeranjang(baris, indeks)
          return baruMuncul
            ? html.replace('reveal-card', `reveal-card stagger-${(indeks % 10) + 1}`)
            : html.replace('reveal-card', 'reveal-card-off')
        })
        .join('')
    }

    const totalEl = el.querySelector('[data-bind="totalHargaKeranjang"]')
    if (totalEl) totalEl.textContent = formatRupiah(this.dapatkanTotalHarga())
  }

  /** Render layar pembayaran */
  renderPembayaran() {
    const el = document.querySelector('[data-screen="pembayaran"]')
    if (!el) return

    const elTotal = el.querySelector('[data-bind="totalHargaBayar"]')
    if (elTotal) {
      elTotal.textContent = formatRupiah(this.dapatkanTotalHarga())
    }

    const wadahMetode = el.querySelector('[data-list="metodePembayaran"]')
    if (wadahMetode) {
      wadahMetode.innerHTML = daftarMetodePembayaran
        .map(metode => this.buatHTMLMetodePembayaran(metode))
        .join('')
    }

    // Modal konfirmasi metode pembayaran
    const modalEl = el.querySelector('[data-bind="konfirmasiBayar"]')
    if (modalEl) modalEl.style.display = this.tampilKonfirmasiBayar ? '' : 'none'

    const modalTeks = el.querySelector('[data-bind="konfirmasiBayarTeks"]')
    if (modalTeks) {
      const nama = daftarMetodePembayaran.find(m => m.id === this.tampilKonfirmasiBayar)?.label
      modalTeks.textContent = nama
        ? `Apakah yakin anda akan menggunakan metode pembayaran ${nama}?`
        : ''
    }
  }

  /** Render layar QRIS Kiosk */
  renderQris() {
    const el = document.querySelector('[data-screen="qris"]')
    if (!el) return

    const total = this.dapatkanTotalHarga() || 15000

    const elTotal = el.querySelector('[data-bind="totalHargaQris"]')
    if (elTotal) {
      elTotal.textContent = formatRupiah(total)
    }

    // URL tujuan scan: IP/host server yang berjalan + nominal (opsional)
    const urlQris = this.dapatkanUrlQris(total)

    // Bind link ke tombol "Buka Layar Danu"
    const linkDanu = el.querySelector('[data-bind="linkDanu"]')
    if (linkDanu) {
      linkDanu.href = urlQris
    }

    // Generate QR Code dinamis (hanya saat URL berubah)
    const boxQr = el.querySelector('[data-bind="qrisQrBox"]')
    const KodeQR = window.QRCode
    if (boxQr && urlQris !== this.urlQrisTerakhir) {
      if (!KodeQR) {
        console.warn('[QRIS] Library QR belum termuat. Cek file /qrcode.js dan tag script di index.html.')
      } else if (!this.qrInstance) {
        this.qrInstance = new KodeQR(boxQr, {
          text: urlQris,
          width: 176,
          height: 176,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: KodeQR.CorrectLevel.H,
        })
        this.urlQrisTerakhir = urlQris
      } else {
        this.qrInstance.clear()
        this.qrInstance.makeCode(urlQris)
        this.urlQrisTerakhir = urlQris
      }
    }

    // Countdown batas waktu + pil status menunggu
    this.perbaruiCountdownQris()
  }

  /** Render layar sukses */
  renderSukses() {
    const el = document.querySelector('[data-screen="sukses"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    // Judul berbeda per metode: QRIS → "Pembayaran Berhasil", selain itu → "Terima Kasih!"
    const judul = this.metodePembayaran === 'qris' ? t('thankQris') : t('thank')

    const elTerimaKasih = el.querySelector('[data-bind="thankText"]')
    if (elTerimaKasih) elTerimaKasih.textContent = judul

    const elProses = el.querySelector('[data-bind="processingText"]')
    if (elProses) elProses.textContent = t('processing')

    // Animasi masuk hanya diputar sekali saat layar sukses baru dibuka.
    // Wajib dicek this.langkah: renderSukses() dipanggil di setiap render(),
    // jadi tanpa pengecekan ini kelas akan dipasang saat layar masih hidden.
    if (this.langkah === 'sukses' && this.layarBaruTadi) {
      el.classList.remove('sukses-masuk')
      void el.offsetWidth
      el.classList.add('sukses-masuk')
    }
  }

  /** Render layar struk digital */
  renderStruk() {
    const el = document.querySelector('[data-screen="struk"]')
    if (!el) return
    const t = (kunci) => this.terjemahkan(kunci)

    // Animasi cetak hanya sekali saat struk pertama dibuka. Setelah itu
    // (mis. hitung mundur berubah tiap detik) baris tetap tampil diam.
    const baruMuncul = this.layarBaruTadi

    const elNomor = el.querySelector('[data-bind="nomorAntrean"]')
    if (elNomor) elNomor.textContent = this.nomorAntrean

    // Tipe pesanan mengikuti bahasa yang dipilih pelanggan
    const elTipe = el.querySelector('[data-bind="strukTipe"]')
    if (elTipe) elTipe.textContent = this.tipePesanan === 'take' ? t('take') : t('dine')

    const elTanggal = el.querySelector('[data-bind="strukTanggal"]')
    if (elTanggal) elTanggal.textContent = this.formatTanggalStruk()

    const elAlamat = el.querySelector('[data-bind="strukAlamat"]')
    if (elAlamat) elAlamat.textContent = t('strukAddress')

    const wadahItem = el.querySelector('[data-list="strukItems"]')
    if (wadahItem) {
      wadahItem.innerHTML = this.keranjang
        .map((baris, indeks) => this.buatHTMLItemStruk(baris, indeks))
        .join('')
    }

    const elTotal = el.querySelector('[data-bind="totalHargaStruk"]')
    if (elTotal) elTotal.textContent = formatRupiah(this.dapatkanTotalHarga())

    // Metode pembayaran mengikuti bahasa pelanggan
    const elMetode = el.querySelector('[data-bind="strukMetode"]')
    if (elMetode) {
      const metode = daftarMetodePembayaran.find(m => m.id === this.metodePembayaran)
      elMetode.textContent = metode ? metode.label.toUpperCase() : (this.metodePembayaran || '').toUpperCase()
    }

    // Beri urutan cetak (--i) ke tiap baris header/footer
    if (baruMuncul) {
      el.querySelectorAll('.struk-baris:not([style*="--i"])').forEach((baris, i) => {
        baris.style.setProperty('--i', String(i + this.keranjang.length + 2))
      })
    } else {
      // Sudah tampil sebelumnya — matikan animasi supaya tidak mengulang
      el.querySelectorAll('.struk-baris').forEach(baris => baris.classList.add('struk-baris-off'))
    }

    this.perbaruiDetikStruk()
  }

  /**
   * Tanggal struk memakai waktu SERVER Laravel, bukan jam perangkat kiosk.
   * Fallback ke jam perangkat kalau server tidak mengirim (mis. offline).
   */
  formatTanggalStruk() {
    const t = (kunci) => this.terjemahkan(kunci)
    const tanggal = this.tanggalServer ? new Date(this.tanggalServer) : new Date()

    try {
      return new Intl.DateTimeFormat(this.bahasa === 'en' ? 'en-GB' : 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(tanggal)
    } catch {
      return tanggal.toLocaleDateString()
    }
  }

  /** Memperbarui tampilan detik countdown struk */
  perbaruiDetikStruk() {
    const el = document.querySelector('[data-bind="detikStruk"]')
    if (el) el.textContent = this.detikStruk

    const t = (kunci) => this.terjemahkan(kunci)
    const elHitung = document.querySelector('[data-bind="strukCountdown"]')
    if (elHitung) elHitung.textContent = t('strukCountdown').replace('{n}', String(Math.max(this.detikStruk, 0)))
  }
}

export default KioskApp
