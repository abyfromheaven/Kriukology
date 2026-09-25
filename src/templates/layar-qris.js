/**
 * ==========================================================================
 * TEMPLATE: LAYAR QRIS (KIOSK)
 * ==========================================================================
 * Layar konfirmasi pembayaran QRIS pada Kiosk Kriukology.
 * 1. Menampilkan QR Code dinamis (library davidshimjs/qrcodejs, /qrcode.js)
 *    yang mengikuti IP/host server yang menjalankan website
 *    (window.location.origin) + path QRIS_LINK_DASAR (+ ?amount=total).
 *    Jadi tidak perlu config ulang saat pindah device/server.
 * 2. Menampilkan status "Menunggu Pembayaran..."
 * 3. Mengirimkan jumlah tagihan ke Danu agar dilakukan validasi kecocokan nominal.
 * 4. Ketika pembayaran diselesaikan di layar Danu, layar ini menampilkan
 *    splash animasi "Pembayaran Berhasil!" dengan audio cash register.
 * ==========================================================================
 */

const templateLayarQris = `
<div data-screen="qris" style="display:none" class="h-full flex flex-col bg-white relative overflow-hidden">

  <!-- 1. Header Belang + Judul -->
  <header class="shrink-0">
    <div class="h-[64px] flex items-stretch relative">
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
      <div class="flex-1 bg-white flex items-center justify-center px-3">
        <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology"
          class="h-11 max-w-[88%] object-contain drop-shadow-sm" />
      </div>
      <div class="header-belang w-16 sm:w-20 shrink-0"></div>
    </div>
    <h1 class="display font-black text-xl sm:text-2xl text-center text-[#231f20] py-2">PEMBAYARAN QRIS</h1>
  </header>

  <!-- 2. Body Container (Memenuhi Layar, Centered Content) -->
  <div class="flex-1 min-h-0 overflow-y-auto scroll-clean px-4 sm:px-8 pt-2 pb-6 flex flex-col items-center justify-between gap-4 relative">

    <!-- Container Utama QR & Informasi -->
    <div class="w-full flex-1 flex flex-col items-center justify-center gap-4">
      
      <!-- Card Total Pembayaran -->
      <div class="w-full bg-stone-50 rounded-2xl py-3 px-4 text-center border border-stone-200/60 shadow-xs">
        <p class="text-xs sm:text-sm font-bold text-stone-500">Total Yang Harus Dibayar</p>
        <p class="text-xl sm:text-2xl font-black text-[#d51f32] mt-0.5 tabular-nums" data-bind="totalHargaQris">Rp0</p>
      </div>

      <!-- Card QR Code Dinamis (Digenerate oleh qrcodejs mengikuti link di kode) -->
      <div class="bg-white rounded-3xl p-5 shadow-[0_12px_32px_rgba(42,36,36,0.12)] border border-stone-100 flex flex-col items-center gap-3 text-center w-full max-w-[280px]">
        
        <div class="flex items-center gap-2 mb-1">
          <img src="/assets/qris.png" alt="QRIS" class="h-6 object-contain" />
        </div>

        <!-- QR Code Clickable Box -->
        <a data-bind="linkDanu" href="/danu.html" target="_blank"
          title="Klik untuk membuka Layar Danu (Simulasi DANA)"
          class="group relative p-2.5 bg-white rounded-2xl border-2 border-dashed border-sky-400 hover:border-sky-600 transition flex flex-col items-center justify-center cursor-pointer shadow-inner">
          
          <!-- Wadah QR Code dinamis (diisi library qrcodejs) -->
          <div data-bind="qrisQrBox" class="w-44 h-44 group-hover:scale-[1.02] transition-transform duration-200"></div>

          <span class="mt-2 text-[10px] font-bold text-sky-600 group-hover:underline flex items-center gap-1">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Layar Danu (/danu.html)
          </span>
        </a>

        <p class="text-[11px] text-stone-500 font-medium leading-tight">
          Scan QR Code di atas menggunakan aplikasi <span class="font-bold text-[#108ee9]">DANU</span> untuk membayar
        </p>

      </div>

      <!-- Status Menunggu Pembayaran -->
      <div data-bind="qrisStatusWaiting" class="flex items-center gap-2 py-2 px-4 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 animate-pulse">
        <i class="fa-solid fa-spinner fa-spin text-sm"></i>
        <span class="text-xs font-bold" data-bind="qrisStatusText">Menunggu Pembayaran...</span>
      </div>

    </div>

    <!-- 3. Splash Overlay Animasi Sukses (Disembunyikan secara default) -->
    <div data-bind="qrisSuccessSplash" style="display:none"
      class="absolute inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white text-center">
      
      <div class="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-2xl animate__animated animate__bounceIn">
        <i class="fa-solid fa-check text-5xl"></i>
      </div>

      <h2 class="text-2xl sm:text-3xl font-black text-white mb-2 animate__animated animate__fadeInUp">
        Pembayaran Berhasil!
      </h2>
      <p class="text-sm text-emerald-200 font-medium animate__animated animate__fadeInUp">
        Transaksi via Danu sukses dikonfirmasi
      </p>

      <div class="mt-6 flex items-center gap-2 text-xs text-stone-300 font-bold">
        <i class="fa-solid fa-circle-notch fa-spin text-emerald-400"></i>
        <span>Mencetak struk pesanan...</span>
      </div>

    </div>

    <!-- 4. Tombol Batal / Kembali -->
    <div class="w-full flex justify-center pt-1 pb-2 shrink-0">
      <button data-action="navigasiKe:pembayaran"
        class="h-11 px-7 rounded-2xl bg-white hover:bg-stone-50 active:scale-[0.98] transition border border-stone-200 shadow-xs flex items-center justify-center gap-2.5">
        <i class="fa-solid fa-arrow-left text-[#d51f32] text-sm shrink-0 w-4 text-center"></i>
        <span class="text-xs sm:text-sm font-bold text-stone-700">Ganti Metode Pembayaran</span>
      </button>
    </div>

  </div>

</div>
`

export default templateLayarQris
