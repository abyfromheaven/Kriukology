<?php

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
