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
 * - Teks "Klik Layar untuk Pesan" di bagian bawah
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
  `<img src="${src}" alt="Promosi PahaDada" class="poster-slide ${i === 0 ? 'aktif' : ''}">`
).join('')

const templateLayarScreensaver = `
<div data-screen="screensaver" class="h-full bg-black relative overflow-hidden" data-action="mulaiPesan">

  <!-- Poster rotasi -->
  <div class="absolute inset-0">
    ${htmlPoster}
  </div>

  <!-- Teks ajakan di bagian bawah -->
  <div class="absolute bottom-0 left-0 right-0 z-10 px-8 pb-10 pt-20
              flex flex-col items-center gap-3
              pointer-events-none">
    <p class="text-white/80 text-sm font-bold tracking-[.15em] uppercase">
      Klik Layar untuk Pesan
    </p>
    <div class="w-10 h-0.5 bg-white/30 rounded-full"></div>
  </div>

</div>
`

export default templateLayarScreensaver
