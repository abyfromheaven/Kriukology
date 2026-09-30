<?php

use App\Http\Controllers\CMS\CategoryController as CMSCategoryController;
use App\Http\Controllers\CMS\ProductController as CMSProductController;
use App\Http\Controllers\Kiosk\MenuController;
use App\Http\Controllers\Kiosk\OrderController;
use Illuminate\Support\Facades\Route;

// ── Rute Frontend Halaman Kiosk & CMS ────────────────────────────────────
// Menampilkan hasil `npm run build` (vite outDir = public/).
Route::get('/', fn () => response(file_get_contents(public_path('index.html'))))->name('kiosk.home');
Route::get('/cms', fn () => response(file_get_contents(public_path('cms.html'))))->name('cms.products');

// ── API Kiosk & CMS ──────────────────────────────────────────────────────
Route::prefix('api')->group(function () {
    // API Kiosk
    Route::get('/menu', [MenuController::class, 'index']);
    Route::post('/checkout', [OrderController::class, 'checkout']);

    // API CMS Kelola Produk
    Route::get('/cms/products', [CMSProductController::class, 'index']);
    Route::post('/cms/products', [CMSProductController::class, 'store']);
    Route::put('/cms/products/{id}', [CMSProductController::class, 'update']);
    Route::post('/cms/products/{id}', [CMSProductController::class, 'update']); // Fallback untuk multipart/form-data
    Route::delete('/cms/products/{id}', [CMSProductController::class, 'destroy']);

    // API CMS Kelola Kategori
    Route::get('/cms/categories', [CMSCategoryController::class, 'index']);
    Route::post('/cms/categories', [CMSCategoryController::class, 'store']);
    Route::put('/cms/categories/{id}', [CMSCategoryController::class, 'update']);
    Route::delete('/cms/categories/{id}', [CMSCategoryController::class, 'destroy']);
});