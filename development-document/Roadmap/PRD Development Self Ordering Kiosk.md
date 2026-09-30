## FLOWCHART & LOGIKA OPERASIONAL KIOSK KRIUKOLOGY

```unset
[Fase 1: Screensaver Loop] ──(Klik Area Mana Saja)──> [Fase 2: Preferensi (Bahasa & Makan)]
                                                               │
┌──────────────────────────────────────────────────────────────┘
│
▼
[Fase 3: Layar Menu Utama] <──(Klik Tambah Lain)──┐
│                                                 │
├──(Klik Tambah)──> [Pop-up Bottom Bar]           │
│                         │                       │
│                   (Lihat Keranjang)             │
│                         │                       │
▼                         ▼                       │
[Idle Reset 60s]    [Fase 4: Review Keranjang] ───┘
                          │
                     (Lanjut Bayar)
                          │
                          ▼
                    [Fase 5: Layar Pilihan Bayar Dummy]
                          │
                     (Klik Metode)
                          │
                          ▼
                    [Fase 6: Splash Animasi Sukses] ──> [Fase 7: Tampilan Struk Akhir]
                                                                  │
                                                        ┌─────────┴─────────┐
                                                  (Klik Layar)        (Diam 10s)
                                                        │                   │
                                                        ▼                   ▼
                                               [Fase 2: Preferensi]   [Fase 1: Screensaver]
```

---

## PENJELASAN ALUR & DETAIL ATURAN MAIN TIAP HALAMAN

## 1. Fase 1: Screensaver (Halaman Pertama)

- Alur Visual: Layar menampilkan 3 poster promosi makanan bergantian secara otomatis (_Slide Carousel_).
- Interaksi User: Mengetuk (klik) di area mana saja dalam _frame_ layar kiosk.
- Logika Sistem (Vanilla JS):
    
    - Memicu audio multimedia `tap.mp3` .
    - Sistem menyembunyikan kontainer Screensaver dan langsung memunculkan kontainer Preferensi.
    - Sistem mulai menyalakan _Global Idle Timer_ (Pendeteksi AFK).
    
## 2. Fase 2: Layar Preferensi (Bahasa & Lokasi Makan)

- Alur Visual: Menyajikan dua pasang tombol pilihan. Atas: Bahasa (Indonesia / English). Bawah: Tipe Makan (Dine In / Take Away).
- Interaksi User: Memilih salah satu tombol bahasa dan mengeklik salah satu tipe makan.
- Logika Sistem (Vanilla JS):
    
    - Sistem mengunci nilai preferensi ke dalam variabel memori sementara browser.
    - Tanpa Menunggu Klik Tombol Lanjut: Begitu salah satu dari kartu Dine In / Take Away diklik, sistem memberikan jeda animasi mikro 300ms, lalu otomatis menyembunyikan halaman ini dan membuka halaman Menu Utama.

## 3. Fase 3: Layar Menu Utama (Section Terbesar)

- Desain Header: Banner logo `banner_kriukology.png` di tengah. Sisi kanan dan kirinya diberi motif garis belang merah-putih vertikal (memberikan aura estetik interior restoran cepat saji).
- Desain Sidebar (Sisi Kiri): Berisi 5 tombol kategori menu — Chicken, Bowl / Burger, Snack / Sides, Dessert, Beverage (Urutan pertama: Chicken terbuka otomatis secara _default_). Di bagian bawah _sidebar_ terdapat tombol "Kembali" (untuk ganti tipe makan) dan tombol "Ganti Bahasa" instan.
- Desain Grid Produk (Sisi Kanan): Menampilkan deretan kartu produk mockup yang dinamis berdasarkan kategori yang diklik pada _sidebar_. Area gambar kartu memakai `aspect-square` + `object-contain` dengan latar putih, sehingga gambar produk dengan aspect ratio berapa pun (persegi, landscape, atau portrait) tampil utuh tanpa perlu penyesuaian per gambar.
- Atur Logika Keranjang & Bottom Bar (Interaktivitas):
    
    - _Kondisi Awal:_ _Bottom bar_ keranjang belanja berstatus tersembunyi (`hidden`). Tombol pada kartu makanan bertuliskan "Tambahkan".
    - _Kondisi saat Tombol Diklik:_ Picu fungsi tambah item:
        1. Bottom bar otomatis slide up. Menampilkan total kuantitas porsi dan akumulasi harga belanjaan.
        2. Tombol "Tambahkan" di kartu produk menghilang, berganti menjadi komponen kontrol mini 3 elemen: Tombol `[-]`, teks `Angka Jumlah`, dan tombol `[+]`.
        
    - _Tombol Reset Pesanan:_ Jika diklik, sistem mengosongkan seluruh item belanja, mengembalikan semua tombol kartu produk menjadi tulisan "Tambahkan", dan menyembunyikan kembali _bottom bar_ ke bawah tanpa memindahkan halaman.

## 4. Fase 4: Halaman Overview Keranjang

- Alur Visual: Diakses via tombol "Lihat Keranjang". Header bermotif merah-putih vertikal tetap dipertahankan. Area tengah dipenuhi kartu baris produk apa saja yang dibeli (dilengkapi tombol kontrol `[-] / Angka / [+]` untuk kustomisasi darurat jika porsi kelebihan/kekurangan).
- Desain Bottom Bar Baru: Tidak menampilkan total jumlah porsi barang, hanya menampilkan teks "Total    Rp XXX" yang mencolok.
- Dua Tombol Kontrol Bawah:
    - Tombol _"Tambahkan Menu Lain"_: Menyembunyikan halaman keranjang dan memunculkan kembali Halaman Menu Utama (Fase 3) tanpa merusak atau mereset data makanan yang sudah terlanjur dipilih sebelumnya.
    - Tombol _"Lanjut Bayar"_: Mengalihkan layar ke Fase 5.

