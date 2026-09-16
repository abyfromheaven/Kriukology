/**
 * ==========================================================================
 * TEMPLATE: LAYAR SCREENSAVER
 * ==========================================================================
 * Layar pembuka (screensaver) yang menampilkan poster promosi secara
 * otomatis bergantian. Pengguna bisa menekan di mana saja pada layar
 * untuk memulai proses pemesanan.
 *
 * Fitur:
 * - 3 poster promosi bergantian setiap 6 detik dengan efek fade
 * - Teks "Klik Layar untuk Pesan" di bagian bawah
 * - Seluruh layar dapat diketuk untuk navigasi
 * ==========================================================================
 */

const daftarPoster = [
  '/assets/poster/poster1.png',
  '/assets/poster/poster2.png',
  '/assets/poster/poster3.png',
]

const htmlPoster = daftarPoster.map((src, i) =>
  `<img src="${src}" alt="Promosi PahaDada" class="poster-slide absolute inset-0 w-full h-full object-cover ${i === 0 ? 'aktif' : ''}">`
).join('')

const templateLayarScreensaver = `
<div data-screen="screensaver" class="h-full bg-black relative overflow-hidden" data-action="mulaiPesan">

  <!-- Poster rotasi -->
  <div class="absolute inset-0">
    ${htmlPoster}
  </div>

  <!-- Overlay gradient bawah untuk teks -->
  <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent"></div>

  <!-- Teks ajakan -->
  <div class="absolute bottom-8 left-0 right-0 text-center">
    <p class="text-white/90 text-sm font-bold tracking-[.15em] uppercase animate-[pulse_2s_ease-in-out_infinite]">
      Klik Layar untuk Pesan
    </p>
  </div>

</div>
`

export default templateLayarScreensaver
