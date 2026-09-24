/**
 * ==========================================================================
 * TEMPLATE: LAYAR MENU
 * ==========================================================================
 * Rebuild total dari nol berdasarkan sketsa layout layar menu pengguna.
 *
 * Struktur:
 * 1. Header: belang kiri | banner logo tengah (putih) | belang kanan
 * 2. Sidebar kategori di sebelah kiri (clean, tanpa container box)
 * 3. Section produk di sebelah kanan (Judul Kategori di atas Grid 2 Kolom)
 * 4. Status pesanan (slide in/out lewat bawah layar) berisi:
 *    - Logo shopcart.webp besar + badge angka + label Pesanan (font besar setara harga) + total harga
 *    - Tombol Back (icon saja), Reset Pesanan (teks merah, bg putih), Lihat Pesanan (bg merah)
 * 5. Modal konfirmasi reset pesanan
 * ==========================================================================
 */

const templateLayarMenu = `
<div data-screen="menu" style="display:none" class="h-full flex flex-col bg-white relative overflow-hidden">

  <!-- 1. Header: Belang Kiri | Banner Logo Tengah (Putih) | Belang Kanan -->
  <header class="shrink-0 h-[80px] flex items-stretch border-b border-stone-100 relative">
    <!-- Sayap Kiri Belang -->
    <div class="header-belang w-16 sm:w-20 shrink-0"></div>

    <!-- Tengah Putih + Banner Logo -->
    <div class="flex-1 bg-white flex items-center justify-center px-3">
      <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology"
        class="h-11 max-w-[85%] object-contain drop-shadow-sm" />
    </div>

    <!-- Sayap Kanan Belang -->
    <div class="header-belang w-16 sm:w-20 shrink-0"></div>
  </header>

  <!-- 2. Body Area: Sidebar Kategori (Kiri) + Section Produk (Kanan) -->
  <div class="flex flex-1 min-h-0">

    <!-- Sidebar Kategori (Clean, Tanpa Box Container) -->
    <nav class="w-[115px] shrink-0 py-3 px-2 space-y-2 overflow-y-auto scroll-clean border-r border-stone-100"
      data-list="kategori"></nav>

    <!-- Section Produk (Kanan) -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Judul Kategori Aktif di atas Grid Produk -->
      <div class="px-3 pt-3 pb-2 shrink-0">
        <h2 class="display text-lg font-black text-[#231f20]" data-bind="judulKategori"></h2>
      </div>

      <!-- Grid Produk (2 Kolom) -->
      <div class="flex-1 overflow-y-auto scroll-clean px-3 pb-28">
        <div class="grid grid-cols-2 gap-2.5" data-list="menuTampil"></div>
      </div>
    </div>

  </div>

  <!-- 3. Status Pesanan (Slide-up Bottom Bar) -->
  <div data-bind="statusPesanan"
    class="status-pesanan absolute left-3 right-3 bottom-3 z-30 rounded-2xl bg-white border border-stone-200 shadow-[0_14px_44px_rgba(0,0,0,0.18)] p-3">

    <!-- Baris atas: Icon Shopcart + Label Pesanan & Total Harga -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-2.5">
        <!-- Icon Shopcart: pas di dalam bar, sedikit overflow masih dalam padding -->
        <div class="relative h-20 w-20 shrink-0 flex items-center justify-center">
          <img src="/assets/shopcart.webp" alt="Pesanan"
            class="h-24 w-24 object-contain drop-shadow" />
          <span data-bind="countBucket"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-black text-[#231f20] pointer-events-none">0</span>
        </div>
        <!-- Teks Pesanan dengan Ukuran Font Sama dengan Harga (text-base / text-lg) -->
        <span class="font-black text-base sm:text-lg text-[#231f20]" data-text="orderLabel">Pesanan</span>
      </div>

      <!-- Total Harga (Ukuran Font Sama text-base / text-lg) -->
      <div class="text-right">
        <span class="font-black text-base sm:text-lg text-[#231f20]" data-bind="totalHargaMenu">Rp0</span>
      </div>
    </div>

    <!-- Baris bawah: Tombol Back (icon), Reset Pesanan (teks merah), Lihat Pesanan (bg merah) -->
    <div class="grid grid-cols-12 gap-2">
      <!-- Tombol Back (Hanya Icon) -->
      <button data-action="kembaliPreferensi" aria-label="Kembali"
        class="col-span-2 h-10 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center active:scale-95 transition">
        <i class="fa-solid fa-arrow-left text-sm"></i>
      </button>

      <!-- Tombol Reset Pesanan (Teks Merah, BG Putih) -->
      <button data-action="mintaBatalkan"
        class="col-span-5 h-10 rounded-xl bg-white border border-stone-200 text-[#d51f32] font-bold text-xs active:scale-95 transition">
        <span data-text="cancelOrder">Reset Pesanan</span>
      </button>

      <!-- Tombol Lihat Pesanan (BG Merah, Teks Putih) -->
      <button data-action="navigasiKe:keranjang"
        class="col-span-5 h-10 rounded-xl bg-[#d51f32] text-white font-black text-xs active:scale-95 transition">
        <span data-text="viewOrder">Lihat Pesanan</span>
      </button>
    </div>

  </div>

  <!-- 4. Konfirmasi reset pesanan -->
  <div data-bind="konfirmasiBatal" style="display:none"
    class="absolute inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center px-6"
    data-action="batalKonfirmasi">
    <div class="bg-white rounded-2xl p-5 w-full max-w-[290px] text-center shadow-xl"
      data-action="hentiPenyebaran">
      <p class="font-black text-base text-[#231f20]" data-text="cancelConfirm">Reset seluruh pesanan ini?</p>
      <div class="grid grid-cols-2 gap-2.5 mt-4">
        <button data-action="batalKonfirmasi"
          class="rounded-xl py-2.5 bg-stone-100 font-bold text-xs text-stone-600 active:scale-95 transition"
          data-text="no">Batal</button>
        <button data-action="konfirmasiBatalkan"
          class="rounded-xl py-2.5 bg-[#d51f32] text-white font-black text-xs active:scale-95 transition"
          data-text="yes">Ya, Reset</button>
      </div>
    </div>
  </div>

</div>
`

export default templateLayarMenu
