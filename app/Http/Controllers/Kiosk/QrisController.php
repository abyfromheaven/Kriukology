<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Perantara pembayaran QRIS antara Kiosk dan Layar Danu.
 *
 * Kenapa perlu server: notifikasi antar halaman harus lewat server supaya
 * bisa jalan lintas perangkat. BroadcastChannel & localStorage hanya bekerja
 * di satu browser/perangkat, jadi HP tidak akan pernah \"mendengar\" kiosk.
 *
 * Alur:
 *   1. Kiosk buka layar QRIS  -> GET  /api/qris/info        (ambil alamat Danu)
 *   2. Kiosk tampilkan QR     -> alamat + ?amount=..&token=..
 *   3. Pelanggan scan di HP   -> POST /api/qris/pay          (lapor bayar)
 *   4. Kiosk cek berkala      -> GET  /api/qris/status/{token}
 *
 * Token penting: tanpa itu, pembayaran milik satu pesanan bisa dianggap
 * milik pesanan lain yang kebetulan nilainya sama.
 */
class QrisController extends Controller
{
    /** Berapa lama status pembayaran disimpan (detik). 10 menit. */
    private const TTL_PEMBAYARAN = 600;

    /** Kunci cache per token */
    private function kunci(string $token): string
    {
        return "kriukology:qris:{$token}";
    }

    /**
     * GET /api/qris/info
     * Dipanggil sekali saat kiosk start: alamat halaman Danu, kecepatan cek,
     * dan batas waktu menunggu pembayaran.
     */
    public function info(Request $request): JsonResponse
    {
        return response()->json([
            'danu_url'   => $this->danuUrl($request),
            'poll_ms'    => 1500,
            'timeout_s'  => 180,
        ]);
    }

    /**
     * POST /api/qris/pay
     * Dipanggil Layar Danu setelah pembayaran dianggap berhasil.
     */
    public function pay(Request $request): JsonResponse
    {
        // Syarat token harus sama persis dengan yang dibaca status(). Kalau
        // longgarkan di sini saja, pembayaran masuk tapi kiosk tidak pernah
        // membacanya — hilang tanpa jejak.
        $validated = $request->validate([
            'token'  => ['required', 'string', 'regex:/^[a-f0-9]{32}$/'],
            'amount' => 'required|integer|min:1',
        ]);

        Cache::put(
            $this->kunci($validated['token']),
            [
                'amount'   => $validated['amount'],
                'paid_at'  => now()->toIso8601String(),
            ],
            self::TTL_PEMBAYARAN
        );

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran diterima',
        ]);
    }

    /**
     * GET /api/qris/status/{token}
     * Dipanggil kiosk secara berkala untuk tahu apakah sudah dibayar.
     */
    public function status(string $token): JsonResponse
    {
        // Batasi panjang agar tidak ada orang iseng meng-cache key raksasa
        if (!preg_match('/^[a-f0-9]{32}$/', $token)) {
            return response()->json(['paid' => false, 'amount' => null]);
        }

        $data = Cache::get($this->kunci($token));

        return response()->json([
            'paid'   => $data !== null,
            'amount' => $data['amount'] ?? null,
        ]);
    }

    /**
     * Susun URL halaman Danu yang bisa dibuka HP.
     * Pakai IP jaringan, bukan localhost — HP tidak akan bisa membuka
     * "localhost" karena itu berarti "HP itu sendiri".
     */
    private function danuUrl(Request $request): string
    {
        $ip = $this->serverIp();

        return $ip
            ? $request->getScheme() . '://' . $ip . ':' . $request->getPort() . '/danu.html'
            : '/danu.html';
    }

    /**
     * Deteksi IP jaringan server.
     *
     * Urutan prioritas:
     *   1. QRIS_SERVER_IP di .env (isi manual kalau deteksi otomatis salah)
     *   2. Tanya kernel: IP mana yang dipakai untuk keluar ke internet
     *      -> otomatis memilih interface yang benar (Wi-Fi, bukan bridge VM)
     *   3. hostname -I (kalau cara di atas gagal)
     *   4. gethostbyname() (sorotan akhir)
     */
    private function serverIp(): ?string
    {
        $manual = env('QRIS_SERVER_IP');
        if (is_string($manual) && filter_var(trim($manual), FILTER_VALIDATE_IP)) {
            return trim($manual);
        }

        $dariRoute = $this->ipDariRoute();
        if ($dariRoute) {
            return $dariRoute;
        }

        $dariHostname = $this->ipDariHostname();
        if ($dariHostname) {
            return $dariHostname;
        }

        $resolved = gethostbyname(gethostname());
        return filter_var($resolved, FILTER_VALIDATE_IP) ? $resolved : null;
    }

    /** Tanya kernel IP sumber untuk ke luar (Linux): `ip route get` */
    private function ipDariRoute(): ?string
    {
        if (!$this->bolehJalankanPerintah()) {
            return null;
        }

        $keluaran = @shell_exec('ip route get 1.1.1.1 2>/dev/null');
        if ($keluaran && preg_match('/\bsrc\s+(\d+\.\d+\.\d+\.\d+)/', $keluaran, $m)) {
            return $m[1];
        }

        return null;
    }

    /** Fallback: `hostname -I`, ambil address pertama yang bukan loopback */
    private function ipDariHostname(): ?string
    {
        if (!$this->bolehJalankanPerintah()) {
            return null;
        }

        $keluaran = @shell_exec('hostname -I 2>/dev/null');
        if (!$keluaran) {
            return null;
        }

        foreach (preg_split('/\s+/', trim($keluaran)) as $ip) {
            if (filter_var($ip, FILTER_VALIDATE_IP) && !str_starts_with($ip, '127.')) {
                return $ip;
            }
        }

        return null;
    }

    /** Cek shell_exec tersedia dan tidak dinonaktifkan di php.ini */
    private function bolehJalankanPerintah(): bool
    {
        if (!function_exists('shell_exec') || !function_exists('exec')) {
            return false;
        }

        $disable = ini_get('disable_functions');
        return !in_array('shell_exec', array_map('trim', explode(',', (string) $disable)), true);
    }
}
