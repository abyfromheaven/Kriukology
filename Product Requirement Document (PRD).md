# 1. Project Overview & Objectives
- **Nama Produk:** PahaDada.id (Sebuah aplikasi _Self-Ordering Kiosk_ / Kasir Mandiri berbasis Web Restoran Cepat Saji).
- **Problem Statement:** 
	1. **Antrean Panjang & Konvensional:**
        Proses pemesanan makanan di kasir konvensional seringkali memicu antrean panjang yang membuat pelanggan mengalami _mager_ (malas gerak/antre) dan membuang waktu.
    2. **Keterbatasan Interaksi Sosial (Kaum Introver):** Berdasarkan tren perilaku Gen Z, banyak pelanggan yang merasa kurang nyaman atau malas melakukan interaksi sosial yang bertele-tele dengan petugas kasir hanya untuk memilih menu makanan.
    3. **Privasi & Keamanan Data Kasir:** Sistem kasir konvensional (_Back-Office_) menyimpan data sensitif perusahaan (seperti laporan keuangan harian dan token admin) sehingga tidak aman jika diletakkan di area publik yang menghadap langsung ke pelanggan.
- **Value Proposition:**
	1. **Anti Antre-Antre Club (Self-Service Efisien):**
        Memangkas waktu tunggu dengan memindahkan kendali pemesanan penuh ke tangan pelanggan melalui layar sentuh mandiri. Pelanggan datang, ketuk layar, bayar, dan tinggal menunggu nomor antrean dipanggil.
    2. **Kaum Introvert Friendly (Anti-Social Order):** Menyediakan pengalaman memesan makanan yang personal, cepat, dan minim interaksi sosial, tanpa adanya tekanan psikologis saat memilih-milih menu di depan kasir.
    3. **Visual Rich & Multimedia Immersive:** Menyajikan antarmuka yang sangat atraktif dengan standar industri modern menggunakan Tailwind CSS, dilengkapi dengan animasi transisi yang halus, video promosi yang terintegrasi, dan _sound effect_ interaktif untuk meningkatkan _user experience_.
    4. **Aman Secara Arsitektur:** Memisahkan antarmuka publik pelanggan (_Front-Facing Kiosk_) dengan sistem manajemen data internal, menjadikannya sistem yang ramah privasi dan aman untuk diekspos di lobi restoran.
- **Target Audience:**
	- 1. **Pelanggan Restoran Cepat Saji (Utamanya Gen Z & Milenial):**
        Konsumen modern yang mengutamakan kecepatan, kepraktisan, kebebasan memilih menu, dan melek teknologi digital.
    2. **Kaum Introver:** Pelanggan yang lebih memilih memesan makanan secara mandiri tanpa harus berkomunikasi langsung dengan staf kasir.
    3. **Manajemen Restoran Lokal (Dunia Nyata):** Sebagai solusi digitalisasi bagi pemilik usaha kuliner cepat saji lokal yang ingin meningkatkan efisiensi operasional tanpa risiko kebocoran data sensitif.
---
# 2. Tech Stack & Architecture Constraints (Batasan Teknologi)
### 1. Frontend
1. **State Management & Interaktivitas Keranjang: Alpine.js**
	- **Apa itu?** Alpine.js adalah _framework_ JavaScript super ringan yang sering dijuluki "Tailwind-nya JavaScript". Ukurannya kecil dan kodenya langsung ditulis di dalam tag HTML (mirip Tailwind).
	- **Alasan:** Jika menggunakan JavaScript murni (Vanilla JS) untuk fitur keranjang belanja (tambah ayam, kurang ayam, hitung total harga secara _real-time_), kodenya akan panjang dan rawan _error_ DOM. Jika menggunakan Vue.js atau React, waktu belajar kamu tidak akan cukup dalam 3 hari. **Alpine.js adalah jalan tengah yang sempurna.**
2. **Animasi & Desain Grafis: Tailwind Transitions + Animate.css**
	- **Alasan:** Kriteria tugas meminta desain dan animasi yang menarik. Cukup andalkan _class_ transisi bawaan Tailwind untuk efek kartu makanan yang membesar halus saat disentuh.
	- **Tambahan:** Kamu bisa menyelipkan _library_ **Animate.css** khusus untuk animasi _pop-up_ modal pembayaran agar terlihat sangat mulus dan interaktif.
3. **Audio & Video Multimedia: HTML5 Audio API & Youtube Iframe API**
	- **Alasan:** Untuk memicu _sound effect_ "Tap" saat memilih menu dan suara "Sukses" saat selesai bayar, HTML5 Audio API bawaan _browser_ sudah lebih dari cukup dan hanya butuh 2 baris kode JavaScript. Untuk video promosi di halaman depan, kita cukup menggunakan `<iframe>` standar YouTube yang diatur `autoplay=1` dan `mute=1`.
4. **CSS Framework: Tailwind CSS (via package manager)**
	- **Optimasi Performa Industri (Production Ready):** Penggunaan NPM memungkinkan proses _purging_ otomatis oleh Vite. Sistem hanya akan mengompilasi _utility classes_ yang benar-benar digunakan, sehingga ukuran file CSS akhir menjadi sangat kecil dan ringan untuk performa mesin Kiosk.
    - **Kemudahan Manajemen Dependensi:** Mempermudah integrasi dengan _library_ frontend modern lainnya (seperti Alpine.js atau Animate.css) dalam satu ekosistem _build tools_ yang rapi dan terstruktur.
    - **Fleksibilitas Kustomisasi:** Membuka akses penuh ke file `tailwind.config.js` untuk mempermudah pengaturan tema lokal, warna khas _branding_ **PahaDada.id**, serta konfigurasi animasi kustom tanpa menumpuk kode di file HTML.

