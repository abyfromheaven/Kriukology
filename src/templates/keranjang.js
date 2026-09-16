/**
 * ==========================================================================
 * TEMPLATE: LAYAR KERANJANG
 * ==========================================================================
 * Layar review pesanan sebelum masuk ke pengiriman.
 * ==========================================================================
 */

const templateKeranjang = `
<div data-screen="keranjang" style="display:none" class="h-full flex flex-col bg-[#f7f1e8]">

  <!-- Header -->
  <header class="p-6 pb-4">
    <button data-action="navigasiKe:menu" class="text-sm font-bold text-stone-500">
      <i class="fa-solid fa-arrow-left mr-2"></i>
      <span data-text="back"></span>
    </button>
    <p class="text-xs font-bold tracking-[.18em] text-[#d51f32] mt-5">03 — REVIEW PESANAN</p>
    <h2 class="display text-4xl mt-1" data-text="cart"></h2>
  </header>

  <!-- Daftar item di keranjang -->
  <div class="flex-1 overflow-y-auto px-5" data-list="keranjangItems"></div>

  <!-- Footer: Total harga + tombol aksi -->
  <footer class="p-5 bg-white border-t border-stone-200">
    <div class="flex justify-between mb-4">
      <span class="font-bold text-stone-500">TOTAL</span>
      <span class="text-xl font-black text-[#d51f32]" data-bind="totalHargaKeranjang"></span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <button data-action="navigasiKe:menu"
        class="rounded-xl py-4 bg-stone-100 font-bold text-sm"
        data-text="more"></button>
      <button data-action="navigasiKe:pengiriman"
        class="rounded-xl py-4 bg-[#d51f32] text-white font-black text-sm"
        data-text="finish"></button>
    </div>
  </footer>

</div>
`

export default templateKeranjang
