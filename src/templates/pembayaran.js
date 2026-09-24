/**
 * ==========================================================================
 * TEMPLATE: LAYAR PEMBAYARAN
 * ==========================================================================
 * Layar pemilihan metode pembayaran Kiosk Kriukology.
 * 100% Mengikuti Sketsa Layout Layar Pembayaran dari pengguna:
 * 1. Header Belang + Judul (identik halaman keranjang)
 * 2. Card Total Pembayaran (Soft Shadow White Card, tanpa outline solid)
 * 3. Judul Pilihan Metode Pembayaran
 * 4. Card 3 Pilihan Metode (QRIS, Tunai, Debit) dengan gambar besar
 * 5. Tombol Kembali (ikon panah merah seperti sidebar menu)
 * ==========================================================================
 */

const templatePembayaran = `
<div data-screen="pembayaran" style="display:none" class="h-full flex flex-col bg-white relative overflow-hidden">

  <!-- 1. Header: identik halaman keranjang (Belang | Logo | Belang + Judul) -->
  <header class="shrink-0">
    <div class="h-[64px] flex items-stretch relative">
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
      <div class="flex-1 bg-white flex items-center justify-center px-3">
        <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology"
          class="h-11 max-w-[88%] object-contain drop-shadow-sm" />
      </div>
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
    </div>
    <h1 class="display font-black text-xl sm:text-2xl text-center text-[#231f20] py-2" data-text="paymentTitle">METODE PEMBAYARAN</h1>
  </header>

  <!-- 2. Body Container (Memenuhi Layar, Centered Content) -->
  <div class="flex-1 min-h-0 overflow-y-auto scroll-clean px-4 sm:px-8 pt-2 pb-6 flex flex-col items-center justify-between gap-6">

    <!-- Section Atas: Card Total Pembayaran (shadow, tanpa outline solid) -->
    <div class="w-full flex flex-col items-center gap-4 mt-2">
      <div class="w-full bg-white rounded-3xl py-7 px-5 text-center shadow-[0_14px_36px_rgba(42,36,36,0.10)]">
        <p class="text-base sm:text-lg font-bold text-stone-500" data-text="paymentTotalLabel">Total Pembayaran</p>
        <p class="text-xl sm:text-2xl font-black text-[#231f20] mt-2 tabular-nums" data-bind="totalHargaBayar">Rp0</p>
      </div>
    </div>

    <!-- Section Tengah: Judul + Card 3 Pilihan Metode Pembayaran -->
    <div class="w-full flex flex-col items-center gap-4">
      <h2 class="display text-xl sm:text-2xl font-black tracking-wide text-[#231f20] text-center" data-text="paymentMethodsHeading">Pilihan Metode Pembayaran</h2>

      <!-- Container 3 Metode Pembayaran (QRIS, Tunai, Debit) -->
      <div class="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-[0_14px_36px_rgba(42,36,36,0.10)]">
        <div class="grid grid-cols-3 gap-3 sm:gap-4" data-list="metodePembayaran"></div>
      </div>
    </div>

    <!-- Section Bawah: Tombol Kembali (ikon panah merah seperti sidebar menu) -->
    <div class="w-full flex justify-center pt-1 pb-2">
      <button data-action="navigasiKe:keranjang"
        class="h-12 px-7 rounded-2xl bg-white hover:bg-stone-50 active:scale-[0.98] transition shadow-[0_8px_24px_rgba(42,36,36,0.08)] flex items-center justify-center gap-2.5">
        <i class="fa-solid fa-arrow-left text-[#d51f32] text-sm shrink-0 w-4 text-center"></i>
        <span class="text-xs sm:text-sm font-bold text-stone-700" data-text="back">Kembali</span>
      </button>
    </div>

  </div>

</div>
`

export default templatePembayaran
