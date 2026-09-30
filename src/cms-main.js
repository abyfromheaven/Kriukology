import './cms.css'
import menuAwal from './data/menu.js'
import kategoriMenu from './data/kategori.js'

const STORAGE_KEY = 'kriukology-cms-products-v2'
const categoryLabels = Object.fromEntries(kategoriMenu.map(item => [item.id, item.label.id]))
const placeholderImage = '/assets/menu-placeholder.svg'

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (error) {
    console.warn('Data CMS lokal tidak dapat dibaca.', error)
  }

  const initial = menuAwal.map((item, index) => ({
    id: `dummy-${item.id}`,
    name: item.nama,
    category: item.kategori,
    price: item.harga,
    image: item.gambar || placeholderImage,
    stock: index === menuAwal.length - 1 ? 0 : 12,
  }))
  saveProducts(initial)
  return initial
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    return true
  } catch (error) {
    console.error('Penyimpanan browser penuh atau tidak tersedia.', error)
    return false
  }
}

let products = loadProducts()
let activeProductId = null
let panelMode = null
let draft = null
let pendingPanel = null
let errors = {}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
})[char])
const rupiah = value => `Rp${Number(value || 0).toLocaleString('id-ID')}`
const getCategoryLabel = value => categoryLabels[value] || value

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

      <h1>Kelola Produk</h1>

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
const panelHost = document.querySelector('#panel-host')
const alertHost = document.querySelector('#alert-host')

function allCategories() {
  return [...new Set([...kategoriMenu.map(item => item.id), ...products.map(product => product.category)])]
}

function renderCategoryFilter() {
  const selected = categoryFilterButton.dataset.value || ''
  categoryFilterLabel.textContent = selected ? getCategoryLabel(selected) : 'Semua'
  categoryMenu.innerHTML = [
    `<button type="button" class="category-option${selected ? '' : ' selected'}" role="option" aria-selected="${!selected}" data-category="">Semua</button>`,
    ...allCategories().map(value => `<button type="button" class="category-option${selected === value ? ' selected' : ''}" role="option" aria-selected="${selected === value}" data-category="${escapeHtml(value)}">${escapeHtml(getCategoryLabel(value))}</button>`),
  ].join('')
}

function visibleProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase('id')
  const category = categoryFilterButton.dataset.value || ''
  return products.filter(product =>
    product.name.toLocaleLowerCase('id').includes(query) && (!category || product.category === category))
}

function renderGrid() {
  renderCategoryFilter()
  grid.innerHTML = visibleProducts().map(product => `
    <button class="product-card${Number(product.stock) < 1 ? ' out-of-stock' : ''}" type="button" data-product-id="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)}, stok ${Number(product.stock)}">
      <span class="stock-label">Stok: ${Number(product.stock)}</span>
      <img class="product-image" src="${escapeHtml(product.image || placeholderImage)}" alt="${escapeHtml(product.name)}" />
      ${Number(product.stock) < 1 ? '<span class="out-of-stock-label">Stok Habis</span>' : ''}
      <span class="product-category">${escapeHtml(getCategoryLabel(product.category))}</span>
      <span class="product-name">${escapeHtml(product.name)}</span>
      <span class="product-price">${rupiah(product.price)}</span>
    </button>`).join('')
}

function openPanel(mode, product = null) {
  panelMode = mode
  activeProductId = product?.id ?? null
  draft = product ? { ...product } : { id: null, name: '', category: '', price: '', image: '', stock: 0 }
  errors = {}
  renderPanel()
}

function hasChanges() {
  if (!draft || !panelMode) return false
  if (panelMode === 'add') return Boolean(draft.category || draft.name.trim() || draft.price || Number(draft.stock) > 0 || draft.image)
  const original = products.find(product => product.id === activeProductId)
  return Boolean(original && ['name', 'category', 'price', 'image', 'stock'].some(key => String(draft[key] ?? '') !== String(original[key] ?? '')))
}

function requestPanel(next) {
  if (hasChanges()) {
    pendingPanel = next
    renderConfirmModal()
    return
  }
  if (!next) closePanel()
  else openPanel(next.mode, next.product)
}

function closePanel() {
  const panel = panelHost.querySelector('.cms-panel')
  if (panel) {
    panel.classList.add('closing')
    panelMode = null
    activeProductId = null
    draft = null
    pendingPanel = null
    window.setTimeout(() => {
      if (panelHost.contains(panel)) panelHost.innerHTML = ''
    }, 240)
    return
  }
  panelMode = null
  activeProductId = null
  draft = null
  pendingPanel = null
  panelHost.innerHTML = ''
}

