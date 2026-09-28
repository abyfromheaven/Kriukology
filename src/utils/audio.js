/**
 * ==========================================================================
 * UTILITAS AUDIO (SUARA TOMBOL & CASH REGISTER)
 * ==========================================================================
 * Berisi fungsi untuk memutar suara singkat (beep) saat tombol ditekan,
 * suara cash register ("cha-ching") untuk splash sukses kiosk, serta
 * pemutar file audio lokal (mis. sound sukses Danu).
 * Semuanya berjalan offline tanpa perlu koneksi internet.
 * ==========================================================================
 */

/**
 * mainkanSuara — Memutar suara tombol singkat (beep)
 * Dipakai untuk SEMUAS klik: screensaver, kategori, tambah item, dst.
 * Volume sengaja dibuat tinggi agar terdengar jelas di ruang restoran.
 */
function mainkanSuara() {
  try {
    const konteksAudio = new (window.AudioContext || window.webkitAudioContext)()
    const osilator = konteksAudio.createOscillator()
    const pengaturVolume = konteksAudio.createGain()

    osilator.frequency.value = 620
    pengaturVolume.gain.setValueAtTime(0.8, konteksAudio.currentTime)
    pengaturVolume.gain.exponentialRampToValueAtTime(
      0.001,
      konteksAudio.currentTime + 0.12
    )

    osilator.connect(pengaturVolume).connect(konteksAudio.destination)
    osilator.start()
    osilator.stop(konteksAudio.currentTime + 0.13)
  } catch (e) {
    // Abaikan jika browser tidak mendukung Web Audio API
  }
}

/**
 * mainkanFileSuara — Memutar file audio lokal (mis. /assets/sound/dana.mp3)
 * Aman dipanggil dari event handler (sudah ada interaksi user, jadi
 * kebijakan autoplay browser mengizinkan pemutaran).
 */
export function mainkanFileSuara(src) {
  try {
    const audio = new Audio(src)
    audio.volume = 1
    const proses = audio.play()
    if (proses && typeof proses.catch === 'function') {
      proses.catch(() => {})
    }
  } catch (e) {
    // Abaikan jika file tidak ada / tidak didukung
  }
}

/**
 * mainkanSuaraCash — Memutar efek suara cash register ("cha-ching")
 */
export function mainkanSuaraCash() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    const waktuMulai = ctx.currentTime

    // Nada pertama (Ching 1 - pitch medium-tinggi 987Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(987, waktuMulai)
    gain1.gain.setValueAtTime(0.15, waktuMulai)
    gain1.gain.exponentialRampToValueAtTime(0.001, waktuMulai + 0.25)
    osc1.connect(gain1).connect(ctx.destination)
    osc1.start(waktuMulai)
    osc1.stop(waktuMulai + 0.25)

    // Nada kedua (Ching 2 - pitch sangat tinggi 1318Hz, sedikit delay 0.08s)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1318, waktuMulai + 0.08)
    gain2.gain.setValueAtTime(0.25, waktuMulai + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.001, waktuMulai + 0.5)
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(waktuMulai + 0.08)
    osc2.stop(waktuMulai + 0.5)

    // Tone penyempurna resonance (1567Hz)
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(1567.98, waktuMulai + 0.1)
    gain3.gain.setValueAtTime(0.2, waktuMulai + 0.1)
    gain3.gain.exponentialRampToValueAtTime(0.001, waktuMulai + 0.6)
    osc3.connect(gain3).connect(ctx.destination)
    osc3.start(waktuMulai + 0.1)
    osc3.stop(waktuMulai + 0.6)
  } catch (e) {
    // Abaikan jika tidak didukung
  }
}

export default mainkanSuara
