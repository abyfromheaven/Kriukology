/**
 * ==========================================================================
 * TEMPLATE: LAYAR SUKSES
 * ==========================================================================
 * Layar animasi singkat setelah pesanan berhasil.
 *
 * Dua kondisi, mengikuti metode pembayaran:
 *   - Tunai → "Terima Kasih!"
 *   - QRIS  → "Pembayaran Berhasil"
 *
 * Elemen masuk berurutan (lingkaran centang → judul → keterangan) dan
 * keluar lagi sebelum pindah ke layar struk.
 * ==========================================================================
 */

const templateSukses = `
<div data-screen="sukses" style="display:none" class="h-full bg-white grid-noise flex items-center justify-center text-center p-8">
  <div class="sukses-konten">

    <!-- Lingkaran centang merah -->
    <div class="sukses-check">
      <i class="fa-solid fa-check"></i>
    </div>

    <!-- Judul: Terima Kasih! (tunai) / Pembayaran Berhasil (QRIS) -->
    <h2 class="display font-black text-[30px] sm:text-4xl mt-7 text-[#231f20]" data-bind="thankText"></h2>

    <!-- Keterangan -->
    <p class="sukses-catatan mt-4 font-medium text-stone-500 text-sm sm:text-base whitespace-pre-line" data-bind="processingText"></p>

  </div>
</div>
`

export default templateSukses
