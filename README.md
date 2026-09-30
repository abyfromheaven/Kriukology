# Kriukology — Self Ordering Kiosk + CMS

Sistem pemesanan mandiri (kiosk pelanggan) yangyang manages produknya lewat
CMS (manajer). Keduanya terhubung lewat satu database.

```
CMS (manajer)  ──tambah/ubah/hapus produk & kategori──┐
                                                      ├──►  Database  ──►  Kiosk (pelanggan)
Kiosk (pelanggan) ──lihat menu, pesan, bayar───────────┘
```

## Menjalankan

```bash
composer install
npm install
cp .env.example .env          # lalu isi, minimal untuk database
php artisan key:generate
touch database/database.sqlite   # kalau pakai SQLite
php artisan migrate --seed
npm run build                   # WAJIB — hasilnya ditulis ke public/
php artisan serve
```

Buka:

| Halaman | Alamat | Untuk siapa |
|---|---|---|
| Kiosk | `http://localhost:8000/` | Pelanggan |
| CMS | `http://localhost:8000/cms` | Manajer |
| Danu (QRIS) | `http://localhost:8000/danu.html` | simulating pembayaran |

> **Penting:** `npm run build` wajib dijalankan setiap kali mengubah kode
> frontend. Hasil build langsung masuk ke `public/`, jadi `php artisan serve`
> selalu memakai kode terbaru.

### Mode pengembangan

Untuk development dengan hot reload:

```bash
php artisan serve          # terminal 1
npm run dev                # terminal 2 → http://localhost:5173
```

Port 5173 sudah diarahkan ke Laravel secara otomatis, jadi data produk & kategori
tetap terbaca.

## Alur integrasi CMS → Kiosk

1. Manajer buka `/cms`, tambah atau ubah produk.
2. Produk tersimpan ke tabel `products` dan **langsung** jadi bagian dari
   `/api/menu`.
3. Pelanggan buka `/` — grid menu, tab kategori, dan harga ikut berubah.
4. Kategori yang dibuat di CMS langsung muncul sebagai tab baru di kiosk,
   **termasuk kalau belum ada produknya** di kategori tersebut.
5. Stok produk = 0 → produk otomatis mati (abu-abu) di kiosk.
6. Checkout mengurangi stok, jadilangsung terlihat di layar berikutnya.

## Yang bisa dikelola di CMS

**Produk** — nama, kategori, harga, stok, gambar (maks 2 MB).
Produk yang **pernah dipesan tidak bisa dihapus** (agar riwayat pesanan utuh).
Untuk menyembunyikannya, set stoknya jadi 0.

**Kategori** — nama Indonesia, nama English, icon, emoji, urutan tampil.
Kategori yang **masih dipakai produk tidak bisa dihapus**; pindahkan dulu
produknya.

## Struktur data

| Tabel | Isi |
|---|---|
| `categories` | Kategori menu (nama 2 bahasa, icon, emoji, urutan) |
| `products` | Produk — nyambung ke `categories` lewat `category_id` |
| `orders` | Header pesanan (nomor antrean, total, metode bayar, status) |
| `order_details` | Rincian item per pesanan |

Produk yang sudah pernah dibeli terkunci oleh `order_details` (relasi database),
itulah alasan kenapa penghapusan produk dicegol dengan pesan jelas, bukan error.

## Catatan

- **Belum ada login untuk CMS.** `/cms` terbuka untuk siapa pun yang tahu
  alamatnya. Prioritasambahkan autentikasi sebelum dipakai di produksi.
- Kode QRIS masih simulasi, belum tersambung ke penyedia pembayaran sungguhan.
- `dist/` tidak dipakai — build langsung ke `public/`.
