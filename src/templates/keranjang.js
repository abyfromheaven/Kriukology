/**
 * ==========================================================================
 * TEMPLATE: LAYAR KERANJANG
 * ==========================================================================
 * Ringkasan pesanan dengan daftar produk dan total yang selalu diperbarui.
 * ==========================================================================
 */

const templateKeranjang = `
<div data-screen="keranjang" style="display:none" class="h-full flex flex-col bg-white relative overflow-hidden">

  <header class="shrink-0">
    <div class="h-[64px] flex items-stretch relative">
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
      <div class="flex-1 bg-white flex items-center justify-center px-3">
        <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology"
          class="h-11 max-w-[88%] object-contain drop-shadow-sm" />
      </div>
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
    </div>
    <h1 class="display font-black text-xl sm:text-2xl text-center text-[#231f20] py-2" data-text="cartTitle">KERANJANG</h1>
  </header>

  <main class="flex-1 min-h-0 overflow-y-auto scroll-clean px-4 sm:px-5 pt-1 pb-5">
    <div class="space-y-3 pb-3" data-list="keranjangItems"></div>
  </main>

  <footer class="shrink-0 z-20 bg-white rounded-t-[26px] shadow-[0_-12px_32px_rgba(42,36,36,0.18)] px-4 sm:px-5 pt-4 pb-4">
    <div class="flex items-center justify-between gap-3 mb-3">
      <span class="font-black text-base sm:text-lg text-[#231f20]" data-text="cartTotal">TOTAL</span>
      <span class="font-black text-base sm:text-lg text-[#231f20] tabular-nums" data-bind="totalHargaKeranjang">Rp0</span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <button data-action="navigasiKe:menu"
        class="min-h-11 rounded-xl border border-[#d51f32] bg-white text-[#d51f32] font-bold text-xs sm:text-sm active:scale-[0.98] transition"
        data-text="cartMore">Tambahkan Menu Lain</button>
      <button data-action="navigasiKe:pembayaran"
        class="min-h-11 rounded-xl bg-[#d51f32] text-white font-black text-xs sm:text-sm active:scale-[0.98] transition"
        data-text="cartCheckout">Lanjut Bayar</button>
    </div>
  </footer>

</div>
`

export default templateKeranjang
