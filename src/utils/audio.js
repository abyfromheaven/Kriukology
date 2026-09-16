/**
 * ==========================================================================
 * UTILITAS AUDIO (SUARA TOMBOL)
 * ==========================================================================
 * Berisi fungsi untuk memutar suara singkat saat pengguna menekan tombol.
 * Menggunakan Web Audio API (Oscillator) sehingga tidak perlu file audio
 * eksternal — suara dihasilkan langsung oleh browser.
 *
 * Keuntungan pendekatan ini:
 * - Tidak perlu load file audio (bundle lebih kecil)
 * - Tidak ada delay pemrosesan file
 * - Bekerja offline tanpa masalah
 *
 * Cara kerja:
 * 1. Buat AudioContext baru
 * 2. Buat Oscillator dengan frekuensi 620Hz (nada sedang)
 * 3. Atur volume awal ke 0.035 (sangat pelan)
 * 4. Fade out (exponential ramp) ke 0.001 dalam 0.07 detik
 * 5. Putar selama 0.08 detik lalu hentikan
 * ==========================================================================
 */

/**
 * mainkanSuara — Memutar suara tombol singkat (beep)
 *
 * Fungsi ini dipanggil setiap kali pengguna melakukan interaksi
 * (menekan tombol, memilih menu, navigasi) untuk memberikan
 * umpan balik audio (haptic-like feedback).
 *
 * Dipanggil dari: navigasiKe(), bukaMenu(), tambahKeKeranjang(),
 *                 ubahJumlah(), tekanKeypad(), selesaikanPesanan()
 */
function mainkanSuara() {
  try {
    // Buat konteks audio baru
    const konteksAudio = new AudioContext()

    // Buat oscillator (penghasil gelombang suara)
    const osilator = konteksAudio.createOscillator()

    // Buat pengatur volume (gain node)
    const pengaturVolume = konteksAudio.createGain()

    // Atur frekuensi nada ke 620Hz (nada sedang, enak di telinga)
    osilator.frequency.value = 620

    // Atur volume awal sangat pelan (0.035)
    pengaturVolume.gain.setValueAtTime(0.035, konteksAudio.currentTime)

    // Fade out: turunkan volume ke 0.001 dalam 0.07 detik
    pengaturVolume.gain.exponentialRampToValueAtTime(
      0.001,
      konteksAudio.currentTime + 0.07
    )

    // Hubungkan: Oscillator → Gain → Output (speaker)
    osilator.connect(pengaturVolume).connect(konteksAudio.destination)

    // Mulai dan hentikan setelah 0.08 detik
    osilator.start()
    osilator.stop(konteksAudio.currentTime + 0.08)
  } catch (kesalahan) {
    // Abaikan jika browser tidak mendukung Web Audio API
  }
}

export default mainkanSuara
