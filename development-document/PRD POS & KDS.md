## 1. Project Overview & Objectives

* Nama Produk: Kriukology - Back-Office Merchant Dashboard & POS Management System.
* Problem Statement:
1. Kekakuan Manajemen Data Menu: Pemilik restoran cepat saji lokal seringkali kesulitan mengubah harga, memperbarui ketersediaan stok, atau menambah varian produk baru secara instan tanpa harus membongkar baris kode HTML front-end secara manual.
   2. Disorientasi Antrean Dapur (Kitchen Grid): Tanpa adanya sistem pelacakan digital terpusat, koordinasi antara pesanan mandiri pelanggan di lobi dengan kru juru masak di dapur seringkali kacau, memicu keterlambatan penyajian makanan.
   3. Kerumitan Rekonsiliasi Transaksi Tunai: Pelanggan Kiosk yang memilih metode pembayaran Cash (Tunai) membutuhkan validasi otorisasi manual yang cepat oleh petugas kasir agar nomor antreannya segera masuk ke antrean masak dapur secara legal.
* Value Proposition:
1. Real-Time Data Synchronization: Manajemen data menu (CRUD) terhubung langsung secara dua arah. Setiap perubahan data produk di back-office otomatis memperbarui visual menu Kiosk di depan secara real-time.
   2. Integrated Kitchen Display System (KDS): Menyediakan monitor pemantau pesanan masuk secara digital berbasis urutan waktu, mempermudah kru dapur menyelesaikan proses memasak dan memanggil nomor antrean secara efisien.
   3. Dual-Mode Cashier Authorization: Berfungsi sebagai kasir konvensional kilat untuk melakukan konfirmasi transaksi tunai (Cash) dan merubah status pembayaran menjadi lunas (Paid) hanya dengan satu klik.
   4. Secure Data Isolation (Arsitektur Terpisah): Memastikan akses kontrol dashboard dibatasi pada rute internal /admin, menjaga agar visualisasi laporan keuangan dan data manajemen aman dari jangkauan publik di lobi.
* Target Audience:
1. Manajemen Restoran / Pemilik UMKM Kuliner: Pengelola yang membutuhkan kendali penuh atas harga produk, promosi, dan kontrol inventaris secara fleksibel.
   2. Kru Dapur / Juru Masak: Staf yang membutuhkan monitor pelacak pesanan yang bersih untuk menyiapkan makanan sesuai kustomisasi menu paket pelanggan.
   3. Petugas Kasir Utama: Staf yang bertugas melayani verifikasi pembayaran tunai dan penyerahan makanan ke tangan konsumen.

------------------------------
## 2. Tech Stack & Architecture Constraints (Batasan Teknologi)## 1. Komponen Utama Tech Stack POS Admin
Subsistem ini dirancang menggunakan arsitektur yang sinkron dengan sisi klien, memanfaatkan framework core di sisi server dan manipulasi state interface yang reaktif di sisi depan.

* Backend Framework: PHP 8.2+ / 9.x dengan Laravel 11 [1, 2]
* Frontend UI/CSS: Tailwind CSS v3/v4 (Di-bundle menggunakan NPM / Vite Bundler) [1, 2]
* Frontend Scripting: Vanilla JavaScript Murni (Tanpa Framework Frontend Tambahan) [1, 2]
* Database Management: SQLite (Serverless Embedded Database - Berbagi file database tunggal database.sqlite dengan Kiosk) [1, 2]

------------------------------
## 2. Rationale & Alasan Pemilihan Komponen (Bahan Argumen Sidang)## A. Mengapa Memilih Backend Laravel 11?

   1. Pola Desain MVC Bersih: Memisahkan data produk/pesanan (Models), antarmuka kontrol dashboard (Views), dan logika pembaruan status transaksi (Controllers) secara terstruktur. Sangat mudah dipertanggungjawabkan di depan penguji PT Bonet & PT ION Network.
   2. Sanitasi Form Input Otomatis: Menghilangkan pengerjaan sanitasi kode manual. Fitur validasi form bawaan Laravel otomatis mengunci tipe data (seperti harga wajib numeric) dan mencegah file upload bypass pada gambar menu produk.

