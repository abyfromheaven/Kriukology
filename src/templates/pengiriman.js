/**
 * ==========================================================================
 * TEMPLATE: LAYAR PENGIRIMAN
 * ==========================================================================
 * Layar pemilihan metode pengiriman pesanan. Pengguna memilih:
 * 1. Antar ke meja — Masukkan nomor meja (1-99) via keypad virtual
 * 2. Ambil di kasir — Tidak perlu nomor meja
 *
 * Fitur keypad virtual:
 * - Tombol angka 0-9 untuk input nomor meja
 * - Tombol "C" untuk clear (reset input)
 * - Tombol "⌫" untuk hapus karakter terakhir
 * - Validasi nomor meja: harus antara 1-99
 *
 * Alur navigasi: keranjang → PENGIRIMAN → pembayaran
 *
 * Tombol "Lanjut ke Pembayaran" aktif jika:
 * - Pengguna pilih "Ambil di kasir", ATAU
 * - Pengguna pilih "Antar ke meja" DAN nomor meja valid (1-99)
 * ==========================================================================
 */

const templatePengiriman = `
<template x-if="langkah === 'pengiriman'">
  <div class="h-full flex flex-col p-6 bg-[#f7f1e8]">

    <!-- Tombol kembali -->
    <button @click="navigasiKe('keranjang')" class="text-sm font-bold text-stone-500 self-start">
      <i class="fa-solid fa-arrow-left mr-2"></i>
      <span x-text="terjemahkan('back')"></span>
    </button>

    <!-- Judul section -->
    <p class="text-xs font-bold tracking-[.18em] text-[#d51f32] mt-8">04 — DELIVERY</p>
    <h2 class="display text-4xl mt-1 max-w-xs" x-text="terjemahkan('delivery')"></h2>

    <!-- Pilihan metode pengiriman -->
    <div class="space-y-3 mt-7">

      <!-- Tombol: Antar ke Meja -->
      <button @click="metodePengiriman='meja'; mainkanSuara()"
        :class="metodePengiriman==='meja' ? 'bg-[#d51f32] text-white' : 'bg-white border border-stone-200'"
        class="w-full rounded-2xl p-5 flex gap-4 text-left">
        <i class="fa-solid fa-utensils text-xl"></i>
        <span>
          <b class="block" x-text="terjemahkan('table')"></b>
          <small class="opacity-70">1—99</small>
        </span>
      </button>

      <!-- Tombol: Ambil di Kasir -->
      <button @click="metodePengiriman='kasir'; nomorMeja=''; mainkanSuara()"
        :class="metodePengiriman==='kasir' ? 'bg-[#d51f32] text-white' : 'bg-white border border-stone-200'"
        class="w-full rounded-2xl p-5 flex gap-4 text-left">
        <i class="fa-solid fa-store text-xl"></i>
        <span>
          <b class="block" x-text="terjemahkan('counter')"></b>
          <small class="opacity-70">Pick-up zone</small>
        </span>
      </button>

    </div>

    <!-- Keypad Nomor Meja (hanya muncul jika pilih "Antar ke Meja") -->
    <template x-if="metodePengiriman==='meja'">
      <div class="mt-5">

        <!-- Label -->
        <p class="font-bold text-sm" x-text="terjemahkan('tableNo')"></p>

        <!-- Display nomor meja yang sedang diketik -->
        <div class="mt-2 h-16 rounded-xl bg-white border-2 border-[#d51f32] flex items-center px-5 text-2xl font-black"
             x-text="nomorMeja || '—'"></div>

        <!-- Keypad virtual: 3x4 grid -->
        <div class="grid grid-cols-3 gap-2 mt-3">
          <template x-for="tombol in [1,2,3,4,5,6,7,8,9,'clear',0,'delete']">
            <button @click="tekanKeypad(tombol)"
              class="rounded-xl bg-white border border-stone-200 py-3 font-black text-sm"
              x-text="tombol==='clear' ? 'C' : tombol==='delete' ? '⌫' : tombol"></button>
          </template>
        </div>

        <!-- Peringatan jika nomor meja tidak valid -->
        <p x-show="nomorMeja && !mejaValid"
           class="text-xs font-bold text-[#d51f32] mt-2">
          Masukkan nomor meja valid (1-99).
        </p>

      </div>
    </template>

    <!-- Tombol Lanjut ke Pembayaran (fixed di bawah) -->
    <button @click="navigasiKe('pembayaran')"
      :disabled="!bisaBayar"
      class="mt-auto rounded-2xl py-5 font-black text-white disabled:bg-stone-300 bg-[#231f20]"
      x-text="terjemahkan('pay')">
    </button>

  </div>
</template>
`

export default templatePengiriman