---
### 2. Backend
**PHP + Laravel**
- **Alasan Pemilihan & Keunggulan:**
    1. **Arsitektur Standar Industri (Enterprise Ready):** Menggunakan pola MVC yang memisahkan logika bisnis (_Controller_), representasi data (_Model_), dan antarmuka visual (_View_). Membuat kode terstruktur rapi dan mudah dipahami saat proses pembedahan kode oleh penguji.
    2. **Keamanan Berlapis Bawaan (Built-in Security):** Menyediakan perlindungan otomatis terhadap celah keamanan web kritis seperti _Cross-Site Request Forgery_ (melalui token `@csrf` pada form) dan enkripsi data sensitif secara instan.
    3. **Efisiensi Waktu Pengembangan (Rapid Development):** Memiliki fitur bawaan yang lengkap seperti _Form Validation_, _Routing_ yang bersih, serta integrasi _native_ dengan SQLite, memungkinkan seluruh logika CRUD _back-office_ dan pemesanan selesai tepat waktu sebelum hari Senin.
---
### 3. Database
**SQLite (via Laravel Eloquent ORM):**
**Alasan Pemilihan & Keunggulan:**
	- **Zero-Configuration & Serverless Architecture:** SQLite tidak membutuhkan proses _daemon/service_ eksternal yang berjalan di latar belakang. Seluruh database disimpan dalam satu file lokal di dalam project, meminimalisasi risiko kegagalan koneksi _service_ saat demo aplikasi di ruang sidang.
	- **Portabilitas Tinggi (Portable):** Mempermudah pemindahan seluruh ekosistem proyek dari laptop pribadi ke laptop sekolah/penguji hanya dengan menyalin folder proyek tanpa perlu melakukan _export-import_ file `.sql` via phpMyAdmin.
	- **Sesuai Karakteristik Perangkat Kiosk:** Di dunia industri nyata, mesin _Self-Ordering Kiosk_ mandiri sering kali dirancang menggunakan arsitektur _local-first application_ yang tertanam langsung di mesin gudang/lobi demi kecepatan respon transaksi yang instan tanpa ketergantungan latensi jaringan server.

---
# 3. Core Features & User Stories (Spesifikasi Fitur)
### 1. Front-Facing Self-Ordering Kiosk
#### 1. User Story
- Sebagai: Pelanggan Restoran (Utamanya Gen Z / Kaum Introver).
- Saya ingin: Memilih menu paket makanan, mengustomisasi isian komponen paket, memilih tempat makan, menginput nomor meja secara mandiri, dan melakukan simulasi pembayaran langsung melalui layar mesin kios.
- Agar: Saya bisa mendapatkan makanan dengan cepat, tidak perlu mengantre lama di kasir konvensional, terhindar dari interaksi sosial yang tidak perlu, dan mendapatkan nomor antrean yang valid dengan pengalaman visual multimedia yang menarik.
---
#### 2. System & User Flow (Langkah demi Langkah)
Berikut adalah visualisasi alur sistem dari awal hingga akhir transaksi:

```unset
[Lockscreen/Idle] ──(Sentuh Layar)──> [Pilih Bahasa & Makan] ──> [Main Menu & Kategori]
                                                                        │
[Review Struk Akhir] <──(Simulasi Sukses)── [Pilih Payment] <──(Input Meja) <──(Klik Menu Paket)
```

1. Fase Screensaver (Lockscreen)
    
    - User: Melihat layar monitor yang menampilkan _looping_ video promosi dan _slider_ poster ayam goreng. User mengetuk tombol _"Mulai Pesanan / Order Here"_.
    - Sistem: Memicu Sound Tap, menghentikan video, dan mengalihkan halaman ke opsi preferensi.
    
2. Fase Preferensi Awal
    
    - User: Memilih bahasa (Indonesia / English) dan memilih tipe makan (Dine In / Take Away) dalam satu halaman yang sama.
    - Sistem: Menyimpan pilihan user ke dalam _state memory_ (Alpine.js) dan membuka halaman menu utama.
    
3. Fase Menu Utama & Kategori
    
    - User: Melihat daftar menu. User berpindah kategori menggunakan menu vertikal di sisi kiri (Tab Rekomendasi terbuka otomatis di awal). User melihat status keranjang (_floating bar_) ter-update di bawah layar.
    - Sistem: Menampilkan produk berdasarkan kategori secara dinamis dari database SQLite. Setiap perpindahan kategori memicu Sound Tap.
    
4. Fase Kustomisasi Paket (Pop-up Modal)
    
    - User: Mengeklik salah satu jenis menu paket. Muncul _pop-up_ kustomisasi. User memilih komponen isi paket (Contoh: Pilih Paha/Dada ➔ Pilih Pepsi/Tebs ➔ Pilih Saus). User mengeklik "Tambah ke Keranjang".
    - Sistem: Menampilkan pilihan varian secara bertahap. Ketika tombol tambah diklik, sistem memicu animasi _splash_ "Menu Ditambahkan", memperbarui total harga di _bottom bar_, dan mengembalikan user ke halaman utama pesanan agar bisa menambah menu lain.
    
5. Fase Peninjauan Keranjang (Cart Review)
    
    - User: Mengeklik tombol _"Lihat Pesanan Saya"_ di samping total harga. User meninjau daftar pesanan, mengubah kuantitas jika perlu, lalu mengeklik _"Selesaikan Pesanan"_.
    - Sistem: Menampilkan rekapitulasi seluruh item paket yang dipilih beserta kalkulasi harga akhir.
    
6. Fase Logistik Pengantaran
    
    - User: Memilih metode penerimaan makanan: "Antar Ke Meja" atau "Ambil di Kasir". Jika memilih antar ke meja, user mengetik nomor meja pada _keyboard_ numerik yang muncul di layar.
    - Sistem: Jika user memilih antar ke meja, sistem memvalidasi input nomor meja sebelum mengizinkan user lanjut ke halaman pembayaran.
    
