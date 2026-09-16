/**
 * ==========================================================================
 * TEMPLATE: LAYAR STRUK DIGITAL
 * ==========================================================================
 * Layar terakhir yang menampilkan struk digital pesanan. Struk berisi:
 * 1. Header: Logo PahaDada + label "DIGITAL RECEIPT"
 * 2. Nomor antrean (contoh: PD-001)
 * 3. Daftar item yang dipesan beserta kustomisasi dan harga
 * 4. Informasi pengiriman (meja/kasir)
 * 5. Status pembayaran (PAID/PENDING)
 * 6. Total harga
 * 7. Hitung mundur otomatis (15 detik) sebelum kiosk kembali ke awal
 *
 * Fitur auto-reset:
 * - Timer 15 detik di pojok bawah struk
 * - Saat timer habis, semua state di-reset dan kiosk kembali ke lockscreen
 * - Ini memastikan kiosk siap untuk pengguna berikutnya
 *
 * Alur: sukses → STRUK (15 detik) → kunci (auto-reset)
 * ==========================================================================
 */

const templateStruk = `
<template x-if="langkah === 'struk'">
  <div class="h-full p-5 bg-[#d51f32] grid-noise flex items-center">

    <div class="ticket-edge bg-[#f7f1e8] w-full rounded-sm p-6 shadow-2xl">

      <!-- ── Header Struk ─────────────────────────────────────────────── -->
      <div class="text-center border-b-2 border-dashed border-stone-300 pb-5">
        <p class="font-black text-2xl text-[#d51f32]">
          PahaDada<span class="text-[#f5bd27]">.id</span>
        </p>
        <p class="text-[10px] tracking-[.2em] mt-1">DIGITAL RECEIPT</p>

        <!-- Nomor antrean -->
        <p class="text-xs mt-4" x-text="terjemahkan('queue')"></p>
        <h2 class="display text-6xl text-[#d51f32] mt-1" x-text="nomorAntrean"></h2>
      </div>

      <!-- ── Daftar Item yang Dipesan ─────────────────────────────────── -->
      <div class="py-4 border-b-2 border-dashed border-stone-300 text-sm">
        <template x-for="baris in keranjang" :key="baris.kunci">
          <div class="mb-3">
            <div class="flex justify-between font-bold">
              <span x-text="baris.nama+' × '+baris.jumlah"></span>
              <span x-text="formatRupiah(baris.harga*baris.jumlah)"></span>
            </div>
            <p class="text-[10px] text-stone-500 mt-1"
               x-text="baris.kustomisasi.potongan+' · '+baris.kustomisasi.minuman+' · '+baris.kustomisasi.saus"></p>
          </div>
        </template>
      </div>

      <!-- ── Ringkasan Pesanan ────────────────────────────────────────── -->
      <div class="py-4 space-y-2 text-sm">

        <!-- Metode pengiriman -->
        <div class="flex justify-between">
          <span class="text-stone-500">Delivery</span>
          <b x-text="metodePengiriman==='meja' ? terjemahkan('served')+' '+nomorMeja : terjemahkan('counter')"></b>
        </div>

        <!-- Status pembayaran -->
        <div class="flex justify-between">
          <span class="text-stone-500">Status</span>
          <b class="text-[#268c57]"
             x-text="metodePembayaran==='cash' ? 'PENDING' : 'PAID'"></b>
        </div>

        <!-- Total harga -->
        <div class="flex justify-between text-lg">
          <span class="font-black">TOTAL</span>
          <span class="font-black text-[#d51f32]" x-text="formatRupiah(totalHarga)"></span>
        </div>

      </div>

      <!-- ── Hitung Mundur Auto-Reset ─────────────────────────────────── -->
      <p class="text-center text-[10px] text-stone-400">
        Kiosk kembali ke awal dalam
        <span x-text="detikStruk"></span> detik
      </p>

    </div>

  </div>
</template>
`

export default templateStruk
