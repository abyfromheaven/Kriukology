import './cms.css'

const placeholderImage = '/assets/menu-placeholder.svg'

let products = []
let categories = []
let activeProductId = null
let panelMode = null
let draft = null
let pendingPanel = null
let pendingTutup = null
let errors = {}
let categoryScreen = null
let categoryDraft = null
let categoryError = ''

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
})[char])
const rupiah = value => `Rp${Number(value || 0).toLocaleString('id-ID')}`
const getCategory = id => categories.find(item => String(item.id) === String(id)) || null
const getCategoryLabel = id => getCategory(id)?.label_id || '—'

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

      <div class="cms-heading">
        <h1>Kelola Produk</h1>
        <button class="manage-category-button" id="manage-categories" type="button">
          Kelola Kategori <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
        </button>
      </div>

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

async function fetchCategories() {
  try {
    const res = await fetch('/api/cms/categories')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    categories = await res.json()
  } catch (error) {
    console.error('Gagal mengambil data kategori dari API server:', error)
  }
}

async function fetchProducts() {
  try {
    const res = await fetch('/api/cms/products')
    if (res.ok) {
      const data = await res.json()
      products = data.map(item => ({
        ...item,
        id: String(item.id),
      }))
      renderGrid()
    }
  } catch (error) {
    console.error('Gagal mengambil data produk dari API server:', error)
  }
}

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
  grid.innerHTML = visibleProducts().map(product => `
    <button class="product-card${Number(product.stock) < 1 ? ' out-of-stock' : ''}" type="button" data-product-id="${escapeHtml(product.id)}" aria-label="${escapeHtml(product.name)}, stok ${Number(product.stock)}">
      <span class="stock-label">Stok: ${Number(product.stock)}</span>
      <img class="product-image" src="${escapeHtml(product.image || placeholderImage)}" alt="${escapeHtml(product.name)}" />
      ${Number(product.stock) < 1 ? '<span class="out-of-stock-label">Stok Habis</span>' : ''}
      <span class="product-category">${escapeHtml(getCategoryLabel(product.category_id))}</span>
      <span class="product-name">${escapeHtml(product.name)}</span>
      <span class="product-price">${rupiah(product.price)}</span>
    </button>`).join('')
}

function openPanel(mode, product = null) {
  panelMode = mode
  activeProductId = product?.id ?? null
  draft = product ? { ...product } : { id: null, name: '', category_id: '', price: '', image: '', stock: 0 }
  errors = {}
  renderPanel()
}

function hasChanges() {
  if (!draft || !panelMode) return false
  if (panelMode === 'add') return Boolean(draft.category_id || draft.name.trim() || draft.price || Number(draft.stock) > 0 || draft.image)
  const original = products.find(product => String(product.id) === String(activeProductId))
  return Boolean(original && ['name', 'category_id', 'price', 'image', 'stock'].some(key => String(draft[key] ?? '') !== String(original[key] ?? '')))
}

function requestPanel(next, setelahTutup = null) {
  if (hasChanges()) {
    pendingPanel = next
    pendingTutup = setelahTutup
    renderConfirmModal()
    return
  }
  if (!next) closePanel()
  else openPanel(next.mode, next.product)
  if (setelahTutup) setTimeout(setelahTutup, 250)
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
  const categoryOptions = categories.map(item =>
    `<option value="${escapeHtml(item.id)}"${String(item.id) === String(draft.category_id) ? ' selected' : ''}>${escapeHtml(item.label_id)}</option>`).join('')
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
          <select id="draft-category" aria-label="Kategori produk"${!draft.category_id && adding ? ' data-placeholder="Pilih Kategori"' : ''}>
            <option value="">Pilih Kategori</option>
            ${categoryOptions}
          </select>
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
  if (!String(draft.category_id).trim()) { setError('category', messages.category); valid = false }
  if (!String(draft.name).trim()) { setError('name', messages.name); valid = false }
  if (!Number.isFinite(Number(draft.price)) || Number(draft.price) < 1) { setError('price', messages.price); valid = false }
  if (String(draft.stock).trim() === '' || !Number.isInteger(Number(draft.stock)) || Number(draft.stock) < 0 || (panelMode === 'add' && Number(draft.stock) < 1)) {
    setError('stock', panelMode === 'add' ? 'Stok produk belum diisi.' : messages.stock)
    valid = false
  }
  return valid
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
    const url = isEdit ? `/api/cms/products/${activeProductId}` : '/api/cms/products'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    if (res.ok && result.success) {
      await fetchProducts()
      closePanel()
    } else {
      window.alert(result.message || 'Gagal menyimpan produk.')
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menyimpan produk:', error)
    window.alert('Terjadi kesalahan koneksi ke server.')
  } finally {
    if (saveButton) saveButton.disabled = false
  }
}

