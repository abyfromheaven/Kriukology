/**
 * ==========================================================================
 * TEMPLATE: LAYAR PREFERENSI
 * ==========================================================================
 * Layar kedua setelah lockscreen. Pengguna memilih:
 * 1. Bahasa (Indonesia / English)
 * 2. Tipe pesanan (Makan di sini / Bawa pulang)
 *
 * Pilihan ini menentukan:
 * - Bahasa yang digunakan di seluruh UI (via state `bahasa`)
 * - Tipe pesanan yang ditampilkan di header menu (via state `tipePesanan`)
 *
 * Alur navigasi: lockscreen → PREFERENSI → menu
 * ==========================================================================
 */

const templatePreferensi = `
<template x-if="langkah === 'preferensi'">
  <div class="h-full flex flex-col p-7 bg-[#f7f1e8]">

    <!-- Header: Tombol kembali + Logo -->
    <div class="flex justify-between items-center">
      <button @click="navigasiKe('kunci')" class="text-sm font-bold text-stone-500">
        <i class="fa-solid fa-arrow-left mr-2"></i>
        <span x-text="terjemahkan('back')"></span>
      </button>
      <div class="font-black text-xl text-[#d51f32]">
        PahaDada<span class="text-[#f5bd27]">.id</span>
      </div>
    </div>

    <!-- Judul section: "Let's Start" -->
    <div class="mt-11">
      <p class="text-xs font-bold tracking-[.2em] text-[#d51f32]">01 — LET'S START</p>
      <h2 class="display text-4xl mt-2" x-text="terjemahkan('choose')"></h2>
    </div>

    <!-- Pilihan Bahasa -->
    <div class="mt-7">
      <p class="font-bold" x-text="terjemahkan('language')"></p>
      <div class="grid grid-cols-2 gap-3 mt-3">
        <!-- Tombol Bahasa Indonesia -->
        <button @click="bahasa='id'; mainkanSuara()"
          :class="bahasa==='id' ? 'border-[#d51f32] bg-red-50' : 'border-stone-200'"
          class="rounded-2xl border-2 p-4 text-left transition">
          <span class="text-2xl">🇮🇩</span>
          <span class="block font-bold mt-2">Indonesia</span>
        </button>
        <!-- Tombol Bahasa Inggris -->
        <button @click="bahasa='en'; mainkanSuara()"
          :class="bahasa==='en' ? 'border-[#d51f32] bg-red-50' : 'border-stone-200'"
          class="rounded-2xl border-2 p-4 text-left transition">
          <span class="text-2xl">🇺🇸</span>
          <span class="block font-bold mt-2">English</span>
        </button>
      </div>
    </div>

    <!-- Pilihan Tipe Pesanan (Dine In / Take Away) -->
    <div class="mt-7">
      <p class="font-bold" x-text="terjemahkan('eat')"></p>
      <div class="grid grid-cols-2 gap-3 mt-3">
        <!-- Tombol Makan di Sini -->
        <button @click="tipePesanan='dine'; mainkanSuara()"
          :class="tipePesanan==='dine' ? 'bg-[#d51f32] text-white' : 'bg-white border border-stone-200'"
          class="rounded-2xl p-5 text-left transition">
          <i class="fa-solid fa-utensils text-xl"></i>
          <span class="block font-bold mt-4" x-text="terjemahkan('dine')"></span>
        </button>
        <!-- Tombol Bawa Pulang -->
        <button @click="tipePesanan='take'; mainkanSuara()"
          :class="tipePesanan==='take' ? 'bg-[#d51f32] text-white' : 'bg-white border border-stone-200'"
          class="rounded-2xl p-5 text-left transition">
          <i class="fa-solid fa-bag-shopping text-xl"></i>
          <span class="block font-bold mt-4" x-text="terjemahkan('take')"></span>
        </button>
      </div>
    </div>

    <!-- Tombol Lanjut ke Menu -->
    <button @click="navigasiKe('menu')"
      class="mt-auto bg-[#d51f32] text-white rounded-2xl py-5 font-black shadow-lg"
      x-text="terjemahkan('continue')">
    </button>

  </div>
</template>
`

export default templatePreferensi
