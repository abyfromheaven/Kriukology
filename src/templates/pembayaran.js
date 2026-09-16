/**
 * ==========================================================================
 * TEMPLATE: LAYAR PEMBAYARAN
 * ==========================================================================
 * Layar pemilihan metode pembayaran. Pengguna memilih salah satu dari
 * 5 metode pembayaran yang tersedia, lalu menekan tombol "Simulasi Sukses"
 * untuk menyelesaikan pesanan.
 *
 * Metode pembayaran:
 * 1. QRIS  — Tampilkan QR code (simulasi)
 * 2. E-Wallet — Instruksi bayar via aplikasi
 * 3. M-Banking — Instruksi bayar via mobile banking
 * 4. Debit — Instruksi bayar via kartu debit
 * 5. Cash — Bayar tunai di kasir
 *
 * Area preview (kotak hitam) menampilkan instruksi visual sesuai
 * metode yang dipilih:
 * - QRIS: QR code pseudo-random (dekoratif)
 * - Cash: Ikon uang tunai
 * - E-Wallet/M-Banking/Debit: Ikon HP + instruksi
 * - Belum memilih: pesan "Pick a payment method"
 *
 * Alur navigasi: pengiriman → PEMBAYARAN → sukses → struk
 * ==========================================================================
 */

const templatePembayaran = `
<template x-if="langkah === 'pembayaran'">
  <div class="h-full flex flex-col p-6 bg-[#f7f1e8]">

    <!-- Tombol kembali -->
    <button @click="navigasiKe('pengiriman')" class="text-sm font-bold text-stone-500 self-start">
      <i class="fa-solid fa-arrow-left mr-2"></i>
      <span x-text="terjemahkan('back')"></span>
    </button>

    <!-- Judul section -->
    <p class="text-xs font-bold tracking-[.18em] text-[#d51f32] mt-8">05 — PAYMENT</p>
    <h2 class="display text-4xl mt-1" x-text="terjemahkan('payment')"></h2>

    <!-- Grid pilihan metode pembayaran (3 kolom) -->
    <div class="grid grid-cols-3 gap-2 mt-6">
      <template x-for="metode in daftarMetodePembayaran" :key="metode.id">
        <button @click="metodePembayaran=metode.id; mainkanSuara()"
          :class="metodePembayaran===metode.id ? 'bg-[#d51f32] text-white border-[#d51f32]' : 'bg-white border-stone-200'"
          class="rounded-xl border p-3 text-center">
          <i :class="metode.icon" class="text-lg"></i>
          <span class="block text-[10px] font-bold mt-2" x-text="metode.label"></span>
        </button>
      </template>
    </div>

    <!-- Area preview instruksi pembayaran (kotak hitam) -->
    <div class="mt-5 flex-1 rounded-3xl bg-[#231f20] text-white grid-noise p-6 flex flex-col items-center justify-center text-center">

      <!-- Tampilan QRIS: QR code pseudo-random -->
      <template x-if="metodePembayaran==='qris'">
        <div>
          <div class="w-36 h-36 bg-white rounded-xl p-3 grid grid-cols-7 gap-1 mx-auto">
            <template x-for="x in 49">
              <i :class="x%3===0 || x%5===0 ? 'bg-[#231f20]' : 'bg-stone-100'" class="rounded-[1px]"></i>
            </template>
          </div>
          <p class="font-black mt-5" x-text="terjemahkan('scan')"></p>
        </div>
      </template>

      <!-- Tampilan Cash: Ikon uang tunai -->
      <template x-if="metodePembayaran==='cash'">
        <div>
          <i class="fa-solid fa-money-bill-wave text-6xl text-[#f5bd27]"></i>
          <p class="font-black mt-5" x-text="terjemahkan('cash')"></p>
        </div>
      </template>

      <!-- Tampilan E-Wallet / M-Banking / Debit: Instruksi via HP -->
      <template x-if="metodePembayaran && metodePembayaran!=='qris' && metodePembayaran!=='cash'">
        <div>
          <i class="fa-solid fa-mobile-screen-button text-6xl text-[#f5bd27]"></i>
          <p class="font-black mt-5">Follow the instruction<br>on your phone</p>
        </div>
      </template>

      <!-- Tampilan default: Belum memilih metode -->
      <template x-if="!metodePembayaran">
        <div class="text-white/40">
          <i class="fa-solid fa-arrow-up text-3xl"></i>
          <p class="font-bold mt-3">Pick a payment method</p>
        </div>
      </template>

      <!-- Total harga yang harus dibayar -->
      <p class="mt-7 text-2xl font-black text-[#f5bd27]" x-text="formatRupiah(totalHarga)"></p>

    </div>

    <!-- Tombol Simulasi Sukses -->
    <button @click="selesaikanPesanan()"
      :disabled="!metodePembayaran"
      class="mt-5 rounded-2xl py-4 font-black text-sm text-white disabled:bg-stone-300 bg-[#d51f32]">
      <i class="fa-solid fa-lock mr-2"></i>
      <span x-text="terjemahkan('simulate')"></span>
    </button>

  </div>
</template>
`

export default templatePembayaran
