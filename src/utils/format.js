/**
 * ==========================================================================
 * UTILITAS FORMAT ANGKA
 * ==========================================================================
 * Berisi fungsi-fungsi untuk memformat angka ke dalam format yang mudah
 * dibaca oleh pengguna Indonesia.
 * ==========================================================================
 */

/**
 * FormatRupiah — Mengubah angka menjadi string format Rupiah (IDR)
 *
 * Contoh penggunaan:
 *   formatRupiah(32000) → "Rp32.000"
 *   formatRupiah(72000) → "Rp72.000"
 *
 * @param {number} angka — Nilai harga dalam bentuk angka
 * @returns {string} — String harga yang sudah terformat Rupiah
 */
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka)
}

export default formatRupiah