async function deleteProduct() {
  if (!activeProductId) return

  try {
    const res = await fetch(`/api/cms/products/${activeProductId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    })

    const result = await res.json()
    if (res.ok && result.success) {
      await fetchProducts()
      closePanel()
    } else {
      window.alert(result.message || 'Gagal menghapus produk.')
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menghapus produk:', error)
    window.alert('Terjadi kesalahan koneksi saat menghapus produk.')
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

// ── KELOLA KATEGORI ────────────────────────────────────────────────────────

const IKON_KATEGORI = [
  'fa-solid fa-drumstick-bite', 'fa-solid fa-burger', 'fa-solid fa-cookie-bite',
  'fa-solid fa-ice-cream', 'fa-solid fa-mug-hot', 'fa-solid fa-bowl-food',
  'fa-solid fa-pizza-slice', 'fa-solid fa-cake-candles', 'fa-solid fa-coffee',
  'fa-solid fa-lemon', 'fa-solid fa-pepper-hot', 'fa-solid fa-fish',
  'fa-solid fa-carrot', 'fa-solid fa-wheat-awn', 'fa-solid fa-tag',
  'fa-solid fa-star', 'fa-solid fa-utensils',
]

function openCategoryScreen(mode, category = null) {
  categoryScreen = mode
  categoryDraft = category
    ? { ...category }
    : { id: null, label_id: '', label_en: '', icon: IKON_KATEGORI[0], emoji: '🍗', sort_order: categories.length + 1 }
  categoryError = ''
  renderCategoryScreen()
}

function closeCategoryScreen() {
  categoryScreen = null
  categoryDraft = null
  categoryError = ''
  renderCategoryScreen()
}

function renderCategoryScreen() {
  if (!categoryScreen) return

  const editing = categoryScreen === 'edit'
  const item = categoryDraft
  const jumlahProduk = item?.id ? products.filter(p => String(p.category_id) === String(item.id)).length : 0
  const iconOptions = IKON_KATEGORI.map(icon =>
    `<option value="${icon}"${icon === item.icon ? ' selected' : ''}>${icon.replace('fa-solid ', '')}</option>`).join('')

  panelHost.innerHTML = `
    <aside class="cms-panel" aria-label="Kelola Kategori">
      <button class="panel-close" type="button" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <div class="panel-content">
        <h2 class="panel-title">${editing ? 'Ubah Kategori' : 'Tambah Kategori'}</h2>
        <p class="panel-hint">Kategori ini otomatis muncul sebagai tab baru di kiosk pelanggan.</p>

        <div class="cat-field field-wrap">
          <label for="cat-label-id">Nama Kategori (Indonesia)</label>
          <input id="cat-label-id" type="text" value="${escapeHtml(item.label_id)}" placeholder="Contoh: Menu Musiman" />
          <span class="field-error" data-cat-error="label_id"></span>
        </div>

        <div class="cat-field field-wrap">
          <label for="cat-label-en">Nama Kategori (English)</label>
          <input id="cat-label-en" type="text" value="${escapeHtml(item.label_en)}" placeholder="Example: Seasonal Menu" />
          <span class="field-error" data-cat-error="label_en"></span>
        </div>

        <div class="cat-field field-wrap">
          <label for="cat-icon">Icon Kiosk</label>
          <select id="cat-icon">${iconOptions}</select>
          <span class="cat-icon-preview"><i class="${escapeHtml(item.icon)}" aria-hidden="true"></i></span>
        </div>

        <div class="cat-row">
          <div class="cat-field field-wrap">
            <label for="cat-emoji">Emoji</label>
            <input id="cat-emoji" type="text" maxlength="8" value="${escapeHtml(item.emoji)}" placeholder="🍗" />
          </div>
          <div class="cat-field field-wrap">
            <label for="cat-order">Urutan</label>
            <input id="cat-order" type="number" min="0" max="9999" value="${escapeHtml(item.sort_order)}" />
          </div>
        </div>

        ${editing ? `<p class="cat-usage">Dipakai ${jumlahProduk} produk. Kategori yang masih dipakai produk tidak bisa dihapus.</p>` : ''}
        ${categoryError ? `<p class="cat-error-banner">${escapeHtml(categoryError)}</p>` : ''}

        <div class="panel-actions${editing ? '' : ' single-action'}">
          ${editing ? '<button type="button" class="delete-button" id="delete-category">Hapus</button>' : ''}
          <button type="button" class="save-button" id="save-category">${editing ? 'Simpan' : 'Tambahkan'}</button>
        </div>
      </div>
    </aside>`
}

function updateCategoryDraft(key, value) {
  if (!categoryDraft) return
  categoryDraft[key] = value
  if (key === 'icon') {
    const preview = panelHost.querySelector('.cat-icon-preview i')
    if (preview) preview.className = value
  }
  if (key === 'label_id' || key === 'label_en') {
    const error = panelHost.querySelector(`[data-cat-error="${key}"]`)
    if (error) error.textContent = ''
  }
}

async function saveCategory() {
  if (!categoryDraft) return

  const labelId = String(categoryDraft.label_id || '').trim()
  const labelEn = String(categoryDraft.label_en || '').trim()

  if (!labelId) {
    const error = panelHost.querySelector('[data-cat-error="label_id"]')
    if (error) error.textContent = 'Nama kategori wajib diisi.'
    return
  }
  if (!labelEn) {
    const error = panelHost.querySelector('[data-cat-error="label_en"]')
    if (error) error.textContent = 'Nama English wajib diisi.'
    return
  }

  const payload = {
    label_id: labelId,
    label_en: labelEn,
    icon: categoryDraft.icon,
    emoji: String(categoryDraft.emoji || '🍗').trim() || '🍗',
    sort_order: Number(categoryDraft.sort_order) || 0,
  }

  const editing = categoryScreen === 'edit'
  const saveButton = panelHost.querySelector('#save-category')
  if (saveButton) saveButton.disabled = true

  try {
    const res = await fetch(editing ? `/api/cms/categories/${categoryDraft.id}` : '/api/cms/categories', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    if (res.ok && result.success) {
      await fetchCategories()
      renderGrid()
      // Produk ikut memuat label kategori terbaru
      await fetchProducts()
      if (categoryScreen === 'add') closeCategoryScreen()
      else openCategoryScreen('edit', categories.find(c => String(c.id) === String(result.category.id)))
    } else {
      categoryError = result.message || 'Gagal menyimpan kategori.'
      renderCategoryScreen()
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menyimpan kategori:', error)
    window.alert('Terjadi kesalahan koneksi ke server.')
  } finally {
    const button = panelHost.querySelector('#save-category')
    if (button) button.disabled = false
  }
}

async function deleteCategory() {
  if (!categoryDraft?.id) return

  if (!window.confirm(`Hapus kategori "${categoryDraft.label_id}"?`)) return

  try {
    const res = await fetch(`/api/cms/categories/${categoryDraft.id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    })

    const result = await res.json()
    if (res.ok && result.success) {
      await fetchCategories()
      await fetchProducts()
      renderGrid()
      closeCategoryScreen()
    } else {
      categoryError = result.message || 'Gagal menghapus kategori.'
      renderCategoryScreen()
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menghapus kategori:', error)
    window.alert('Terjadi kesalahan koneksi saat menghapus kategori.')
  }
}

panelHost.addEventListener('input', event => {
  if (categoryScreen) {
    const keys = { 'cat-label-id': 'label_id', 'cat-label-en': 'label_en', 'cat-emoji': 'emoji', 'cat-order': 'sort_order' }
    const key = keys[event.target.id]
    if (key) updateCategoryDraft(key, event.target.value)
    return
  }
  const panelKeys = { 'draft-name': 'name', 'draft-price': 'price', 'draft-stock': 'stock' }
  const panelKey = panelKeys[event.target.id]
  if (panelKey) updateDraft(panelKey, event.target.value)
})

panelHost.addEventListener('change', event => {
  if (categoryScreen) {
    if (event.target.id === 'cat-icon') updateCategoryDraft('icon', event.target.value)
    return
  }
  if (event.target.id === 'draft-category') {
    updateDraft('category_id', event.target.value)
    return
  }
  if (event.target.id === 'image-input') readImage(event.target.files?.[0]).catch(() => window.alert('Gambar tidak dapat dibaca.'))
})

// Inisialisasi awal: kategori dulu (produk butuh kategori_id), lalu produk
fetchCategories().then(fetchProducts)

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

document.querySelector('#manage-categories').addEventListener('click', () => {
  requestPanel(null, () => openCategoryScreen('add'))
})

grid.addEventListener('click', event => {
  const card = event.target.closest('[data-product-id]')
  if (!card) return
  const product = products.find(item => String(item.id) === String(card.dataset.productId))
  if (product) requestPanel({ mode: 'edit', product })
})

document.addEventListener('click', event => {
  if (categoryScreen || !panelMode) return
  if (panelHost.contains(event.target) || alertHost.contains(event.target)) return
  if (event.target.closest('.cms-controls')) return
  if (event.target.closest('[data-product-id]')) return
  requestPanel(null)
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !alertHost.innerHTML) {
    if (categoryScreen) closeCategoryScreen()
    else if (panelMode) requestPanel(null)
  }
})

panelHost.addEventListener('click', event => {
  if (categoryScreen) {
    if (event.target.closest('.panel-close')) closeCategoryScreen()
    if (event.target.closest('#save-category')) saveCategory()
    if (event.target.closest('#delete-category')) deleteCategory()
    return
  }

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

alertHost.addEventListener('click', event => {
  if (event.target.closest('.confirm-cancel')) {
    alertHost.innerHTML = ''
    pendingPanel = null
    pendingTutup = null
  }
  if (event.target.closest('.confirm-continue')) {
    const next = pendingPanel
    const lanjut = pendingTutup
    alertHost.innerHTML = ''
    pendingPanel = null
    pendingTutup = null
    if (next) openPanel(next.mode, next.product)
    else closePanel()
    if (lanjut) setTimeout(lanjut, 250)
  }
})
