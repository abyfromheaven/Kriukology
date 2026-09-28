/**
 * ==========================================================================
 * TEMPLATE: MODAL ALERT IDLE (AFK ANTI RESET ZONK)
 * ==========================================================================
 * Modal global yang muncul di atas layar mana pun ketika timer idle hampir
 * habis. Memberi peringatan hitung mundur 15 detik sebelum seluruh pesanan
 * dibersihkan dan kiosk dikembalikan ke Screensaver.
 *
 * Skenario A: pelanggan menekan tombol konfirmasi (atau menyentuh layar)
 *             → keranjang aman, timer di-reset dari awal.
 * Skenario B: hitung mundur habis tanpa tanggapan
 *             → keranjang dikosongkan, kiosk kembali ke Screensaver.
 * ==========================================================================
 */

const templateModalAlertIdle = `
<div data-bind="alertIdleModal" style="display:none"
  class="absolute inset-0 z-[60] bg-black/60 backdrop-blur-[3px] flex items-center justify-center px-6">

  <div class="bg-white rounded-3xl p-6 w-full max-w-[320px] text-center shadow-2xl border border-stone-100"
    data-action="hentiPenyebaran">

    <!-- Judul -->
    <p class="font-black text-lg tracking-wide text-[#d51f32]" data-text="idleTitle">MASIH PESAN?</p>

    <!-- Angka hitung mundur -->
    <div class="my-4 flex flex-col items-center gap-2">
      <div class="h-24 w-24 rounded-full bg-[#d51f32]/10 border-4 border-[#d51f32] flex items-center justify-center">
        <span class="display font-black text-5xl text-[#d51f32] tabular-nums"
          data-bind="alertIdleDetik">15</span>
      </div>
      <span class="text-[10px] font-black tracking-[.25em] text-[#d51f32]/70"
        data-text="idleUnit">DETIK</span>
    </div>

    <!-- Penjelasan -->
    <p class="text-xs leading-relaxed text-stone-500" data-text="idleDesc">
      Layar akan otomatis kembali ke awal.
    </p>
    <p class="text-[11px] leading-relaxed text-stone-400 mt-2" data-text="idleNote">
      Pesananmu akan dihapus bila tidak ada tanggapan.
    </p>

    <!-- Tombol konfirmasi -->
    <button data-action="lanjutkanIdle"
      class="mt-5 w-full rounded-2xl py-3.5 bg-[#d51f32] text-white font-black text-sm active:scale-[0.98] transition shadow-md hover:bg-[#b81828]"
      data-text="idleConfirm">Ya, Saya Masih Pesan</button>

  </div>

</div>
`

export default templateModalAlertIdle
