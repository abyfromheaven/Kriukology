/**
 * ==========================================================================
 * KOMPONEN VANILLA JS: KIOSK
 * ==========================================================================
 * Kelas utama yang mengelola seluruh state dan logika aplikasi kiosk
 * PahaDada.id. Menggunakan pola State Machine untuk navigasi antar layar.
 *
 * Alur navigasi (state machine):
 * kunci → preferensi → menu → keranjang → pengiriman → pembayaran → sukses → struk → (auto-reset ke kunci)
 *
 * Arsitektur rendering:
 * - Semua template di-inject sebagai HTML string ke DOM
 * - Setiap state change memanggil render() yang update DOM secara imperatif
 * - Event handling via document-level delegation (data-action attributes)
 * - Text binding via data-text attributes
 * - Conditional rendering via data-screen + style.display
 * ==========================================================================
 */

import daftarMenu from '../data/menu.js'
import daftarKategori from '../data/kategori.js'
import daftarMetodePembayaran from '../data/pembayaran.js'
import kamus from '../data/kamus.js'
import formatRupiah from '../utils/format.js'
import mainkanSuara from '../utils/audio.js'

class KioskApp {
  constructor() {
    this.langkah = 'kunci'
    this.bahasa = 'id'
    this.tipePesanan = 'dine'
    this.kategoriAktif = 'rekomendasi'
    this.keranjang = []
    this.itemSaatIni = null
    this.tampilModal = false
    this.tampilToast = false
    this.kustomisasi = { potongan: '', minuman: '', saus: '' }
    this.metodePengiriman = ''
    this.nomorMeja = ''
    this.metodePembayaran = ''
    this.nomorAntrean = 'PD-001'
    this.timerIdle = null
    this.timerStruk = null
    this.detikStruk = 15

    this.resetIdleTimer()
    this.bindEvents()
    this.render()
  }

  // ── COMPUTED ──────────────────────────────────────────────────────────

  getMenuTampil() {
    if (this.kategoriAktif === 'rekomendasi') {
      return daftarMenu.filter(item => item.kategori === 'rekomendasi')
    }
    return daftarMenu.filter(item => item.kategori === this.kategoriAktif)
  }

  getTotalHarga() {
    return this.keranjang.reduce((jumlah, baris) => jumlah + baris.harga * baris.jumlah, 0)
  }

  getJumlahItem() {
    return this.keranjang.reduce((jumlah, baris) => jumlah + baris.jumlah, 0)
  }

  getMejaValid() {
    const nomor = Number(this.nomorMeja)
    return nomor >= 1 && nomor <= 99
  }

  getBisaBayar() {
    return this.metodePengiriman === 'kasir' ||
      (this.metodePengiriman === 'meja' && this.getMejaValid())
  }

  // ── METHODS ───────────────────────────────────────────────────────────

  terjemahkan(kunci) {
    return kamus[this.bahasa][kunci] || kunci
  }

  navigasiKe(langkahBerikutnya) {
    mainkanSuara()
    this.langkah = langkahBerikutnya
    this.resetIdleTimer()
    this.render()
  }

  resetIdleTimer() {
    clearTimeout(this.timerIdle)
    if (this.langkah !== 'kunci' && this.langkah !== 'sukses' && this.langkah !== 'struk') {
      this.timerIdle = setTimeout(() => this.aturUlang(), 60000)
    }
  }

  bukaMenu(item) {
    this.itemSaatIni = item
    this.kustomisasi = { potongan: '', minuman: '', saus: '' }
    this.tampilModal = true
    mainkanSuara()
    this.render()
  }

  tambahKeKeranjang() {
    if (!this.kustomisasi.potongan || !this.kustomisasi.minuman || !this.kustomisasi.saus) return

    this.keranjang.push({
      ...this.itemSaatIni,
      kustomisasi: { ...this.kustomisasi },
      jumlah: 1,
      kunci: Date.now(),
    })

    this.tampilModal = false
    this.tampilToast = true
    mainkanSuara()
    this.render()

    setTimeout(() => {
      this.tampilToast = false
      this.render()
    }, 1800)
  }

  ubahJumlah(indeks, jumlah) {
    const jumlahBaru = this.keranjang[indeks].jumlah + jumlah
    if (jumlahBaru < 1) {
      this.keranjang.splice(indeks, 1)
    } else {
      this.keranjang[indeks].jumlah = jumlahBaru
    }
    mainkanSuara()
    if (!this.keranjang.length) {
      this.navigasiKe('menu')
    } else {
      this.render()
    }
  }

