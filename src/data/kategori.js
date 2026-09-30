/**
 * ==========================================================================
 * DATA KATEGORI MENU
 * ==========================================================================
 * Berisi 5 kategori menu yang digunakan di kiosk Kriukology:
 * 1. chicken    — Chicken / Ayam Goreng Krispi
 * 2. burger     — Bowl / Burger
 * 3. snack      — Snack / Sides
 * 4. dessert    — Dessert / Makanan Penutup
 * 5. beverage   — Beverage / Minuman Dingin
 * ==========================================================================
 */

const daftarKategori = [
  {
    id: 'chicken',
    icon: 'fa-solid fa-drumstick-bite',
    label: { id: 'Chicken', en: 'Chicken' },
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
    id: 'dessert',
    icon: 'fa-solid fa-ice-cream',
    label: { id: 'Dessert', en: 'Dessert' },
  },
  {
    id: 'beverage',
    icon: 'fa-solid fa-mug-hot',
    label: { id: 'Beverage', en: 'Beverage' },
  },
]

export default daftarKategori