7. Fase Simulasi Pembayaran
    
    - User: Memilih metode pembayaran (QRIS, E-Wallet, M-Banking, Debit, atau Cash). User melakukan _scanning_ statis atau gesek kartu tiruan, lalu mengetuk tombol tersembunyi "Simulasi Sukses".
    - Sistem: Memproses data via POST ke _backend_ Laravel tanpa API _gateway_ eksternal. Sistem mengenerate nomor antrean harian otomatis (`PD-001`, `PD-002`, dst) dan menyimpan transaksi ke database dengan status `paid` (atau `pending` jika memilih metode Cash).
    
8. Fase Struk Akhir & Splash Thank You
    
    - User: Melihat _splash screen_ "Terima Kasih" dan mendengarkan Sound Sukses. Layar langsung menampilkan visualisasi struk digital berisi Nomor Antrean besar, Detail Belanja, Nomor Meja, dan Metode Bayar.
    - Sistem: Setelah 15 detik menampilkan struk di layar, sistem otomatis melakukan _clear session_ dan kembali ke Fase 1 (Lockscreen).
    

---

#### 3. Logic & Edge Cases (Aturan Main & Validasi Error)

- Aturan Main Keranjang Belanja (Cart Logic):
    
    - Harga total yang dikirim ke _backend_ harus dihitung ulang berdasarkan ID produk yang terdaftar di database SQLite untuk mencegah manipulasi data harga di sisi _client/inspect element_.
    - Setiap halaman pesanan wajib memiliki tombol "Reset / Mulai Dari Awal" untuk menghapus seluruh _state_ keranjang jika pelanggan ingin membatalkan semua pesanan secara instan.
    
- Edge Case 1: Pengguna Meninggalkan Mesin Kiosk di Tengah Jalan (Idle Timeout)
    
    - _Kondisi:_ Pengguna pergi begitu saja saat sedang memilih menu atau berada di halaman keranjang tanpa menyelesaikan transaksi.
    - _Logika Sistem:_ Sistem memasang _timer window_ selama 60 detik. Jika tidak ada aktivitas sentuhan/klik sama sekali, sistem akan menghapus seluruh isi keranjang (_clear session_) secara otomatis dan kembali ke halaman Lockscreen awal.
    
- Edge Case 2: Input Nomor Meja Kosong atau Tidak Valid
    
    - _Kondisi:_ Pengguna memilih opsi "Antar Ke Meja" tetapi langsung mengeklik tombol "Lanjut" tanpa mengisi nomor meja, atau mengisi angka `0`.
    - _Logika Sistem:_ Tombol "Lanjut" akan terkunci (_disabled_) atau memicu _pop-up error alert_ merah bertuliskan _"Silakan masukkan nomor meja yang valid (1-99)"_.
    
- Edge Case 3: Checkout Tanpa Item di Keranjang (Empty Cart)
    
    - _Kondisi:_ Pengguna mencoba mengakses halaman `/checkout` atau `/review` secara langsung dengan menembak URL browser.
    - _Logika Sistem:_ _Backend_ Laravel akan melakukan pengecekan data session/request. Jika keranjang kosong, sistem otomatis melakukan _redirect_ paksa kembali ke halaman `kiosk.menu` disertai pesan peringatan.
    
---
### 2. POS Kasir
#### 1. User Story

- Sebagai: Manajemen Restoran / Kasir Utama PahaDada.id.
- Saya ingin: Mengelola master data produk (menu paket, harga, stok, gambar) dan memantau pesanan yang masuk dari mesin kiosk secara _real-time_.
- Agar: Operasional restoran berjalan lancar, menu di layar kiosk selalu diperbarui, dan pesanan pelanggan dapat diproses serta dipanggil sesuai nomor antrean.
#### 2. Core Features (Fitur Utama Dashboard Admin)

Untuk menghemat waktu pengerjaan, seluruh fitur ini diletakkan dalam satu halaman admin utama (`/admin`) yang dibagi menjadi 3 Tab Navigasi menggunakan Tailwind CSS (tanpa memisahkannya menjadi banyak halaman/file):

#### Tab 1: Manajemen Produk (Product CRUD)

Pusat pengelolaan menu ayam dan minuman yang tampil di Kiosk.

- Lihat Menu (Read): Tabel rapi yang menampilkan Gambar Menu, Nama, Kategori, dan Harga.
- Tambah Menu Baru (Create): Form input sederhana di dalam _pop-up modal_ untuk memasukkan Nama Menu, Harga, Kategori (`paket`, `alacarte`, `minuman`, `cemilan`), dan tombol _upload_ file gambar menu.
- Hapus Menu (Delete): Tombol aksi cepat untuk menghapus menu yang sudah tidak dijual (stok kosong/tidak berlaku).

#### Tab 2: Kitchen Display System (KDS Mockup - Order Tracker)

Menampilkan pesanan yang masuk dari mesin Kiosk secara berurutan untuk pihak dapur/kasir.

- Tabel Pesanan Masuk: Menampilkan Nomor Antrean, Tipe Order (Dine In/Take Away), Lokasi (Nomor Meja / Ambil di Kasir), Detail Item yang dibeli, dan Total Harga.
- Aksi Status Bayar (Khusus Metode Cash): Tombol "Konfirmasi Pembayaran" untuk pesanan yang memilih metode _Cash di Kasir_. Begitu diklik, status berubah dari `pending` menjadi `paid`.
- Tombol "Selesaikan Pesanan": Mengubah status pesanan dari `paid` menjadi `completed` jika makanan sudah diserahkan ke pelanggan, sehingga pesanan hilang dari daftar antrean aktif di dapur.

