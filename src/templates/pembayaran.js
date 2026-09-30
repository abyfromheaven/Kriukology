/**
 * ==========================================================================
 * TEMPLATE: LAYAR PEMBAYARAN
 * ==========================================================================
 * Layar pemilihan metode pembayaran Kiosk Kriukology.
 * 100% Mengikuti Sketsa Layout Layar Pembayaran dari pengguna:
 * 1. Header Belang + Judul (identik halaman keranjang)
 * 2. Card Total Pembayaran (Soft Shadow White Card, tanpa outline solid)
 * 3. Judul Pilihan Metode Pembayaran
 * 4. Card 3 Pilihan Metode (QRIS, Tunai, Debit) dengan gambar besar
 * 5. Tombol Kembali (ikon panah merah seperti sidebar menu)
 * ==========================================================================
 */

const templatePembayaran = `
<div data-screen="pembayaran" style="display:none" class="h-full flex flex-col bg-white relative overflow-hidden">

  <!-- 1. Header: identik halaman keranjang (Belang | Logo | Belang + Judul) -->
  <header class="shrink-0">
    <div class="h-[64px] flex items-stretch relative">
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
      <div class="flex-1 bg-white flex items-center justify-center px-3">
        <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology"
          class="h-11 max-w-[88%] object-contain drop-shadow-sm" />
      </div>
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
    </div>
    <h1 class="display font-black text-xl sm:text-2xl text-center text-[#231f20] py-2" data-text="paymentTitle">METODE PEMBAYARAN</h1>
  </header>

  <!-- 2. Body Container (Memenuhi Layar, Centered Content) -->
  <div class="flex-1 min-h-0 overflow-y-auto scroll-clean px-4 sm:px-8 pt-2 pb-6 flex flex-col items-center justify-between gap-6">

    <!-- Section Atas: Card Total Pembayaran (shadow, tanpa outline solid) -->
    <div class="w-full flex flex-col items-center gap-4 mt-2">
      <div class="w-full bg-white rounded-3xl py-7 px-5 text-center shadow-[0_14px_36px_rgba(42,36,36,0.10)]">
        <p class="text-base sm:text-lg font-bold text-stone-500" data-text="paymentTotalLabel">Total Pembayaran</p>
        <p class="text-[28px] sm:text-[36px] leading-tight font-black text-[#231f20] mt-2 tabular-nums" data-bind="totalHargaBayar">Rp0</p>
      </div>
    </div>

    <!-- Section Tengah: Judul + Card 3 Pilihan Metode Pembayaran -->
    <div class="w-full flex flex-col items-center gap-4">
      <h2 class="display text-xl sm:text-2xl font-black tracking-wide text-[#231f20] text-center" data-text="paymentMethodsHeading">Pilihan Metode Pembayaran</h2>

      <!-- Container 3 Metode Pembayaran (QRIS, Tunai, Debit) -->
      <div class="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-[0_14px_36px_rgba(42,36,36,0.10)]">
        <div class="grid grid-cols-3 gap-3 sm:gap-4" data-list="metodePembayaran"></div>
      </div>
    </div>

    <!-- Section Bawah: Tombol Kembali (ikon panah merah seperti sidebar menu) -->
    <div class="w-full flex justify-center pt-1 pb-2">
      <button data-action="navigasiKe:keranjang"
        class="h-12 px-7 rounded-2xl bg-white hover:bg-stone-50 active:scale-[0.98] transition shadow-[0_8px_24px_rgba(42,36,36,0.08)] flex items-center justify-center gap-2.5">
        <i class="fa-solid fa-arrow-left text-[#d51f32] text-sm shrink-0 w-4 text-center"></i>
        <span class="text-xs sm:text-sm font-bold text-stone-700" data-text="back">Kembali</span>
      </button>
    </div>

  </div>

  <!-- 4. Notifikasi Bubble (pengganti alert browser, hilang sendiri) -->
  <div data-bind="bubleNotif" style="display:none"
    class="absolute inset-x-0 top-4 z-[55] flex justify-center px-5 pointer-events-none">
    <div class="buble-notif flex items-start gap-3 max-w-[380px] rounded-2xl bg-[#231f20] px-4 py-3.5 shadow-2xl">
      <i class="fa-solid fa-circle-exclamation text-[#d51f32] text-base mt-0.5 shrink-0" aria-hidden="true"></i>
      <p data-bind="bubleNotifTeks" class="text-[13px] sm:text-sm font-semibold leading-snug text-white"></p>
    </div>
  </div>

  <!-- 5. Modal Konfirmasi Metode Pembayaran (anti salah pilih) -->
  <div data-bind="konfirmasiBayar" style="display:none"
    class="absolute inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center px-6"
    data-action="batalKonfirmasiBayar">
    <div class="konfirmasi-bayar-modal bg-white rounded-[28px] px-7 py-7 w-full max-w-[430px] text-center shadow-xl"
      data-action="hentiPenyebaran">
      <p class="display font-black text-xl sm:text-2xl text-[#231f20] tracking-wide">KONFIRMASI METODE PEMBAYARAN!</p>
      <p data-bind="konfirmasiBayarTeks" class="mt-4 text-base sm:text-lg font-medium leading-snug text-[#231f20]"></p>
      <div class="grid grid-cols-2 gap-6 mt-7">
        <button data-action="batalKonfirmasiBayar"
          class="rounded-xl py-3 border-2 border-[#d51f32] text-[#d51f32] font-bold text-sm active:scale-95 transition">Batal</button>
        <button data-action="konfirmasiBayarLanjut"
          class="rounded-xl py-3 bg-[#d51f32] text-white font-bold text-sm active:scale-95 transition">Lanjut</button>
      </div>
    </div>
  </div>

</div>
`

export default templatePembayaran
