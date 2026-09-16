/**
 * ==========================================================================
 * TEMPLATE: LAYAR MENU
 * ==========================================================================
 * Layar utama untuk browsing dan memilih menu.
 * ==========================================================================
 */

const templateLayarMenu = `
<div data-screen="menu" style="display:none" class="h-full flex flex-col bg-[#f7f1e8]">

  <!-- Header -->
  <header class="h-20 shrink-0 flex items-center justify-between px-5 border-b border-stone-200">
    <div>
      <div class="font-black text-xl text-[#d51f32]">
        PahaDada<span class="text-[#f5bd27]">.id</span>
      </div>
      <p class="text-[10px] text-stone-500 uppercase tracking-widest"
         data-bind="tipePesanan"></p>
    </div>
    <button data-action="aturUlang" class="text-xs font-bold text-stone-500">
      <i class="fa-solid fa-rotate-left mr-1"></i>
      <span data-text="reset"></span>
    </button>
  </header>

  <!-- Judul Section -->
  <div class="px-5 pt-5">
    <p class="text-xs font-bold tracking-[.18em] text-[#d51f32]">02 — PILIH MENU</p>
    <h2 class="display text-3xl mt-1" data-text="menu"></h2>
  </div>

  <!-- Konten Utama: Sidebar Kategori + Grid Menu -->
  <div class="flex flex-1 min-h-0 mt-4">

    <!-- Sidebar navigasi kategori -->
    <nav class="w-[92px] shrink-0 px-3 space-y-2" data-list="kategori"></nav>

    <!-- Grid menu -->
    <div class="flex-1 pr-4 pb-24 overflow-y-auto scroll-clean">
      <div class="grid grid-cols-2 gap-3" data-list="menuTampil"></div>
    </div>

  </div>

  <!-- Tombol Keranjang Mini -->
  <button data-action="navigasiKe:keranjang" data-bind="keranjangMini"
    class="absolute bottom-4 left-4 right-4 rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl">
    <div class="text-left">
      <p class="text-[10px] font-bold uppercase tracking-wider"
         data-bind="jumlahItemMenu"></p>
      <p class="font-black" data-bind="totalHargaMenu"></p>
    </div>
    <span class="font-bold text-sm" data-bind="viewCartText"></span>
    <i class="fa-solid fa-arrow-right"></i>
  </button>

  <!-- Toast Notifikasi -->
  <div data-bind="toast"
    class="absolute z-40 top-24 left-1/2 -translate-x-1/2 rounded-full bg-[#268c57] text-white px-5 py-3 shadow-xl font-bold text-sm" style="display:none">
    <i class="fa-solid fa-check mr-2"></i>
    <span data-bind="toastText"></span>
  </div>

  <!-- Modal Kustomisasi Item -->
  <div data-bind="modalOverlay" style="display:none"
    class="absolute inset-0 z-30 bg-black/45 flex items-end" data-action="tutupModal">

    <div class="bg-[#f7f1e8] w-full rounded-t-[2rem] p-6 animate__animated animate__slideInUp" data-action="hentiPenyebaran">

      <!-- Header modal -->
      <div class="flex justify-between">
        <div>
          <p class="text-xs text-[#d51f32] font-bold tracking-widest">BANGUN PAKETMU</p>
          <h3 class="display text-3xl" data-bind="modalNama"></h3>
        </div>
        <button data-action="tutupModal" class="h-9 w-9 rounded-full bg-stone-200">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Opsi kustomisasi -->
      <div class="mt-5 space-y-4">
        <div>
          <p class="font-bold text-sm" data-text="chooseCut"></p>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <button data-action="setKustomisasi:potongan=Paha" data-kustomisasi="potongan=Paha"
              class="rounded-xl p-3 font-bold text-sm">Paha</button>
            <button data-action="setKustomisasi:potongan=Dada" data-kustomisasi="potongan=Dada"
              class="rounded-xl p-3 font-bold text-sm">Dada</button>
          </div>
        </div>

        <div>
          <p class="font-bold text-sm" data-text="chooseDrink"></p>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <button data-action="setKustomisasi:minuman=Pepsi" data-kustomisasi="minuman=Pepsi"
              class="rounded-xl p-3 font-bold text-sm">Pepsi</button>
            <button data-action="setKustomisasi:minuman=Es Teh" data-kustomisasi="minuman=Es Teh"
              class="rounded-xl p-3 font-bold text-sm">Es Teh</button>
          </div>
        </div>

        <div>
          <p class="font-bold text-sm" data-text="chooseSauce"></p>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <button data-action="setKustomisasi:saus=BBQ" data-kustomisasi="saus=BBQ"
              class="rounded-xl p-3 font-bold text-sm">BBQ</button>
            <button data-action="setKustomisasi:saus=Sambal" data-kustomisasi="saus=Sambal"
              class="rounded-xl p-3 font-bold text-sm">Sambal</button>
          </div>
        </div>
      </div>

      <!-- Tombol Tambah ke Keranjang -->
      <button data-action="tambahKeKeranjang" data-bind="addCartBtn"
        class="w-full mt-6 rounded-2xl py-4 bg-[#231f20] text-white disabled:bg-stone-300 font-black"
        data-text="addCart">
      </button>

    </div>
  </div>

</div>
`

export default templateLayarMenu
