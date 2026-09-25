/**
 * ==========================================================================
 * HELPER KOMUNIKASI PEMBAYARAN INTER-TAB (BROADCAST CHANNEL & LOCALSTORAGE)
 * ==========================================================================
 * Mengelola pengiriman sinyal status pembayaran QRIS antara Layar Danu
 * (tab/window terpisah atau tab yang sama) dan Layar QRIS Kiosk.
 * ==========================================================================
 */

const CHANNEL_NAME = 'kriukology_qris_channel'
const STORAGE_KEY = 'kriukology_qris_paid'

let broadcastChannel = null
try {
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME)
  }
} catch (e) {
  broadcastChannel = null
}

/**
 * Kirim sinyal bahwa pembayaran QRIS di Danu telah sukses dilakukan
 * @param {object} payload - Data transaksi (misal: jumlah, timestamp)
 */
export function kirimSinyalPembayaranSukses(payload = {}) {
  const data = {
    type: 'PAYMENT_SUCCESS',
    timestamp: Date.now(),
    ...payload,
  }

  // 1. Kirim via BroadcastChannel (jika didukung)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(data)
    } catch (e) {
      console.warn('Gagal kirim via BroadcastChannel:', e)
    }
  }

  // 2. Kirim via localStorage sebagai fallback inter-tab sync
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Gagal simpan ke localStorage:', e)
  }
}

/**
 * Dengarkan sinyal pembayaran sukses dari Layar Danu
 * @param {function} callback - Dipanggil ketika pembayaran sukses diterima
 * @returns {function} Fungsi cleanup untuk melepas listener
 */
export function dengarkanSinyalPembayaranSukses(callback) {
  const handlerBroadcast = (event) => {
    if (event && event.data && event.data.type === 'PAYMENT_SUCCESS') {
      callback(event.data)
    }
  }

  const handlerStorage = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue)
        if (parsed && parsed.type === 'PAYMENT_SUCCESS') {
          callback(parsed)
        }
      } catch (e) {
        // Abaikan parse error
      }
    }
  }

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handlerBroadcast)
  }
  window.addEventListener('storage', handlerStorage)

  // Kembalikan fungsi pembersih
  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handlerBroadcast)
    }
    window.removeEventListener('storage', handlerStorage)
  }
}
