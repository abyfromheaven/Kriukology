/**
 * ==========================================================================
 * TEMPLATE: LAYAR SIMULASI DANU (DANA)
 * ==========================================================================
 * Tampilan simulasi aplikasi DANA (Danu) seukuran layar HP fullscreen.
 * Berisi 2 tampilan utama:
 * 1. Form Pembayaran (Keypad, Input 0 Muted vs Black Active, Tombol LANJUT Biru)
 * 2. Layar Sukses Full (Background Biru, Logo Danu, Teks Terima Kasih Transaksi Berhasil)
 * ==========================================================================
 */

const templateLayarDanu = `
<div data-screen="danu" class="h-full w-full flex flex-col bg-white relative overflow-hidden font-sans">

  <!-- ── TAMPILAN 1: FORM PEMBAYARAN DANU ───────────────────────────── -->
  <div data-danu-view="form" class="h-full w-full flex flex-col bg-white">
    
    <!-- 1. Header Navigation Bar (Danu Protection & Pay) -->
    <header class="shrink-0 bg-white border-b border-stone-100 px-4 py-3.5 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2">
        <img src="/assets/Danu.png" alt="Danu" class="h-6 w-6 object-contain" />
        <div class="flex flex-col leading-none">
          <span class="text-[11px] font-black tracking-wider text-[#108ee9]">DANU</span>
          <span class="text-[9px] font-bold text-stone-400 tracking-widest">PROTECTION</span>
        </div>
      </div>
      
      <div class="flex items-center gap-1.5">
        <img src="/assets/Danu.png" alt="Danu" class="h-6 w-6 object-contain" />
        <span class="text-xs font-black text-[#108ee9] tracking-wider">PAY</span>
      </div>
    </header>

    <!-- 2. Section Card Biru (Informasi Merchant) -->
    <div class="bg-[#108ee9] text-white px-5 py-6 flex flex-col items-center text-center shrink-0">
      <p class="text-xs font-medium text-sky-100 tracking-wide mb-3">Masukkan Jumlah Harga</p>

      <!-- Row Store Icon + Store Name & Owner -->
      <div class="flex items-center gap-3.5 text-left w-full justify-center max-w-sm">
        <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center p-2.5 shrink-0 shadow-md">
          <img src="/assets/storeicon.png" alt="Store" class="w-full h-full object-contain" />
        </div>
        <div class="min-w-0">
          <h2 class="text-base sm:text-lg font-black tracking-wide leading-snug uppercase text-white truncate">
            KRIUKOLOGY CITEUREUP
          </h2>
          <p class="text-xs text-sky-100 font-normal mt-0.5 truncate">
            Muhamad Abiyan Hafidz
          </p>
        </div>
      </div>

      <!-- Tagihan yang harus dibayar (jika ada param nominal) -->
      <div data-bind="danuTagihanInfo" class="mt-3 py-1 px-3 rounded-full bg-white/15 border border-white/20 text-[11px] text-sky-100 font-bold">
        Total Tagihan: <span data-bind="danuTagihanNominal" class="text-white font-extrabold">Rp0</span>
      </div>
    </div>

    <!-- 3. Section Input Jumlah Harga & Custom Keypad -->
    <div class="flex-1 min-h-0 overflow-y-auto scroll-clean px-6 py-4 flex flex-col justify-between gap-4">

      <!-- Form Input Box -->
      <div class="w-full pt-1">
        <p class="text-xs font-medium text-stone-400 mb-2">Jumlah Harga</p>

        <div class="flex items-center gap-3 border-b-2 border-stone-300 pb-2">
          <!-- Badge Rp -->
          <div class="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 text-xs font-bold shrink-0">
            Rp
          </div>

          <!-- Kolom Input Teks (Angka 0 Muted vs Black Active) -->
          <div class="flex-1 text-2xl sm:text-3xl font-bold tracking-tight">
            <span data-bind="danuInputText" class="text-stone-400 font-normal">0</span>
          </div>
        </div>

        <!-- Alert pesan kesalahan nominal kurang -->
        <div data-bind="danuErrorAlert" style="display:none"
          class="mt-2.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 animate__animated animate__shakeX">
          <i class="fa-solid fa-triangle-exclamation text-sm shrink-0"></i>
          <span data-bind="danuErrorText">Jumlah pembayaran kurang dari total tagihan!</span>
        </div>
      </div>

      <!-- Keypad Numerik (1-9, 0, 000, Backspace) -->
      <div class="w-full max-w-xs mx-auto grid grid-cols-3 gap-y-3 gap-x-6 text-center my-auto">
        <button data-action="tekanKeypadDanu:1" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">1</button>
        <button data-action="tekanKeypadDanu:2" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">2</button>
        <button data-action="tekanKeypadDanu:3" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">3</button>

        <button data-action="tekanKeypadDanu:4" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">4</button>
        <button data-action="tekanKeypadDanu:5" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">5</button>
        <button data-action="tekanKeypadDanu:6" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">6</button>

        <button data-action="tekanKeypadDanu:7" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">7</button>
        <button data-action="tekanKeypadDanu:8" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">8</button>
        <button data-action="tekanKeypadDanu:9" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">9</button>

        <button data-action="tekanKeypadDanu:0" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">0</button>
        <button data-action="tekanKeypadDanu:000" class="py-2.5 text-2xl font-bold text-stone-800 active:bg-stone-100 rounded-2xl transition">000</button>
        <button data-action="tekanKeypadDanu:backspace" class="py-2.5 flex items-center justify-center text-stone-500 active:bg-stone-100 rounded-2xl transition">
          <img src="/assets/backspace.png" alt="Hapus" class="h-6 opacity-75 object-contain" />
        </button>
      </div>

      <!-- Tombol LANJUT (Grey jika 0 vs Blue jika >0) -->
      <div class="w-full pb-3">
        <button data-bind="danuBtnLanjut" data-action="prosesBayarDanu" disabled
          class="w-full h-12 rounded-2xl bg-[#a3b1c6] text-white font-extrabold text-base tracking-wider transition-all duration-200 cursor-not-allowed flex items-center justify-center">
          LANJUT
        </button>
      </div>

    </div>

  </div>

  <!-- ── TAMPILAN 2: HALAMAN SUKSES DANU (BACKGROUND BIRU FULLSCREEN) ──── -->
  <div data-danu-view="sukses" style="display:none" class="h-full w-full bg-[#108ee9] text-white flex flex-col items-center justify-between p-8 text-center animate__animated animate__fadeIn">

    <!-- Header Logo Danu -->
    <div class="pt-6 flex flex-col items-center gap-2">
      <div class="w-16 h-16 rounded-full bg-white p-3 shadow-xl flex items-center justify-center">
        <img src="/assets/Danu.png" alt="Danu Logo" class="w-full h-full object-contain" />
      </div>
      <div class="flex flex-col leading-tight">
        <span class="text-sm font-black tracking-widest text-white">DANU</span>
        <span class="text-[10px] font-bold text-sky-200 tracking-wider">PROTECTION & PAY</span>
      </div>
    </div>

    <!-- Main Content Sukses -->
    <div class="flex flex-col items-center gap-4 my-auto">
      <div class="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-white shadow-2xl animate__animated animate__bounceIn">
        <i class="fa-solid fa-check text-5xl"></i>
      </div>

      <h2 class="text-2xl sm:text-3xl font-black tracking-wide leading-snug uppercase">
        TERIMA KASIH<br/>TRANSAKSI BERHASIL
      </h2>

      <p class="text-sm text-sky-100 font-medium max-w-xs">
        Pembayaran sebesar <span data-bind="danuSuksesNominal" class="font-black text-white">Rp0</span> ke <strong class="text-white">KRIUKOLOGY CITEUREUP</strong> telah dikonfirmasi.
      </p>

      <div class="py-2 px-5 rounded-full bg-white/15 border border-white/25 text-xs text-sky-100 font-bold flex items-center gap-2">
        <i class="fa-solid fa-wifi text-emerald-300"></i>
        <span>Sinyal terikirim ke Kiosk Kriukology</span>
      </div>
    </div>

    <!-- Tombol Selesai -->
    <div class="w-full pb-4">
      <button data-action="resetHalamanDanu"
        class="w-full h-12 rounded-2xl bg-white text-[#108ee9] font-black text-sm tracking-wider shadow-lg active:scale-95 transition">
        Selesai / Transaksi Baru
      </button>
    </div>

  </div>

</div>
`

export default templateLayarDanu
