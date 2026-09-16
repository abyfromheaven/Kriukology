/**
 * ==========================================================================
 * TEMPLATE: LAYAR PEMBAYARAN
 * ==========================================================================
 * Layar pemilihan metode pembayaran.
 * ==========================================================================
 */

const templatePembayaran = `
<div data-screen="pembayaran" style="display:none" class="h-full flex flex-col p-6 bg-[#f7f1e8]">

  <!-- Tombol kembali -->
  <button data-action="navigasiKe:pengiriman" class="text-sm font-bold text-stone-500 self-start">
    <i class="fa-solid fa-arrow-left mr-2"></i>
    <span data-text="back"></span>
  </button>

  <!-- Judul section -->
  <p class="text-xs font-bold tracking-[.18em] text-[#d51f32] mt-8">05 — PAYMENT</p>
  <h2 class="display text-4xl mt-1" data-text="payment"></h2>

  <!-- Grid pilihan metode pembayaran -->
  <div class="grid grid-cols-3 gap-2 mt-6" data-list="metodePembayaran"></div>

  <!-- Area preview instruksi pembayaran -->
  <div class="mt-5 flex-1 rounded-3xl bg-[#231f20] text-white grid-noise p-6 flex flex-col items-center justify-center text-center"
       data-bind="paymentPreview">
  </div>

  <!-- Tombol Simulasi Sukses -->
  <button data-action="selesaikanPesanan" data-bind="simulateBtn"
    class="mt-5 rounded-2xl py-4 font-black text-sm text-white disabled:bg-stone-300 bg-[#d51f32]">
    <i class="fa-solid fa-lock mr-2"></i>
    <span data-text="simulate"></span>
  </button>

</div>
`

export default templatePembayaran
