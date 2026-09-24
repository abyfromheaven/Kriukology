/**
 * ==========================================================================
 * KAMUS TERJEMAHAN (INTERNATIONALIZATION / i18n)
 * ==========================================================================
 * Berisi kamus terjemahan untuk semua teks UI dalam bahasa Indonesia (id)
 * dan bahasa Inggris (en). Digunakan oleh fungsi `terjemahkan(key)` di
 * komponen kiosk untuk mengambil teks sesuai pilihan bahasa pengguna.
 *
 * Cara kerja:
 * 1. Pengguna memilih bahasa di layar preferensi
 * 2. Fungsi terjemahkan() mengambil nilai dari kamus berdasarkan key
 * 3. Jika key tidak ditemukan, fungsi mengembalikan key itu sendiri
 *
 * Struktur: { id: { key: 'nilai' }, en: { key: 'value' } }
 * ==========================================================================
 */

const kamus = {
  // ── Bahasa Indonesia ──────────────────────────────────────────────────
  id: {
    order: 'MULAI PESANAN',
    subtitle: 'Tap layar, pesananmu nggak pakai antre.',
    welcome: 'SELAMAT DATANG',
    welcomeSub: 'Tentukan caramu berkriuk!',
    chooseLang: 'Pilih Bahasamu',
    choose: 'Pilih pengalamanmu',
    language: 'Pilih bahasa',
    eat: 'Makan di mana?',
    dine: 'Makan Di Sini',
    take: 'Bawa Pulang',
    continue: 'Lanjut',
    menu: 'Menu pilihanmu',
    reset: 'Reset pesanan',
    viewCart: 'Lihat pesanan saya',
    add: 'Tambah',
    cancel: 'Batalkan',
    cart: 'Pesanan saya',
    cartTitle: 'KERANJANG',
    cartTotal: 'TOTAL',
    cartMore: 'Tambahkan Menu Lain',
    cartCheckout: 'Lanjut Bayar',
    finish: 'Selesaikan pesanan',
    more: 'Tambah pesanan',
    payment: 'Pilih cara bayarmu',
    simulate: 'Simulasi sukses',
    thank: 'Terima kasih!',
    processing: 'Pesananmu sedang diproses',
    receipt: 'Struk digital',
    queue: 'Nomor antrean',
    back: 'Kembali',
    items: 'item',
    chooseCut: 'Pilih potongan ayam',
    chooseDrink: 'Pilih minuman',
    chooseSauce: 'Pilih saus',
    addCart: 'Tambah ke keranjang',
    added: 'Menu ditambahkan!',
    ready: 'Sudah siap?',
    scan: 'Scan QR untuk bayar',
    cash: 'Bayar di kasir',
    orderLabel: 'Pesanan',
    cancelOrder: 'Reset Pesanan',
    viewOrder: 'Lihat Keranjang',
    stockOut: 'Stok Habis',
    cancelConfirm: 'Reset seluruh pesanan ini?',
    yes: 'Ya',
    no: 'Batal',
  },

  // ── Bahasa Inggris ────────────────────────────────────────────────────
  en: {
    order: 'START ORDER',
    subtitle: 'Tap the screen, no queue needed.',
    welcome: 'WELCOME',
    welcomeSub: 'Where would you like to eat?',
    chooseLang: 'Choose your language',
    choose: 'Choose your experience',
    language: 'Choose language',
    eat: 'Where are you eating?',
    dine: 'Dine In',
    take: 'Take Away',
    continue: 'Continue',
    menu: 'Your menu picks',
    reset: 'Reset order',
    viewCart: 'View my order',
    add: 'Add',
    cancel: 'Cancel',
    cart: 'My order',
    cartTitle: 'YOUR CART',
    cartTotal: 'TOTAL',
    cartMore: 'Add Another Menu',
    cartCheckout: 'Continue',
    finish: 'Finish order',
    more: 'Add more items',
    payment: 'Choose payment method',
    simulate: 'Simulate success',
    thank: 'Thank you!',
    processing: 'Your order is being prepared',
    receipt: 'Digital receipt',
    queue: 'Queue number',
    back: 'Back',
    items: 'items',
    chooseCut: 'Choose chicken cut',
    chooseDrink: 'Choose a drink',
    chooseSauce: 'Choose a sauce',
    addCart: 'Add to order',
    added: 'Menu added!',
    ready: 'Ready?',
    scan: 'Scan QR to pay',
    cash: 'Pay at counter',
    orderLabel: 'Order',
    cancelOrder: 'Reset Order',
    viewOrder: 'View Cart',
    stockOut: 'Out of Stock',
    cancelConfirm: 'Reset this entire order?',
    yes: 'Yes',
    no: 'Cancel',
  },
}

export default kamus