## 5. Fase 5: Halaman Pembayaran (Dummy Sandbox)

- Alur Visual: Menampilkan total nominal yang harus dibayar. Di bawahnya terdapat 3 tombol pilihan metode pembayaran: Tunai, QRIS, dan Debit.
- Status Fitur Saat Ini (Dummy): Tombol masih bersifat _non-function_ (tanpa validasi saldo asli).
    
    - _Rencana Masa Depan:_ Klik QRIS masuk ke layar QR Code, klik Tunai muncul instruksi kasir, untuk debit berstatus "Maintenance" dan tidak bisa di klik.
    - Untuk Saat ini: ketiga tombol ini dikonfigurasi reaktif oleh JavaScript. Begitu salah satu diklik, sistem langsung melompat mengunci transaksi dan membawa user ke halaman Splash Sukses. untuk simulsi sandbox qris, instruksi kasir untuk tunai dan debit biarkan nanti saja belakangan. 
    
- Tombol Navigasi Bawah: Menyediakan tombol "Kembali ke Keranjang" jika pelanggan ingin membatalkan atau meninjau ulang data belanjanya sebelum membayar.

## 6. Fase 6: Splash Screen Sukses

- Alur Visual: Layar transisi penuh yang mengunci seluruh interaksi tombol. Menampilkan animasi teks centang hijau bergerak atau teks kedip: _"Pesanan Berhasil Diproses, Terima Kasih!"_.
- Logika Sistem (Vanilla JS): Memutar efek suara `sukses.mp3` secara otomatis selama 2 hingga 3 detik saja untuk menampilkan animasi transisi sebelum otomatis mengoper layar ke halaman Struk Akhir.

## 7. Fase 7: Layar Struk Akhir Digital (On-Screen Receipt)

- Alur Visual: Menampilkan visualisasi kertas struk digital rapi di tengah monitor berisi Nomor Antrean fiktif besar, ringkasan belanja, dan metode bayar yang dipilih.
- Solusi UX Cerdas Antrean Kiosk (Mengatasi Masalah Menunggu Detik):
    
    - _Logika Otomatis:_ Jika layar didiamkan tanpa ada interaksi apa pun selama 10 detik, sistem otomatis membersihkan seluruh memori keranjang belanja dan kembali ke Fase 1 (Screensaver).
    - _Logika Interaktif (Akal-Akalan Antrean Padat):_ Jika ada pelanggan baru di belakang antrean yang malas menunggu layar struk hilang, mereka cukup mengetuk/klik area mana saja pada layar struk tersebut. JavaScript akan langsung memotong waktu tunggu (_bypass timer_), membersihkan memori belanjaan lama, dan langsung membawa pelanggan baru tersebut melompat ke Fase 2 (Layar Preferensi). Ini memangkas waktu tunggu antrean Kiosk menjadi 0 detik!

---

## SOLUSI CERDAS PENJAGAAN IDLE TIMER (AFK ANTI RESET ZONK)

Kekhawatiran saat ini: Kasihan pelanggan kalau sedang berpikir memilih menu atau sedang sibuk mengeluarkan HP untuk membuka aplikasi QRIS, tiba-tiba sistem langsung reset paksa kembali ke screensaver karena dianggap AFK. Namun, Jika sistem langsung menghapus pesanan tanpa peringatan, kasihan pelanggan yang sedang sibuk menghitung uang di dompet atau sedang mencari aplikasi QRIS di HP-nya, mereka akan sangat kecewa karena harus mengulang pesanan dari nol.

Kita akan menggabungkan _context-aware timeout_ yang kita bahas tadi ke dalam sistem _alert_ hitung mundur ini:

- **Saat di Halaman Pemilihan Menu (Fase 3) & Keranjang (Fase 4):**
    - **Masa Melamun (Mikir): 120 Detik** . Pelanggan butuh waktu lebih lama untuk membaca nama paket menu, menghitung budget, atau berdiskusi dengan temannya.
    - **Masa Peringatan (Alert Countdown): 15 Detik** . Memberikan waktu yang cukup bagi pelanggan untuk sadar bahwa layar memunculkan _pop-up_ dan bergerak menekan tombol konfirmasi.
- **Saat di Halaman Pembayaran QRIS / DANA (Fase 5):**
    - **Masa Melamun (Mikir): 90 detik** . Ini adalah fase paling kritis. Pelanggan butuh waktu lama untuk merogoh kantong, membuka kunci HP, membuka aplikasi DANA, dan mengarahkan kamera ke layar untuk memindai QR Code.
    - **Masa Peringatan (Alert Countdown): 15 Detik**.

    - **Skenario A (Pelanggan Menyentuh Layar):** Jika pelanggan menekan tombol _"Ya, Saya Masih Pesan"_, modal peringatan langsung menghilang, memori keranjang belanja **aman tidak terhapus**, dan _timer_ di-reset kembali ke angka `0` (Mulai dari awal lagi) .
    - **Skenario B (Didiamkan Sampai Habis):** Jika waktu 10 detik di modal habis dan tidak ada respons, baru sistem mengeksekusi penghapusan seluruh isi keranjang (_clear array_), menutup modal, dan mengembalikan aplikasi ke **Fase 1 (Screensaver)** .