## B. Mengapa Memilih Tailwind CSS via NPM / Vite Bundler?

   1. Hot Module Replacement (HMR) & Optimasi Kompilasi: Penggunaan Vite mempermudah slicing layout dashboard tabel yang kompleks dengan fitur hot reload instan tanpa refresh manual saat koding.
   2. Kerapian Antarmuka Multi-Tab: Mempermudah pembuatan komponen navigasi tab horizontal (CRUD, KDS, Monitor) yang bersih menggunakan utilitas kelas state Tailwind tanpa memerlukan pustaka UI eksternal.

## C. Mengapa Memilih Vanilla JavaScript Murni?

   1. Manipulasi DOM Instan Tanpa Overhead: Mengontrol perpindahan antar-tab dan pemutaran audio panggil antrean menggunakan fungsi native (document.getElementById()), menghemat performa komputer server kasir.
   2. Kecepatan Update State KDS: Vanilla JS bertugas membaca perubahan struktur baris tabel antrean secara dinamis, menjaga agar visual data tetap sinkron di bawah 50ms.

## D. Mengapa Memilih Database SQLite?

   1. Zero-Conflict Share Database: Kiosk dan POS Kasir membaca dan menulis pada satu file fisik yang sama (database.sqlite). Tidak ada risiko race condition atau kebutuhan menyalakan service database tambahan (XAMPP/MySQL) di lingkungan Linux lobi restoran.
   2. Kemudahan Backup Data: Seluruh data menu baru dan riwayat antrean harian dapat dicadangkan atau dipindahkan ke komputer penguji hanya dengan menyalin satu file basis data proyek.

------------------------------
## 3. Core Features & User Stories (Spesifikasi Fitur)## 1. POS Kasir & Admin Dashboard## 1. User Story

* Sebagai: Manajemen Restoran / Kasir Utama Kriukology.
* Saya ingin: Mengelola master data menu produk, memverifikasi status pembayaran tunai, serta memantau dan memperbarui pergerakan nomor antrean dapur secara real-time.
* Agar: Pengelolaan katalog makanan berjalan praktis, pesanan dari mesin kiosk langsung terdata di dapur, dan proses pemanggilan antrean lobi berjalan tertib secara visual dan audio multimedia.

------------------------------
## 2. System & User Flow (Langkah demi Langkah)
Berikut adalah visualisasi alur sistem manajemen POS Admin dari pintu masuk /admin:

              ┌─── [Tab 1: CRUD Produk] ──> Simpan/Hapus ──> Efek Instan ke Kiosk
              │
[Buka /admin] ├─── [Tab 2: KDS Monitor] ──> Klik Konfirmasi ──> Status PAID / COMPLETED
              │
              └─── [Tab 3: Layar Lobi] ──> Klik Panggil ──> Suara Ding-Dong Audio


   1. Fase Otentikasi Jalur Masuk
   * Admin: Membuka rute URL khusus /admin pada browser lobi/kasir.
      * Sistem: Mengarahkan ke file view admin.dashboard tunggal yang memuat kerangka utama dashboard 3-tab.
   2. Fase Manajemen Katalog (Tab 1 - CRUD)
   * Admin: Melihat tabel menu aktif. Admin mengeklik "Tambah Produk", mengisi form nama, harga, kategori, dan mengunggah gambar ayam baru, lalu klik "Simpan".
      * Sistem: Memproses data ke tabel products, menyimpan file gambar ke direktori publik, dan mengirim pesan sukses reaktif.
   3. Fase Pelacakan Monitor Dapur (Tab 2 - KDS)
   * Admin/Juru Masak: Melihat grid kartu pesanan masuk. Jika ada pesanan Cash, kasir mengeklik "Konfirmasi Bayar". Jika makanan selesai dimasak, juru masak mengeklik "Selesaikan Pesanan".
      * Sistem: Tombol Konfirmasi merubah status pending ➔ paid. Tombol Selesai merubah status paid ➔ completed dan otomatis menghapus kartu pesanan dari antrean dapur aktif.
   4. Fase Panggilan Antrean Lobi (Tab 3 - Monitor Lobi)
   * Admin/Staf Pengantar: Melihat daftar antrean di layar TV lobi. Petugas mengeklik tombol besar "Panggil Antrean".
      * Sistem: Memutar file audio multimedia dingdong.mp3 secara keras melalui speaker lobi restoran.
   
