/**
 * ==========================================================================
 * TEMPLATE: LAYAR PREFERENSI
 * ==========================================================================
 * Layar kedua setelah lockscreen. Pengguna memilih bahasa dan tipe pesanan.
 * Redesign: Layout vertikal terpusat dengan logo, teks sambutan,
 * kartu pilihan dine-in/take-away, dan pemilih bahasa dengan bendera.
 * Klik kartu langsung navigasi ke menu (tanpa tombol lanjut).
 * ==========================================================================
 */

const templatePreferensi = `
<div data-screen="preferensi" style="display:none"
     class="h-full flex flex-col items-center justify-between bg-white relative overflow-hidden"
     style="font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;">

  <!-- ═══ TOP SECTION: Logo + Welcome Text ═══ -->
  <div class="flex flex-col items-center pt-10 relative z-10">
    <!-- Logo -->
    <div class="pref-logo-wrapper mb-4">
      <img src="/assets/kriukology/logo1.webp"
           alt="Kriukology Logo"
           class="w-[11rem] h-[11rem] object-contain drop-shadow-[0_6px_20px_rgba(213,31,50,0.25)]" />
    </div>

    <!-- Welcome Text -->
    <h1 class="pref-welcome-title text-[#1a1a1a] text-[2.2rem] font-black tracking-wide leading-tight"
        data-text="welcome"></h1>
  </div>

  <!-- ═══ MIDDLE SECTION: Subtitle + Order Type Cards ═══ -->
  <div class="flex flex-col items-center relative z-10 -mt-2">
    <!-- Subtitle — di atas kartu, ukuran lebih besar -->
    <p class="pref-welcome-sub text-[#1a1a1a] text-2xl font-bold tracking-wide mb-7 text-center px-6"
       data-bind="welcomeSub"></p>

    <!-- Order Type Cards -->
    <div class="flex gap-5 px-8">

      <!-- Dine In Card -->
      <button data-action="setTipePesananDanLanjut:dine" data-aktif-tipe="dine"
        class="pref-order-card group flex flex-col items-center justify-center
               w-[155px] h-[175px] rounded-3xl transition-all duration-300 ease-out cursor-pointer
               bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <!-- Dummy Icon -->
        <div class="pref-card-icon w-20 h-20 rounded-2xl bg-[#f5f5f5] flex items-center justify-center mb-4 transition-all duration-300">
          <svg class="w-12 h-12 text-[#555] transition-colors duration-300" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Fork -->
            <path d="M18 10v10c0 4 2 6 6 7v27h2V27c4-1 6-3 6-7V10h-2v9c0 1-1 2-2 2s-2-1-2-2V10h-2v9c0 1-1 2-2 2s-2-1-2-2V10h-2z" fill="currentColor"/>
            <!-- Knife -->
            <path d="M40 10c0 0-4 6-4 14c0 4 2 6 4 7v23h2V31c2-1 4-3 4-7c0-8-4-14-4-14h-2z" fill="currentColor"/>
          </svg>
        </div>
        <span class="pref-card-label text-[#444] font-bold text-sm tracking-wide transition-colors duration-300" data-text="dine"></span>
      </button>

      <!-- Take Away Card -->
      <button data-action="setTipePesananDanLanjut:take" data-aktif-tipe="take"
        class="pref-order-card group flex flex-col items-center justify-center
               w-[155px] h-[175px] rounded-3xl transition-all duration-300 ease-out cursor-pointer
               bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <!-- Dummy Icon -->
        <div class="pref-card-icon w-20 h-20 rounded-2xl bg-[#f5f5f5] flex items-center justify-center mb-4 transition-all duration-300">
          <svg class="w-12 h-12 text-[#555] transition-colors duration-300" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Paper bag -->
            <path d="M16 22h32l-3 32H19L16 22z" fill="currentColor" opacity="0.3"/>
            <path d="M16 22h32l-3 32H19L16 22z" stroke="currentColor" stroke-width="2" fill="none"/>
            <!-- Bag top fold -->
            <path d="M20 22V18c0-6 5-10 12-10s12 4 12 10v4" stroke="currentColor" stroke-width="2" fill="none"/>
            <!-- Small chicken leg icon inside -->
            <circle cx="32" cy="36" r="5" fill="currentColor" opacity="0.5"/>
            <path d="M32 31v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="pref-card-label text-[#444] font-bold text-sm tracking-wide transition-colors duration-300" data-text="take"></span>
      </button>

    </div>
  </div>

  <!-- ═══ BOTTOM SECTION: Language Selector ═══ -->
  <div class="flex flex-col items-center pb-14 relative z-10">
    <p class="text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase mb-5"
       data-text="chooseLang"></p>

    <div class="flex items-center gap-6">
      <!-- Indonesia Flag -->
      <button data-action="setBahasa:id" data-aktif-bahasa="id"
        class="pref-flag-btn relative flex items-center justify-center transition-all duration-300 ease-out cursor-pointer
               rounded-full outline-offset-4"
        aria-label="Bahasa Indonesia">
        <div class="pref-flag w-14 h-14 rounded-full overflow-hidden shadow-lg transition-all duration-300 border-[3px] border-transparent">
          <!-- Indonesia Flag SVG -->
          <svg viewBox="0 0 56 56" class="w-full h-full">
            <rect width="56" height="28" fill="#FF0000"/>
            <rect y="28" width="56" height="28" fill="#FFFFFF"/>
          </svg>
        </div>
      </button>

      <!-- English (UK) Flag -->
      <button data-action="setBahasa:en" data-aktif-bahasa="en"
        class="pref-flag-btn relative flex items-center justify-center transition-all duration-300 ease-out cursor-pointer
               rounded-full outline-offset-4"
        aria-label="English">
        <div class="pref-flag w-14 h-14 rounded-full overflow-hidden shadow-lg transition-all duration-300 border-[3px] border-transparent">
          <!-- UK Flag SVG -->
          <svg viewBox="0 0 60 60" class="w-full h-full">
            <rect width="60" height="60" fill="#012169"/>
            <path d="M0 0L60 60M60 0L0 60" stroke="#FFFFFF" stroke-width="10"/>
            <path d="M0 0L60 60M60 0L0 60" stroke="#C8102E" stroke-width="6"/>
            <path d="M30 0V60M0 30H60" stroke="#FFFFFF" stroke-width="14"/>
            <path d="M30 0V60M0 30H60" stroke="#C8102E" stroke-width="8"/>
          </svg>
        </div>
      </button>
    </div>
  </div>

</div>
`

export default templatePreferensi
