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

---
# 4. Data Models & Database Schema (Struktur Data)

---