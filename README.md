# Kriukology — Self-Ordering Kiosk

Prototype frontend interaktif untuk alur pemesanan mandiri restoran cepat saji. Dibuat dari PRD proyek menggunakan Vite, Tailwind CSS, Alpine.js, dan Animate.css.

## Menjalankan project

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite (umumnya `http://localhost:5173`). Untuk build produksi:

```bash
npm run build
```

## Yang tersedia di prototype

- Lockscreen promosi, pemilihan bahasa Indonesia/English, dan tipe pesanan.
- Menu berkategori, modal kustomisasi paket, keranjang, serta perhitungan Rupiah real-time.
- Pengiriman ke meja dengan keypad dan validasi nomor meja 1–99.
- Simulasi QRIS, e-wallet, mobile banking, debit, dan tunai.
- Splash sukses, nomor antrean, serta struk digital dengan reset otomatis.

Data menu dan checkout masih bersifat lokal di browser agar demo bisa berjalan tanpa backend. Laravel, SQLite, admin POS, dan KDS dapat ditambahkan pada tahap berikutnya.
