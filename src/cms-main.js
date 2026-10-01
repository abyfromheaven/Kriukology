import './cms.css'

const placeholderImage = '/assets/menu-placeholder.svg'

// ── STATE ────────────────────────────────────────────────────────────────
let tabAktif = 'produk'          // 'produk' | 'media'
let products = []
let categories = []
let media = []

// Panel produk: null | 'add' | 'edit'
let panelMode = null
let activeProductId = null
let draft = null
let errors = {}

// Panel media: null | 'media-add' | 'media-edit'
let mediaMode = null
let activeMediaId = null
let mediaDraft = null

// Field yang sedang diedit di panel edit (harus klik ikon dulu)
let fieldAktif = null

// Navigasi tertunda (untuk modal "Buang Perubahan?")
let pendingTutup = null

// Modal konfirmasi serbaguna
let modal = null

// Card grid pakai animasi reveal: hanya saat halaman pertama dibuka atau
// berpindah tab, bukan tiap ketikan di kolom search.
let revealGrid = true

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
})[char])
const rupiah = value => `Rp${Number(value || 0).toLocaleString('id-ID')}`
const getCategoryLabel = id => categories.find(c => String(c.id) === String(id))?.label_id || '—'

// ── KERANGKA HALAMAN ─────────────────────────────────────────────────────
document.querySelector('#cms-app').innerHTML = `
  <div class="cms-page">
    <div class="cms-frame">
      <header class="cms-header" aria-label="Kriukology">
      <div class="stripe-band" aria-hidden="true"></div>
        <div class="brand-space">
          <img class="brand-logo" src="/assets/kriukology/logo1.webp" alt="Kriukology" />
          <img class="brand-banner" src="/assets/kriukology/banner_kriukology.webp" alt="" />
        </div>
        <div class="stripe-band" aria-hidden="true"></div>
      </header>

      <nav class="cms-tabs" aria-label="Pindah halaman">
        <span class="cms-tab-indikator" aria-hidden="true"></span>
        <button class="cms-tab" id="tab-produk" type="button" data-tab="produk">Kelola Produk</button>
        <button class="cms-tab" id="tab-media" type="button" data-tab="media">Kelola Media</button>
      </nav>

      <!-- Konten: Produk -->
      <section class="tab-panel" data-panel="produk">
        <section class="cms-controls" aria-label="Cari dan tambah produk">
          <label class="search-box">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input id="search" type="search" placeholder="Cari Produk..." autocomplete="off" />
          </label>
          <div class="category-filter-wrap">
            <button class="category-filter" id="category-filter-button" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span id="category-filter-label">Semua</span>
              <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
            </button>
            <div class="category-menu" id="category-menu" role="listbox" aria-label="Filter kategori" hidden></div>
          </div>
          <button class="add-product-button" id="add-product" type="button">
            Tambah Produk <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </section>
        <section class="product-grid" id="product-grid" aria-label="Daftar produk"></section>
      </section>

      <!-- Konten: Media -->
      <section class="tab-panel" data-panel="media" hidden>
        <section class="cms-controls" aria-label="Cari dan tambah media">
          <label class="search-box">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input id="media-search" type="search" placeholder="Cari Media..." autocomplete="off" />
          </label>
          <div class="category-filter-wrap">
            <button class="category-filter" id="media-filter-button" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span id="media-filter-label">Semua</span>
              <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
            </button>
            <div class="category-menu" id="media-filter-menu" role="listbox" aria-label="Filter jenis media" hidden></div>
          </div>
          <button class="add-product-button" id="add-media" type="button">
            Tambah Media <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
        </section>
        <section class="product-grid" id="media-grid" aria-label="Daftar media"></section>
      </section>
    </div>
  </div>
  <div id="panel-host"></div>
  <div id="alert-host"></div>
`

const searchInput = document.querySelector('#search')
const categoryFilterButton = document.querySelector('#category-filter-button')
const categoryFilterLabel = document.querySelector('#category-filter-label')
const categoryMenu = document.querySelector('#category-menu')
const grid = document.querySelector('#product-grid')
const mediaGrid = document.querySelector('#media-grid')
const mediaSearchInput = document.querySelector('#media-search')
const mediaFilterButton = document.querySelector('#media-filter-button')
const mediaFilterLabel = document.querySelector('#media-filter-label')
const mediaFilterMenu = document.querySelector('#media-filter-menu')
const panelHost = document.querySelector('#panel-host')
const alertHost = document.querySelector('#alert-host')

// ── AMBIL DATA ───────────────────────────────────────────────────────────
async function fetchCategories() {
  try {
    const res = await fetch('/api/cms/categories')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    categories = await res.json()
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error)
  }
}

async function fetchProducts() {
  try {
    const res = await fetch('/api/cms/products')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    products = (await res.json()).map(item => ({ ...item, id: String(item.id) }))
    renderGrid()
  } catch (error) {
    console.error('Gagal mengambil data produk:', error)
  }
}

