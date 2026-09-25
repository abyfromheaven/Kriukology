/**
 * ==========================================================================
 * ENTRY POINT: APLIKASI SIMULASI DANU (DANA)
 * ==========================================================================
 * Halaman terpisah (danu.html) yang mensimulasikan aplikasi DANA seukuran HP.
 * Melakukan validasi jumlah nominal pembayaran dan transisi ke layar
 * sukses background biru dengan logo Danu saat transaksi berhasil.
 * ==========================================================================
 */

import './style.css'
import templateLayarDanu from './templates/layar-danu.js'
import formatRupiah from './utils/format.js'
import mainkanSuara, { mainkanSuaraCash } from './utils/audio.js'
import { kirimSinyalPembayaranSukses } from './utils/paymentChannel.js'

class DanuApp {
  constructor() {
    this.inputDanu = ''
    this.view = 'form' // 'form' | 'sukses'
    this.tagihanKiosk = 0

    // Ambil tagihan dari parameter URL ?amount=...
    const params = new URLSearchParams(window.location.search)
    const rawAmount = params.get('amount')
    if (rawAmount) {
      this.tagihanKiosk = Number(rawAmount) || 0
    }

    this.renderInitialHTML()
    this.bindPeristiwa()
    this.render()
  }

  renderInitialHTML() {
    const appEl = document.querySelector('#app-danu')
    if (appEl) {
      appEl.innerHTML = templateLayarDanu
      const screenEl = appEl.querySelector('[data-screen="danu"]')
      if (screenEl) screenEl.style.display = ''
    }
  }

  bindPeristiwa() {
    document.addEventListener('click', (e) => {
      const tombol = e.target.closest('[data-action]')
      if (!tombol) return
      this.tanganiAksi(tombol.dataset.action)
    })
  }

  tanganiAksi(aksi) {
    const [metode, argumen] = aksi.split(':')

    switch (metode) {
      case 'tekanKeypadDanu': {
        mainkanSuara()
        // Sembunyikan alert error saat user mengetik ulang
        const errEl = document.querySelector('[data-bind="danuErrorAlert"]')
        if (errEl) errEl.style.display = 'none'

        if (argumen === 'backspace') {
          this.inputDanu = this.inputDanu.slice(0, -1)
        } else if (argumen === '000') {
          if (this.inputDanu && this.inputDanu !== '0') {
            this.inputDanu += '000'
          }
        } else if (argumen === '0') {
          if (this.inputDanu && this.inputDanu !== '0') {
            this.inputDanu += '0'
          }
        } else {
          if (this.inputDanu === '0') {
            this.inputDanu = argumen
          } else {
            this.inputDanu += argumen
          }
        }
        this.render()
        break
      }

      case 'prosesBayarDanu': {
        const numEntered = Number(this.inputDanu)
        if (!this.inputDanu || numEntered <= 0) return

        // ── VALIDASI PENGECEKAN NOMINAL PEMBAYARAN ────────────────────
        // Jika nominal yang diinput kurang dari total tagihan kiosk
        if (this.tagihanKiosk > 0 && numEntered < this.tagihanKiosk) {
          mainkanSuara()
          const errEl = document.querySelector('[data-bind="danuErrorAlert"]')
          const errTxt = document.querySelector('[data-bind="danuErrorText"]')
          if (errTxt) {
            errTxt.textContent = `Jumlah pembayaran (${formatRupiah(numEntered)}) kurang dari total tagihan ${formatRupiah(this.tagihanKiosk)}!`
          }
          if (errEl) errEl.style.display = 'flex'
          return
        }

        // Nominal sesuai / cukup -> Eksekusi Transaksi Berhasil
        mainkanSuaraCash()
        kirimSinyalPembayaranSukses({
          total: numEntered,
          tagihan: this.tagihanKiosk,
          timestamp: Date.now()
        })

        this.view = 'sukses'
        this.render()
        break
      }

      case 'resetHalamanDanu': {
        mainkanSuara()
        this.inputDanu = ''
        this.view = 'form'
        this.render()
        break
      }

      default:
        break
    }
  }

  render() {
    // 1. Switch Tampilan (Form vs Sukses Screen Full Blue)
    const viewForm = document.querySelector('[data-danu-view="form"]')
    const viewSukses = document.querySelector('[data-danu-view="sukses"]')

    if (viewForm && viewSukses) {
      if (this.view === 'sukses') {
        viewForm.style.display = 'none'
        viewSukses.style.display = 'flex'

        const elSuksesNominal = document.querySelector('[data-bind="danuSuksesNominal"]')
        if (elSuksesNominal) {
          elSuksesNominal.textContent = formatRupiah(Number(this.inputDanu))
        }
        return
      } else {
        viewForm.style.display = 'flex'
        viewSukses.style.display = 'none'
      }
    }

    // 2. Render Info Tagihan
    const tagihanInfo = document.querySelector('[data-bind="danuTagihanInfo"]')
    const tagihanNominal = document.querySelector('[data-bind="danuTagihanNominal"]')
    if (tagihanInfo && tagihanNominal) {
      if (this.tagihanKiosk > 0) {
        tagihanInfo.style.display = 'inline-block'
        tagihanNominal.textContent = formatRupiah(this.tagihanKiosk)
      } else {
        tagihanInfo.style.display = 'none'
      }
    }

    // 3. Render Kolom Input Teks & Warna (0 Grey Muted vs Black Active)
    const txtEl = document.querySelector('[data-bind="danuInputText"]')
    const btnLanjut = document.querySelector('[data-bind="danuBtnLanjut"]')

    const rawVal = this.inputDanu
    const numVal = Number(rawVal)

    if (txtEl) {
      if (!rawVal || rawVal === '0' || numVal === 0) {
        txtEl.className = 'text-stone-400 font-normal'
        txtEl.textContent = '0'
      } else {
        txtEl.className = 'text-black font-extrabold'
        const formatted = new Intl.NumberFormat('id-ID').format(numVal)
        txtEl.textContent = formatted
      }
    }

    // 4. Render Tombol LANJUT (Grey disabled vs Blue active)
    if (btnLanjut) {
      if (rawVal && rawVal.length > 0 && numVal > 0) {
        btnLanjut.disabled = false
        btnLanjut.className = 'w-full h-12 rounded-2xl bg-[#108ee9] text-white font-extrabold text-base tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:bg-[#0e7ed0] active:scale-[0.98]'
      } else {
        btnLanjut.disabled = true
        btnLanjut.className = 'w-full h-12 rounded-2xl bg-[#a3b1c6] text-white font-extrabold text-base tracking-wider transition-all duration-200 cursor-not-allowed shadow-none'
      }
    }
  }
}

new DanuApp()
