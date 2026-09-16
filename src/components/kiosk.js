/**
 * ==========================================================================
 * KOMPONEN ALPINE.JS: KIOSK
 * ==========================================================================
 * Komponen utama yang mengelola seluruh state dan logika aplikasi kiosk
 * PahaDada.id. Menggunakan pola State Machine untuk navigasi antar layar.
 *
 * Alur navigasi (state machine):
 * kunci → preferensi → menu → keranjang → pengiriman → pembayaran → sukses → struk → (auto-reset ke kunci)
 *
 * State yang dikelola:
 * - langkah          : Layar aktif saat ini (kunci/preferensi/menu/dst)
 * - bahasa           : Pilihan bahasa pengguna (id/en)
 * - tipePesanan      : Tipe pesanan (dine/take)
 * - kategoriAktif    : Kategori menu yang sedang aktif
 * - keranjang        : Array item di keranjang belanja
 * - itemSaatIni      : Item menu yang sedang dibuka di modal
 * - tampilModal      : Status tampilan modal kustomisasi
 * - tampilToast      : Status tampilan toast notifikasi
 * - kustomisasi      : Pilihan kustomisasi (potongan/minuman/saus)
 * - metodePengiriman : Metode pengiriman (meja/kasir)
 * - nomorMeja        : Nomor meja yang diketik pengguna
 * - metodePembayaran : Metode pembayaran yang dipilih
 * - nomorAntrean     : Nomor antrean acak (contoh: PD-342)
 * - timerIdle        : Timer idle timeout (60 detik)
 * - timerStruk       : Timer countdown struk (15 detik)
 * - detikStruk       : Sisa detik countdown struk
 *
 * Computed properties (getter):
 * - menuTampil  : Menu yang difilter berdasarkan kategori aktif
 * - totalHarga  : Total harga semua item di keranjang
 * - jumlahItem  : Total jumlah item di keranjang
 * - mejaValid   : Apakah nomor meja valid (1-99)
 * - bisaBayar   : Apakah pengguna sudah memenuhi syarat untuk pembayaran
 *
 * Metode utama:
 * - terjemahkan(key)    : Mengambil terjemahan dari kamus
 * - navigasiKe(langkah) : Pindah ke layar tertentu
 * - mainkanSuara()      : Memutar suara tombol
 * - resetIdleTimer()    : Reset timer idle timeout
 * - bukaMenu(item)      : Buka modal kustomisasi item
 * - tambahKeKeranjang() : Tambah item ke keranjang
 * - ubahJumlah(i, n)    : Ubah jumlah item di keranjang
 * - tekanKeypad(tombol) : Input nomor meja via keypad virtual
 * - selesaikanPesanan() : Proses pesanan selesai
 * - aturUlang()         : Reset semua state ke awal
 * ==========================================================================
 */

import daftarMenu from '../data/menu.js'
import daftarKategori from '../data/kategori.js'
import daftarMetodePembayaran from '../data/pembayaran.js'
import kamus from '../data/kamus.js'
import formatRupiah from '../utils/format.js'
import mainkanSuara from '../utils/audio.js'

/**
 * buatKomponenKiosk — Faktori yang mengembalikan definisi Alpine.js component
 *
 * Fungsi ini mengembalikan objek konfigurasi untuk `Alpine.data('kiosk', ...)`.
 * Semua state, computed, dan metode didefinisikan di sini.
 *
 * @returns {Object} — Konfigurasi Alpine.js component
 */