  tekanKeypad(tombol) {
    if (tombol === 'clear') {
      this.nomorMeja = ''
    } else if (tombol === 'delete') {
      this.nomorMeja = this.nomorMeja.slice(0, -1)
    } else if (this.nomorMeja.length < 2) {
      this.nomorMeja += String(tombol)
    }
    mainkanSuara()
    this.render()
  }

  selesaikanPesanan() {
    mainkanSuara()
    const angkaAcak = Math.floor(Math.random() * 900) + 100
    this.nomorAntrean = `PD-${String(angkaAcak)}`
    this.langkah = 'sukses'
    this.render()

    setTimeout(() => {
      this.langkah = 'struk'
      this.mulaiTimerStruk()
      this.render()
    }, 2500)
  }

  mulaiTimerStruk() {
    this.detikStruk = 15
    clearInterval(this.timerStruk)
    this.timerStruk = setInterval(() => {
      this.detikStruk--
      this.updateDetikStruk()
      if (this.detikStruk <= 0) {
        clearInterval(this.timerStruk)
        this.aturUlang()
      }
    }, 1000)
  }

  aturUlang() {
    clearTimeout(this.timerIdle)
    clearInterval(this.timerStruk)
    this.langkah = 'kunci'
    this.keranjang = []
    this.kategoriAktif = 'rekomendasi'
    this.itemSaatIni = null
    this.tampilModal = false
    this.metodePengiriman = ''
    this.nomorMeja = ''
    this.metodePembayaran = ''
    this.kustomisasi = { potongan: '', minuman: '', saus: '' }
    this.render()
  }

  // ── EVENT BINDING ─────────────────────────────────────────────────────

