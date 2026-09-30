/**
 * ==========================================================================
 * DATA MENU
 * ==========================================================================
 * Berisi daftar semua item menu yang tersedia di kiosk Kriukology.
 * Setiap menu memiliki properti: id, nama, harga, kategori, gambar, emoji, tag, dan deskripsi.
 *
 * Kategori yang didukung:
 * chicken, burger, snack, dessert, beverage
 *
 * CATATAN GAMBAR:
 * Seluruh gambar memakai file lokal di /assets/produk/. Spasi pada nama file
 * ditulis sebagai %20 agar valid di atribut src. Ukuran/aspect ratio bebas —
 * kartu produk di kiosk memakai object-contain + aspect-square sehingga
 * gambar apa pun tampil utuh tanpa perlu penyesuaian per gambar.
 * ==========================================================================
 */

const daftarMenu = [
  // ── 1. Chicken ────────────────────────────────────────────────────────
  {
    id: 1,
    nama: 'Ayam Goreng Crispy 1 Ekor',
    harga: 28000,
    kategori: 'chicken',
    gambar: '/assets/produk/Chicken%201%20Ekor.png',
    emoji: '🍗',
    tag: 'BEST SELLER',
    deskripsi: 'Ayam krispi utuh satu ekor, renyah di luar dan juicy di dalam',
  },
  {
    id: 2,
    nama: 'Chicken Sayap 6 Pcs',
    harga: 32000,
    kategori: 'chicken',
    gambar: '/assets/produk/Chicken%20Sayap.jpg',
    emoji: '🍗',
    tag: '',
    deskripsi: 'Enam potong sayap ayam krispi, pas dicocol saus favorit',
  },

  // ── 2. Bowl / Burger ──────────────────────────────────────────────────
  {
    id: 3,
    nama: 'Yakiniku Don',
    harga: 29000,
    kategori: 'burger',
    gambar: '/assets/produk/Yakiniku%20Don.jpg',
    emoji: '🍚',
    tag: '',
    deskripsi: 'Nasi hangat dengan potongan ayam yakiniku manis kecap',
  },
  {
    id: 4,
    nama: 'Zinger Burger',
    harga: 34000,
    kategori: 'burger',
    gambar: '/assets/produk/Burger.jpg',
    emoji: '🍔',
    tag: 'BEST SELLER',
    deskripsi: 'Burger fillet ayam krispi dengan selada segar dan saus zinger',
  },

  // ── 3. Snack / Sides ──────────────────────────────────────────────────
  {
    id: 5,
    nama: 'Chicken Popcorn',
    harga: 26000,
    kategori: 'snack',
    gambar: '/assets/produk/Chicken%20Popcorn.jpg',
    emoji: '🍿',
    tag: '',
    deskripsi: 'Popcorn ayam krispi ukuran gigitan, gurihnya bikin nagih',
  },
  {
    id: 6,
    nama: 'French Fries',
    harga: 14000,
    kategori: 'snack',
    gambar: '/assets/produk/French%20Fries.jpg',
    emoji: '🍟',
    tag: '',
    deskripsi: 'Kentang goreng renyah dengan sedikit garam',
  },
  {
    id: 7,
    nama: 'Cream Soup',
    harga: 15000,
    kategori: 'snack',
    gambar: '/assets/produk/Cream%20Soup.jpg',
    emoji: '🍲',
    tag: '',
    deskripsi: 'Sup krim jamur hangat yang gurihnya lembut',
  },

  // ── 4. Dessert ────────────────────────────────────────────────────────
  {
    id: 8,
    nama: 'Coconut Sundae',
    harga: 14000,
    kategori: 'dessert',
    gambar: '/assets/produk/Choconut%20Sundae.jpg',
    emoji: '🍦',
    tag: '',
    deskripsi: 'Es krim kelapa lembut dengan saus cokelat manis',
  },
  {
    id: 9,
    nama: 'Donut Gula',
    harga: 12000,
    kategori: 'dessert',
    gambar: '/assets/produk/Donut.jpg',
    emoji: '🍩',
    tag: 'FAVORIT',
    deskripsi: 'Donut lembut dengan taburan cokelat dan sprinkles',
  },

  // ── 5. Beverage ───────────────────────────────────────────────────────
  {
    id: 10,
    nama: 'Iced Cappuccino Float',
    harga: 22000,
    kategori: 'beverage',
    gambar: '/assets/produk/Iced%20Cappucino%20Float.jpg',
    emoji: '☕',
    tag: '',
    deskripsi: 'Es cappuccino dingin dengan Cuban ice cream melimpah',
  },
  {
    id: 11,
    nama: 'Mocha Float',
    harga: 24000,
    kategori: 'beverage',
    gambar: '/assets/produk/Mocha%20Float.jpg',
    emoji: '🍫',
    tag: 'BEST SELLER',
    deskripsi: 'Mocha dingin dengan whip cream dan gerELY cokelat',
  },
]

export default daftarMenu
