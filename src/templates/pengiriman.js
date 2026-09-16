/**
 * ==========================================================================
 * TEMPLATE: LAYAR PENGIRIMAN
 * ==========================================================================
 * Layar pemilihan metode pengiriman pesanan.
 * ==========================================================================
 */

const templatePengiriman = `
<div data-screen="pengiriman" style="display:none" class="h-full flex flex-col p-6 bg-[#f7f1e8]">

  <!-- Tombol kembali -->
  <button data-action="navigasiKe:keranjang" class="text-sm font-bold text-stone-500 self-start">
    <i class="fa-solid fa-arrow-left mr-2"></i>
    <span data-text="back"></span>
  </button>

  <!-- Judul section -->
  <p class="text-xs font-bold tracking-[.18em] text-[#d51f32] mt-8">04 — DELIVERY</p>
  <h2 class="display text-4xl mt-1 max-w-xs" data-text="delivery"></h2>

  <!-- Pilihan metode pengiriman -->
  <div class="space-y-3 mt-7">
    <button data-action="setMetodePengiriman:meja" data-active-metode="meja"
      class="w-full rounded-2xl p-5 flex gap-4 text-left">
      <i class="fa-solid fa-utensils text-xl"></i>
      <span>
        <b class="block" data-text="table"></b>
        <small class="opacity-70">1—99</small>
      </span>
    </button>

    <button data-action="setMetodePengiriman:kasir" data-active-metode="kasir"
      class="w-full rounded-2xl p-5 flex gap-4 text-left">
      <i class="fa-solid fa-store text-xl"></i>
      <span>
        <b class="block" data-text="counter"></b>
        <small class="opacity-70">Pick-up zone</small>
      </span>
    </button>
  </div>

  <!-- Keypad Nomor Meja -->
  <div data-bind="keypadSection" style="display:none" class="mt-5">
    <p class="font-bold text-sm" data-text="tableNo"></p>

    <div class="mt-2 h-16 rounded-xl bg-white border-2 border-[#d51f32] flex items-center px-5 text-2xl font-black"
         data-bind="mejaDisplay">—</div>

    <div class="grid grid-cols-3 gap-2 mt-3">
      <button data-action="tekanKeypad:1" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">1</button>
      <button data-action="tekanKeypad:2" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">2</button>
      <button data-action="tekanKeypad:3" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">3</button>
      <button data-action="tekanKeypad:4" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">4</button>
      <button data-action="tekanKeypad:5" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">5</button>
      <button data-action="tekanKeypad:6" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">6</button>
      <button data-action="tekanKeypad:7" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">7</button>
      <button data-action="tekanKeypad:8" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">8</button>
      <button data-action="tekanKeypad:9" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">9</button>
      <button data-action="tekanKeypad:clear" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">C</button>
      <button data-action="tekanKeypad:0" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">0</button>
      <button data-action="tekanKeypad:delete" class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm">⌫</button>
    </div>

    <p data-bind="mejaError" style="display:none"
       class="text-xs font-bold text-[#d51f32] mt-2">
      Masukkan nomor meja valid (1-99).
    </p>
  </div>

  <!-- Tombol Lanjut ke Pembayaran -->
  <button data-action="navigasiKe:pembayaran" data-bind="payBtn"
    class="mt-auto rounded-2xl py-5 font-black text-white disabled:bg-stone-300 bg-[#231f20]"
    data-text="pay">
  </button>

</div>
`

export default templatePengiriman
