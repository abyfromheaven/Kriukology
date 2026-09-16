/**
 * ==========================================================================
 * TEMPLATE: LAYAR MENU
 * ==========================================================================
 * Layar utama untuk browsing dan memilih menu. Terdiri dari:
 * 1. Header — Logo, tipe pesanan, tombol reset
 * 2. Navigasi kategori — Sidebar kiri untuk filter menu
 * 3. Grid menu — Daftar item dalam format kartu 2 kolom
 * 4. Keranjang mini — Tombol fixed di bawah untuk melihat pesanan
 * 5. Toast notifikasi — Muncul saat item berhasil ditambahkan
 * 6. Modal kustomisasi — Untuk memilih potongan ayam, minuman, dan saus
 *
 * Alur navigasi: preferensi → MENU → keranjang / pengiriman
 *
 * Fitur interaktif:
 * - Klik kartu menu → buka modal kustomisasi
 * - Pilih opsi kustomisasi → tombol "Tambah ke Keranjang" aktif
 * - Toast muncul 1.8 detik setelah item ditambahkan
 * - Tombol keranjang mini menampilkan jumlah item dan total harga
 * ==========================================================================
 */

const templateLayarMenu = `
<template x-if="langkah === 'menu'">
  <div class="h-full flex flex-col bg-[#f7f1e8]">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <header class="h-20 shrink-0 flex items-center justify-between px-5 border-b border-stone-200">
      <div>
        <div class="font-black text-xl text-[#d51f32]">
          PahaDada<span class="text-[#f5bd27]">.id</span>
        </div>
        <p class="text-[10px] text-stone-500 uppercase tracking-widest"
           x-text="tipePesanan==='dine' ? terjemahkan('dine') : terjemahkan('take')"></p>
      </div>
      <button @click="aturUlang()" class="text-xs font-bold text-stone-500">
        <i class="fa-solid fa-rotate-left mr-1"></i>
        <span x-text="terjemahkan('reset')"></span>
      </button>
    </header>

    <!-- ── Judul Section ──────────────────────────────────────────────── -->
    <div class="px-5 pt-5">
      <p class="text-xs font-bold tracking-[.18em] text-[#d51f32]">02 — PICK YOUR FAVE</p>
      <h2 class="display text-3xl mt-1" x-text="terjemahkan('menu')"></h2>
    </div>

    <!-- ── Konten Utama: Sidebar Kategori + Grid Menu ─────────────────── -->
    <div class="flex flex-1 min-h-0 mt-4">

      <!-- Sidebar navigasi kategori (kiri) -->
      <nav class="w-[92px] shrink-0 px-3 space-y-2">
        <template x-for="kategori in daftarKategori" :key="kategori.id">
          <button @click="kategoriAktif=kategori.id; mainkanSuara()"
            :class="kategoriAktif===kategori.id ? 'bg-[#d51f32] text-white shadow-md' : 'text-stone-500'"
            class="w-full rounded-xl px-2 py-3 text-[10px] font-bold leading-3 transition">
            <i :class="kategori.icon" class="block text-base mb-1"></i>
            <span x-text="kategori.label[bahasa]"></span>
          </button>
        </template>
      </nav>

      <!-- Grid menu (kanan, bisa di-scroll) -->
      <div class="flex-1 pr-4 pb-24 overflow-y-auto scroll-clean">
        <div class="grid grid-cols-2 gap-3">
          <template x-for="item in menuTampil" :key="item.id">
            <button @click="bukaMenu(item)"
              class="text-left rounded-2xl bg-white overflow-hidden border border-stone-100 shadow-sm hover:-translate-y-0.5 transition">

              <!-- Gambar menu dengan overlay tag -->
              <div class="h-28 relative flex items-center justify-center mini-food overflow-hidden">
                <img src="/assets/menu-placeholder.svg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-80">
                <!-- Tag promosi (BEST SELLER, HEMAT, dll) -->
                <span x-show="item.tag"
                  class="absolute top-2 left-2 bg-[#f5bd27] px-2 py-1 rounded-full text-[8px] font-black text-[#4c2a14]"
                  x-text="item.tag"></span>
                <!-- Emoji menu -->
                <span class="relative text-4xl drop-shadow-lg" x-text="item.emoji"></span>
              </div>

              <!-- Info menu: nama, deskripsi, harga, tombol tambah -->
              <div class="p-3">
                <p class="font-black text-xs leading-4" x-text="item.nama"></p>
                <p class="text-[10px] text-stone-500 mt-1 truncate" x-text="item.deskripsi"></p>
                <div class="mt-3 flex justify-between items-center">
                  <span class="text-xs font-black text-[#d51f32]" x-text="formatRupiah(item.harga)"></span>
                  <span class="h-6 w-6 bg-[#d51f32] text-white rounded-full inline-flex items-center justify-center">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                  </span>
                </div>
              </div>

            </button>
          </template>
        </div>
      </div>

    </div>

    <!-- ── Tombol Keranjang Mini (Fixed di bawah) ─────────────────────── -->
    <button @click="keranjang.length && navigasiKe('keranjang')"
      :class="keranjang.length ? 'bg-[#231f20] text-white' : 'bg-stone-200 text-stone-400'"
      class="absolute bottom-4 left-4 right-4 rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl">
      <div class="text-left">
        <p class="text-[10px] font-bold uppercase tracking-wider"
           x-text="jumlahItem + ' ' + terjemahkan('items')"></p>
        <p class="font-black" x-text="formatRupiah(totalHarga)"></p>
      </div>
      <span class="font-bold text-sm" x-text="terjemahkan('viewCart')"></span>
      <i class="fa-solid fa-arrow-right"></i>
    </button>

    <!-- ── Toast Notifikasi (muncul saat item ditambahkan) ─────────────── -->
    <div x-show="tampilToast" x-transition
      class="absolute z-40 top-24 left-1/2 -translate-x-1/2 rounded-full bg-[#268c57] text-white px-5 py-3 shadow-xl font-bold text-sm">
      <i class="fa-solid fa-check mr-2"></i>
      <span x-text="terjemahkan('added')"></span>
    </div>

    <!-- ── Modal Kustomisasi Item ─────────────────────────────────────── -->
    <div x-show="tampilModal" x-cloak
      class="absolute inset-0 z-30 bg-black/45 flex items-end"
      @click.self="tampilModal=false">

      <div class="bg-[#f7f1e8] w-full rounded-t-[2rem] p-6 animate__animated animate__slideInUp">

        <!-- Header modal: judul + tombol tutup -->
        <div class="flex justify-between">
          <div>
            <p class="text-xs text-[#d51f32] font-bold tracking-widest">BUILD YOUR BOX</p>
            <h3 class="display text-3xl" x-text="itemSaatIni?.nama"></h3>
          </div>
          <button @click="tampilModal=false" class="h-9 w-9 rounded-full bg-stone-200">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Opsi kustomisasi: Potongan Ayam -->
        <div class="mt-5 space-y-4">
          <div>
            <p class="font-bold text-sm" x-text="terjemahkan('chooseCut')"></p>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <template x-for="pilihan in ['Paha','Dada']">
                <button @click="kustomisasi.potongan=pilihan; mainkanSuara()"
                  :class="kustomisasi.potongan===pilihan ? 'bg-[#d51f32] text-white' : 'bg-white border border-stone-200'"
                  class="rounded-xl p-3 font-bold text-sm" x-text="pilihan"></button>
              </template>
            </div>
          </div>

          <!-- Opsi kustomisasi: Minuman -->
          <div>
            <p class="font-bold text-sm" x-text="terjemahkan('chooseDrink')"></p>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <template x-for="pilihan in ['Pepsi','Es Teh']">
                <button @click="kustomisasi.minuman=pilihan; mainkanSuara()"
                  :class="kustomisasi.minuman===pilihan ? 'bg-[#d51f32] text-white' : 'bg-white border border-stone-200'"
                  class="rounded-xl p-3 font-bold text-sm" x-text="pilihan"></button>
              </template>
            </div>
          </div>

          <!-- Opsi kustomisasi: Saus -->
          <div>
            <p class="font-bold text-sm" x-text="terjemahkan('chooseSauce')"></p>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <template x-for="pilihan in ['BBQ','Sambal']">
                <button @click="kustomisasi.saus=pilihan; mainkanSuara()"
                  :class="kustomisasi.saus===pilihan ? 'bg-[#d51f32] text-white' : 'bg-white border border-stone-200'"
                  class="rounded-xl p-3 font-bold text-sm" x-text="pilihan"></button>
              </template>
            </div>
          </div>
        </div>

        <!-- Tombol Tambah ke Keranjang (aktif jika semua opsi dipilih) -->
        <button @click="tambahKeKeranjang()"
          :disabled="!kustomisasi.potongan || !kustomisasi.minuman || !kustomisasi.saus"
          class="w-full mt-6 rounded-2xl py-4 bg-[#231f20] text-white disabled:bg-stone-300 font-black"
          x-text="terjemahkan('addCart')">
        </button>

      </div>
    </div>

  </div>
</template>
`

export default templateLayarMenu
