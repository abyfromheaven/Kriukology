/**
 * ==========================================================================
 * TEMPLATE: LAYAR STRUK DIGITAL
 * ==========================================================================
 * Layar terakhir yang menampilkan struk digital pesanan.
 * ==========================================================================
 */

const templateStruk = `
<div data-screen="struk" style="display:none" class="h-full p-5 bg-[#d51f32] grid-noise flex items-center">

  <div class="ticket-edge bg-[#f7f1e8] w-full rounded-sm p-6 shadow-2xl">

    <!-- Header Struk -->
    <div class="text-center border-b-2 border-dashed border-stone-300 pb-5">
      <p class="font-black text-2xl text-[#d51f32]">
        Kriuk<span class="text-[#f5bd27]">ology</span>
      </p>
      <p class="text-[10px] tracking-[.2em] mt-1">STRUK DIGITAL</p>
      <p class="text-xs mt-4" data-bind="queueText"></p>
      <h2 class="display text-6xl text-[#d51f32] mt-1" data-bind="nomorAntrean"></h2>
    </div>

    <!-- Daftar Item yang Dipesan -->
    <div class="py-4 border-b-2 border-dashed border-stone-300 text-sm" data-list="strukItems"></div>

    <!-- Ringkasan Pesanan -->
    <div class="py-4 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-stone-500">Pengiriman</span>
        <b data-bind="deliveryInfo"></b>
      </div>
      <div class="flex justify-between">
        <span class="text-stone-500">Status</span>
        <b data-bind="statusPembayaran"></b>
      </div>
      <div class="flex justify-between text-lg">
        <span class="font-black">TOTAL</span>
        <span class="font-black text-[#d51f32]" data-bind="totalHargaStruk"></span>
      </div>
    </div>

    <!-- Hitung Mundur Auto-Reset -->
    <p class="text-center text-[10px] text-stone-400">
      Kiosk kembali ke awal dalam
      <span data-bind="detikStruk">15</span> detik
    </p>

  </div>

</div>
`

export default templateStruk
