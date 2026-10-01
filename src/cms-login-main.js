import './cms-login.css'

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
})[char])

document.querySelector('#login-app').innerHTML = `
  <div class="login-page">
    <div class="login-kartu">

      <div class="login-kop">
        <img src="/assets/kriukology/logo1.webp" alt="Kriukology" class="login-logo" />
        <img src="/assets/kriukology/banner_kriukology.webp" alt="Kriukology" class="login-banner" />
      </div>

      <h1 class="login-judul">Kelola Produk</h1>
      <p class="login-sub">Masuk untuk mengelola produk Kriukology.</p>

      <form id="form-login" novalidate>
        <div class="login-field">
          <label for="username">Username</label>
          <input id="username" name="username" type="text" autocomplete="username"
            autocapitalize="none" spellcheck="false" required
            placeholder="Masukkan username" />
          <span class="login-error" data-error="username"></span>
        </div>

        <div class="login-field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password"
            required placeholder="Masukkan password" />
          <span class="login-error" data-error="password"></span>
        </div>

        <div class="login-alat" data-error="umum" hidden></div>

        <button type="submit" class="login-tombol" id="tombol-masuk">Masuk</button>
      </form>

      <p class="login-bawah">Halaman ini khusus pengelola. Hubungi administrator bila lupa akses.</p>

    </div>
  </div>
`

const form = document.querySelector('#form-login')
const tombol = document.querySelector('#tombol-masuk')

function bersihkanError() {
  form.querySelectorAll('.login-error').forEach(el => { el.textContent = '' })
  const umum = form.querySelector('[data-error="umum"]')
  umum.hidden = true
  umum.textContent = ''
}

/** Tampilkan satu pesan error di bawah form */
function tampilkanError(pesan) {
  bersihkanError()

  const umum = form.querySelector('[data-error="umum"]')
  umum.textContent = pesan
  umum.hidden = false
}

form.addEventListener('input', () => {
  form.querySelectorAll('.login-error').forEach(el => { el.textContent = '' })
  const umum = form.querySelector('[data-error="umum"]')
  umum.hidden = true
})

form.addEventListener('submit', async event => {
  event.preventDefault()
  bersihkanError()

  const username = form.username.value.trim()
  const password = form.password.value

  if (!username || !password) {
    tampilkanError('Username dan password wajib diisi.')
    return
  }

  tombol.disabled = true
  tombol.textContent = 'Memeriksa...'

  try {
    // CSRF token supaya request ini lolos pemeriksaan Laravel
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content
    const res = await fetch('/cms/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
      },
      body: JSON.stringify({ username, password }),
    })

    const hasil = await res.json()

    if (res.ok) {
      window.location.href = hasil.redirect || '/cms'
      return
    }

    // Gabungkan semua pesan validasi jadi satu baris
    const pesan = Object.values(hasil.errors || {}).flat()
    if (pesan.length) {
      tampilkanError(pesan[0])
    } else {
      tampilkanError(hasil.message || 'Username atau password salah.')
    }
  } catch (error) {
    console.error('Gagal menghubungi server:', error)
    tampilkanError('Tidak ada koneksi ke server.')
  } finally {
    tombol.disabled = false
    tombol.textContent = 'Masuk'
  }
})
