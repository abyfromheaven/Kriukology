/**
 * ==========================================================================
 * DATA METODE PEMBAYARAN
 * ==========================================================================
 * Berisi daftar metode pembayaran yang tersedia di kiosk Kriukology.
 * Pengguna dapat memilih salah satu metode sebelum menyelesaikan pesanan.
 *
 * Metode yang tersedia:
 * - QRIS      — Pembayaran via scan QR code
 * - E-Wallet  — Dompet digital (GoPay, OVO, DANA, dll)
 * - M-Banking — Mobile banking dari berbagai bank
 * - Debit     — Kartu debit langsung
 * - Cash      — Bayar tunai di kasir
 * ==========================================================================
 */

const daftarPembayaran = [
  {
    id: 'qris',
    label: 'QRIS',
    icon: 'fa-solid fa-qrcode',
  },
  {
    id: 'cash',
    label: 'Tunai',
    icon: 'fa-solid fa-money-bill-wave',
  },
  {
    id: 'debit',
    label: 'Debit',
    icon: 'fa-solid fa-credit-card',
  },
]

export default daftarPembayaran