function buatKomponenKiosk() {
  return {

    // ── STATE: Variabel reaktif yang menyimpan kondisi aplikasi ──────────

    /** Langkah / layar aktif saat ini */
    langkah: 'kunci',

    /** Pilihan bahasa pengguna ('id' atau 'en') */
    bahasa: 'id',

    /** Tipe pesanan: 'dine' (makan di sini) atau 'take' (bawa pulang) */
    tipePesanan: 'dine',

    /** Kategori menu yang sedang dipilih (default: rekomendasi) */
    kategoriAktif: 'rekomendasi',

    /** Array item di keranjang belanja */
    keranjang: [],

    /** Item menu yang sedang dibuka di modal kustomisasi */
    itemSaatIni: null,

    /** Status tampilan modal kustomisasi (true = terbuka) */
    tampilModal: false,

    /** Status tampilan toast notifikasi (true = terlihat) */
    tampilToast: false,

    /** Pilihan kustomisasi item (potongan ayam, minuman, saus) */
    kustomisasi: { potongan: '', minuman: '', saus: '' },

    /** Metode pengiriman: 'meja' atau 'kasir' */
    metodePengiriman: '',

    /** Nomor meja yang diketik pengguna (string, max 2 digit) */
    nomorMeja: '',

    /** Metode pembayaran yang dipilih (contoh: 'qris', 'cash', dll) */
    metodePembayaran: '',

    /** Nomor antrean pesanan (contoh: 'PD-342') */
    nomorAntrean: 'PD-001',

    /** Referensi timer idle timeout */
    timerIdle: null,

    /** Referensi timer countdown struk */
    timerStruk: null,

    /** Sisa detik countdown struk (mulai dari 15) */
    detikStruk: 15,

    // ── DATA STATIS: Tidak berubah selama aplikasi berjalan ─────────────

    /** Daftar kategori menu (import dari file terpisah) */
    daftarKategori: daftarKategori,

    /** Daftar metode pembayaran (import dari file terpisah) */
    daftarMetodePembayaran: daftarMetodePembayaran,

    // ── LIFECYCLE: Dipanggil saat komponen pertama kali dimuat ──────────

    /**
     * init() — Fungsi inisialisasi Alpine.js component
     * Dipanggil otomatis oleh Alpine.js saat komponen dimount.
     * Memulai timer idle timeout untuk pertama kali.
     */
    init() {
      this.resetIdleTimer()
    },

    // ── COMPUTED PROPERTIES: Nilai yang dihitung dari state ─────────────

    /**
     * menuTampil — Menu yang difilter berdasarkan kategori aktif
     * Jika kategori 'rekomendasi', tampilkan semua item rekomendasi.
     * Jika kategori lain, tampilkan item yang sesuai.
     *
     * @returns {Array} — Array objek menu yang sudah difilter
     */
    get menuTampil() {
      if (this.kategoriAktif === 'rekomendasi') {
        return daftarMenu.filter(item => item.kategori === 'rekomendasi')
      }
      return daftarMenu.filter(item => item.kategori === this.kategoriAktif)
    },

    /**
     * totalHarga — Total harga semua item di keranjang
     * Dihitung dengan menjumlahkan (harga × jumlah) setiap item.
     *
     * @returns {number} — Total harga dalam Rupiah (angka)
     */
    get totalHarga() {
      return this.keranjang.reduce((jumlah, baris) => {
        return jumlah + baris.harga * baris.jumlah
      }, 0)
    },

    /**
     * jumlahItem — Total jumlah item di keranjang
     * Dihitung dengan menjumlahkan jumlah setiap item.
     *
     * @returns {number} — Total jumlah item (angka)
     */
    get jumlahItem() {
      return this.keranjang.reduce((jumlah, baris) => {
        return jumlah + baris.jumlah
      }, 0)
    },

    /**
     * mejaValid — Pengecekan validitas nomor meja
     * Nomor meja valid jika antara 1-99.
     *
     * @returns {boolean} — true jika nomor meja valid
     */
    get mejaValid() {
      const nomor = Number(this.nomorMeja)
      return nomor >= 1 && nomor <= 99
    },

    /**
     * bisaBayar — Pengecekan apakah pengguna bisa lanjut ke pembayaran
     * Pengguna bisa bayar jika:
     * - Memilih "Ambil di kasir", ATAU
     * - Memilih "Antar ke meja" DAN nomor meja valid
     *
     * @returns {boolean} — true jika pengguna memenuhi syarat
     */
    get bisaBayar() {
      return (
        this.metodePengiriman === 'kasir' ||
        (this.metodePengiriman === 'meja' && this.mejaValid)
      )
    },

    // ── METODE: Fungsi-fungsi yang mengubah state aplikasi ──────────────

    /**
     * terjemahkan — Mengambil teks terjemahan dari kamus
     * Mencari nilai berdasarkan key dan bahasa aktif.
     * Jika key tidak ditemukan, mengembalikan key itu sendiri (fallback).
     *
     * @param {string} kunci — Kunci teks yang ingin diterjemahkan
     * @returns {string} — Teks dalam bahasa yang sesuai
     */
    terjemahkan(kunci) {
      return kamus[this.bahasa][kunci] || kunci
    },

    /**
     * navigasiKe — Pindah ke layar tertentu
     * Memutar suara tombol, mengubah state langkah, dan mereset timer idle.
     *
     * @param {string} langkahBerikutnya — ID langkah tujuan
     */
    navigasiKe(langkahBerikutnya) {
      mainkanSuara()
      this.langkah = langkahBerikutnya
      this.resetIdleTimer()
    },

    /**
     * mainkanSuara — Memutar suara tombol (delegasi ke utilitas audio)
     * Dipanggil untuk memberikan umpan balik audio saat interaksi.
     */
    mainkanSuara: mainkanSuara,

    /**
     * resetIdleTimer — Mereset timer idle timeout (60 detik)
     * Jika pengguna tidak melakukan apa pun selama 60 detik,
     * kiosk otomatis kembali ke layar kunci (lockscreen).
     *
     * Timer TIDAK aktif di layar: kunci, sukses, dan struk
     * (karena layar tersebut sudah memiliki auto-reset sendiri).
     */
    resetIdleTimer() {
      clearTimeout(this.timerIdle)

      // Hanya aktifkan timer jika bukan di layar kunci/sukses/struk
      if (
        this.langkah !== 'kunci' &&
        this.langkah !== 'sukses' &&
        this.langkah !== 'struk'
      ) {
        this.timerIdle = setTimeout(() => {
          this.aturUlang()
        }, 60000) // 60.000 ms = 60 detik
      }
    },

    /**
     * bukaMenu — Membuka modal kustomisasi untuk item tertentu
     * Menyimpan item yang dipilih ke state itemSaatIni,
     * mereset kustomisasi, dan menampilkan modal.
     *
     * @param {Object} item — Objek menu yang dipilih pengguna
     */
    bukaMenu(item) {
      this.itemSaatIni = item
      this.kustomisasi = { potongan: '', minuman: '', saus: '' }
      this.tampilModal = true
      mainkanSuara()
    },

    /**
     * tambahKeKeranjang — Menambahkan item yang sudah dikustomisasi ke keranjang
     * Hanya berjalan jika semua opsi kustomisasi sudah dipilih.
     *
     * Proses:
     * 1. Salin data item + kustomisasi + jumlah 1
     * 2. Tambahkan ke array keranjang dengan kunci unik (timestamp)
     * 3. Tutup modal
     * 4. Tampilkan toast notifikasi selama 1.8 detik
     */
    tambahKeKeranjang() {
      // Validasi: semua opsi kustomisasi harus dipilih
      if (!this.kustomisasi.potongan || !this.kustomisasi.minuman || !this.kustomisasi.saus) {
        return
      }

      // Tambahkan item ke keranjang
      this.keranjang.push({
        ...this.itemSaatIni,
        kustomisasi: { ...this.kustomisasi },
        jumlah: 1,
        kunci: Date.now(), // Kunci unik berbasis timestamp
      })

      // Tutup modal dan tampilkan toast
      this.tampilModal = false
      this.tampilToast = true
      mainkanSuara()

      // Sembunyikan toast setelah 1.8 detik
      setTimeout(() => {
        this.tampilToast = false
      }, 1800)
    },

    /**
     * ubahJumlah — Menambah atau mengurangi jumlah item di keranjang
     * Jika jumlah menjadi < 1, item dihapus dari keranjang.
     * Jika keranjang kosong, kembali ke layar menu.
     *
     * @param {number} indeks — Index item di array keranjang
     * @param {number} jumlah — Nilai perubahan (+1 atau -1)
     */
    ubahJumlah(indeks, jumlah) {
      const jumlahBaru = this.keranjang[indeks].jumlah + jumlah

      if (jumlahBaru < 1) {
        // Hapus item dari keranjang jika jumlah < 1
        this.keranjang.splice(indeks, 1)
      } else {
        // Update jumlah item
        this.keranjang[indeks].jumlah = jumlahBaru
      }

      mainkanSuara()

      // Kembali ke menu jika keranjang kosong
      if (!this.keranjang.length) {
        this.navigasiKe('menu')
      }
    },

    /**
     * tekanKeypad — Menangani input nomor meja dari keypad virtual
     * Mendukung 3 jenis input:
     * - Angka (0-9): Menambahkan digit ke nomor meja (max 2 digit)
     * - 'clear': Mereset nomor meja ke string kosong
     * - 'delete': Menghapus digit terakhir
     *
     * @param {number|string} tombol — Tombol yang ditekan
     */
    tekanKeypad(tombol) {
      if (tombol === 'clear') {
        // Reset nomor meja
        this.nomorMeja = ''
      } else if (tombol === 'delete') {
        // Hapus digit terakhir
        this.nomorMeja = this.nomorMeja.slice(0, -1)
      } else if (this.nomorMeja.length < 2) {
        // Tambahkan digit baru (maksimal 2 digit)
        this.nomorMeja += String(tombol)
      }

      mainkanSuara()
    },

    /**
     * selesaikanPesanan — Memproses pesanan selesai
     * Proses:
     * 1. Putar suara konfirmasi
     * 2. Buat nomor antrean acak (PD-100 sampai PD-999)
     * 3. Pindah ke layar sukses
     * 4. Setelah 2.5 detik, pindah ke layar struk
     * 5. Mulai timer countdown struk (15 detik)
     */
    selesaikanPesanan() {
      mainkanSuara()

      // Buat nomor antrean acak: PD-100 hingga PD-999
      const angkaAcak = Math.floor(Math.random() * 900) + 100
      this.nomorAntrean = `PD-${String(angkaAcak)}`

      // Pindah ke layar sukses
      this.langkah = 'sukses'

      // Setelah 2.5 detik, tampilkan struk
      setTimeout(() => {
        this.langkah = 'struk'
        this.mulaiTimerStruk()
      }, 2500)
    },

    /**
     * mulaiTimerStruk — Memulai timer countdown untuk layar struk
     * Countdown dimulai dari 15 detik. Saat mencapai 0,
     * kiosk otomatis di-reset ke layar kunci.
     */
    mulaiTimerStruk() {
      this.detikStruk = 15

      // Hentikan timer sebelumnya (jika ada)
      clearInterval(this.timerStruk)

      // Mulai countdown baru
      this.timerStruk = setInterval(() => {
        this.detikStruk--

        if (this.detikStruk <= 0) {
          clearInterval(this.timerStruk)
          this.aturUlang()
        }
      }, 1000) // 1.000 ms = 1 detik
    },

    /**
     * aturUlang — Mereset semua state ke kondisi awal
     * Dipanggil saat:
     * - Timer idle timeout habis (60 detik tidak ada interaksi)
     * - Timer struk habis (15 detik setelah struk ditampilkan)
     * - Pengguna menekan tombol "Reset pesanan"
     *
     * Proses:
     * 1. Bersihkan semua timer
     * 2. Reset langkah ke 'kunci' (lockscreen)
     * 3. Kosongkan keranjang
     * 4. Reset semua state lain ke nilai default
     */
    aturUlang() {
      // Bersihkan semua timer aktif
      clearTimeout(this.timerIdle)
      clearInterval(this.timerStruk)

      // Reset semua state ke nilai awal
      this.langkah = 'kunci'
      this.keranjang = []
      this.kategoriAktif = 'rekomendasi'
      this.itemSaatIni = null
      this.tampilModal = false
      this.metodePengiriman = ''
      this.nomorMeja = ''
      this.metodePembayaran = ''
      this.kustomisasi = { potongan: '', minuman: '', saus: '' }
    },
  }
}

export default buatKomponenKiosk
