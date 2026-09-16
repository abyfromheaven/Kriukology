/**
 * ==========================================================================
 * DATA KATEGORI MENU
 * ==========================================================================
 * Berisi daftar kategori yang digunakan untuk memfilter menu di layar menu.
 * Setiap kategori memiliki id, ikon Font Awesome, dan label ganda (ID & EN).
 *
 * Kategori tersedia:
 * 1. rekomendasi — Menu terlaris dan paling direkomendasikan
 * 2. paket       — Paket combo dengan harga hemat
 * 3. alacarte    — Menu satuan / a la carte
 * 4. minuman     — Berbagai pilihan minuman
 * 5. cemilan     — Snack dan cemilan ringan
 * ==========================================================================
 */

const daftarKategori = [
  {
    id: 'rekomendasi',
    icon: 'fa-solid fa-fire',
    label: { id: 'Rekomen', en: 'Top picks' },
  },
  {
    id: 'paket',
    icon: 'fa-solid fa-box',
    label: { id: 'Paket', en: 'Combos' },
  },
  {
    id: 'alacarte',
    icon: 'fa-solid fa-drumstick-bite',
    label: { id: 'Satuan', en: 'A la carte' },
  },
  {
    id: 'minuman',
    icon: 'fa-solid fa-glass-water',
    label: { id: 'Minum', en: 'Drinks' },
  },
  {
    id: 'cemilan',
    icon: 'fa-solid fa-cookie-bite',
    label: { id: 'Cemilan', en: 'Snacks' },
  },
]

export default daftarKategori
