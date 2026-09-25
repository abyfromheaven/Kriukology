/**
 * ==========================================================================
 * ENTRY POINT: APLIKASI KIOSK KRIUKOLOGY
 * ==========================================================================
 * File ini adalah titik masuk utama aplikasi Self-Ordering Kiosk.
 * 1. Import style CSS global
 * 2. Import semua template layar kiosk (termasuk Layar QRIS)
 * 3. Import komponen kiosk (Vanilla JS class)
 * 4. Gabungkan semua template ke dalam elemen #app
 * 5. Instansiasi KioskApp
 * ==========================================================================
 */

import './style.css'

// ── Import Template Layar Kiosk ────────────────────────────────────────
import templateLayarScreensaver from './templates/layar-screensaver.js'
import templatePreferensi from './templates/preferensi.js'
import templateLayarMenu from './templates/layar-menu.js'
import templateKeranjang from './templates/keranjang.js'
import templatePembayaran from './templates/pembayaran.js'
import templateLayarQris from './templates/layar-qris.js'
import templateSukses from './templates/sukses.js'
import templateStruk from './templates/struk.js'

// ── Import Komponen Kiosk ──────────────────────────────────────────────
import KioskApp from './components/kiosk.js'

// ── Gabungkan Template Kiosk ───────────────────────────────────────────
const gabunganTemplate = `
  ${templateLayarScreensaver}
  ${templatePreferensi}
  ${templateLayarMenu}
  ${templateKeranjang}
  ${templatePembayaran}
  ${templateLayarQris}
  ${templateSukses}
  ${templateStruk}
`

// ── Render Template ke DOM ─────────────────────────────────────────────
document.querySelector('#app').innerHTML = `
<div class="min-h-screen bg-[#f6f1e8] p-3 sm:p-5 flex items-center justify-center">

  <section class="screen-shell relative overflow-hidden rounded-[2.1rem] bg-[#f7f1e8] border-[8px] border-[#231f20]"
           aria-label="Kriukology self-ordering kiosk">

    ${gabunganTemplate}

  </section>

</div>
`

// ── Instansiasi KioskApp ──────────────────────────────────────────────
new KioskApp()