------------------------------
## 3. Logic & Edge Cases (Aturan Main & Validasi Admin)

* Aturan Sinkronisasi Integrity:
* Proses penghapusan produk pada Tab 1 wajib menggunakan Foreign Key Cascade Restriction pada database SQLite untuk memastikan produk yang sedang aktif dibeli di keranjang Kiosk tidak memicu system crash di sisi klien.
* Edge Case 1: Upload File Gambar Kosong atau Corrupt
* Kondisi: Admin menginput menu produk baru namun melewati kolom unggah gambar, atau mengunggah format file ilegal (bukan gambar).
   * Logika Sistem: Sistem memicu validasi required|image|mimes:jpeg,png. Jika gagal, sistem menolak input dan otomatis memasang gambar fallback default bernama default-chicken.png agar visual Kiosk depan tidak pecah.
* Edge Case 2: Perubahan Harga Menu Saat Kiosk Sedang Bertransaksi
* Kondisi: Admin mengubah harga Paket Ayam di Tab 1 menjadi lebih mahal, tepat saat pelanggan di depan sedang menaruh item tersebut di keranjang Kiosk dengan harga lama.
   * Logika Sistem: Saat pelanggan klik bayar, backend server action Kiosk akan mengabaikan total harga kiriman klien dan menghitung ulang subtotal berdasarkan harga terbaru di database SQLite untuk mencegah manipulasi kerugian finansial.

------------------------------
## 4. Data Models & Database Schema (Struktur Data)
(Mengacu penuh pada cetak biru data terpusat di berkas utama, menggunakan tabel products, orders, dan order_details via Eloquent ORM Laravel secara relasional).
------------------------------
## 5. Functional Requirements & Feature Breakdown## Modul 2: Back-Office Merchant Dashboard & KDS (Admin-Side) [1, 2]## Modul 2A: Manajemen Produk (Product CRUD Tab)

* User Story: "Sebagai admin toko, saya ingin menambah dan menghapus katalog makanan dari dashboard, sehingga menu di layar depan selalu up-to-date sesuai stok gudang."
* UI/UX Component Requirements:
* Tabel data responsif Tailwind CSS dengan kolom: Gambar Mini, Nama Menu, Kategori Tag, Harga (Format Rupiah), dan Tombol Aksi Hapus Merah.
   * Tombol hijau "Tambah Menu Baru" yang memicu munculnya jendela Pop-up Modal Form berisi kolom teks Nama, angka Harga, opsi Kategori, dan input file upload.
* Logic & State Management:
* Jika form disubmit, panggil fungsi tambahProdukBaru(). Lakukan pengecekan validitas input, simpan gambar ke public/assets/images/, jalankan query INSERT ke SQLite, tutup modal, dan jalankan fungsi re-render tabel dinamis.
* Acceptance Criteria:
* Menu baru terdaftar di database SQLite dengan ID unik berbasis auto-increment dan langsung nampak di grid Kiosk lobi tanpa perlu mematikan aplikasi.

## Modul 2B: Kitchen Display System (KDS Tab Monitor)

* User Story: "Sebagai juru masak dapur, saya ingin melihat rincian isi menu paket yang dibeli pelanggan secara berurutan, agar saya tidak salah memasak lauk dan minuman pilihan mereka."
* UI/UX Component Requirements:
* Layout kartu berderet (Grid Flexbox). Setiap kartu berisi: Nomor Antrean besar, Label Tipe Makan (Dine In/Take Away), Teks JSON detail isi komponen paket (Ayam Paha/Dada, Jenis Minuman), dan Tombol Aksi Transisi.
* Logic & State Management:
* Gunakan fungsi renderTabelPesananDapur(). Jika pesanan berstatus pending (Cash), tampilkan tombol kuning Konfirmasi Bayar. Jika diklik, jalankan fungsi PATCH merubah data ke status paid.
   * Jika pesanan berstatus paid (Lunas), tampilkan tombol Selesai Masak. Jika diklik, ubah status ke completed di database, memicu hilangnya kartu dari area kerja dapur.
* Acceptance Criteria:
* Kru dapur dapat membaca isi varian kustomisasi makanan secara detail dan merubah urutan antrean penyajian data secara valid.