#### Tab 3: Monitor Antrean Pelanggan (Queue Monitor Screen)

Simulasi layar TV monitor lobi restoran untuk memanggil nomor antrean pelanggan.

- Kolom "Sedang Diproses": Menampilkan daftar nomor antrean yang statusnya `paid` (sedang dimasak/disiapkan di dapur).
- Kolom "Silakan Ambil": Menampilkan nomor antrean yang baru saja diselesaikan oleh kasir di Tab 2.
- _Trik Sidang:_ Berikan satu tombol "Panggil Antrean" yang jika diklik akan memicu Sound "Ding-Dong" atau suara robot pembaca nomor antrean (memenuhi aspek nilai multimedia dari guru produktif).

---

#### 3. Logic & Edge Cases (Aturan Main & Validasi Admin)

- Logic Sinkronisasi Data: Setiap kali admin menghapus produk atau menambahkan produk baru di Tab 1, data di database SQLite akan langsung berubah, dan layar Kiosk pelanggan di depan otomatis menampilkan perubahan tersebut saat diakses/di-refresh.
- Edge Case: Penanganan File Gambar Produk:
    
    - _Kondisi:_ Admin mengunggah menu ayam baru tetapi lupa memasukkan file gambar.
    - _Logika Sistem:_ Backend Laravel akan memberikan validasi `required|image` pada form. Jika kosong, sistem menampilkan pesan error merah, atau secara otomatis memasang gambar _placeholder_ bawaan bernama `default-chicken.png` agar tampilan Kiosk pelanggan tidak pecah/rusak.
---
# 4. Data Models & Database Schema (Struktur Data)
## 1. Database Models (Entity Relationship)
Karena proyek ini menggunakan SQLite, tipe data yang digunakan disesuaikan dengan tipe data primitif SQLite (`INTEGER`, `TEXT`). Relasi antar-tabel dikunci menggunakan konstanta _Foreign Key_ bawaan Eloquent ORM.

```unset
+------------------+             +------------------+             +-------------------------+

|     products     |             |      orders      |             |      order_details      |
+------------------+             +------------------+             +-------------------------+

| id (PK)          |             | id (PK)          |             | id (PK)                 |
| name (TEXT)      |             | queue_num (TEXT) |<----------- | order_id (FK)           |
| price (INTEGER)  |             | total (INTEGER)  |             | product_id (FK) --------+
| category (TEXT)  |             | type (TEXT)      |             | combo_details (TEXT)    | |
| image (TEXT)     |             | table_num (TEXT) |             | quantity (INTEGER)      | |
+------------------+             | payment (TEXT)   |             | subtotal (INTEGER)      | |

                                 | status (TEXT)    |             +-------------------------+ |
                                 +------------------+                                         |
                                          ^                                                   |
                                          +---------------------------------------------------+
```

## A. Tabel: `products` (Master Data Menu)

Menyimpan data item menu tunggal yang dapat dimasukkan ke dalam paket (_combo_).

- `id` (INTEGER, Primary Key, Auto Increment)
- `name` (TEXT) — Nama menu (Contoh: "Ayam Paha Bawah", "Nasi Putih", "Pepsi XL").
- `price` (INTEGER) — Harga item jika dijual ala carte (jika di dalam paket, nilainya bisa di-set `0` untuk penambah komponen).
- `category` (TEXT) — Pengelompokan komponen menu (`chicken`, `rice`, `drinks`, `addons`).
- `image` (TEXT) — Jalur nama file gambar di dalam folder publik.

## B. Tabel: `orders` (Transaksi Utama Kiosk)

Mencatat data utama dari pesanan yang dibuat oleh pelanggan di mesin _kiosk_.

- `id` (INTEGER, Primary Key, Auto Increment)
- `queue_number` (TEXT) — Nomor antrean unik harian (Contoh: `PD-001`).
- `total_price` (INTEGER) — Total harga akhir yang harus dibayar.
- `order_type` (TEXT) — Pilihan tipe makan (`dine_in`, `take_away`).
- `table_number` (TEXT, Nullable) — Nomor meja jika memilih opsi antar ke meja.
- `payment_method` (TEXT) — Metode pembayaran (`QRIS`, `DEBIT`, `CASH`).
- `status` (TEXT) — Status pelacakan untuk KDS (`pending`, `paid`, `completed`).
- `timestamps` (`created_at` dan `updated_at`)

## C. Tabel: `order_details` (Detail Transaksi / Item Paket - _One-to-Many_)

Mencatat rincian item paket yang dibeli. Karena alur pemesanan menginginkan pemilihan komponen di dalam satu paket (pilih ayam, pilih minum), detail pilihan komponen tersebut disimpan dalam bentuk format JSON teks (`TEXT`) di kolom `combo_details`.

- `id` (INTEGER, Primary Key, Auto Increment)
- `order_id` (INTEGER, Foreign Key, `constrained()->onDelete('cascade')`) — Terhubung ke `orders.id`.
- `product_id` (INTEGER, Foreign Key, `constrained()`) — Terhubung ke `products.id` (Induk paket yang dibeli).
- `combo_details` (TEXT) — Format JSON data komponen yang dipilih user (Contoh: `{"chicken": "Paha Bawah", "drink": "Pepsi", "sauce": "Barbeque"}`).
- `quantity` (INTEGER) — Jumlah paket sejenis yang dibeli.
- `subtotal` (INTEGER) — Hasil dari (`harga_paket * quantity`).

---

## 2. Folder Structure Plan (Laravel Standard)

Berikut adalah peta struktur folder proyek PahaDada.id agar penempatan file komponen teks, grafis, multimedia, dan logika _backend_ konsisten:

