# Roadmap Development — Kriukology (Kiosk + POS/KDS)

**Status**: Dokumen perencanaan development.
**Terakhir diperbarui**: 27 September 2026

---

## 1. Kondisi Awal: Kenapa Terasa Berantakan?

Proyek ini terbagi menjadi dua aplikasi (Kiosk dan POS/KDS) yang **sampai sekarang belum pernah saling terhubung.**

### Sisi Kiosk
- Tampilan sudah bagus — 8 layar berjalan (screensaver → preferensi → menu → keranjang → pembayaran → QRIS/sukses → struk → reset).
- **Tapi menu masih di-hardcode** di `src/data/menu.js` — kiosk tidak pernah memanggil `GET /api/menu`.
- **Checkout tidak pernah dikirim ke server** (`POST /api/checkout`) → nomor antrean masih angka acak `Math.random()`.
- 9 dari 25 produk tidak bisa diakses pelanggan (menu punya 11 kategori, sidebar hanya 7).
- Halaman `/` via Laravel = asset 404 (hasil build tidak di-copy ke `public/`).

### Sisi POS/KDS
- Database, controller, dashboard 3 tab sudah dibuat.
- **Tapi tidak ada yang memakainya secara nyata** — tidak ada pesanan masuk dari kiosk, dan perubahan admin tidak sampai ke kiosk.
- Beberapa tombol error 500, auto-refresh tidak dirender, upload gambar 404, tidak ada login.

### Kesimpulan
> Ada dua rumah yang sudah dibangun, tapi jalan penghubungnya belum dibuat. Masing-masing rumah terlihat lengkap dari luar, tapi tidak ada yang bisa saling berkunjung.

**Prinsip urutan pengerjaan**: perbaiki yang rusak → sambungkan dulu → baru rapikan masing-masing sisi → terakhir perapian akhir.

---

## 2. Tahap 0 — Perbaiki Fondasi (Bug yang Bikin Rusak)

**Kenapa duluan?** Agar saat testing tidak tertukar antara "error karena rusak" dengan "error karena belum disambungkan."

### 0.1. Tombol "Panggil Antrean" selalu error 500
- **Lokasi**: `app/Http/Controllers/Admin/LobbyController.php:13`
- **Masalah**: memakai `->last()` yang bukan fungsi Eloquent Builder → `BadMethodCallException`.
- **Akibat**: setiap klik tombol panggil = HTTP 500. JS menelan errornya sehingga suara tetap bunyi, tapi server tidak memproses apa pun.
- **Fix**: ganti dengan `->orderByDesc('created_at')->first()`.

### 0.2. Auto-refresh tidak mempengaruhi tampilan
- **Lokasi**: `resources/views/admin/dashboard.blade.php` (Tab 2 & Tab 3).
- **Masalah**: polling 5 detik sudah jalan dan data JS sudah diupdate, tapi tabel/kartu dirender oleh Blade (`@forelse`) saat load pertama — JS tidak punya izin mengubahnya.
- **Akibat**: pesanan baru dari kiosk tidak pernah muncul sampai reload manual.
- **Fix**: ubah bagian Tab 2 (kartu KDS) dan Tab 3 (2 kolom lobi) menjadi render Alpine.js `x-for` di atas state JS; panggil `muatUlangData()` saat ganti tab.

### 0.3. Upload gambar, error validasi, hapus produk bermasalah
- **Gambar 404**: belum jalan `php artisan storage:link`, path gambar tidak pakai `asset()`/`Storage::url()`.
  - Lokasi: `ProductController.php:25`, `dashboard.blade.php:137`.
- **Error validasi tak terlihat**: `showModal` selalu `false` setelah redirect, input tidak pakai `old()` → pesan `@error` tersembunyi.
  - Lokasi: `dashboard.blade.php:456` (showModal), `:381,391,401,423` (input tanpa old()).
- **Hapus produk kena FK restrict → 500**: produk yang pernah dipesan ditolak database, tapi error tidak ditangani; urutan salah (file gambar dihapus sebelum `$product->delete()` gagal).
  - Lokasi: `ProductController.php:38-47`.
- **Fix**: `storage:link` + `asset()`; `showModal: @js($errors->any())` + `old()`; bungkus delete dengan try/catch `QueryException` + pindahkan `Storage::delete` setelah delete sukses + pesan "produk sudah dipakai pesanan".

### 0.4. Halaman Kiosk tidak bisa dibuka lewat Laravel
- **Lokasi**: `routes/web.php:12-14` (serve `index.html`), `index.html:16` (panggil `/src/main.js`).
- **Masalah**: `public/src/` tidak ada → asset 404 → halaman kiosk blank tanpa `npm run dev`.
- **Fix**: `npm run build` → salin hasil `dist/` ke `public/`.

---

## 3. Tahap 1 — Sambungkan Kiosk ↔ Backend (INTI)