async function fetchMedia() {
  try {
    const res = await fetch('/api/cms/posters')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    media = (await res.json()).map(item => ({ ...item, id: String(item.id) }))
    renderMediaGrid()
  } catch (error) {
    console.error('Gagal mengambil data media:', error)
  }
}

// ── TAB ──────────────────────────────────────────────────────────────────
const tabsEl = document.querySelector('.cms-tabs')
const indikatorEl = document.querySelector('.cms-tab-indikator')

function setTab(tab, animasi = true) {
  const ganti = tabAktif !== tab
  tabAktif = tab

  document.querySelectorAll('.cms-tab').forEach(el => {
    const aktif = el.dataset.tab === tab
    el.classList.toggle('is-aktif', aktif)
    el.setAttribute('aria-current', aktif ? 'page' : 'false')
  })

  document.querySelectorAll('.tab-panel').forEach(el => {
    el.hidden = el.dataset.panel !== tab
  })

  geserIndikator(animasi)
  if (ganti) revealGrid = true
}

/**
 * Geser latar merah ke tab yang aktif. Kalau animasi, pakai CSS transition
 * supaya latar merahnya bergeser halus, bukan langsung melompat.
 */
function geserIndikator(animasi = true) {
  if (!indikatorEl) return
  const aktif = document.querySelector('.cms-tab.is-aktif')
  if (!aktif) return

  indikatorEl.classList.toggle('is-geser', animasi)
  indikatorEl.style.width = `${aktif.offsetWidth}px`
  indikatorEl.style.transform = `translateX(${aktif.offsetLeft}px)`
}


// ── GRID PRODUK ──────────────────────────────────────────────────────────
function renderCategoryFilter() {
  const selected = categoryFilterButton.dataset.value || ''
  categoryFilterLabel.textContent = selected ? getCategoryLabel(selected) : 'Semua'
  categoryMenu.innerHTML = [
    `<button type="button" class="category-option${selected ? '' : ' selected'}" role="option" aria-selected="${!selected}" data-category="">Semua</button>`,
    ...categories.map(item => `<button type="button" class="category-option${selected === String(item.id) ? ' selected' : ''}" role="option" aria-selected="${selected === String(item.id)}" data-category="${escapeHtml(item.id)}">${escapeHtml(item.label_id)}</button>`),
  ].join('')
}

function visibleProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase('id')
  const category = categoryFilterButton.dataset.value || ''
  return products.filter(product =>
    product.name.toLocaleLowerCase('id').includes(query) && (!category || String(product.category_id) === category))
}

function renderGrid() {
  renderCategoryFilter()
  grid.innerHTML = visibleProducts().map((product, i) => `
    <button class="product-card reveal${revealGrid ? ` stagger-${(i % 10) + 1}` : ''}${Number(product.stock) < 1 ? ' out-of-stock' : ''}" type="button" data-product-id="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)}, stok ${Number(product.stock)}">
      <span class="stock-label">Stok: ${Number(product.stock)}</span>
      <img class="product-image" src="${escapeHtml(product.image || placeholderImage)}" alt="${escapeHtml(product.name)}" />
      ${Number(product.stock) < 1 ? '<span class="out-of-stock-label">Stok Habis</span>' : ''}
      <span class="product-category">${escapeHtml(getCategoryLabel(product.category_id))}</span>
      <span class="product-name">${escapeHtml(product.name)}</span>
      <span class="product-price">${rupiah(product.price)}</span>
    </button>`).join('')
  revealGrid = false
}

const JENIS_MEDIA = [
  { value: '', label: 'Semua' },
  { value: 'image', label: 'Gambar' },
  { value: 'video', label: 'Video' },
]

function renderMediaFilter() {
  const selected = mediaFilterButton.dataset.value || ''
  const aktif = JENIS_MEDIA.find(j => j.value === selected)
  mediaFilterLabel.textContent = aktif ? aktif.label : 'Semua'
  mediaFilterMenu.innerHTML = JENIS_MEDIA
    .map(j => `<button type="button" class="category-option${selected === j.value ? ' selected' : ''}" role="option" aria-selected="${selected === j.value}" data-jenis-filter="${j.value}">${escapeHtml(j.label)}</button>`)
    .join('')
}

function visibleMedia() {
  const query = mediaSearchInput.value.trim().toLocaleLowerCase('id')
  const jenis = mediaFilterButton.dataset.value || ''
  return media.filter(item =>
    item.name.toLocaleLowerCase('id').includes(query) && (!jenis || item.type === jenis))
}

