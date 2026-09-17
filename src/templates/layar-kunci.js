/**
 * ==========================================================================
 * TEMPLATE: LAYAR KUNCI (LOCKSCREEN)
 * ==========================================================================
 * Layar pertama yang ditampilkan saat kiosk pertama kali dibuka atau setelah
 * sesi selesai (auto-reset). Berfungsi sebagai halaman selamat datang dan
 * titik awal alur pemesanan.
 *
 * DESAIN: Fullscreen poster dengan gradient overlay di bagian bawah.
 * Seluruh layar dapat diketuk untuk memulai pemesanan.
 *
 * Komponen:
 * - Background: Poster promosi fullscreen (object-cover)
 * - Overlay: Gradient gelap dari bawah untuk keterbacaan teks
 * - Header: Logo PahaDada.id (transparan, subtle)
 * - CTA: "KETUK LAYAR UNTUK MULAI" dengan typography bold
 * - Efek: Pulse animation pada teks CTA
 * ==========================================================================
 */

import '../style.css'

// Poster promosi yang digunakan sebagai background fullscreen
const posterLatar = '/assets/poster/poster1.webp'

const templateLayarKunci = `
<div data-screen="kunci"
     data-action="mulaiPesan"
     class="h-full relative overflow-hidden cursor-pointer select-none group">

  <!-- ── Background: Poster Fullscreen ──────────────────────────────── -->
  <!-- Poster ditampilkan sebagai background fullscreen dengan object-cover
       agar selalu mengisi seluruh area layar tanpa distorsi.
       Class 'group' pada parent memungkinkan efek hover pada child. -->
  <img src="${posterLatar}"
       alt="Promosi PahaDada.id"
       class="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover:scale-105">

  <!-- ── Overlay: Gradient Gelap dari Bawah ─────────────────────────── -->
  <!-- Gradient overlay berfungsi untuk:
       1. Membuat teks di bagian bawah tetap terbaca di atas poster
       2. Membuat teks "Ketuk Layar" menjadi fokus utama
       3. Memberikan kesan premium dan dramatic
       Gradient dari transparent (atas) → black/80 (bawah) -->
  <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

  <!-- ── Overlay: Vignette effect (subtle) ─────────────────────────── -->
  <!-- Vignette memberikan efek gelap di tepi layar untuk
       mengarahkan perhatian pengguna ke tengah dan bawah -->
  <div class="absolute inset-0 shadow-[inset_0_0_120px_40px_rgba(0,0,0,0.4)] pointer-events-none"></div>

  <!-- ── Header: Logo PahaDada.id ──────────────────────────────────── -->
  <!-- Logo ditempatkan di bagian atas dengan transparansi rendah
       agar tidak mengganggu visual poster utama -->
  <header class="absolute top-0 left-0 right-0 z-10 px-6 pt-8 pb-4
                  bg-gradient-to-b from-black/50 to-transparent">
    <div class="flex items-center justify-between">
      <div class="font-black text-xl tracking-tight text-white/90">
        Paha<span class="text-[#f5bd27]">Dada</span><span class="text-xs ml-0.5">.id</span>
      </div>
      <span class="text-[9px] font-bold tracking-[.25em] text-white/50
                   border border-white/20 rounded-full px-3 py-1
                   backdrop-blur-sm bg-white/5">
        SELF ORDER
      </span>
    </div>
  </header>

  <!-- ── Bagian Tengah: Tagline Subtle ─────────────────────────────── -->
  <!-- Tagline kecil di tengah layar sebagai branding moment.
       Menggunakan huruf besar (uppercase) dengan letter-spacing lebar
       untuk kesan premium dan modern. -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <p class="text-white/20 text-[11px] font-bold uppercase tracking-[.4em]
              transform -rotate-90 origin-center whitespace-nowrap">
      Kriuk Tanpa Ribet
    </p>
  </div>

  <!-- ── Bagian Bawah: CTA "Ketuk Layar" ───────────────────────────── -->
  <!-- Area CTA utama dengan teks besar dan ikon panah ke atas.
       Menggunakan flexbox untuk positioning yang presisi.
       Typography: font besar, bold, dengan letter-spacing lebar. -->
  <div class="absolute bottom-0 left-0 right-0 z-10 px-8 pb-10 pt-20
              flex flex-col items-center gap-4
              pointer-events-none">

    <!-- Ikon panah ke atas (indikasi interaksi) -->
    <div class="w-10 h-10 rounded-full border border-white/30
                flex items-center justify-center
                animate-bounce">
      <i class="fa-solid fa-chevron-up text-white/70 text-sm"></i>
    </div>

    <!-- Teks CTA utama -->
    <!-- Typography: huruf besar, bold, dengan letter-spacing sangat lebar
         untuk kesan premium dan mudah dibaca dari kejauhan.
         Warna kuning (#f5bd27) konsisten dengan brand PahaDada. -->
    <p class="text-white text-sm font-black uppercase tracking-[.35em]
              text-center leading-relaxed
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
      Ketuk Layar<br>untuk Mulai
    </p>

    <!-- Garis dekoratif di bawah teks -->
    <div class="w-12 h-0.5 bg-[#f5bd27]/60 rounded-full mt-1"></div>

  </div>

</div>
`

export default templateLayarKunci