**Kenapa tahap paling penting?** Inilah jawaban atas pertanyaan awal: *"bagaimana produk bisa ditambahkan ke kiosk?"* — lewat POS yang menulis ke database, lalu kiosk membaca dari database. Tanpa tahap ini, kerjaan POS tidak ada gunanya dan KDS tidak ada pesanan.

### 1.1. Kiosk ambil menu dari server
- **Sebelum**: kiosk import `src/data/menu.js` (hardcode).
- **Sesudah**: saat dibuka, kiosk `fetch('/api/menu')` → tampilkan data dari server.
- **Route/controller sudah jadi**: `GET /api/menu` → `Kiosk/MenuController.php`.
- **Efek**: setiap tambah/hapus/ubah produk di POS → kiosk langsung berubah (real-time sync, value proposition PRD).

### 1.2. Kiosk kirim pesanan ke server
- **Sebelum**: checkout hanya menyimpan di memori browser + nomor acak → layar sukses.
- **Sesudah**: sebelum layar sukses, kiosk `POST /api/checkout` dengan keranjang.
- **Route/controller sudah jadi**: `Kiosk/OrderController.php` — termasuk **re-harga total dari database** (Edge Case 2 PRD). Saat ini kode mati karena tak ada yang memanggil.
- **Efek**: pesanan langsung muncul di tab KDS dapur (nomor urut #001, detail item, status pending).

### 1.3. Nomor antrean dari backend
- **Sebelum**: `Math.floor(Math.random()*900)+100` → bisa duplikat, tidak berurutan.
- **Sesudah**: kiosk membaca `order_number` yang dikembalikan server (`#001`, `#002`, ...).
- **Generator sudah jadi**: `OrderController.php:45-50`.

### 1.4. Kirim info pembayaran + kustomisasi
- **Sebelum**: `payment_method` dipaksa `'cash'` di backend; kolom `options` selalu kosong.
- **Sesudah**: kiosk mengirim metode bayar asli dan opsi kustomisasi → data lengkap untuk juru masak.

### Hasil setelah Tahap 1 (bisa didemokan end-to-end):
> Admin tambah produk di POS → muncul di kiosk → pelanggan pesan → muncul di KDS → kasir konfirmasi bayar → pindah kolom lobi → dipanggil.

---

## 4. Tahap 2 — Kelarikan Kiosk (Nilai Jual Utama)

Dikerjakan **setelah Tahap 1** karena sebagian fitur butuh data dari database.

### 2.1. Perbaiki kategori menu (BUG: 9 produk hilang)
- **Masalah**: `src/data/menu.js` punya 11 kategori, `src/data/kategori.js` sidebar hanya 7.
- **Akibat**: kategori `lto`, `box`, `beverage`, `breakfast` (9 produk) **tidak bisa diakses pelanggan** — tidak ada tombol sidebar-nya.
- **Fix**: selaraskan daftar kategori (idealnya ambil dari database).

### 2.2. Modal kustomisasi paket
- **Status**: kamus teks sudah ada (`kamus.js:55-58`: `chooseCut/chooseDrink/chooseSauce/addCart`), kolom DB `options` sudah ada, **UI modal belum dibuat** (`kiosk.js:215,524-529` selalu kosong).
- **Fix**: buat modal pilihan potongan ayam (paha/dada), minuman, saus → isi kolom `options`.

### 2.3. Input nomor meja
- **Status**: PRD mewajibkan (Modul 1C/1E), tapi **tidak ada sama sekali** (grep `meja|table` = 0).
- **Fix**: input di kiosk → kolom DB → tampil di struk & kartu KDS (untuk pelayan mengantar).

### 2.4. Lengkapi alur pembayaran
- **Cash**: input uang diberikan → hitung kembalian → sukses (sebelumnya langsung lompat sukses).
- **Debit**: animasi mesin EDC/gesek kartu (sesuai PRD).
- **QRIS**: simulasi lokal (BroadcastChannel) **boleh dipertahankan** — gateway asli di luar scope proyek sekolah.

---

## 5. Tahap 3 — Kelarikan POS/KDS

Dikerjakan **setelah Tahap 1** karena baru bisa diuji kalau sudah ada pesanan mengalir.

### 3.1. Edit / ubah harga produk (WAJIB — ada di PRD)
- **Status**: admin hanya bisa tambah & hapus — **tidak bisa ubah**. Tidak ada route `PATCH`, tidak ada controller, tidak ada UI.
- **Padahal**: syarat "Edge Case 2" PRD (ubah harga saat pelanggan transaksi → hitung ulang). Tanpa ini, edge case tidak bisa didemokan.
- **Fix**: route `PATCH /admin/products/{product}` + controller `update()` + tombol/modal edit.

### 3.2. Login / pengaman halaman admin
- **Status**: `/admin` terbuka untuk semua orang di jaringan — tanpa auth (`routes/web.php:23` tanpa middleware).
- **Padahal**: PRD menyebut "Fase Otentikasi" dan "jalur /admin dibentengi".
- **Fix**: login sederhana (satu akun admin) + `->middleware('auth')` — tidak perlu sistem role kompleks.

### 3.3. Real-time penuh + reset antrean harian
- Pastikan semua transisi status terlihat tanpa reload manual (lanjutan Tahap 0.2).
- **Masalah**: kolom "SILAKAN AMBIL" mengambil semua `completed` sepanjang masa → menumpuk nomor usang.
- **Fix**: filter tanggal hari ini / tombol reset harian.

### 3.4. (Opsional) Laporan keuangan sederhana
- PRD menyebut "visualisasi laporan keuangan" — bisa bersifat nilai plus.
- **Kandidat pertama untuk di-skip** kalau waktu mepet.

---

## 6. Tahap 4 — Perapian Akhir & Deployment

### 4.1. Satu server saja (hilangkan 2 server)
- **Sekarang**: butuh `php artisan serve` + `npm run dev` (kiosk berupa JS belum dibundel).
- **Fix**: `npm run build` → salin `dist/` ke `public/` → cukup `php artisan serve` untuk kiosk + POS + API.
- **Manfaat**: minim kejadian "lupa nyalakan server ini itu" saat sidang.

### 4.2. Audio `dingdong.mp3` sesuai PRD
- Sekarang: sintetis Web Audio API (sudah bunyi, tapi bukan file mp3 seperti PRD:77,124,132).
- Boleh dibiarkan (fungsi sudah ada) atau diganti file mp3 asli.

### 4.3. Mode offline & dokumentasi
- Tailwind/Alpine/Font Awesome masih dari **CDN (internet)** → kalau lobi offline, dashboard mati. Perlu dipindah ke build lokal.
- **README basi**: masih menyebut "Laravel, POS, KDS dapat ditambahkan di tahap berikutnya" — padahal sudah ada.
- Docblock `src/data/pembayaran.js:8-14` menyebut 5 metode, isi array cuma 3.

---

## 7. Ringkasan Urutan & Alasan

```
Tahap 0: Perbaiki yang RUSAK
   ↓  supaya testing tidak tertukar antara "rusak" vs "belum disambung"
Tahap 1: SAMBUNGKAN Kiosk ↔ Backend
   ↓  ini yang bikin sistem "hidup" — jawaban atas masalah awal
Tahap 2: Lengkapi KIOSK
   ↓  nilai jual utama, butuh data dari database yang baru tersambung
Tahap 3: Lengkapi POS/KDS
   ↓  baru bisa diuji kalau sudah ada pesanan mengalir dari kiosk
Tahap 4: Rapikan & Deploy
```

**Jangan** langsung melengkapi semua fitur kiosk tanpa menyambungkan — fitur itu harus dirombak ulang begitu tahu bentuk data dari database.
**Jangan** terlalu lama fokus ke POS — tanpa kiosk tersambung, tidak ada cara membuktikan POS bekerja.

---

## 8. Referensi Bug / Temuan Teknis

| Kode | Deskripsi | Lokasi |
|------|-----------|--------|
| B1 | Auto-refresh tidak dirender (tanpa `x-for`) | `dashboard.blade.php` Tab 2 & 3 |
| B2 | Upload gambar 404 (tanpa `storage:link` + `asset()`) | `ProductController.php:25` |
| B3 | Error validasi tak terlihat (modal selalu tertutup, tanpa `old()`) | `dashboard.blade.php:456` |
| B4 | Setiap aksi reset tab ke Tab 1 (`activeTab` hardcoded) | `dashboard.blade.php:455` |
| B5 | Tombol Panggil Antrean 500 (`->last()` bukan fungsi Eloquent) | `LobbyController.php:13` |
| B6 | Hapus produk kena FK restrict 500 + urutan hapus gambar salah | `ProductController.php:38-47` |
| B7 | Kolom "SILAKAN AMBIL" tak pernah dibersihkan (tanpa filter tanggal) | `DashboardController.php:21,34` |
| B8 | Kiosk via Laravel rusak (asset di `dist/`, bukan `public/`) | `routes/web.php:12-14` |
| B9 | Deviasi PRD: Alpine + Tailwind via CDN, bukan Vanilla JS + NPM | `dashboard.blade.php:10-11` |
| — | 9 produk tak terakses (11 kategori vs sidebar 7) | `data/menu.js` vs `data/kategori.js` |
| — | Kiosk nol `fetch` — tak pernah panggil API | seluruh `src/` |
| — | Nomor antrean acak, bukan dari backend | `kiosk.js:264-265` |
| — | Tidak ada edit/ubah harga produk | `routes/web.php` |
| — | Tidak ada auth di `/admin` | `routes/web.php:23` |
| — | File `default-chicken.png` tidak ada (fallback rusak) | seluruh repo |
