import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  publicDir: false,
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  build: {
    // Build langsung ke public/ supaya `php artisan serve` bisa langsung dipakai.
    // emptyOutDir:false — public/ berisi index.php, qrcode.js, storage/, dan
    // aset gambar (public/assets) yang tidak digenerate Vite.
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        danu: resolve(__dirname, 'danu.html'),
        cms: resolve(__dirname, 'cms.html'),
      },
    },
  },
})