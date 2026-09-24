/**
 * ==========================================================================
 * TEMPLATE: LAYAR PEMBAYARAN
 * ==========================================================================
 * Layar pemilihan metode pembayaran Kiosk Kriukology.
 * 100% Mengikuti Sketsa Layout Layar Pembayaran dari pengguna:
 * 1. Header Belang Logo Konsisten
 * 2. Judul METODE PEMBAYARAN
 * 3. Card Total Pembayaran (Soft Shadow White Card)
 * 4. Judul METODE PEMBAYARAN
 * 5. Card 3 Pilihan Metode (QRIS, Tunai, Debit)
 * 6. Tombol Kembali
 * ==========================================================================
 */

const templatePembayaran = `
<div data-screen="pembayaran" style="display:none" class="h-full flex flex-col bg-[#f7f1e8] relative overflow-hidden">

  <!-- 1. Header: Belang Kiri | Banner Logo Tengah (Putih) | Belang Kanan -->
  <header class="shrink-0 h-[64px] flex items-stretch relative z-10 shadow-xs">
    <!-- Sayap Kiri Belang -->
    <div class="header-belang w-16 sm:w-20 shrink-0"></div>

    <!-- Tengah Putih + Banner Logo -->
    <div class="flex-1 bg-white flex items-center justify-center px-3">
      <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology"
        class="h-11 max-w-[88%] object-contain drop-shadow-sm" />
    </div>

    <!-- Sayap Kanan Belang -->
    <div class="header-belang w-16 sm:w-20 shrink-0"></div>
  </header>

  <!-- 2. Body Container (Memenuhi Layar, Centered Content) -->
  <div class="flex-1 overflow-y-auto scroll-clean p-5 sm:p-6 flex flex-col items-center justify-between gap-4">

    <!-- Section Atas: Judul + Card Total Pembayaran -->
    <div class="w-full flex flex-col items-center gap-2.5 mt-2">
      <h2 class="display text-base sm:text-lg font-black tracking-wider text-[#231f20] uppercase">METODE PEMBAYARAN</h2>
      
      <!-- Card Total Pembayaran (Clean Soft Shadow, White Card) -->
      <div class="w-full bg-white rounded-2xl py-5 px-4 text-center shadow-[0_8px_24px_rgba(42,36,36,0.06)] border border-stone-100">
        <p class="text-xs sm:text-sm font-semibold text-stone-600">Total Pembayaran</p>
        <p class="text-2xl sm:text-3xl font-black text-[#231f20] mt-1.5 tabular-nums" data-bind="totalHargaBayar">Rp0</p>
      </div>
    </div>

    <!-- Section Tengah: Judul + Card 3 Pilihan Metode Pembayaran -->
    <div class="w-full flex flex-col items-center gap-2.5">
      <h2 class="display text-base sm:text-lg font-black tracking-wider text-[#231f20] uppercase">METODE PEMBAYARAN</h2>
      
      <!-- Container 3 Metode Pembayaran (QRIS, Tunai, Debit) -->
      <div class="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(42,36,36,0.06)] border border-stone-100">
        <div class="grid grid-cols-3 gap-3" data-list="metodePembayaran"></div>
      </div>
    </div>

    <!-- Section Bawah: Tombol Kembali -->
    <div class="w-full flex justify-center pt-2 pb-2">
      <button data-action="navigasiKe:keranjang"
        class="w-48 h-11 rounded-2xl bg-white hover:bg-stone-50 active:scale-[0.98] transition border border-stone-200 font-bold text-xs sm:text-sm text-stone-700 shadow-[0_4px_16px_rgba(42,36,36,0.06)] flex items-center justify-center gap-2">
        <span data-text="back">Kembali</span>
      </button>
    </div>

  </div>

</div>
`

export default templatePembayaran
