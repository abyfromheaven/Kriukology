/**
 * ==========================================================================
 * TEMPLATE: LAYAR SUKSES
 * ==========================================================================
 * Layar animasi singkat yang muncul selama 2.5 detik setelah pesanan
 * berhasil diselesaikan. Berfungsi sebagai konfirmasi visual bahwa
 * pesanan telah diterima oleh sistem.
 *
 * Komponen:
 * - Lingkaran hijau dengan ikon centang (✓)
 * - Tulisan "Terima kasih!" (terjemahan dari kamus)
 * - Pesan "Pesananmu sedang diproses"
 *
 * Alur: pembayaran → SUKSES (2.5 detik) → struk
 *
 * Setelah 2.5 detik, layar otomatis berpindah ke layar struk digital.
 * ==========================================================================
 */

const templateSukses = `
<template x-if="langkah === 'sukses'">
  <div class="h-full bg-[#d51f32] grid-noise flex items-center justify-center text-white text-center p-8">
    <div class="animate__animated animate__zoomIn">

      <!-- Ikon centang di dalam lingkaran -->
      <div class="h-20 w-20 mx-auto rounded-full border-4 border-[#f5bd27] flex items-center justify-center text-4xl">
        <i class="fa-solid fa-check"></i>
      </div>

      <!-- Tulisan "Terima kasih!" -->
      <h2 class="display text-5xl mt-7" x-text="terjemahkan('thank')"></h2>

      <!-- Pesan pemrosesan -->
      <p class="mt-3 font-medium text-white/80" x-text="terjemahkan('processing')"></p>

    </div>
  </div>
</template>
`

export default templateSukses
