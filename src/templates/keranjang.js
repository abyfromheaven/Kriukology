/**
 * ==========================================================================
 * TEMPLATE: LAYAR KERANJANG
 * ==========================================================================
 * Layar review pesanan sebelum masuk ke pengiriman. Pengguna bisa:
 * 1. Melihat daftar item yang sudah dipilih beserta kustomisasinya
 * 2. Menambah/mengurangi jumlah item (quantity +/-)
 * 3. Melihat total harga
 * 4. Kembali ke menu untuk menambah item lain
 * 5. Lanjut ke layar pengiriman jika sudah yakin
 *
 * Alur navigasi: menu → KERANJANG → pengiriman
 *
 * Setiap item di keranjang ditampilkan sebagai kartu (article) yang berisi:
 * - Ikon ayam goreng
 * - Nama item + detail kustomisasi
 * - Harga per item
 * - Kontrol jumlah (+/-)
 * ==========================================================================
 */

const templateKeranjang = `
<template x-if="langkah === 'keranjang'">
  <div class="h-full flex flex-col bg-[#f7f1e8]">

    <!-- Header: Tombol kembali + judul -->
    <header class="p-6 pb-4">
      <button @click="navigasiKe('menu')" class="text-sm font-bold text-stone-500">
        <i class="fa-solid fa-arrow-left mr-2"></i>
        <span x-text="terjemahkan('back')"></span>
      </button>
      <p class="text-xs font-bold tracking-[.18em] text-[#d51f32] mt-5">03 — REVIEW TICKET</p>
      <h2 class="display text-4xl mt-1" x-text="terjemahkan('cart')"></h2>
    </header>

    <!-- Daftar item di keranjang (bisa di-scroll) -->
    <div class="flex-1 overflow-y-auto px-5">
      <template x-for="(baris, indeks) in keranjang" :key="baris.kunci">
        <article class="bg-white rounded-2xl p-4 mb-3 border border-stone-100">
          <div class="flex gap-3">

            <!-- Ikon item -->
            <div class="mini-food h-12 w-12 rounded-xl flex items-center justify-center text-2xl">🍗</div>

            <!-- Info item: nama, kustomisasi, harga -->
            <div class="flex-1">
              <p class="font-black text-sm" x-text="baris.nama"></p>
              <p class="text-[10px] text-stone-500 mt-1"
                 x-text="baris.kustomisasi.potongan+' · '+baris.kustomisasi.minuman+' · '+baris.kustomisasi.saus"></p>
              <p class="font-black text-[#d51f32] text-sm mt-2"
                 x-text="formatRupiah(baris.harga * baris.jumlah)"></p>
            </div>

            <!-- Kontrol jumlah: kurang / jumlah / tambah -->
            <div class="flex items-end gap-2">
              <button @click="ubahJumlah(indeks, -1)"
                class="h-7 w-7 rounded-full bg-stone-100">
                <i class="fa-solid fa-minus text-[10px]"></i>
              </button>
              <span class="font-black text-sm" x-text="baris.jumlah"></span>
              <button @click="ubahJumlah(indeks, 1)"
                class="h-7 w-7 rounded-full bg-[#d51f32] text-white">
                <i class="fa-solid fa-plus text-[10px]"></i>
              </button>
            </div>

          </div>
        </article>
      </template>
    </div>

    <!-- Footer: Total harga + tombol aksi -->
    <footer class="p-5 bg-white border-t border-stone-200">

      <!-- Total harga -->
      <div class="flex justify-between mb-4">
        <span class="font-bold text-stone-500">TOTAL</span>
        <span class="text-xl font-black text-[#d51f32]" x-text="formatRupiah(totalHarga)"></span>
      </div>

      <!-- Tombol: Tambah Pesanan / Selesaikan Pesanan -->
      <div class="grid grid-cols-2 gap-3">
        <button @click="navigasiKe('menu')"
          class="rounded-xl py-4 bg-stone-100 font-bold text-sm"
          x-text="terjemahkan('more')"></button>
        <button @click="navigasiKe('pengiriman')"
          class="rounded-xl py-4 bg-[#d51f32] text-white font-black text-sm"
          x-text="terjemahkan('finish')"></button>
      </div>

    </footer>

  </div>
</template>
`

export default templateKeranjang
