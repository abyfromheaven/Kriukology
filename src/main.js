/**
 * ==========================================================================
 * ENTRY POINT: APLIKASI KIOSK PAHADADA.ID
 * ==========================================================================
 * File ini adalah titik masuk utama aplikasi.
 * 1. Import style CSS global
 * 2. Import semua template layar
 * 3. Import komponen kiosk (Vanilla JS class)
 * 4. Gabungkan semua template ke dalam elemen #app
 * 5. Instansiasi KioskApp
 * ==========================================================================
 */

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
import KioskApp from './components/kiosk.js'

// ── Gabungkan Semua Template ───────────────────────────────────────────
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
document.querySelector('#app').innerHTML = `
<div class="min-h-screen bg-[#f6f1e8] p-3 sm:p-5 flex items-center justify-center">

  <section class="screen-shell relative overflow-hidden rounded-[2.1rem] bg-[#f7f1e8] border-[8px] border-[#231f20]"
           aria-label="PahaDada self-ordering kiosk">

    <!-- Notch / Titik layar di bagian atas -->
    <div class="absolute top-2 left-1/2 -translate-x-1/2 z-50 h-1.5 w-16 rounded-full bg-[#3b3434]"></div>

    ${gabunganTemplate}

  </section>

</div>
`

// ── Instansiasi KioskApp ──────────────────────────────────────────────
// Mulai aplikasi Vanilla JS tanpa Alpine.js
new KioskApp()