  bindEvents() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]')
      if (!btn) return
      const action = btn.dataset.action
      this.handleAction(action)
    })

    window.addEventListener('keydown', () => this.resetIdleTimer())
  }

  handleAction(action) {
    const [method, arg] = action.split(':')

    switch (method) {
      case 'navigasiKe':
        if (arg === 'keranjang' && !this.keranjang.length) return
        this.navigasiKe(arg)
        break
      case 'aturUlang':
        this.aturUlang()
        break
      case 'setBahasa':
        this.bahasa = arg
        mainkanSuara()
        this.render()
        break
      case 'setTipePesanan':
        this.tipePesanan = arg
        mainkanSuara()
        this.render()
        break
      case 'setKategori':
        this.kategoriAktif = arg
        mainkanSuara()
        this.render()
        break
      case 'bukaMenu': {
        const id = Number(arg)
        const item = daftarMenu.find(m => m.id === id)
        if (item) this.bukaMenu(item)
        break
      }
      case 'setKustomisasi':
        this.kustomisasi[arg.split('=')[0]] = arg.split('=')[1]
        mainkanSuara()
        this.render()
        break
      case 'tambahKeKeranjang':
        this.tambahKeKeranjang()
        break
      case 'tutupModal':
        this.tampilModal = false
        this.render()
        break
      case 'ubahJumlah': {
        const [idx, num] = arg.split(',')
        this.ubahJumlah(Number(idx), Number(num))
        break
      }
      case 'setMetodePengiriman':
        this.metodePengiriman = arg
        if (arg === 'kasir') this.nomorMeja = ''
        mainkanSuara()
        this.render()
        break
      case 'tekanKeypad':
        this.tekanKeypad(arg === 'delete' ? 'delete' : arg === 'clear' ? 'clear' : Number(arg))
        break
      case 'setMetodePembayaran':
        this.metodePembayaran = arg
        mainkanSuara()
        this.render()
        break
      case 'selesaikanPesanan':
        this.selesaikanPesanan()
        break
      default:
        break
    }
  }

  // ── RENDERING ─────────────────────────────────────────────────────────

  render() {
    const t = (key) => this.terjemahkan(key)

    document.querySelectorAll('[data-screen]').forEach(el => {
      el.style.display = el.dataset.screen === this.langkah ? '' : 'none'
    })

    document.querySelectorAll('[data-text]').forEach(el => {
      const key = el.dataset.text
      if (key) el.textContent = t(key)
    })

    this.renderPreferensi()
    this.renderMenu()
    this.renderKeranjang()
    this.renderPengiriman()
    this.renderPembayaran()
    this.renderStruk()
    this.renderSukses()
    this.updateModal()
    this.updateToast()
  }

  renderPreferensi() {
    const el = document.querySelector('[data-screen="preferensi"]')
    if (!el) return
    const t = (k) => this.terjemahkan(k)

    el.querySelectorAll('[data-active-lang]').forEach(btn => {
      const isActive = btn.dataset.activeLang === this.bahasa
      btn.classList.toggle('border-[#d51f32]', isActive)
      btn.classList.toggle('bg-red-50', isActive)
      btn.classList.toggle('border-stone-200', !isActive)
    })

    el.querySelectorAll('[data-active-tipe]').forEach(btn => {
      const isActive = btn.dataset.activeTipe === this.tipePesanan
      btn.classList.toggle('bg-[#d51f32]', isActive)
      btn.classList.toggle('text-white', isActive)
      btn.classList.toggle('bg-white', !isActive)
      btn.classList.toggle('border', !isActive)
      btn.classList.toggle('border-stone-200', !isActive)
    })
  }

  renderMenu() {
    const el = document.querySelector('[data-screen="menu"]')
    if (!el) return
    const t = (k) => this.terjemahkan(k)

    const headerTipe = el.querySelector('[data-bind="tipePesanan"]')
    if (headerTipe) headerTipe.textContent = this.tipePesanan === 'dine' ? t('dine') : t('take')

    const katContainer = el.querySelector('[data-list="kategori"]')
    if (katContainer) {
      katContainer.innerHTML = daftarKategori.map(kat => {
        const aktif = this.kategoriAktif === kat.id
        return `<button data-action="setKategori:${kat.id}"
          class="w-full rounded-xl px-2 py-3 text-[10px] font-bold leading-3 transition ${aktif ? 'bg-[#d51f32] text-white shadow-md' : 'text-stone-500'}">
          <i class="${kat.icon} block text-base mb-1"></i>
          <span>${kat.label[this.bahasa]}</span>
        </button>`
      }).join('')
    }

    const menuContainer = el.querySelector('[data-list="menuTampil"]')
    if (menuContainer) {
      const items = this.getMenuTampil()
      menuContainer.innerHTML = items.map(item => `
        <button data-action="bukaMenu:${item.id}"
          class="text-left rounded-2xl bg-white overflow-hidden border border-stone-100 shadow-sm hover:-translate-y-0.5 transition">
          <div class="h-28 relative flex items-center justify-center mini-food overflow-hidden">
            <img src="/assets/menu-placeholder.svg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-80">
            ${item.tag ? `<span class="absolute top-2 left-2 bg-[#f5bd27] px-2 py-1 rounded-full text-[8px] font-black text-[#4c2a14]">${item.tag}</span>` : ''}
            <span class="relative text-4xl drop-shadow-lg">${item.emoji}</span>
          </div>
          <div class="p-3">
            <p class="font-black text-xs leading-4">${item.nama}</p>
            <p class="text-[10px] text-stone-500 mt-1 truncate">${item.deskripsi}</p>
            <div class="mt-3 flex justify-between items-center">
              <span class="text-xs font-black text-[#d51f32]">${formatRupiah(item.harga)}</span>
              <span class="h-6 w-6 bg-[#d51f32] text-white rounded-full inline-flex items-center justify-center">
                <i class="fa-solid fa-plus text-[10px]"></i>
              </span>
            </div>
          </div>
        </button>
      `).join('')
    }

    const keranjangBtn = el.querySelector('[data-bind="keranjangMini"]')
    if (keranjangBtn) {
      const ada = this.keranjang.length > 0
      keranjangBtn.classList.toggle('bg-[#231f20]', ada)
      keranjangBtn.classList.toggle('text-white', ada)
      keranjangBtn.classList.toggle('bg-stone-200', !ada)
      keranjangBtn.classList.toggle('text-stone-400', !ada)
      keranjangBtn.querySelector('[data-bind="jumlahItemMenu"]').textContent = this.getJumlahItem() + ' ' + t('items')
      keranjangBtn.querySelector('[data-bind="totalHargaMenu"]').textContent = formatRupiah(this.getTotalHarga())
      keranjangBtn.querySelector('[data-bind="viewCartText"]').textContent = t('viewCart')
    }
  }

  renderKeranjang() {
    const el = document.querySelector('[data-screen="keranjang"]')
    if (!el) return
    const t = (k) => this.terjemahkan(k)

    const listEl = el.querySelector('[data-list="keranjangItems"]')
    if (listEl) {
      listEl.innerHTML = this.keranjang.map((baris, indeks) => `
        <article class="bg-white rounded-2xl p-4 mb-3 border border-stone-100">
          <div class="flex gap-3">
            <div class="mini-food h-12 w-12 rounded-xl flex items-center justify-center text-2xl">🍗</div>
            <div class="flex-1">
              <p class="font-black text-sm">${baris.nama}</p>
              <p class="text-[10px] text-stone-500 mt-1">${baris.kustomisasi.potongan} · ${baris.kustomisasi.minuman} · ${baris.kustomisasi.saus}</p>
              <p class="font-black text-[#d51f32] text-sm mt-2">${formatRupiah(baris.harga * baris.jumlah)}</p>
            </div>
            <div class="flex items-end gap-2">
              <button data-action="ubahJumlah:${indeks},-1"
                class="h-7 w-7 rounded-full bg-stone-100">
                <i class="fa-solid fa-minus text-[10px]"></i>
              </button>
              <span class="font-black text-sm">${baris.jumlah}</span>
              <button data-action="ubahJumlah:${indeks},1"
                class="h-7 w-7 rounded-full bg-[#d51f32] text-white">
                <i class="fa-solid fa-plus text-[10px]"></i>
              </button>
            </div>
          </div>
        </article>
      `).join('')
    }

    const totalEl = el.querySelector('[data-bind="totalHargaKeranjang"]')
    if (totalEl) totalEl.textContent = formatRupiah(this.getTotalHarga())
  }

  renderPengiriman() {
    const el = document.querySelector('[data-screen="pengiriman"]')
    if (!el) return
    const t = (k) => this.terjemahkan(k)

    el.querySelectorAll('[data-active-metode]').forEach(btn => {
      const isActive = btn.dataset.activeMetode === this.metodePengiriman
      btn.classList.toggle('bg-[#d51f32]', isActive)
      btn.classList.toggle('text-white', isActive)
      btn.classList.toggle('bg-white', !isActive)
      btn.classList.toggle('border', !isActive)
      btn.classList.toggle('border-stone-200', !isActive)
    })

    const keypadSection = el.querySelector('[data-bind="keypadSection"]')
    if (keypadSection) {
      keypadSection.style.display = this.metodePengiriman === 'meja' ? '' : 'none'

      if (this.metodePengiriman === 'meja') {
        const display = keypadSection.querySelector('[data-bind="mejaDisplay"]')
        if (display) display.textContent = this.nomorMeja || '—'

        const error = keypadSection.querySelector('[data-bind="mejaError"]')
        if (error) error.style.display = this.nomorMeja && !this.getMejaValid() ? '' : 'none'
      }
    }

    const payBtn = el.querySelector('[data-bind="payBtn"]')
    if (payBtn) {
      payBtn.disabled = !this.getBisaBayar()
      payBtn.classList.toggle('disabled:bg-stone-300', !this.getBisaBayar())
      payBtn.classList.toggle('bg-[#231f20]', this.getBisaBayar())
    }
  }

  renderPembayaran() {
    const el = document.querySelector('[data-screen="pembayaran"]')
    if (!el) return
    const t = (k) => this.terjemahkan(k)

    const gridEl = el.querySelector('[data-list="metodePembayaran"]')
    if (gridEl) {
      gridEl.innerHTML = daftarMetodePembayaran.map(metode => {
        const isActive = this.metodePembayaran === metode.id
        return `<button data-action="setMetodePembayaran:${metode.id}"
          class="rounded-xl border p-3 text-center ${isActive ? 'bg-[#d51f32] text-white border-[#d51f32]' : 'bg-white border-stone-200'}">
          <i class="${metode.icon} text-lg"></i>
          <span class="block text-[10px] font-bold mt-2">${metode.label}</span>
        </button>`
      }).join('')
    }

    const preview = el.querySelector('[data-bind="paymentPreview"]')
    if (preview) {
      let previewHTML = ''
      if (this.metodePembayaran === 'qris') {
        const cells = Array.from({ length: 49 }, (_, i) => {
          const cls = (i + 1) % 3 === 0 || (i + 1) % 5 === 0 ? 'bg-[#231f20]' : 'bg-stone-100'
          return `<i class="${cls} rounded-[1px]"></i>`
        }).join('')
        previewHTML = `
          <div class="w-36 h-36 bg-white rounded-xl p-3 grid grid-cols-7 gap-1 mx-auto">${cells}</div>
          <p class="font-black mt-5">${t('scan')}</p>`
      } else if (this.metodePembayaran === 'cash') {
        previewHTML = `
          <i class="fa-solid fa-money-bill-wave text-6xl text-[#f5bd27]"></i>
          <p class="font-black mt-5">${t('cash')}</p>`
      } else if (this.metodePembayaran && this.metodePembayaran !== 'qris' && this.metodePembayaran !== 'cash') {
        previewHTML = `
          <i class="fa-solid fa-mobile-screen-button text-6xl text-[#f5bd27]"></i>
          <p class="font-black mt-5">Follow the instruction<br>on your phone</p>`
      } else {
        previewHTML = `
          <div class="text-white/40">
            <i class="fa-solid fa-arrow-up text-3xl"></i>
            <p class="font-bold mt-3">Pick a payment method</p>
          </div>`
      }
      previewHTML += `<p class="mt-7 text-2xl font-black text-[#f5bd27]">${formatRupiah(this.getTotalHarga())}</p>`
      preview.innerHTML = previewHTML
    }

    const simBtn = el.querySelector('[data-bind="simulateBtn"]')
    if (simBtn) {
      simBtn.disabled = !this.metodePembayaran
    }
  }

  renderSukses() {
    const el = document.querySelector('[data-screen="sukses"]')
    if (!el) return
    const t = (k) => this.terjemahkan(k)
    const thankEl = el.querySelector('[data-bind="thankText"]')
    if (thankEl) thankEl.textContent = t('thank')
    const procEl = el.querySelector('[data-bind="processingText"]')
    if (procEl) procEl.textContent = t('processing')
  }

  renderStruk() {
    const el = document.querySelector('[data-screen="struk"]')
    if (!el) return
    const t = (k) => this.terjemahkan(k)

    const queueEl = el.querySelector('[data-bind="queueText"]')
    if (queueEl) queueEl.textContent = t('queue')

    const nomorEl = el.querySelector('[data-bind="nomorAntrean"]')
    if (nomorEl) nomorEl.textContent = this.nomorAntrean

    const itemsEl = el.querySelector('[data-list="strukItems"]')
    if (itemsEl) {
      itemsEl.innerHTML = this.keranjang.map(baris => `
        <div class="mb-3">
          <div class="flex justify-between font-bold">
            <span>${baris.nama} × ${baris.jumlah}</span>
            <span>${formatRupiah(baris.harga * baris.jumlah)}</span>
          </div>
          <p class="text-[10px] text-stone-500 mt-1">${baris.kustomisasi.potongan} · ${baris.kustomisasi.minuman} · ${baris.kustomisasi.saus}</p>
        </div>
      `).join('')
    }

    const deliveryEl = el.querySelector('[data-bind="deliveryInfo"]')
    if (deliveryEl) {
      deliveryEl.textContent = this.metodePengiriman === 'meja'
        ? t('served') + ' ' + this.nomorMeja
        : t('counter')
    }

    const statusEl = el.querySelector('[data-bind="statusPembayaran"]')
    if (statusEl) {
      statusEl.textContent = this.metodePembayaran === 'cash' ? 'PENDING' : 'PAID'
      statusEl.classList.toggle('text-[#268c57]', true)
    }

    const totalEl = el.querySelector('[data-bind="totalHargaStruk"]')
    if (totalEl) totalEl.textContent = formatRupiah(this.getTotalHarga())
  }

  updateDetikStruk() {
    const el = document.querySelector('[data-bind="detikStruk"]')
    if (el) el.textContent = this.detikStruk
  }

  updateModal() {
    const overlay = document.querySelector('[data-bind="modalOverlay"]')
    if (!overlay) return
    overlay.style.display = this.tampilModal ? '' : 'none'

    if (this.tampilModal && this.itemSaatIni) {
      const namaEl = overlay.querySelector('[data-bind="modalNama"]')
      if (namaEl) namaEl.textContent = this.itemSaatIni.nama

      overlay.querySelectorAll('[data-kustomisasi]').forEach(btn => {
        const [jenis, nilai] = btn.dataset.kustomisasi.split('=')
        const isActive = this.kustomisasi[jenis] === nilai
        btn.classList.toggle('bg-[#d51f32]', isActive)
        btn.classList.toggle('text-white', isActive)
        btn.classList.toggle('bg-white', !isActive)
        btn.classList.toggle('border', !isActive)
        btn.classList.toggle('border-stone-200', !isActive)
      })

      const addBtn = overlay.querySelector('[data-bind="addCartBtn"]')
      if (addBtn) {
        addBtn.disabled = !this.kustomisasi.potongan || !this.kustomisasi.minuman || !this.kustomisasi.saus
      }
    }
  }

  updateToast() {
    const toast = document.querySelector('[data-bind="toast"]')
    if (!toast) return
    toast.style.display = this.tampilToast ? '' : 'none'
    const toastText = toast.querySelector('[data-bind="toastText"]')
    if (toastText) toastText.textContent = this.terjemahkan('added')
  }
}

export default KioskApp
