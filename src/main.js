/**
 * ==========================================================================
 * ENTRY POINT: APLIKASI KIOSK PAHADADA.ID
 * ==========================================================================
 * File ini adalah titik masuk utama aplikasi. Tugasnya:
 * 1. Import Alpine.js
 * 2. Import style CSS global
 * 3. Import semua template layar
 * 4. Impor komponen kiosk
 * 5. Gabungkan semua template ke dalam elemen #app
 * 6. Daftarkan komponen kiosk ke Alpine.js
 * 7. Mulai Alpine.js
 *
 * Arsitektur:
 * - Template dipisah per file untuk kemudahan pemeliharaan
 * - Komponen kiosk mengelola semua state dan logika
 * - Data (menu, kategori, pembayaran) diimpor dari folder terpisah
 * - Utilitas (format, audio) diimpor dari folder terpisah
 *
 * Alur rendering:
 * index.html → main.js (ini) → Gabung template → Daftar komponen → Alpine.start()
 * ==========================================================================
 */

import Alpine from 'alpinejs'
import './style.css'

// ── Import Semua Template Layar ────────────────────────────────────────
import templateLayarKunci from './templates/layar-kunci.js'
import templatePreferensi from './templates/preferensi.js'
import templateLayarMenu from './templates/layar-menu.js'
import templateKeranjang from './templates/keranjang.js'
import templatePengiriman from './templates/pengiriman.js'
import templatePembayaran from './templates/pembayaran.js'
import templateSukses from './templates/sukses.js'
import templateStruk from './templates/struk.js'

// ── Import Komponen Kiosk ──────────────────────────────────────────────
import buatKomponenKiosk from './components/kiosk.js'

// ── Expose Alpine.js ke global scope ───────────────────────────────────
// Diperlukan agar Alpine.js bisa diakses dari template inline
window.Alpine = Alpine

// ── Gabungkan Semua Template ───────────────────────────────────────────
// Setiap template diekspor sebagai string HTML dari file terpisah.
// Digabungkan menjadi satu string besar lalu dimasukkan ke #app.
const gabunganTemplate = `
  ${templateLayarKunci}
  ${templatePreferensi}
  ${templateLayarMenu}
  ${templateKeranjang}
  ${templatePengiriman}
  ${templatePembayaran}
  ${templateSukses}
  ${templateStruk}
`

// ── Render Template ke DOM ─────────────────────────────────────────────
// Semua template dimasukkan ke dalam elemen <main id="app">
document.querySelector('#app').innerHTML = `
<div x-data="kiosk()"
     @click.window="resetIdleTimer()"
     @keydown.window="resetIdleTimer()"
     class="min-h-screen bg-[#f6f1e8] p-3 sm:p-5 flex items-center justify-center">

  <section class="screen-shell relative overflow-hidden rounded-[2.1rem] bg-[#f7f1e8] border-[8px] border-[#231f20]"
           aria-label="PahaDada self-ordering kiosk">

    <!-- Notch / Titik layar di bagian atas -->
    <div class="absolute top-2 left-1/2 -translate-x-1/2 z-50 h-1.5 w-16 rounded-full bg-[#3b3434]"></div>

    ${gabunganTemplate}

  </section>

</div>
`

// ── Daftarkan Komponen Kiosk ke Alpine.js ──────────────────────────────
// Komponen didaftarkan dengan nama 'kiosk' agar bisa dipanggil dari
// template HTML via atribut x-data="kiosk()"
Alpine.data('kiosk', buatKomponenKiosk)

// ── Mulai Alpine.js ────────────────────────────────────────────────────
// Memulai pemrosesan semua directive Alpine.js di DOM
Alpine.start()