function renderMediaGrid() {
  renderMediaFilter()
  mediaGrid.innerHTML = visibleMedia().map((item, i) => {
    const video = item.type === 'video'
    return `
    <button class="product-card media-card reveal${revealGrid ? ` stagger-${(i % 10) + 1}` : ''}" type="button" data-media-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.name)}, ${video ? 'video' : 'gambar'}">
      <span class="media-thumb">
        ${video
          ? `<video src="${escapeHtml(item.image)}" muted playsinline preload="metadata"></video><i class="fa-solid fa-play" aria-hidden="true"></i>`
          : `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />`}
      </span>
      <span class="media-nama">${escapeHtml(item.name)}</span>
      <i class="media-jenis fa-solid ${video ? 'fa-video' : 'fa-image'}" title="${video ? 'Video' : 'Gambar'}" aria-hidden="true"></i>
    </button>`
  }).join('')
  revealGrid = false
}

// ── MODAL KONFIRMASI (gaya sama dengan modal konfirmasi pembayaran kiosk) ──
function tampilkanModal({ judul, pesan, labelKiri, labelKanan, aksiKiri, aksiKanan }) {
  modal = { aksiKiri, aksiKanan }
  alertHost.innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <section class="modal-kartu" role="alertdialog" aria-modal="true" aria-label="${escapeHtml(judul)}">
        <p class="modal-judul">${escapeHtml(judul)}</p>
        <p class="modal-pesan">${escapeHtml(pesan)}</p>
        <div class="modal-aksi">
          <button type="button" class="modal-kiri" data-modal="kiri">${escapeHtml(labelKiri)}</button>
          <button type="button" class="modal-kanan" data-modal="kanan">${escapeHtml(labelKanan)}</button>
        </div>
      </section>
    </div>`
}

function tutupModal() {
  alertHost.innerHTML = ''
  modal = null
}

alertHost.addEventListener('click', event => {
  if (!modal) return
  const pilihan = event.target.closest('[data-modal]')?.dataset.modal
  const aksi = pilihan === 'kiri' ? modal.aksiKiri : pilihan === 'kanan' ? modal.aksiKanan : null
  if (!aksi) return
  tutupModal()
  aksi()
})

// ── PANEL PRODUK ─────────────────────────────────────────────────────────
function panelTerbuka() {
  return Boolean(panelMode || mediaMode)
}

function adaPerubahan() {
  if (mediaMode) {
    if (mediaMode === 'media-add') return Boolean(mediaDraft.name.trim() || mediaDraft.image)
    const asli = media.find(p => String(p.id) === String(activeMediaId))
    return Boolean(asli && ['name', 'type', 'image'].some(k => String(mediaDraft[k] ?? '') !== String(asli[k] ?? '')))
  }
  if (!draft || !panelMode) return false
  if (panelMode === 'add') return Boolean(draft.category_id || draft.name.trim() || draft.price || Number(draft.stock) > 0 || draft.image)
  const asli = products.find(p => String(p.id) === String(activeProductId))
  return Boolean(asli && ['name', 'category_id', 'price', 'image', 'stock'].some(k => String(draft[k] ?? '') !== String(asli[k] ?? '')))
}

/**
 * Tutup panel. Kalau ada perubahan yang belum disimpan, tampilkan modal
 * "Buang Perubahan?" dulu.
 *   - tombol KANAN  → lanjutVEN editing (batal buang)
 *   - tombol KIRI   → buang perubahan (tutup)
 * Untuk mode tambah, tombol KANAN = "Ya" (lanjut menambah) dan
 * tombol KIRI = "Buang" (batal menambah).
 */
function requestTutupPanel(setelahTutup = null) {
  if (!panelTerbuka()) {
    if (setelahTutup) setTimeout(setelahTutup, 0)
    return
  }

  if (!adaPerubahan()) {
    closePanel()
    if (setelahTutup) setTimeout(setelahTutup, 250)
    return
  }

  const menambah = panelMode === 'add' || mediaMode === 'media-add'
  pendingTutup = setelahTutup

  tampilkanModal({
    judul: 'Buang Perubahan?',
    pesan: menambah
      ? 'Produk yang sedang ditambahkan akan dibatalkan. Yakin membatalkan penambahan?'
      : 'Perubahan yang belum disimpan akan dibuang. Yakin membuang perubahan?',
    labelKiri: 'Buang',
    labelKanan: menambah ? 'Ya' : 'Lanjut Mengedit',
    aksiKiri: () => {
      closePanel()
      if (pendingTutup) { const f = pendingTutup; pendingTutup = null; setTimeout(f, 250) }
    },
    aksiKanan: () => {
      pendingTutup = null
    },
  })
}

function closePanel() {
  const panel = panelHost.querySelector('.cms-panel')
  const selesai = () => {
    panelMode = null
    activeProductId = null
    draft = null
    mediaMode = null
    activeMediaId = null
    mediaDraft = null
    fieldAktif = null
    errors = {}
    if (panelHost.contains(panel) || !panel) panelHost.innerHTML = ''
  }

  if (panel) {
    panel.classList.add('closing')
    window.setTimeout(selesai, 240)
    return
  }
  selesai()
}

function openProductPanel(mode, product = null) {
  mediaMode = null
  mediaDraft = null
  panelMode = mode
  activeProductId = product?.id ?? null
  fieldAktif = null
  draft = product
    ? { ...product }
    : { id: null, name: '', category_id: '', price: '', image: '', stock: 0 }
  errors = {}
  renderPanel()
}

function openMediaPanel(mode, item = null) {
  panelMode = null
  draft = null
  activeProductId = null
  mediaMode = mode
  activeMediaId = item?.id ?? null
  fieldAktif = null
  mediaDraft = item
    ? { ...item }
    : { id: null, name: '', type: 'image', image: '' }
  errors = {}
  renderPanel()
}

function renderPanel() {
  if (mediaMode) return renderMediaPanel()
  if (!panelMode || !draft) return

  const adding = panelMode === 'add'
  const image = draft.image || ''

  // ── Kategori: dropdown custom (rounded, sama seperti filter di search) ──
  const kategoriDipilih = categories.find(c => String(c.id) === String(draft.category_id))
  const labelKategori = kategoriDipilih ? kategoriDipilih.label_id : 'Pilih Kategori'
  const kategoriAktif = fieldAktif === 'category_id'

  // ── Nama: di panel edit harus klik pensil dulu ──
  const namaAktif = adding || fieldAktif === 'name'
  const namaIsi = namaAktif
    ? `<input id="draft-name" class="panel-input" type="text" placeholder="Nama Produk" value="${escapeHtml(draft.name)}" aria-label="Nama Produk" />`
    : `<span class="panel-teks" data-field="name">${escapeHtml(draft.name)}</span>`
  const namaIkon = namaAktif
    ? ''
    : `<button type="button" class="panel-pencil" data-edit="name" aria-label="Ubah nama produk"><i class="fa-solid fa-pencil" aria-hidden="true"></i></button>`

  // ── Harga: sama, klik pensil dulu ──
  const hargaAktif = adding || fieldAktif === 'price'
  const hargaIsi = hargaAktif
    ? `<span class="currency-prefix">Rp</span><input id="draft-price" class="panel-input" type="number" min="1" step="1" placeholder="0" value="${escapeHtml(draft.price)}" aria-label="Harga produk" />`
    : `<span class="panel-teks" data-field="price">${rupiah(draft.price)}</span>`
  const hargaIkon = hargaAktif
    ? ''
    : `<button type="button" class="panel-pencil" data-edit="price" aria-label="Ubah harga produk"><i class="fa-solid fa-pencil" aria-hidden="true"></i></button>`

  panelHost.innerHTML = `
    <aside class="cms-panel" aria-label="${adding ? 'Tambah Produk' : 'Ubah Produk'}">
      <button class="panel-close" type="button" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <div class="panel-content">

        <div class="image-picker${adding && !image ? ' image-placeholder' : ''}" id="image-picker" role="button" tabindex="0" aria-label="Ubah gambar produk">
          ${image
            ? `<img src="${escapeHtml(image)}" alt="Gambar produk" /><span class="image-edit-icon"><i class="fa-regular fa-images"></i></span>`
            : '<span class="placeholder-picture"><i class="fa-regular fa-images"></i></span>'}
          <input id="image-input" type="file" accept="image/*" hidden />
        </div>
        ${!adding ? '<p class="panel-petunjuk">Ketuk ikon pensil atau chevron untuk mengubah data produk.</p>' : ''}

        <!-- Kategori -->
        <div class="panel-baris">
          <div class="panel-baris-isi">
            <div class="field-wrap kategori-wrap">
              <button type="button" class="kategori-trigger${kategoriDipilih ? ' terisi' : ''}${kategoriAktif ? ' dibuka' : ''}"
                id="draft-category-trigger" aria-haspopup="listbox" aria-expanded="${kategoriAktif}">
                <span>${escapeHtml(labelKategori)}</span>
                <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
              </button>
              <div class="kategori-menu" id="draft-category-menu" role="listbox" aria-label="Kategori produk"${kategoriAktif ? '' : ' hidden'}>
                ${categories.map(c => `<button type="button" class="kategori-option${String(c.id) === String(draft.category_id) ? ' dipilih' : ''}" role="option" aria-selected="${String(c.id) === String(draft.category_id)}" data-pilih-kategori="${escapeHtml(c.id)}">${escapeHtml(c.label_id)}</button>`).join('')}
              </div>
            </div>
            ${!adding && !kategoriAktif ? `<button type="button" class="panel-pencil" data-edit="category_id" aria-label="Ubah kategori"><i class="fa-solid fa-pencil" aria-hidden="true"></i></button>` : ''}
          </div>
          <span class="field-error" data-error="category"></span>
        </div>

        <!-- Nama produk -->
        <div class="panel-baris">
          <div class="panel-baris-isi">
            ${namaIsi}
            ${namaIkon}
          </div>
          <span class="field-error" data-error="name"></span>
        </div>

        <!-- Harga -->
        <div class="price-field">
          <label for="draft-price">Harga</label>
          <div class="panel-baris-isi">
            ${hargaIsi}
            ${hargaIkon}
          </div>
          <span class="field-error" data-error="price"></span>
        </div>

        <!-- Stok: selalu bisa diubah -->
        <div class="stock-field">
          <label>Stok</label>
          <div class="stock-stepper${adding && Number(draft.stock) < 1 ? ' is-empty' : ''}">
            <button type="button" class="stock-step" data-step="-1" aria-label="Kurangi stok"><i class="fa-solid fa-minus"></i></button>
            <input id="draft-stock" type="number" min="0" step="1" value="${escapeHtml(draft.stock)}" aria-label="Stok produk" />
            <button type="button" class="stock-step" data-step="1" aria-label="Tambah stok"><i class="fa-solid fa-plus"></i></button>
          </div>
          <span class="field-error stock-error" data-error="stock"></span>
        </div>

        <div class="panel-actions${adding ? ' single-action' : ''}">
          ${adding ? '' : '<button type="button" class="delete-button" id="delete-product">Hapus</button>'}
          <button type="button" class="save-button" id="save-product"${!adding && !adaPerubahan() ? ' disabled' : ''}>${adding ? 'Tambahkan' : 'Simpan'}</button>
        </div>
      </div>
    </aside>`
}

// ── PANEL MEDIA (gambar / video) ─────────────────────────────────────────
function renderMediaPanel() {
  if (!mediaMode || !mediaDraft) return

  const adding = mediaMode === 'media-add'
  const type = mediaDraft.type === 'video' ? 'video' : 'image'
  const file = mediaDraft.image || ''

  // Preview mengikuti berkas yang sudah tersimpan; kalau belum ada berkas,
  // tampilkan placeholder umum karena jenisnya belum diketahui.
  let preview
  if (!file) {
    preview = '<span class="placeholder-picture"><i class="fa-regular fa-file-video"></i></span>'
  } else if (type === 'video') {
    preview = `<video class="media-preview" src="${escapeHtml(file)}" muted playsinline controls preload="metadata"></video>
       <span class="image-edit-icon"><i class="fa-solid fa-video"></i></span>`
  } else {
    preview = `<img src="${escapeHtml(file)}" alt="${escapeHtml(mediaDraft.name)}" />
       <span class="image-edit-icon"><i class="fa-solid fa-image"></i></span>`
  }

  panelHost.innerHTML = `
    <aside class="cms-panel" aria-label="${adding ? 'Tambah Media' : 'Ubah Media'}">
      <button class="panel-close" type="button" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <div class="panel-content">
        <h2 class="panel-title">${adding ? 'Tambah Media' : 'Ubah Media'}</h2>
        <p class="panel-hint">Media ini diputar otomatis di layar awal kiosk pelanggan.</p>

        <!-- Preview / pilih berkas (gambar ATAU video) -->
        <div class="image-picker${adding && !file ? ' image-placeholder' : ''}" id="image-picker" role="button" tabindex="0" aria-label="Pilih berkas gambar atau video">
          ${preview}
          <input id="image-input" type="file" accept="image/*,video/mp4,video/webm,video/ogg" hidden />
        </div>
        <p class="panel-petunjuk">Bisa gambar atau video.<br />Gambar maks 2 MB · Video MP4/WebM/OGG maks 20 MB.</p>

        <div class="panel-baris">
          <div class="panel-baris-isi">
            <input id="media-name" class="panel-input" type="text" placeholder="Nama Media" value="${escapeHtml(mediaDraft.name)}" aria-label="Nama media" />
          </div>
          <span class="field-error" data-error="name"></span>
        </div>

        <div class="panel-actions${adding ? ' single-action' : ''}">
          ${adding ? '' : '<button type="button" class="delete-button" id="delete-media">Hapus</button>'}
          <button type="button" class="save-button" id="save-media"${!adaPerubahan() ? ' disabled' : ''}>${adding ? 'Tambahkan' : 'Simpan'}</button>
        </div>
      </div>
    </aside>`
}

// ── VALIDASI & SIMPAN PRODUK ─────────────────────────────────────────────
function setError(key, message) {
  errors[key] = message
  const el = panelHost.querySelector(`[data-error="${key}"]`)
  if (!el) return
  el.textContent = message
  el.classList.remove('visible')
  void el.offsetWidth
  el.classList.add('visible')
  el.closest('.panel-baris, .price-field, .stock-field')?.classList.add('has-error')
}

function validateDraft() {
  const valid = Boolean(
    String(draft.category_id).trim() &&
    String(draft.name).trim() &&
    Number.isFinite(Number(draft.price)) && Number(draft.price) >= 1 &&
    String(draft.stock).trim() !== '' &&
    Number.isInteger(Number(draft.stock)) && Number(draft.stock) >= 0 &&
    (panelMode !== 'add' || Number(draft.stock) >= 1)
  )

  if (valid) return true

  if (!String(draft.category_id).trim()) setError('category', 'Pilih kategori produk.')
  if (!String(draft.name).trim()) setError('name', 'Nama produk belum diisi.')
  if (!Number.isFinite(Number(draft.price)) || Number(draft.price) < 1) setError('price', 'Harga produk belum diisi.')
  if (String(draft.stock).trim() === '' || !Number.isInteger(Number(draft.stock)) || Number(draft.stock) < 0 || (panelMode === 'add' && Number(draft.stock) < 1)) {
    setError('stock', panelMode === 'add' ? 'Stok produk belum diisi.' : 'Stok tidak boleh kurang dari 0.')
  }
  return false
}

function updateDraft(key, value) {
  if (!draft) return
  draft[key] = value
  if (errors[key]) {
    delete errors[key]
    const el = panelHost.querySelector(`[data-error="${key}"]`)
    if (el) { el.textContent = ''; el.classList.remove('visible') }
    el?.closest('.panel-baris, .price-field, .stock-field')?.classList.remove('has-error')
  }
  if (key === 'stock') {
    panelHost.querySelector('.stock-stepper')?.classList.toggle('is-empty', panelMode === 'add' && Number(value) < 1)
  }
  const save = panelHost.querySelector('#save-product')
  if (save && panelMode === 'edit') save.disabled = !adaPerubahan()
}

async function saveDraft() {
  if (!validateDraft()) return

  const saveButton = panelHost.querySelector('#save-product')
  if (saveButton) saveButton.disabled = true

  const payload = {
    name: draft.name.trim(),
    category_id: Number(draft.category_id),
    price: Number(draft.price),
    stock: Number(draft.stock),
    image: draft.image || placeholderImage,
  }

  try {
    const isEdit = panelMode === 'edit'
    const res = await fetch(isEdit ? `/api/cms/products/${activeProductId}` : '/api/cms/products', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    if (res.ok && result.success) {
      await fetchProducts()
      closePanel()
    } else {
      tampilkanModal({
        judul: 'Gagal Menyimpan',
        pesan: result.message || 'Produk gagal disimpan.',
        labelKiri: 'Tutup', labelKanan: 'Coba Lagi',
        aksiKiri: () => {}, aksiKanan: () => saveDraft(),
      })
    }
  } catch (error) {
    console.error('Gagal menyimpan produk:', error)
    tampilkanModal({
      judul: 'Gagal Menyimpan',
      pesan: 'Terjadi kesalahan koneksi ke server.',
      labelKiri: 'Tutup', labelKanan: 'Coba Lagi',
      aksiKiri: () => {}, aksiKanan: () => saveDraft(),
    })
  } finally {
    const button = panelHost.querySelector('#save-product')
    if (button) button.disabled = false
  }
}

/** Hapus produk — dengan konfirmasi "Hapus [Nama Produk]?" */
function deleteProduct() {
  if (!activeProductId) return
  const nama = draft?.name || ''

  tampilkanModal({
    judul: 'Hapus Produk?',
    pesan: `Hapus ${nama}?`,
    labelKiri: 'Hapus',
    labelKanan: 'Tidak',
    aksiKiri: kirimHapusProduk,
    aksiKanan: () => {},
  })
}

async function kirimHapusProduk() {
  try {
    const res = await fetch(`/api/cms/products/${activeProductId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    })
    const result = await res.json()

    if (res.ok && result.success) {
      await fetchProducts()
      closePanel()
    } else {
      tampilkanModal({
        judul: 'Gagal Menghapus',
        pesan: result.message || 'Produk gagal dihapus.',
        labelKiri: 'Tutup', labelKanan: 'Coba Lagi',
        aksiKiri: () => {}, aksiKanan: kirimHapusProduk,
      })
    }
  } catch (error) {
    console.error('Gagal menghapus produk:', error)
    tampilkanModal({
      judul: 'Gagal Menghapus',
      pesan: 'Terjadi kesalahan koneksi ke server.',
      labelKiri: 'Tutup', labelKanan: 'Coba Lagi',
      aksiKiri: () => {}, aksiKanan: kirimHapusProduk,
    })
  }
}

