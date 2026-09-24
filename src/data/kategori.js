/**
 * ==========================================================================
 * DATA KATEGORI MENU
 * ==========================================================================
 * Berisi 7 kategori KFC utama yang digunakan di kiosk Kriukology:
 * 1. promotion  — Promotion / Promo Spesial
 * 2. chicken    — Chicken / Ayam Goreng Krispi
 * 3. bucket     — Bucket & Sharing
 * 4. burger     — Bowl / Burger
 * 5. snack      — Snack / Sides
 * 6. kids       — Kids Meal
 * 7. dessert    — Dessert / Makanan Penutup
 * ==========================================================================
 */

const daftarKategori = [
  {
    id: 'promotion',
    icon: 'fa-solid fa-tags',
    label: { id: 'Promotion', en: 'Promotion' },
  },
  {
    id: 'chicken',
    icon: 'fa-solid fa-drumstick-bite',
    label: { id: 'Chicken', en: 'Chicken' },
  },
  {
    id: 'bucket',
    icon: 'fa-solid fa-layer-group',
    label: { id: 'Bucket & Sharing', en: 'Bucket & Sharing' },
  },
  {
    id: 'burger',
    icon: 'fa-solid fa-burger',
    label: { id: 'Bowl / Burger', en: 'Bowl / Burger' },
  },
  {
    id: 'snack',
    icon: 'fa-solid fa-cookie-bite',
    label: { id: 'Snack / Sides', en: 'Snack / Sides' },
  },
  {
    id: 'kids',
    icon: 'fa-solid fa-child',
    label: { id: 'Kids Meal', en: 'Kids Meal' },
  },
  {
    id: 'dessert',
    icon: 'fa-solid fa-ice-cream',
    label: { id: 'Dessert', en: 'Dessert' },
  },
]

export default daftarKategori
