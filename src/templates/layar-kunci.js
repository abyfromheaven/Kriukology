/**
 * ==========================================================================
 * TEMPLATE: LAYAR KUNCI (LOCKSCREEN)
 * ==========================================================================
 * Layar pertama yang ditampilkan saat kiosk pertama kali dibuka atau setelah
 * sesi selesai (auto-reset). Berfungsi sebagai halaman selamat datang dan
 * titik awal alur pemesanan.
 *
 * Komponen utama:
 * - Header dengan logo PahaDada.id
 * - Judul besar "LAPAR? GAS." sebagai CTA utama
 * - Deskripsi singkat tentang kemudahan self-ordering
 * - Dekorasi visual (lingkaran berputar) untuk estetika
 * - Tombol "MULAI PESANAN" untuk masuk ke layar preferensi
 * ==========================================================================
 */

const templateLayarKunci = `
<template x-if="langkah === 'kunci'">
  <div class="h-full bg-[#db1f32] text-white grid-noise relative flex flex-col overflow-hidden">

    <!-- Dekorasi: lingkaran kuning besar berputar ( efek visual ) -->
    <div class="absolute -right-24 top-20 h-64 w-64 rounded-full border-[38px] border-[#f5bd27] opacity-95 animate-[spin_18s_linear_infinite]"></div>

    <!-- Dekorasi: lingkaran oranye statis -->
    <div class="absolute -left-24 bottom-20 h-44 w-44 rounded-full border-[28px] border-[#ff7e43] opacity-80"></div>

    <!-- Header: Logo PahaDada + label SELF ORDER -->
    <header class="relative px-7 pt-10 flex items-center justify-between">
      <div class="font-black text-2xl tracking-tight">
        Paha<span class="text-[#f5bd27]">Dada</span><span class="text-sm">.id</span>
      </div>
      <span class="text-[10px] font-bold tracking-[.2em] border border-white/40 rounded-full px-3 py-1">SELF ORDER</span>
    </header>

    <!-- Konten utama: judul, deskripsi, dan ilustrasi -->
    <div class="relative flex-1 flex flex-col justify-center px-7 pb-5">
      <!-- Label kecil "Kriuk tanpa ribet" -->
      <div class="mb-5 flex items-center gap-3 text-xs uppercase tracking-[.18em] font-bold">
        <span class="h-px w-10 bg-[#f5bd27]"></span> Kriuk tanpa ribet
      </div>

      <!-- Judul besar: LAPAR? GAS. -->
      <h1 class="display text-[4.1rem] leading-[.83] max-w-xs">
        LAPAR?<br><span class="text-[#f5bd27]">GAS.</span>
      </h1>

      <!-- Deskripsi singkat dari kamus -->
      <p class="mt-5 max-w-[15rem] text-sm leading-6 text-white/80" x-text="terjemahkan('subtitle')"></p>

      <!-- Ilustrasi ayam goreng (food orb) -->
      <div class="relative mt-6 ml-auto mr-1 food-orb w-44 h-44 rounded-full shadow-2xl flex items-center justify-center text-8xl rotate-[-10deg]">🍗</div>
    </div>

    <!-- Tombol CTA: Mulai Pesanan -->
    <div class="relative p-7 pt-2">
      <button @click="navigasiKe('preferensi')"
        class="w-full rounded-2xl bg-[#f7f1e8] py-5 text-[#d51f32] font-black tracking-wide shadow-xl active:scale-[.98] transition">
        <i class="fa-solid fa-hand-pointer mr-2"></i>
        <span x-text="terjemahkan('order')"></span>
      </button>
      <p class="mt-3 text-center text-[10px] tracking-[.12em] text-white/65">TAP TO SKIP THE QUEUE</p>
    </div>

  </div>
</template>
`

export default templateLayarKunci
