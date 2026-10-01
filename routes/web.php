<?php

use App\Http\Controllers\Auth\CmsAuthController;
use App\Http\Controllers\CMS\CategoryController as CMSCategoryController;
use App\Http\Controllers\CMS\PosterController as CMSPosterController;
use App\Http\Controllers\CMS\ProductController as CMSProductController;
use App\Http\Controllers\Kiosk\MenuController;
use App\Http\Controllers\Kiosk\OrderController;
use App\Http\Controllers\Kiosk\QrisController;
use Illuminate\Support\Facades\Route;

// ── Login CMS ───────────────────────────────────────────────────────────
// Nggak ada pendaftaran & pemulihan password. Akun dibuat dari server
// lewat `php artisan cms:make-user`.
Route::get('/cms/login', [CmsAuthController::class, 'showLogin'])->name('cms.login');
Route::post('/cms/login', [CmsAuthController::class, 'login'])
    ->middleware('throttle:20,1')
    ->name('cms.login.attempt');
Route::post('/cms/logout', [CmsAuthController::class, 'logout'])->name('cms.logout');

// ── Rute Frontend Halaman Kiosk & CMS ────────────────────────────────────
// Menampilkan hasil `npm run build` (vite outDir = public/).
// Kiosk publik. CMS wajib login: tanpa middleware ini orang tetap bisa
// memanggil API CMS langsung tanpa pernah melihat halaman login.
Route::get('/', fn () => response(file_get_contents(public_path('index.html'))))->name('kiosk.home');
Route::get('/cms', fn () => response(file_get_contents(public_path('cms.html'))))
    ->middleware('auth')
    ->name('cms.products');

// ── API Kiosk & CMS ──────────────────────────────────────────────────────
Route::prefix('api')->group(function () {

    // ── API Kiosk (publik — tidak butuh login) ──
    Route::get('/menu', [MenuController::class, 'index']);
    Route::post('/checkout', [OrderController::class, 'checkout']);

    // QRIS
    // CATATAN: /pay SENGAJA publik — HP pelanggan yang memindai QR tidak punya
    // session login. /info dan /status hanya dipakai kiosk.
    Route::get('/qris/info', [QrisController::class, 'info']);
    Route::post('/qris/pay', [QrisController::class, 'pay']);
    Route::get('/qris/status/{token}', [QrisController::class, 'status']);

    // ── API CMS (WAJIB login) ──
    Route::middleware('auth')->group(function () {
        // Kelola Produk
        Route::get('/cms/products', [CMSProductController::class, 'index']);
        Route::post('/cms/products', [CMSProductController::class, 'store']);
        Route::put('/cms/products/{id}', [CMSProductController::class, 'update']);
        Route::post('/cms/products/{id}', [CMSProductController::class, 'update']); // Fallback multipart
        Route::delete('/cms/products/{id}', [CMSProductController::class, 'destroy']);

        // Kelola Kategori
        Route::get('/cms/categories', [CMSCategoryController::class, 'index']);
        Route::post('/cms/categories', [CMSCategoryController::class, 'store']);
        Route::put('/cms/categories/{id}', [CMSCategoryController::class, 'update']);
        Route::delete('/cms/categories/{id}', [CMSCategoryController::class, 'destroy']);

        // Kelola Media
        Route::get('/cms/posters', [CMSPosterController::class, 'index']);
        Route::post('/cms/posters', [CMSPosterController::class, 'store']);
        Route::put('/cms/posters/{id}', [CMSPosterController::class, 'update']);
        Route::delete('/cms/posters/{id}', [CMSPosterController::class, 'destroy']);
    });
});
