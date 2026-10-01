/**
 * ==========================================================================
 * ENTRY POINT: APLIKASI SIMULASI DANU (DANA)
 * ==========================================================================
 * Halaman terpisah (danu.html) yang mensimulasikan aplikasi DANA seukuran HP.
 * Melakukan validasi jumlah nominal pembayaran dan transisi ke layar
 * sukses background biru dengan logo Danu saat transaksi berhasil.
 * ==========================================================================
 */

import './danu.css'
import templateLayarDanu from './templates/layar-danu.js'
import formatRupiah from './utils/format.js'
import mainkanSuara, { mainkanFileSuara } from './utils/audio.js'

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
    // Token pesanan dari QR Code kiosk: ?amount=15000&token=xxxx
    this.tokenPesanan = params.get('token') || ''

    this.renderInitialHTML()
    this.bindPeristiwa()
    this.render()
  }

  renderInitialHTML() {
    const appEl = document.querySelector('#app-danu')
    if (appEl) {
      appEl.innerHTML = templateLayarDanu
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
        // Sound sukses khas Danu (file lokal, bukan suara kiosk)
        mainkanFileSuara('/assets/sound/dana.mp3')
        // Laporkan ke server, supaya kiosk di perangkat lain ikut tahu
        this.laporPembayaran(numEntered)

        this.view = 'sukses'
        this.render()
        break
      }

      case 'resetHalamanDanu': {
        mainkanSuara()
        this.inputDanu = ''
        this.view = 'form'
        // Bersihkan catatan peringatan dari transaksi sebelumnya
        const catatan = document.querySelector('[data-bind="danuSuksesCatatan"]')
        if (catatan) { catatan.textContent = ''; catatan.classList.add('hidden') }
        this.render()
        break
      }

      default:
        break
    }
  }

  /**
   * Laporkan pembayaran ke server.
   * Lewat server (bukan antar-tab browser) karena halaman Danu dibuka di HP,
   * sedangkan kiosk jalan di perangkat lain.
   */
  async laporPembayaran(jumlah) {
    if (!this.tokenPesanan) {
      // Jangan ditelan diam-diam: dulu return di sini membuat pembayaran hilang
      // tanpa jejak dan kiosk menunggu selamanya. Tampilkan errornya.
      console.error('Token pesanan tidak ada — buka halaman ini lewat QR Code kiosk.')
      this.tampilkanPeringatan('Halaman ini harus dibuka dari QR Code pada kiosk. Pembayaran tidak terkirim.')
      return
    }

    try {
      const res = await fetch('/api/qris/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ token: this.tokenPesanan, amount: Number(jumlah) })
      })
      const hasil = await res.json()
      if (!res.ok || !hasil.success) {
        console.error('Server menolak pembayaran:', hasil)
        this.tampilkanPeringatan('Pembayaran gagal terkirim ke kiosk. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Gagal melaporkan pembayaran ke server:', error)
      this.tampilkanPeringatan('Tidak ada koneksi ke kiosk. Pembayaran belum terkirim.')
    }
  }

  /** Tampilkan pesan singkat di layar sukses kalau laporan ke server bermasalah */
  tampilkanPeringatan(pesan) {
    let el = document.querySelector('[data-bind="danuSuksesCatatan"]')
    if (!el) return
    el.textContent = pesan
    el.classList.remove('hidden')
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