// ── SIMPAN & HAPUS MEDIA ────────────────────────────────────────────────
function updateMediaDraft(key, value) {
  if (!mediaDraft) return
  mediaDraft[key] = value
  if (key === 'name') {
    const el = panelHost.querySelector('[data-error="name"]')
    if (el) { el.textContent = ''; el.classList.remove('visible') }
  }
  const save = panelHost.querySelector('#save-media')
  if (save) save.disabled = !adaPerubahan()
}

async function saveMedia() {
  if (!mediaDraft) return
  if (!String(mediaDraft.name).trim()) {
    setError('name', 'Nama media belum diisi.')
    return
  }

  const saveButton = panelHost.querySelector('#save-media')
  if (saveButton) saveButton.disabled = true

  const payload = { name: mediaDraft.name.trim(), type: mediaDraft.type || 'image', image: mediaDraft.image || '' }
  const adding = mediaMode === 'media-add'

  try {
    const res = await fetch(adding ? '/api/cms/posters' : `/api/cms/posters/${activeMediaId}`, {
      method: adding ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    if (res.ok && result.success) {
      await fetchMedia()
      closePanel()
    } else {
      setError('name', result.message || 'Media gagal disimpan.')
    }
  } catch (error) {
    console.error('Gagal menyimpan media:', error)
    setError('name', 'Terjadi kesalahan koneksi ke server.')
  } finally {
    const button = panelHost.querySelector('#save-media')
    if (button) button.disabled = false
  }
}

function deleteMedia() {
  if (!activeMediaId) return
  const nama = mediaDraft?.name || ''

  tampilkanModal({
    judul: 'Hapus Media?',
    pesan: `Hapus ${nama}?`,
    labelKiri: 'Hapus',
    labelKanan: 'Tidak',
    aksiKiri: kirimHapusMedia,
    aksiKanan: () => {},
  })
}

async function kirimHapusMedia() {
  try {
    const res = await fetch(`/api/cms/posters/${activeMediaId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    })
    const result = await res.json()

    if (res.ok && result.success) {
      await fetchMedia()
      closePanel()
    } else {
      tampilkanModal({
        judul: 'Gagal Menghapus',
        pesan: result.message || 'Media gagal dihapus.',
        labelKiri: 'Tutup', labelKanan: 'Coba Lagi',
        aksiKiri: () => {}, aksiKanan: kirimHapusMedia,
      })
    }
  } catch (error) {
    console.error('Gagal menghapus media:', error)
  }
}

// ── GAMBAR ───────────────────────────────────────────────────────────────
async function readImage(file) {
  if (!file || !file.type.startsWith('image/')) return
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  // Jenis media ditentukan dari berkas yang dipilih, jadi tidak perlu tombol
  // pilih gambar/video terpisah.
  if (mediaMode) {
    const video = file.type.startsWith('video/')

    if (video && file.size > 20 * 1024 * 1024) {
      window.alert('Ukuran video maksimal 20 MB.')
      return
    }
    if (!video && file.size > 2 * 1024 * 1024) {
      window.alert('Ukuran gambar maksimal 2 MB.')
      return
    }

    mediaDraft.type = video ? 'video' : 'image'
    // Video dikirim apa adanya — mengompresnya butuh encoder video yang berat
    // dan sangat lambat untuk file besar.
    mediaDraft.image = video ? source : await kompresGambar(source)
    renderPanel()
    return
  }

  updateDraft('image', await kompresGambar(source))
  renderPanel()
}

/** Perkecil gambar ke WebP supaya tidak berat dikirim ke server */
async function kompresGambar(source) {
  const img = new Image()
  img.src = source
  await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject })

  // Media = layar penuh, produk = kartu. Beda skala pengurangan.
  const maks = mediaMode ? 1600 : 1200
  const ratio = Math.min(1, maks / Math.max(img.naturalWidth, img.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * ratio)
  canvas.height = Math.round(img.naturalHeight * ratio)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/webp', 0.82)
}

// ── EVENT LISTENER ───────────────────────────────────────────────────────
document.querySelectorAll('.cms-tab').forEach(el => {
  el.addEventListener('click', () => requestTutupPanel(() => setTab(el.dataset.tab)))
})

searchInput.addEventListener('input', renderGrid)

// Search & filter media (tab Kelola Media)
mediaSearchInput.addEventListener('input', renderMediaGrid)

mediaFilterButton.addEventListener('click', () => {
  const isOpen = !mediaFilterMenu.hidden
  mediaFilterMenu.hidden = isOpen
  mediaFilterButton.setAttribute('aria-expanded', String(!isOpen))
})

mediaFilterMenu.addEventListener('click', event => {
  const option = event.target.closest('[data-jenis-filter]')
  if (!option) return
  mediaFilterButton.dataset.value = option.dataset.jenisFilter
  mediaFilterMenu.hidden = true
  mediaFilterButton.setAttribute('aria-expanded', 'false')
  renderMediaGrid()
})

categoryFilterButton.addEventListener('click', () => {
  const isOpen = !categoryMenu.hidden
  categoryMenu.hidden = isOpen
  categoryFilterButton.setAttribute('aria-expanded', String(!isOpen))
})

categoryMenu.addEventListener('click', event => {
  const option = event.target.closest('[data-category]')
  if (!option) return
  categoryFilterButton.dataset.value = option.dataset.category
  categoryMenu.hidden = true
  categoryFilterButton.setAttribute('aria-expanded', 'false')
  renderGrid()
})

document.addEventListener('click', event => {
  if (!event.target.closest('.category-filter-wrap')) {
    categoryMenu.hidden = true
    categoryFilterButton.setAttribute('aria-expanded', 'false')
  }
  if (!event.target.closest('.category-filter-wrap')) {
    mediaFilterMenu.hidden = true
    mediaFilterButton.setAttribute('aria-expanded', 'false')
  }
})

document.querySelector('#add-product').addEventListener('click', () => requestTutupPanel(() => openProductPanel('add')))
document.querySelector('#add-media').addEventListener('click', () => requestTutupPanel(() => openMediaPanel('media-add')))

grid.addEventListener('click', event => {
  const card = event.target.closest('[data-product-id]')
  if (!card) return
  const product = products.find(item => String(item.id) === String(card.dataset.productId))
  if (product) requestTutupPanel(() => openProductPanel('edit', product))
})

mediaGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-media-id]')
  if (!card) return
  const found = media.find(item => String(item.id) === String(card.dataset.mediaId))
  if (found) requestTutupPanel(() => openMediaPanel('media-edit', found))
})

// Klik di luar panel → tutup (dengan konfirmasi bila ada perubahan)
document.addEventListener('click', event => {
  if (!panelTerbuka() || modal) return
  if (panelHost.contains(event.target) || alertHost.contains(event.target)) return
  if (event.target.closest('.cms-controls') || event.target.closest('.cms-tabs')) return
  if (event.target.closest('[data-product-id]') || event.target.closest('[data-media-id]')) return
  requestTutupPanel()
})

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || modal) return
  if (panelTerbuka()) requestTutupPanel()
})

// Event di dalam panel
panelHost.addEventListener('click', event => {
  if (event.target.closest('.panel-close')) { requestTutupPanel(); return }

  // Klik ikon pensil → aktifkan field tsb untuk diedit
  const trigger = event.target.closest('[data-edit]')
  if (trigger) {
    fieldAktif = trigger.dataset.edit
    renderPanel()
    panelHost.querySelector('.kategori-menu:not([hidden])')
    const first = panelHost.querySelector('.kategori-trigger[aria-expanded="true"]') ? null : panelHost.querySelector('.panel-input, #draft-stock')
    first?.focus()
    if (first?.select) first.select()
    return
  }

  // Buka/tutup dropdown kategori di dalam panel
  const kategoriTrigger = event.target.closest('#draft-category-trigger')
  if (kategoriTrigger) {
    if (fieldAktif !== 'category_id') { fieldAktif = 'category_id'; renderPanel() }
    else {
      const menu = panelHost.querySelector('#draft-category-menu')
      const terbuka = !menu.hidden
      if (terbuka) { fieldAktif = null; renderPanel() }
    }
    return
  }

  const step = event.target.closest('[data-step]')
  if (step) {
    const input = panelHost.querySelector('#draft-stock')
    updateDraft('stock', Math.max(0, Number(input.value || 0) + Number(step.dataset.step)))
    input.value = draft.stock
    return
  }

  if (event.target.id !== 'image-input' && event.target.closest('#image-picker')) {
    panelHost.querySelector('#image-input').click()
    return
  }
  if (event.target.closest('#save-product')) saveDraft()
  if (event.target.closest('#delete-product')) deleteProduct()
  if (event.target.closest('#save-media')) saveMedia()
  if (event.target.closest('#delete-media')) deleteMedia()
})

// Klik di luar dropdown kategori (tapi di dalam panel) → tutup
panelHost.addEventListener('click', event => {
  if (!panelHost.querySelector('#draft-category-menu')) return
  if (event.target.closest('.kategori-wrap')) return
  if (fieldAktif === 'category_id') { fieldAktif = null; renderPanel() }
})

panelHost.addEventListener('change', event => {
  if (event.target.id === 'image-input') {
    readImage(event.target.files?.[0]).catch(() => window.alert('Gambar tidak dapat dibaca.'))
  }
})

panelHost.addEventListener('input', event => {
  const keys = {
    'draft-name': ['name', 'produk'],
    'draft-price': ['price', 'produk'],
    'draft-stock': ['stock', 'produk'],
    'media-name': ['name', 'media'],
  }
  const entry = keys[event.target.id]
  if (!entry) return
  const [key, kind] = entry
  if (kind === 'media') updateMediaDraft(key, event.target.value)
  else updateDraft(key, event.target.value)
})

panelHost.addEventListener('keydown', event => {
  // Enter di field harga langsung simpan
  if (event.target.id === 'draft-price' && event.key === 'Enter') {
    event.preventDefault()
    if (fieldAktif) { fieldAktif = null; renderPanel() }
    saveDraft()
  }
  if (event.target.id === 'draft-name' && event.key === 'Enter') {
    event.preventDefault()
    event.target.blur()
  }
  if (event.target.id === 'image-picker' && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    panelHost.querySelector('#image-input').click()
  }
})

// ── INISIALISASI ─────────────────────────────────────────────────────────
setTab('produk')
fetchCategories().then(fetchProducts)
fetchMedia()