```text
pahadada-kiosk/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── KioskController.php      # Mengontrol logika alur Client Kiosk (Fase 1-8)
│   │       └── AdminController.php      # Mengontrol logika POS CRUD & KDS (Tab 1-3)
│   └── Models/
│       ├── Product.php                  # Model data menu
│       ├── Order.php                    # Model transaksi utama
│       └── OrderDetail.php              # Model detail item transaksi
├── database/
│   ├── database.sqlite                  # File database utama (SQLite)
│   ├── migrations/                      # File skema pembuatan tabel
│   └── seeders/
│       └── ProductSeeder.php            # Data dummy awal menu PahaDada.id
├── public/
│   └── assets/
│       ├── images/                      # Aset Grafis (Foto menu ayam, logo PahaDada.id)
│       └── sounds/                      # Aset Multimedia Audio (tap.mp3, sukses.mp3, dingdong.mp3)
├── resources/
│   ├── css/
│   │   └── app.css                      # Entrypoint directive Tailwind CSS
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php            # Master Layout (Simulasi Layar Kiosk Vertikal & Audio API)
│       ├── kiosk/
│       │   ├── index.blade.php          # SPA Kiosk View (Fase 1 hingga Fase 8 via Alpine.js)
│       │   └── receipt_pdf.blade.php    # (Opsional) Layout struk jika ingin window.print()
│       └── admin/
│           └── dashboard.blade.php      # Tampilan Dashboard Admin 3 Tab (CRUD, KDS, Monitor)
└── routes/
    └── web.php                          # Endpoints / Routing Web
```

---

## 3. API Routes & Server Actions

Seluruh _routing_ menggunakan metode _Named Routes_ bawaan Laravel untuk mempermudah pemanggilan fungsi di dalam form HTML Blade.

## A. Routing Sisi Client Kiosk (`routes/web.php`)

|HTTP Method|URI|Named Route|Controller Action|Keterangan / Output|
|---|---|---|---|---|
|GET|`/`|`kiosk.index`|`KioskController@index`|Menampilkan antarmuka utama kios (Lockscreen hingga Checkout SPA).|
|POST|`/checkout`|`kiosk.checkout`|`KioskController@checkout`|Server Action: Menerima payload data keranjang belanja JSON dari Alpine.js, melakukan validasi total harga, mengenerate nomor antrean, menyimpan ke database SQLite, lalu mengembalikan data ke halaman sukses (_Redirect with Sessions_).|

## B. Routing Sisi Admin Dashboard POS & KDS (`routes/web.php`)

|HTTP Method|URI|Named Route|Controller Action|Keterangan / Output|
|---|---|---|---|---|
|GET|`/admin`|`admin.dashboard`|`AdminController@index`|Menampilkan satu halaman Dashboard Utama berisi Tab CRUD, KDS, dan Monitor Antrean.|
|POST|`/admin/products`|`admin.products.store`|`AdminController@storeProduct`|Server Action: Memproses input form penambahan menu baru beserta proses _upload_ gambar ke folder publik.|
|DELETE|`/admin/products/{id}`|`admin.products.destroy`|`AdminController@deleteProduct`|Server Action: Menghapus menu produk secara permanen dari database SQLite berdasarkan ID.|
|PATCH|`/admin/orders/{id}/pay`|`admin.orders.pay`|`AdminController@confirmPayment`|Server Action: Khusus metode _Cash_, mengubah kolom `status` pesanan dari `pending` menjadi `paid`.|
|PATCH|`/admin/orders/{id}/complete`|`admin.orders.complete`|`AdminController@completeOrder`|Server Action: Mengubah status transaksi menjadi `completed` jika makanan sudah diambil pelanggan.|

---
# 5. Functional Requirements & Feature Breakdown
## Modul 1: Client-Side Kiosk Application (SPA via Alpine.js)

## Modul 1A: Lockscreen Mode (Screensaver & Video Loop)

- User Story: "Sebagai pelanggan restoran, saya ingin melihat tampilan visual promosi yang bergerak saat mesin tidak digunakan, sehingga saya tertarik untuk mendekat dan menekan tombol untuk mulai memesan makanan."
- UI/UX Component Requirements:
    
    - _Container_ utama vertikal mensimulasikan layar kios asli (`max-w-md h-[920px]`).
    - Komponen slider gambar poster promosi dengan efek transisi otomatis.
    - Komponen video promosi ayam krispi yang di-_embed_ dari YouTube menggunakan tag `<iframe>` dengan parameter `autoplay=1&mute=1&loop=1`.
    - Tombol besar _"MULAI PESANAN / ORDER HERE"_ dengan efek animasi denyut (_pulse_) Tailwind CSS.
    
- Logic & State Management:
    
    - Menggunakan state Alpine.js `step: 'lockscreen'`.
    - Jika tombol _"MULAI PESANAN"_ diklik, panggil fungsi `playTap()` untuk memicu audio `tap.mp3`, lalu ubah status `step` menjadi `'preference'`.
    - _Idle Timeout Logic:_ Jika aplikasi berada di fase selain lockscreen dan tidak menerima interaksi sentuhan/klik selama 60 detik, hapus seluruh isi keranjang (_clear session/state_) dan ubah kembali status `step` ke `'lockscreen'`.
    
- Acceptance Criteria:
    
    - Video YouTube otomatis berputar berulang-ulang tanpa suara (_muted autoplay_) saat halaman pertama kali dimuat.
    - Tombol mulai responsif dan berhasil memindahkan layar ke fase berikutnya tanpa memuat ulang halaman (_zero page reload_).
    

## Modul 1B: Pre-Ordering Preference (Bahasa & Opsi Makan)

