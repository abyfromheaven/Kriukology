<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Login CMS.
 *
 * Sederhana: username + password. Nggak ada pendaftaran, nggak ada pemulihan
 * password. Akun dibuat dari server lewat `php artisan cms:make-user`.
 *
 * Pesan sengaja digabung ("Username atau password salah") supaya halaman ini
 * tidak bisa dipakai untuk menebak username mana yang terdaftar.
 */
class CmsAuthController extends Controller
{
    /** Maksimal percobaan login sebelum dikunci sementara. */
    private const MAX_ATTEMPT = 10;

    /** Lama penguncian dalam detik. */
    private const DECAY_SERATUS = 60;

    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('cms.products');
        }

        // Halaman login dis serving sebagai file statis (bukan Blade), jadi
        // token CSRF disisipkan manual di sini.
        $html = file_get_contents(public_path('cms-login.html'));
        $html = str_replace(
            '<meta name="theme-color" content="#ffffff" />',
            '<meta name="theme-color" content="#ffffff" />'."\n    ".
            '<meta name="csrf-token" content="'.e(csrf_token()).'" />',
            $html,
        );

        return response($html);
    }

    public function login(Request $request): RedirectResponse|JsonResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $throttleKey = $this->throttleKey($request);

        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_ATTEMPT)) {
            $tinggu = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'username' => "Terlalu banyak percobaan. Coba lagi dalam {$tinggu} detik.",
            ]);
        }

        $user = Auth::attempt(
            ['username' => $credentials['username'], 'password' => $credentials['password']],
            $request->boolean('remember'),
        );

        if ($user) {
            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            // Form login di-CDN via fetch(). Kalau mengirim redirect 302, fetch
            // akan mengikuti redirect itu, menerima HTML (bukan JSON), lalu
            // res.json() gagal — jadi login terlihat "gagal" padahal sukses.
            // Karena itu request JSON dibalas JSON, lalu frontend yang mengarahkan.
            if ($request->expectsJson()) {
                return response()->json([
                    'success'  => true,
                    'redirect' => route('cms.products'),
                ]);
            }

            return redirect()->intended(route('cms.products'));
        }

        RateLimiter::hit($throttleKey, self::DECAY_SERATUS);

        // Satu pesan untuk dua-duanya: tidak bocorkan username mana yang ada.
        throw ValidationException::withMessages([
            'username' => 'Username atau password salah.',
        ]);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('cms.login');
    }

    /** Kunci rate limit dikaitkan ke username + alamat IP. */
    private function throttleKey(Request $request): string
    {
        return Str::transliterate(
            Str::lower((string) $request->input('username')).'|'.$request->ip()
        );
    }
}
