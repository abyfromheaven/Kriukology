/**
 * ==========================================================================
 * DATA MENU
 * ==========================================================================
 * Berisi daftar semua item menu yang tersedia di kiosk Kriukology.
 * Setiap menu memiliki properti: id, nama, harga, kategori, gambar, emoji, tag, dan deskripsi.
 *
 * Kategori yang didukung:
 * promotion, lto, chicken, box, bucket, burger, snack, beverage, kids, breakfast, dessert
 * ==========================================================================
 */

const daftarMenu = [
  // ── 1. Promotion ──────────────────────────────────────────────────────
  {
    id: 1,
    nama: 'Super Promo Hemat',
    harga: 28000,
    kategori: 'promotion',
    gambar: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80',
    emoji: '🔥',
    tag: 'PROMO 30%',
    deskripsi: '1 Ayam Krispi + Nasi + Es Teh',
  },
  {
    id: 2,
    nama: 'Combo Berdua Super',
    harga: 52000,
    kategori: 'promotion',
    gambar: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80',
    emoji: '🏷️',
    tag: 'SPECIAL OFFER',
    deskripsi: '2 Ayam Krispi + 2 Nasi + 2 Pepsi',
  },

  // ── 2. Limited Time Offer ─────────────────────────────────────────────
  {
    id: 3,
    nama: 'Chaki Spicy Fire Ayam',
    harga: 26000,
    kategori: 'lto',
    gambar: 'https://images.unsplash.com/photo-1625938146369-ad802ce17300?w=500&auto=format&fit=crop&q=80',
    emoji: '🌶️',
    tag: 'LIMITED',
    deskripsi: 'Ayam krispi balut saus pedas membara',
  },
  {
    id: 4,
    nama: 'Smoky Honey BBQ Box',
    harga: 42000,
    kategori: 'lto',
    gambar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    emoji: '🍯',
    tag: 'LIMITED',
    deskripsi: 'Ayam Honey BBQ + French Fries + Cola',
  },

  // ── 3. Chicken ────────────────────────────────────────────────────────
  {
    id: 5,
    nama: '1 Pcs Ayam Crispy',
    harga: 19500,
    kategori: 'chicken',
    gambar: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80',
    emoji: '🍗',
    tag: '',
    deskripsi: 'Ayam krispi renyah di luar, juicy di dalam',
  },
  {
    id: 6,
    nama: '1 Pcs Ayam Original',
    harga: 19500,
    kategori: 'chicken',
    gambar: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=500&auto=format&fit=crop&q=80',
    emoji: '🍗',
    tag: 'CLASSIC',
    deskripsi: 'Ayam goreng dengan 11 bumbu rahasia',
  },
  {
    id: 7,
    nama: '2 Pcs Ayam Combo',
    harga: 38000,
    kategori: 'chicken',
    gambar: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    emoji: '🍗',
    tag: '',
    deskripsi: '2 potong ayam crispy / original pilihan',
  },

  // ── 4. Box ────────────────────────────────────────────────────────────
  {
    id: 8,
    nama: 'Super Family Box',
    harga: 85000,
    kategori: 'box',
    gambar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
    emoji: '📦',
    tag: 'KOMPLIT',
    deskripsi: '5 Ayam Krispi + 3 Nasi + 3 Minum',
  },
  {
    id: 9,
    nama: 'Crispy Bento Box',
    harga: 35000,
    kategori: 'box',
    gambar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    emoji: '🍱',
    tag: 'FAVORIT',
    deskripsi: 'Chicken Strips + Nasi + Salad + Sauce',
  },

  // ── 5. Bucket & Sharing ──────────────────────────────────────────────
  {
    id: 10,
    nama: 'Bucket 9 Pcs Ayam',
    harga: 145000,
    kategori: 'bucket',
    gambar: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    emoji: '🪣',
    tag: 'PARTY PACK',
    deskripsi: '9 potong ayam krispi untuk kumpul seru',
  },
  {
    id: 11,
    nama: 'Snack Bucket Family',
    harga: 68000,
    kategori: 'bucket',
    gambar: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    emoji: '🍿',
    tag: '',
    deskripsi: 'French Fries + Chicken Balls + Waffle',
  },

  // ── 6. Bowl / Burger ─────────────────────────────────────────────────
  {
    id: 12,
    nama: 'Zinger Burger Super',
    harga: 34000,
    kategori: 'burger',
    gambar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    emoji: '🍔',
    tag: 'BEST SELLER',
    deskripsi: 'Burger fillet ayam krispi ekstra pedas',
  },
  {
    id: 13,
    nama: 'Oriental Chicken Bowl',
    harga: 27000,
    kategori: 'burger',
    gambar: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    emoji: '🍚',
    tag: '',
    deskripsi: 'Nasi warmly served dengan potongan ayam saus oriental',
  },

  // ── 7. Snack / Sides ─────────────────────────────────────────────────
  {
    id: 14,
    nama: 'French Fries Large',
    harga: 21000,
    kategori: 'snack',
    gambar: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    emoji: '🍟',
    tag: '',
    deskripsi: 'Kentang goreng gurih renyah ukuran besar',
  },
  {
    id: 15,
    nama: 'Chicken Strips 3 Pcs',
    harga: 24000,
    kategori: 'snack',
    gambar: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500&auto=format&fit=crop&q=80',
    emoji: '🥓',
    tag: '',
    deskripsi: 'Fillet ayam krispi tanpa tulang',
  },
  {
    id: 16,
    nama: 'Crispy Skin / Kulit Ayam',
    harga: 16000,
    kategori: 'snack',
    gambar: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80',
    emoji: '✨',
    tag: 'REKOR KRIUK',
    deskripsi: 'Kulit ayam goreng kriuk super gurih',
  },

  // ── 8. Beverage ──────────────────────────────────────────────────────
  {
    id: 17,
    nama: 'Pepsi Zero Sugar',
    harga: 12000,
    kategori: 'beverage',
    gambar: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    emoji: '🥤',
    tag: '',
    deskripsi: 'Minuman bersoda segar tanpa gula',
  },
  {
    id: 18,
    nama: 'Iced Lemon Tea',
    harga: 10000,
    kategori: 'beverage',
    gambar: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
    emoji: '🍋',
    tag: '',
    deskripsi: 'Es teh rasa lemon manis menyegarkan',
  },
  {
    id: 19,
    nama: 'Air Mineral 600ml',
    harga: 7000,
    kategori: 'beverage',
    gambar: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
    emoji: '💧',
    tag: '',
    deskripsi: 'Air minum kemasan murni',
  },

  // ── 9. Kids Meal ─────────────────────────────────────────────────────
  {
    id: 20,
    nama: 'Chaki Kids Combo A',
    harga: 38000,
    kategori: 'kids',
    gambar: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=80',
    emoji: '🧸',
    tag: 'FREE TOY',
    deskripsi: '1 Ayam Mild + Nasi + Milo + Mainan',
  },
  {
    id: 21,
    nama: 'Chaki Kids Burger Pack',
    harga: 36000,
    kategori: 'kids',
    gambar: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    emoji: '🍔',
    tag: 'FREE TOY',
    deskripsi: 'Junior Burger + Fries + Juice + Mainan',
  },

  // ── 10. Breakfast ────────────────────────────────────────────────────
  {
    id: 22,
    nama: 'Riser Chicken Roll',
    harga: 18000,
    kategori: 'breakfast',
    gambar: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80',
    emoji: '🌯',
    tag: 'PAGI SEGAR',
    deskripsi: 'Roll ayam hangat dengan saus keju',
  },
  {
    id: 23,
    nama: 'Bubur Ayam Original',
    harga: 15000,
    kategori: 'breakfast',
    gambar: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    emoji: '🥣',
    tag: '',
    deskripsi: 'Bubur lembut dengan suwiran ayam gurih',
  },

  // ── 11. Dessert ──────────────────────────────────────────────────────
  {
    id: 24,
    nama: 'Sundae Chocolate',
    harga: 11000,
    kategori: 'dessert',
    gambar: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80',
    emoji: '🍦',
    tag: '',
    deskripsi: 'Es krim lembut dengan saus cokelat manis',
  },
  {
    id: 25,
    nama: 'Egg Tart Warm',
    harga: 13000,
    kategori: 'dessert',
    gambar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    emoji: '🥧',
    tag: 'FAVORIT',
    deskripsi: 'Pastry renyah isi vla telur hangat',
  },
]

export default daftarMenu