- User Story: "Sebagai pelanggan restoran, saya ingin memilih bahasa pengantar dan menentukan apakah saya ingin makan di tempat atau membawa pulang makanan sebelum masuk ke menu utama."
- UI/UX Component Requirements:
    
    - Pilihan bahasa berbentuk kartu/tombol bergambar bendera: Indonesia dan English.
    - Pilihan tipe pesanan berbentuk dua tombol visual besar: _Dine In_ (Makan di Sini) dan _Take Away_ (Bawa Pulang).
    - Tombol _"Lanjut"_ di bagian bawah layar.
    
- Logic & State Management:
    
    - Menggunakan variabel state `language: 'id'` dan `orderType: 'dine-in'`.
    - Jika tombol bahasa/tipe order diklik, perbarui nilai variabel state yang bersangkutan dan picu suara klik.
    - Jika tombol _"Lanjut"_ diklik, ubah status `step` menjadi `'main-menu'`.
    
- Acceptance Criteria:
    
    - Sistem berhasil mengunci preferensi bahasa dan tipe makan pengguna ke dalam memori variabel Alpine.js sebelum membuka halaman menu utama.
    

## Modul 1C: Main Menu & Package Customization Modal

- User Story: "Sebagai pelanggan restoran, saya ingin melihat menu rekomendasi di urutan teratas, memilih jenis paket makanan, mengustomisasi isian lauk/minumannya, serta memantau ringkasan harga keranjang di bagian bawah layar."
- UI/UX Component Requirements:
    
    - _Sidebar_ navigasi vertikal di sisi kiri untuk kategori menu (Rekomendasi di posisi paling atas, disusul Paket Krispi, Ala Carte, Minuman, Cemilan).
    - _Grid layout_ di sisi kanan untuk menampilkan kartu produk (Gambar, Nama Paket, Harga, Tombol Tambah).
    - _Pop-up Modal_ interaktif dengan animasi transisi membesar halus saat kartu paket diklik. Di dalam modal terdapat opsi kustomisasi bertahap (Langkah 1: Pilih Potongan Ayam ➔ Langkah 2: Pilih Varian Minuman).
    - Tombol "Batalkan" dan "Tambah ke Keranjang" di dalam modal.
    - _Floating Cart Bar_ di bagian bawah layar utama yang menampilkan jumlah item, total harga akumulasi, dan tombol _"Lihat Pesanan Saya"_.
    - Tombol _"Reset Pesanan"_ (Mulai dari Awal) yang selalu hadir di pojok layar menu utama.
    
- Logic & State Management:
    
    - Variabel state pendukung: `cart: []`, `currentPackage: null`, `isModalOpen: false`.
    - Jika kartu paket diklik, set data ke `currentPackage`, ubah `isModalOpen = true`, dan picu `playTap()`.
    - Di dalam modal, komponen isian paket dipilih menggunakan metode _data-binding_ objek ke dalam array keranjang.
    - Jika tombol _"Tambah ke Keranjang"_ diklik, validasi kelengkapan isian komponen paket, masukkan objek baru ke dalam array `cart`, picu animasi _splash pop-up_ sekilas bertuliskan "Menu Ditambahkan!", ubah `isModalOpen = false`, dan perbarui kalkulasi total harga di _floating bar_.
    - Jika tombol _"Reset Pesanan"_ diklik, kosongkan array `cart`, kembalikan `step = 'lockscreen'`.
    
- Acceptance Criteria:
    
    - Menu kategori rekomendasi wajib terbuka secara otomatis saat pertama kali masuk ke menu utama.
    - Pelanggan tidak bisa menambahkan paket ke keranjang sebelum menyelesaikan langkah kustomisasi isian lauk dan minuman di dalam modal.
    - Nilai nominal harga dan jumlah item di _floating bar_ bawah ter-update secara _real-time_ setiap kali item ditambahkan.
    

## Modul 1D: Cart Review & Delivery Logistics

- User Story: "Sebagai pelanggan restoran, saya ingin memeriksa kembali detail seluruh pesanan saya, mengubah jumlah porsi, menentukan lokasi meja makan saya jika memilih dine-in, sebelum lanjut memilih metode pembayaran."
- UI/UX Component Requirements:
    
    - Halaman rekap berisi daftar belanja (Nama paket, detail kustomisasi isi lauk, harga satuan, tombol kuantitas `+` dan `-`, serta subtotal harga).
    - Tombol _"Tambah Pesanan"_ (kembali ke menu utama) dan _"Selesaikan Pesanan"_ di bagian bawah.
    - Halaman logistik (diakses setelah klik selesaikan pesanan): Opsi tombol besar _"Antar ke Meja"_ atau _"Ambil di Kasir"_.
    - Komponen _custom on-screen keyboard_ numerik (keyboard angka visual buatan sendiri di layar) yang muncul otomatis hanya jika opsi _"Antar ke Meja"_ dipilih untuk menginput nomor meja.
    
- Logic & State Management:
    
    - Variabel state pendukung: `deliveryMethod: ''`, `tableNumber: ''`.
    - Tombol kuantitas `+` dan `-` akan langsung menambah atau mengurangi nilai objek di array `cart` dan mengalkulasi ulang total harga belanjaan secara otomatis.
    - Jika opsi _"Antar ke Meja"_ dipilih, tampilkan area input nomor meja beserta keyboard numeriknya. Setiap ketukan angka di keyboard visual akan mengisi nilai variabel `tableNumber`.
    
- Acceptance Criteria:
    
    - Jika pengguna memilih opsi _"Antar ke Meja"_, tombol _"Lanjut ke Pembayaran"_ wajib terkunci (_disabled_) selama kolom nomor meja kosong atau bernilai `0`.
    

## Modul 1E: Interactive Payment & On-Screen Receipt

