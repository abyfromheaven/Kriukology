/**
 * ==========================================================================
 * DATA MENU
 * ==========================================================================
 * Berisi daftar semua item menu yang tersedia di kiosk Kriukology.
 * Setiap menu memiliki properti: id, nama, harga, kategori, emoji, tag, dan deskripsi.
 *
 * Struktur data menu:
 * - id       : Kode unik item (angka)
 * - nama     : Nama tampilan menu
 * - harga    : Harga dalam Rupiah (tanpa format)
 * - kategori : Golongan menu (rekomendasi, paket, alacarte, minuman, cemilan)
 * - emoji    : Ikon emoji untuk tampilan visual
 * - tag      : Label promosi (BEST SELLER, HEMAT, dll) — kosong jika tidak ada
 * - deskripsi: Deskripsi singkat tentang item
 * ==========================================================================
 */

const daftarMenu = [
  // ── Kategori Rekomendasi ──────────────────────────────────────────────
  {
    id: 1,
    nama: 'Paket Paha Juara',
    harga: 32000,
    kategori: 'rekomendasi',
    emoji: '🍗',
    tag: 'BEST SELLER',
    deskripsi: 'Ayam krispi, nasi, minum',
  },
  {
    id: 2,
    nama: 'Paket Dada Mantap',
    harga: 36000,
    kategori: 'rekomendasi',
    emoji: '🍗',
    tag: 'FAVORIT',
    deskripsi: 'Ayam besar, nasi, minum',
  },

  // ── Kategori Paket ────────────────────────────────────────────────────
  {
    id: 3,
    nama: 'Krispi Berdua',
    harga: 58000,
    kategori: 'paket',
    emoji: '🍗',
    tag: 'HEMAT',
    deskripsi: '2 ayam, 2 nasi, 2 minum',
  },
  {
    id: 4,
    nama: 'Paket Sultan',
    harga: 72000,
    kategori: 'paket',
    emoji: '🍗',
    tag: 'RAMAI-RAMAI',
    deskripsi: '4 ayam, nasi, 2 minum',
  },

  // ── Kategori A La Carte (Satuan) ──────────────────────────────────────
  {
    id: 5,
    nama: 'Ayam Krispi',
    harga: 17000,
    kategori: 'alacarte',
    emoji: '🍗',
    tag: '',
    deskripsi: 'Renyah sampai tulang',
  },
  {
    id: 6,
    nama: 'Nasi Hangat',
    harga: 8000,
    kategori: 'alacarte',
    emoji: '🍚',
    tag: '',
    deskripsi: 'Porsi pas, pulen',
  },

  // ── Kategori Minuman ──────────────────────────────────────────────────
  {
    id: 7,
    nama: 'Pepsi Dingin',
    harga: 9000,
    kategori: 'minuman',
    emoji: '🥤',
    tag: '',
    deskripsi: 'Segarnya nggak kaleng-kaleng',
  },
  {
    id: 8,
    nama: 'Es Teh Bahagia',
    harga: 7000,
    kategori: 'minuman',
    emoji: '🧋',
    tag: '',
    deskripsi: 'Manisnya pas',
  },

  // ── Kategori Cemilan ──────────────────────────────────────────────────
  {
    id: 9,
    nama: 'Kentang Nyemil',
    harga: 12000,
    kategori: 'cemilan',
    emoji: '🍟',
    tag: '',
    deskripsi: 'Kentang gurih bergelombang',
  },
  {
    id: 10,
    nama: 'Kulit Krispi',
    harga: 14000,
    kategori: 'cemilan',
    emoji: '✨',
    tag: 'BARU',
    deskripsi: 'Tipis, kriuk, nagih',
  },
]

export default daftarMenu