function renderPanel() {
  if (!panelMode || !draft) return
  const adding = panelMode === 'add'
  const categoryOptions = allCategories().map(value =>
    `<option value="${escapeHtml(getCategoryLabel(value))}"></option>`).join('')
  const image = draft.image || ''
  panelHost.innerHTML = `
    <aside class="cms-panel" aria-label="${adding ? 'Tambah Produk' : 'Modifikasi Produk'}">
      <button class="panel-close" type="button" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <div class="panel-content">
        <div class="image-picker${adding && !image ? ' image-placeholder' : ''}" id="image-picker" role="button" tabindex="0" aria-label="Ubah gambar produk">
          ${image
            ? `<img src="${escapeHtml(image)}" alt="Gambar produk" /><span class="image-edit-icon"><i class="fa-regular fa-images"></i></span>`
            : '<span class="placeholder-picture"><i class="fa-regular fa-images"></i></span>'}
          <input id="image-input" type="file" accept="image/*" hidden />
        </div>

        <div class="category-field field-wrap">
          <input id="draft-category" list="category-options" aria-label="Kategori produk" placeholder="Pilih Kategori" value="${escapeHtml(draft.category ? getCategoryLabel(draft.category) : '')}" class="${!draft.category && adding ? 'is-placeholder' : ''}" autocomplete="off" />
          <datalist id="category-options">${categoryOptions}</datalist>
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
          <span class="field-error" data-error="category"></span>
        </div>

        <div class="editable-field field-wrap name-field">
          <input id="draft-name" type="text" placeholder="Nama Produk" value="${escapeHtml(draft.name)}" aria-label="Nama Produk" />
          <i class="fa-solid fa-pencil" aria-hidden="true"></i>
          <span class="field-error" data-error="name"></span>
        </div>

        <div class="price-field">
          <label for="draft-price">Harga</label>
          <div class="editable-field field-wrap">
            <span class="currency-prefix">Rp</span>
            <input id="draft-price" type="number" min="1" step="1" placeholder="0" value="${escapeHtml(draft.price)}" aria-label="Harga produk" />
            <i class="fa-solid fa-pencil" aria-hidden="true"></i>
            <span class="field-error" data-error="price"></span>
          </div>
        </div>

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
          <button type="button" class="save-button" id="save-product"${!adding && !hasChanges() ? ' disabled' : ''}>${adding ? 'Tambahkan' : 'Simpan'}</button>
        </div>
      </div>
    </aside>`
}

function updateDraft(key, value) {
  if (!draft) return
  draft[key] = value
  if (errors[key]) {
    delete errors[key]
    const error = panelHost.querySelector(`[data-error="${key}"]`)
    if (error) error.classList.remove('visible')
    const field = error?.closest('.field-wrap')
    if (field) field.classList.remove('has-error')
  }
  if (key === 'category' && panelMode === 'add') {
    const category = panelHost.querySelector('#draft-category')
    category?.classList.toggle('is-placeholder', !value)
  }
  if (key === 'stock') panelHost.querySelector('.stock-stepper')?.classList.toggle('is-empty', panelMode === 'add' && Number(value) < 1)
  const saveButton = panelHost.querySelector('#save-product')
  if (saveButton && panelMode === 'edit') saveButton.disabled = !hasChanges()
}

function setError(key, message) {
  errors[key] = message
  const error = panelHost.querySelector(`[data-error="${key}"]`)
  const field = error?.closest('.field-wrap')
  if (error) {
    error.textContent = message
    error.classList.remove('visible')
    void error.offsetWidth
    error.classList.add('visible')
  }
  field?.classList.add('has-error')
}

function validateDraft() {
  const messages = {
    category: 'Pilih kategori produk.',
    name: 'Nama produk belum diisi.',
    price: 'Harga produk belum diisi.',
    stock: 'Stok tidak boleh kurang dari 0.',
  }
  let valid = true
  if (!String(draft.category).trim()) { setError('category', messages.category); valid = false }
  if (!String(draft.name).trim()) { setError('name', messages.name); valid = false }
  if (!Number.isFinite(Number(draft.price)) || Number(draft.price) < 1) { setError('price', messages.price); valid = false }
  if (String(draft.stock).trim() === '' || !Number.isInteger(Number(draft.stock)) || Number(draft.stock) < 0 || (panelMode === 'add' && Number(draft.stock) < 1)) {
    setError('stock', panelMode === 'add' ? 'Stok produk belum diisi.' : messages.stock)
    valid = false
  }
  return valid
}

function persistAndRender() {
  if (!saveProducts(products)) {
    window.alert('Penyimpanan browser penuh. Coba gunakan gambar yang lebih kecil.')
    return false
  }
  renderGrid()
  closePanel()
  return true
}

