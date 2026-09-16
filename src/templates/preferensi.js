/**
 * ==========================================================================
 * TEMPLATE: LAYAR PREFERENSI
 * ==========================================================================
 * Layar kedua setelah lockscreen. Pengguna memilih bahasa dan tipe pesanan.
 * ==========================================================================
 */

const templatePreferensi = `
<div data-screen="preferensi" style="display:none" class="h-full flex flex-col p-7 bg-[#f7f1e8]">

  <!-- Header: Tombol kembali + Logo -->
  <div class="flex justify-between items-center">
    <button data-action="navigasiKe:kunci" class="text-sm font-bold text-stone-500">
      <i class="fa-solid fa-arrow-left mr-2"></i>
      <span data-text="back"></span>
    </button>
    <div class="font-black text-xl text-[#d51f32]">
      PahaDada<span class="text-[#f5bd27]">.id</span>
    </div>
  </div>

  <!-- Judul section -->
  <div class="mt-11">
    <p class="text-xs font-bold tracking-[.2em] text-[#d51f32]">01 — MULAI</p>
    <h2 class="display text-4xl mt-2" data-text="choose"></h2>
  </div>

  <!-- Pilihan Bahasa -->
  <div class="mt-7">
    <p class="font-bold" data-text="language"></p>
    <div class="grid grid-cols-2 gap-3 mt-3">
      <button data-action="setBahasa:id" data-aktif-bahasa="id"
        class="rounded-2xl border-2 p-4 text-left transition">
        <span class="text-2xl">🇮🇩</span>
        <span class="block font-bold mt-2">Indonesia</span>
      </button>
      <button data-action="setBahasa:en" data-aktif-bahasa="en"
        class="rounded-2xl border-2 p-4 text-left transition">
        <span class="text-2xl">🇺🇸</span>
        <span class="block font-bold mt-2">English</span>
      </button>
    </div>
  </div>

  <!-- Pilihan Tipe Pesanan -->
  <div class="mt-7">
    <p class="font-bold" data-text="eat"></p>
    <div class="grid grid-cols-2 gap-3 mt-3">
      <button data-action="setTipePesanan:dine" data-aktif-tipe="dine"
        class="rounded-2xl p-5 text-left transition">
        <i class="fa-solid fa-utensils text-xl"></i>
        <span class="block font-bold mt-4" data-text="dine"></span>
      </button>
      <button data-action="setTipePesanan:take" data-aktif-tipe="take"
        class="rounded-2xl p-5 text-left transition">
        <i class="fa-solid fa-bag-shopping text-xl"></i>
        <span class="block font-bold mt-4" data-text="take"></span>
      </button>
    </div>
  </div>

  <!-- Tombol Lanjut ke Menu -->
  <button data-action="navigasiKe:menu"
    class="mt-auto bg-[#d51f32] text-white rounded-2xl py-5 font-black shadow-lg"
    data-text="continue">
  </button>

</div>
`

export default templatePreferensi
