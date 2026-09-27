<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KdsController;
use App\Http\Controllers\Admin\LobbyController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Kiosk\MenuController;
use App\Http\Controllers\Kiosk\OrderController;
use Illuminate\Support\Facades\Route;

// ── Rute Kiosk (Self-Ordering) ──────────────────────────────────────────
Route::get('/', function () {
    return file_get_contents(base_path('index.html'));
})->name('kiosk.home');

// API Kiosk
Route::prefix('api')->group(function () {
    Route::get('/menu', [MenuController::class, 'index']);
    Route::post('/checkout', [OrderController::class, 'checkout']);
});

// ── Rute Admin (POS & KDS) ──────────────────────────────────────────────
Route::prefix('admin')->group(function () {
    // Dashboard utama (3 tab: CRUD, KDS, Lobi TV)
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/data', [DashboardController::class, 'data'])->name('admin.data');

    // Tab 1: CRUD Produk
    Route::post('/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::patch('/products/{product}/availability', [ProductController::class, 'updateAvailability'])->name('admin.products.availability');

    // Tab 2: KDS Dapur (aksi transisi status)
    Route::patch('/orders/{order}/pay', [KdsController::class, 'konfirmasiBayar'])->name('admin.orders.pay');
    Route::patch('/orders/{order}/complete', [KdsController::class, 'selesaikanPesanan'])->name('admin.orders.complete');

    // Tab 3: Monitor Lobi TV (panggil antrean)
    Route::post('/lobby/call', [LobbyController::class, 'panggilAntrean'])->name('admin.lobby.call');
});