function saveDraft() {
  if (!validateDraft()) return
  const previousProducts = products
  const normalized = {
    ...draft,
    id: draft.id || `cms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: draft.name.trim(),
    category: draft.category.trim(),
    price: Number(draft.price),
    stock: Number(draft.stock),
    image: draft.image || placeholderImage,
  }
  if (panelMode === 'add') products = [...products, normalized]
  else products = products.map(product => product.id === activeProductId ? normalized : product)
  if (!persistAndRender()) {
    products = previousProducts
    renderGrid()
  }
}

function deleteProduct() {
  const previousProducts = products
  products = products.filter(product => product.id !== activeProductId)
  if (!persistAndRender()) {
    products = previousProducts
    renderGrid()
  }
}

function renderConfirmModal() {
  const title = panelMode === 'add' ? 'Batalkan Tambah Produk?' : 'Batalkan Perubahan?'
  alertHost.innerHTML = `
    <div class="confirm-backdrop" role="presentation">
      <section class="confirm-modal" role="alertdialog" aria-modal="true" aria-label="${title}">
        <p>${title}</p>
        <div class="confirm-actions">
          <button type="button" class="confirm-cancel">Batal</button>
          <button type="button" class="confirm-continue">Lanjut</button>
        </div>
      </section>
    </div>`
}

async function readImage(file) {
  if (!file || !file.type.startsWith('image/')) return
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const image = new Image()
  image.src = source
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject })
  const ratio = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.naturalWidth * ratio)
  canvas.height = Math.round(image.naturalHeight * ratio)
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
  draft.image = canvas.toDataURL('image/webp', 0.82)
  renderPanel()
}

renderGrid()

searchInput.addEventListener('input', renderGrid)
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
  if (event.target.closest('.category-filter-wrap')) return
  categoryMenu.hidden = true
  categoryFilterButton.setAttribute('aria-expanded', 'false')
})
document.querySelector('#add-product').addEventListener('click', () => requestPanel({ mode: 'add' }))

grid.addEventListener('click', event => {
  const card = event.target.closest('[data-product-id]')
  if (!card) return
  const product = products.find(item => item.id === card.dataset.productId)
  if (product) requestPanel({ mode: 'edit', product })
})

document.addEventListener('click', event => {
  if (!panelMode || panelHost.contains(event.target) || alertHost.contains(event.target)) return
  if (event.target.closest('.cms-controls')) return
  if (event.target.closest('[data-product-id]')) return
  requestPanel(null)
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && panelMode && !alertHost.innerHTML) requestPanel(null)
})

panelHost.addEventListener('click', event => {
  if (event.target.closest('.panel-close')) requestPanel(null)
  const step = event.target.closest('[data-step]')
  if (step) {
    const input = panelHost.querySelector('#draft-stock')
    updateDraft('stock', Math.max(0, Number(input.value || 0) + Number(step.dataset.step)))
    input.value = draft.stock
  }
  if (event.target.id !== 'image-input' && event.target.closest('#image-picker')) panelHost.querySelector('#image-input').click()
  if (event.target.closest('#save-product')) saveDraft()
  if (event.target.closest('#delete-product')) deleteProduct()
})

panelHost.addEventListener('keydown', event => {
  if (event.target.id === 'image-picker' && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    panelHost.querySelector('#image-input').click()
  }
})

panelHost.addEventListener('change', event => {
  if (event.target.id === 'draft-category') {
    const entry = event.target.value.trim()
    const existing = allCategories().find(value => getCategoryLabel(value).toLocaleLowerCase('id') === entry.toLocaleLowerCase('id'))
    updateDraft('category', existing || entry)
  }
  if (event.target.id === 'image-input') readImage(event.target.files?.[0]).catch(() => window.alert('Gambar tidak dapat dibaca.'))
})

panelHost.addEventListener('input', event => {
  const keys = { 'draft-name': 'name', 'draft-price': 'price', 'draft-stock': 'stock' }
  const key = keys[event.target.id]
  if (event.target.id === 'draft-category') {
    event.target.classList.toggle('is-placeholder', !event.target.value)
    const entry = event.target.value.trim()
    const existing = allCategories().find(value => getCategoryLabel(value).toLocaleLowerCase('id') === entry.toLocaleLowerCase('id'))
    updateDraft('category', existing || entry)
  }
  if (key) updateDraft(key, event.target.value)
})

panelHost.addEventListener('keydown', event => {
  if (event.target.id === 'draft-category' && event.key === 'Enter') {
    event.preventDefault()
    const entry = event.target.value.trim()
    const existing = allCategories().find(value => getCategoryLabel(value).toLocaleLowerCase('id') === entry.toLocaleLowerCase('id'))
    updateDraft('category', existing || entry)
    event.target.value = getCategoryLabel(existing || entry)
    event.target.blur()
  }
})

alertHost.addEventListener('click', event => {
  if (event.target.closest('.confirm-cancel')) {
    alertHost.innerHTML = ''
    pendingPanel = null
  }
  if (event.target.closest('.confirm-continue')) {
    const next = pendingPanel
    alertHost.innerHTML = ''
    pendingPanel = null
    if (!next) closePanel()
    else openPanel(next.mode, next.product)
  }
})