- User Story: "Sebagai pelanggan restoran, saya ingin memilih opsi pembayaran mockup dan melihat struk digital langsung di layar laptop setelah pembayaran sukses tanpa memerlukan mesin print fisik asli."
- UI/UX Component Requirements:
    
    - Halaman pilihan metode bayar: QRIS, E-Wallet, M-Banking, Debit Card, dan Tunai di Kasir.
    - Area visual interaktif sesuai metode yang dipilih (Contoh: Menampilkan gambar QR Code statis tiruan PahaDada.id berlabel nominal total harga belanja untuk opsi QRIS, atau animasi mesin gesek EDC untuk opsi Debit).
    - Tombol rahasia berukuran kecil/minimalis berwarna hijau di pojok bawah bertuliskan "Simulasi Sukses" (sebagai pemicu aksi backend saat kamu demo sidang).
    - _Splash Screen Thank You_ berwarna merah penuh dengan teks "Terima Kasih, Pesanan Anda Sedang Diproses".
    - Komponen visual Struk Belanja Digital (_On-Screen Receipt_) rapi yang muncul di tengah layar setelah splash screen (memuat Nomor Antrean besar harian, Detail Item Paket, Nomor Meja/Keterangan Ambil di Kasir, dan Status Pembayaran).
    
- Logic & State Management:
    
    - Variabel state pendukung: `paymentMethod: ''`.
    - Ketika tombol metode pembayaran diklik, tampilkan visual mockup instruksinya.
    - Jika tombol "Simulasi Sukses" diklik, kirim seluruh data payload (keranjang belanja JSON, tipe makan, nomor meja, total harga, metode pembayaran) menggunakan metode `POST` via Axios/Fetch/Form HTML ke endpoint backend Laravel `/checkout`.
    - Setelah backend merespon sukses dan mengirimkan data balik nomor antrean harian, mainkan audio `sukses.mp3`, ubah status `step = 'success'`, tampilkan splash screen terima kasih selama 3 detik, lalu beralih menampilkan struk digital di layar.
    - Set _timer automated reset_ selama 15 detik pada tampilan struk akhir untuk membersihkan seluruh data state dan mengembalikan sistem secara otomatis ke halaman `step = 'lockscreen'`.
    
- Acceptance Criteria:
    
    - Transaksi berhasil tersimpan ke database lokal SQLite dan status pembayaran tercatat otomatis sebagai `paid` (lunas) untuk non-tunai, atau `pending` jika memilih metode Tunai di Kasir.
    - Nomor antrean berurutan secara otomatis dan tampil jelas di struk digital layar monitor.
    

---

## Modul 2: Back-Office Merchant Dashboard & KDS (Admin-Side)

## Modul 2: Admin Dashboard One-Page (3-Tab Layout)

- User Story: "Sebagai pengelola merchant PahaDada.id, saya ingin mengelola katalog makanan, memantau pesanan masuk untuk dapur, serta memperbarui antrean di satu halaman terpusat yang praktis."
- UI/UX Component Requirements:
    
    - Bilah navigasi atas (_Header Admin_) menampilkan nama brand PahaDada.id - Back Office Control.
    - Bilah navigasi tab horizontal menggunakan utilitas Tailwind CSS untuk berpindah antar-tiga tampilan utama: [Tab 1: Manajemen Produk], [Tab 2: Kitchen Display System (KDS)], dan [Tab 3: Monitor Antrean Lobi].
    

## Spesifikasi Tab 1: Manajemen Produk (Product CRUD)

- Komponen Visual: Tabel data (Kolom: Foto, Nama Menu, Kategori, Harga, Aksi). Tombol _"Tambah Produk Baru"_ di atas tabel yang memicu munculnya jendela formulir modal.
- Logika Sistem: Menggunakan fungsi standar Laravel CRUD Controller. Form wajib memiliki validasi backend (`name` required, `price` numeric, `image` image mimes jpeg,png). Tersedia tombol aksi _"Hapus"_ berbasis metode HTTP `DELETE` dengan konfirmasi alert.
- Acceptance Criteria: Produk yang ditambahkan atau dihapus oleh admin di halaman ini langsung mengubah isi database SQLite dan merubah tampilan pilihan menu di sisi Kiosk secara _real-time_ saat diakses kembali.

## Spesifikasi Tab 2: Kitchen Display System (KDS - Order Tracker)

- Komponen Visual: Grid kartu pesanan masuk yang diurutkan berdasarkan waktu (Pesanan terlama di posisi paling atas kiri). Setiap kartu pesanan memuat: Nomor Antrean besar, Tipe Makan, Detail Komponen Paket yang dibeli (baca data JSON), Status Meja/Ambil Kasir, dan Tombol Aksi Konstatus.
- Logika Sistem:
    
    - Jika pesanan masuk memilih metode Tunai, tampilkan tombol kuning _"Konfirmasi Bayar di Kasir"_. Jika diklik, jalankan server action `PATCH` untuk merubah nilai database `status = 'paid'`.
    - Jika pesanan sudah berstatus lunas (`paid`), tampilkan tombol hijau _"Selesaikan Masakan & Serahkan"_. Jika diklik, jalankan server action `PATCH` untuk merubah database `status = 'completed'`. Pesanan yang selesai otomatis hilang dari daftar pengerjaan aktif dapur.
    
- Acceptance Criteria: Dapur dapat melacak dengan detail modifikasi varian menu paket yang dipilih pelanggan dan merubah status urutan proses masak secara valid.

## Spesifikasi Tab 3: Monitor Antrean Pelanggan (Lobi Restoran)

