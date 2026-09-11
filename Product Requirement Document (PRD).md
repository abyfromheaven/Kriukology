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

---