## Modul 2C: Monitor Antrean Pelanggan (Lobi Tab TV)

* User Story: "Sebagai pelanggan di lobi, saya ingin melihat nomor antrean saya sudah masuk ke status dimasak atau sudah siap ambil melalui layar monitor TV lobi."
* UI/UX Component Requirements:
* Layout visual layar terpisah 2 kolom besar seimbang. Kolom Kiri: Teks Hijau "SEDANG DIPROSES" (Daftar antrean status paid). Kolom Kanan: Teks Animasi Denut "SILAKAN AMBIL" (Daftar antrean status completed).
   * Tombol besar di bagian dasar operator bertuliskan "PANGGIL ANTREAN TERAKHIR".
* Logic & State Management:
* Menggunakan fungsi baca data array lokal dari SQLite. Jika tombol panggil diklik, panggil HTML5 Audio API untuk memutar file efek suara assets/sounds/dingdong.mp3 secara instan tanpa latensi.
* Acceptance Criteria:
* Nomor antrean berpindah kolom secara otomatis dan akurat mengikuti perubahan tombol yang ditekan oleh juru masak di monitor dapur Tab 2.

------------------------------
## 6. Non-Functional Requirements & System Policies## 1. Performance (Batasan & Standar Kecepatan)

* Single Page Control Performance: Transisi perpindahan antar-Tab 1, Tab 2, dan Tab 3 di dashboard admin wajib dikendalikan instan lewat manipulasi utilitas class visibility Tailwind (block dan hidden) di bawah waktu 50ms.
* Audio Preload Broadcast: Tombol panggil antrean TV lobi wajib mengunduh file suara dingdong.mp3 di awal (preload) agar ketika tombol diklik oleh petugas kasir, efek suara multimedia langsung berbunyi tanpa ada jeda tunggu unduhan buffer.

## 2. Security (Penanganan Data Sensitif & Integritas)

* Route Injection Isolation: Rute /admin wajib dibentengi menggunakan validasi logika request validation di sisi server Laravel. Sistem harus menolak segala bentuk manipulasi URL path traversal dari luar mesin lobi kiosk.
* Database Thread Safety: Penulisan data CRUD produk baru dari sisi admin tidak boleh mengunci akses baca (read lock) database SQLite dari sisi Kiosk depan, menjamin mesin pemesanan pelanggan tetap berjalan responsif di waktu yang bersamaan.

## 3. Error Handling Policy (Kebijakan Penanganan Eror)

* Form Validation Fail Capture: Jika admin memasukkan nominal harga menu berupa huruf (bukan angka), backend Laravel wajib menangkap eror lewat variabel $errors dan menampilkan pesan kesalahan berwarna merah tepat di bawah kolom input tanpa merusak desain modal form.
* Fallback Image Replacement: Jika file foto menu ayam yang diunggah admin mengalami korup atau hilang di direktori folder, sistem dilarang memunculkan ikon gambar rusak (broken image). Sistem wajib merender gambar placeholder bawaan default-chicken.png secara otomatis demi menjaga kerapian estetika UI Kiosk.

------------------------------
## 7. AI Development Instructions & Clean Code Standards## 1. Prinsip Clean Code yang Wajib Diterapkan

* Meaningful Names: Penamaan fungsi CRUD dan KDS wajib menggunakan Bahasa Indonesia yang to-the-point dan ramah sidang (Contoh: gunakan tambahMenuAyamBaru() daripada store(), gunakan selesaikanPesananDapur() daripada updateStatus()).
* Single Responsibility Principle: Fungsi untuk menyimpan data produk (simpanDataMenu) harus terpisah dari fungsi untuk mengunggah berkas gambar (prosesUploadFotoMenu). Satu fungsi hanya boleh mengurus satu tugas rapi.

## 2. Standar Komentar Kode (Commenting Rules)

* Bahasa Indonesia Anak SMK RPL: Setiap baris fungsi query database dan manipulasi DOM Tab wajib diberikan komentar penjelas berbahasa Indonesia sehari-hari yang santai. Komentar ini berfungsi sebagai contekan kalimat langsung bagi siswa saat menjelaskan alur bedah kode di depan Kepala Kompetensi (Kakom).

------------------------------
