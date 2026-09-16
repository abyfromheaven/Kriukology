/**
 * ==========================================================================
 * DATA METODE PEMBAYARAN
 * ==========================================================================
 * Berisi daftar metode pembayaran yang tersedia di kiosk PahaDada.id.
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
    id: 'wallet',
    label: 'E-Wallet',
    icon: 'fa-solid fa-wallet',
  },
  {
    id: 'bank',
    label: 'M-Banking',
    icon: 'fa-solid fa-building-columns',
  },
  {
    id: 'debit',
    label: 'Debit',
    icon: 'fa-solid fa-credit-card',
  },
  {
    id: 'cash',
    label: 'Cash',
    icon: 'fa-solid fa-money-bill-wave',
  },
]

export default daftarPembayaran