- Komponen Visual: Tampilan layar lobi yang dibagi menjadi dua kolom vertikal besar. Kolom Kiri: "SEDANG DIPROSES" (menampilkan daftar nomor antrean berstatus `paid`). Kolom Kanan: "SILAKAN AMBIL" (menampilkan daftar nomor antrean berstatus `completed`). Di bagian bawah terdapat tombol besar _"PANGGIL NOMOR ANTREAN TERAKHIR"_.
- Logika Sistem: Mengambil data relasional dari tabel pesanan harian. Ketika tombol panggilan antrean diklik oleh admin, panggil fungsi pemutar efek suara audio multimedia `dingdong.mp3`.
- Acceptance Criteria: Tampilan monitor antrean sinkron dengan perpindahan status pengerjaan yang dilakukan oleh staf dapur di Tab 2.
---
# 6. Non-Functional Requirements & System Policies

## 1. Performance (Batasan & Standar Kecepatan)

- Zero-Reload Reaktivitas Kiosk: Seluruh perpindahan halaman operasional dari Fase 1 hingga Fase 8 di sisi _Self-Ordering Kiosk_ wajib menggunakan manipulasi DOM lokal via Alpine.js tanpa memicu muat ulang halaman (_page reload_). Respon transisi antarmuka harus berada di bawah 100 milidetik (ms) untuk mensimulasikan mesin kasir instan.
- Optimasi Aset Multimedia: File audio efek suara (`tap.mp3`, `sukses.mp3`) wajib dikompresi di bawah 300 KB dengan atribut `preload="auto"` agar tidak ada latensi suara saat tombol diklik. Video YouTube di halaman depan diatur wajib menggunakan parameter `mute=1` agar kebijakan _browser modern_ mengizinkan fungsi _autoplay_ berjalan instan tanpa tersendat.
- Tailwind Production Compile Score: Proses _compilation_ Tailwind CSS wajib menggunakan Vite Bundler (NPM) dengan fitur _purging_ aktif. Ukuran file _output_ CSS akhir tidak boleh melebihi 50 KB setelah di-bundle, demi memastikan skor Google Lighthouse Performance minimal 90 untuk aspek kecepatan muat halaman (_Largest Contentful Paint_).

## 2. Security (Penanganan Data Sensitif & Integritas)

- Database Portability & Serverless Isolation: Menggunakan database lokal SQLite yang diisolasi di dalam folder proyek privat. Koneksi database dikunci secara aman menggunakan _environment variables_ di dalam file `.env`. Jalur file `.sqlite` dilarang keras ditulis secara _hardcoded_ di dalam kode program.
- Form & Transaction Protection: Setiap transaksi pengiriman data keranjang belanja dan formulir CRUD Admin wajib dibungkus oleh directive `@csrf` bawaan Laravel untuk mencegah serangan _Cross-Site Request Forgery_.
- Server-Side Price Validation: Sistem dilarang mempercayai kalkulasi total harga yang dikirim oleh sisi klien (karena rawan manipulasi _inspect element_). Backend Laravel wajib melakukan perhitungan ulang total belanjaan dengan mencocokkan ID produk ke database SQLite internal sebelum transaksi disimpan ke dalam tabel transaksi.

## 3. Error Handling Policy (Kebijakan Penanganan Eror)

- User-Friendly Client Fallback: Jika pengguna menembak URL halaman pembayaran (`/checkout`) secara langsung dalam kondisi keranjang belanja kosong, backend Laravel harus menangkap kondisi tersebut dan melakukan _redirect_ paksa ke halaman menu utama disertai _Flash Session Alert_ berwarna merah di atas layar.
- Dynamic Asset Placeholder: Jika pada Dashboard Admin (`/admin`) petugas mengunggah menu makanan baru tetapi gagal mengunggah gambar atau file gambar rusak, sistem _backend_ tidak boleh merusak layout halaman depan. Sistem wajib secara otomatis menampilkan gambar cadangan bawaan (_fallback placeholder image_) bernama `default-chicken.png`.
- Validation Fail Capture: Semua kegagalan input pada form penambahan produk admin harus ditangkap menggunakan objek `$errors` bawaan Laravel. Eror wajib ditampilkan secara spesifik di bawah masing-masing kolom input dengan teks instruksi yang jelas (Contoh: _"Harga harus berupa angka!"_), bukan memunculkan halaman eror bawaan PHP (_Whoops/Stack Trace_) yang membingungkan penguji.
---
# 7. AI Development Instructions & Clean Code Standards

## 1. Prinsip Clean Code yang Wajib Diterapkan

- Meaningful Names (Nama yang Punya Arti): Nama fungsi dan variabel harus langsung menjelaskan tujuannya tanpa perlu ditebak-tebak, menggunakan bahasa Indonesia yang ramah sidang.
    
    - _Sesuai Clean Code:_ Gunakan `hitungTotalBelanja()` daripada hanya `total()` atau `xyz()`.
    
- Single Responsibility Principle (Satu Fungsi, Satu Tugas): Sebuah fungsi hanya boleh melakukan satu tugas spesifik. Jangan menumpuk logika pengecekan, kalkulasi, dan simpan data dalam satu fungsi raksasa. Pecah menjadi fungsi-fungsi kecil agar kodenya bersih dan mudah dijelaskan baris per baris ke Kakom.
- Don't Repeat Yourself (DRY): Hindari menulis kode atau logika yang sama berulang kali. Jika ada logika yang dipakai di beberapa tempat (misal: memformat angka ke Rupiah), buatkan satu fungsi khusus untuk dipanggil berulang-ulang.

## 2. Standar Komentar Kode (Commenting Rules)

- Komentar Penjelas Alasan (Why, Not What): Clean code menyarankan komentar fokus menjelaskan _kenapa_ kode itu ditulis, bukan menjelaskan hal yang sudah jelas tertulis di kode.
- Bahasa Indonesia Santai: Komentar wajib ditulis menggunakan bahasa sehari-hari anak RPL SMK agar bisa kamu jadikan bahan contekan/hafalan langsung saat kodenya dibedah oleh penguji.