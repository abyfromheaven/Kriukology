# Kriukology Project Architecture Note

**Status**: Documentation-only note (tidak langsung diterapkan). Disusun berdasarkan analisis kode, PRD, dan kebutuhan sidang.

## 1. Alasan Teknis

### 1.1 Mengapa Laravel + PHP (sesuai PRD)
- **PRD sudah seluruhnya Laravel-centric** — *Section 2A berjudul "Mengapa Memilih Backend Laravel 11 (Bukan PHP Native)"* dengan 3 argumen siap pakai (MVC, CSRF/Eloquent PDO binding, migration/validation). Pilih PHP native akan **membantah dokumen sendiri** di depan penguji.
- **PRD menyediakan struktur lengkap** — *Section 4* punya ERD (`products`/`orders`/`order_details`), *Section 290-309* punya tabel named routes (`/checkout`, `/admin/products`, `PATCH /admin/orders/{id}/pay`), serta *Section 251-286* punya folder structure plan Laravel standar.
- **Laravel 11 default = Vite + Tailwind** — frontend sekarang (Vite 6 + Tailwind 3 + vanilla JS) langsung diselaraskan; tidak perlu rewrite templat.
- **SQLite memenuhi alasan "offline demo" PRD 2D** — *"Zero-Configuration (Serverless)"*, *"Local-First Architecture"* untuk embedded kiosk, *"Extreme Portability"* (copy-paste folder).
- **Environment sudah siap** — PHP 8.2.12 + Composer 2.8.11 terdeteksi di mesin ini.

### 1.2 Mengapa tidak PHP Native
- Harus menulis ulang seluruh alur keamanan (CSRF manual, sanitasi SQL manual), struktur folder, dan rute — **lebih banyak kode yang harus dipertanggungjawabkan baris per baris** di sidang.
- Tidak ada *built-in* tools: *Form Validation, File Upload Handler, Database Migration* yang PRD alamiikan untuk mempercepat *development time* (3 hari efektif).

### 1.3 Struktur Folder Disarankan
```
kriukology/
├── app/                      # Backend Laravel (SATU, dipakai KIOSK & ADMIN)
│   ├── Http/Controllers/Admin/   # Controller khusus POS Admin
│   ├── Http/Controllers/Kiosk/   # Controller khusus Self-Ordering Kiosk
│   └── Models/                 # Product, Order, OrderDetail (dipakai kedua app)
├── database/                  # SQLite (satu file, satu skema)
├── routes/web.php
├── resources/
│   ├── views/kiosk/           # Blade view kios
│   └── views/admin/           # Blade view admin
├── kiosk/                     # Frontend app 1 (Self-Ordering Kiosk) — pnpm/Vite
├── admin/                     # Frontend app 2 (POS Admin) — Vite app
├── shared/                    # Kode yang dipakai kedua app (formatRupiah, apiClient, konstanta)
└── public/                    # Aset hasil build
```

### 1.4 Aturan Utama (supaya tetap bersih)
1. **Backend tidak dipecah** — tetap satu `app/`, satu `database/`, satu `routes/web.php`. Kiosk dan Admin cuma konsumen API yang berbeda.
2. **Kode bersama ditaruh di `shared/`** — selalu di-`import` dari sana, **jangan disalin** ke tiap folder.
3. **Tidak ada import lintas antar folder** — `kiosk/` tidak boleh `import` dari `admin/`, hanya dari `shared/`.
4. **Routing**: `/` → kiosk, `/admin` → admin. Keduanya satu origin/port → **tidak perlu CORS**.
5. **Font Geist**: path `../Geist/` di `style.css:49` tetap valid karena diletakkan di root proyek; build Vite akan menyalinnya ke `public/assets/`.

## 2. Mapping File saat ini ke Struktur Baru

| File saat ini | Posisi baru | Catatan |
|---|---|---|
| `src/` (components, data, templates) | `kiosk/` (Vite app) + `admin/` (opsional Vite app) | Pindahkan isi `src/` ke `kiosk/`; `danu-main.js` tetap di `kiosk/` |
| `public/qrcode.js` | `public/` (akses global) | Dipakai keduanya via `<script src="/qrcode.js">` |
| `index.html` / `danu.html` | Entry point keduanya | Vite config dipisah: `input: { kiosk: './index.html', admin: './admin.html' }` |
| `vite.config.js` | Dipisah konfigurasi build kiosk vs admin | `content` di `tailwind.config.js` dipisah ke `./kiosk/**` + `./admin/**` |
| `style.css` | Tetap di root, path `../Geist/` tidak berubah | CSS masih global; alokasi warna merah-putih PRD tetap |
| `package.json` | Tetap minimal (vite, tailwind, fontawesome, animate) | Tanpa qrcodejs2 (diganti script klasik `public/qrcode.js`) |
| `.env` / konfigurasi API base | 1 file di root, akses via `config('app.url')` | QR otomatis ikut `window.location.origin` |

## 3. Alasan Dokumentasi Ini Dibuat
- Menjaga *memory* arsitektur keputusan sebelum implementasi full.
- Menjadi bahan *bahan bincang* (bahan bincang) di sidang: "Kenapa Laravel?", "Mengapa struktur folder gitu?", "Bagaimana cara shared code?".
- Menjadi dasar sebelum developer memulai implementasi full.

---
*Catatan*: Dokumentasi ini dibuat dalam mode *build* untuk mencatat keputusan arsitektur. Implementasi fisik belum dimulai. Blueprint di atas bisa langsung digunakan sebagai acuan bila kemudian keputusan diambil mengintegrasikan backend Laravel + 2 front-end app.