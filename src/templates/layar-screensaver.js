/**
 * ==========================================================================
 * TEMPLATE: LAYAR SCREENSAVER
 * ==========================================================================
 * Layar pembuka (screensaver) yang menampilkan poster promosi secara
 * otomatis bergantian dengan efek sliding. Pengguna bisa menekan di mana
 * saja pada layar untuk memulai proses pemesanan.
 *
 * Fitur:
 * - 3 poster promosi bergantian setiap 6 detik dengan efek sliding
 * - Teks "KETUK UNTUK MULAI" di bagian bawah
 * - Seluruh layar dapat diketuk untuk navigasi
 * - Desain bersih tanpa watermark
 * ==========================================================================
 */

const daftarPoster = [
  '/assets/poster/poster1.webp',
  '/assets/poster/poster2.webp',
  '/assets/poster/poster3.webp',
]

const htmlPoster = daftarPoster.map((src, i) =>
  `<img src="${src}" alt="Promosi Kriukology" class="poster-slide ${i === 0 ? 'aktif' : ''}">`
).join('')

const templateLayarScreensaver = `
<div data-screen="screensaver" class="h-full bg-black relative overflow-hidden" data-action="mulaiPesan">

  <!-- Poster rotasi -->
  <div class="absolute inset-0">
    ${htmlPoster}
  </div>

  <!-- Shading bawah agar teks tetap kontras di atas poster apa pun -->
  <div class="absolute inset-x-0 bottom-0 z-10 h-1/2
              bg-gradient-to-t from-black/95 via-red-950/80 to-transparent
              pointer-events-none"></div>

  <!-- Teks ajakan di bagian bawah -->
  <div class="absolute bottom-0 left-0 right-0 z-20 px-8 pb-11 pt-20
              flex flex-col items-center
              pointer-events-none">
    <p class="animate-pulse text-white text-xl font-semibold tracking-normal uppercase
              drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
      KETUK UNTUK MULAI
    </p>
  </div>

</div>
`

export default templateLayarScreensaver
