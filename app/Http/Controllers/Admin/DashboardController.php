<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    // Tampilkan dashboard utama POS & KDS (semua data 3 tab dalam satu halaman)
    public function index()
    {
        $products  = Product::latest()->get();
        $orders    = Order::with('orderDetails.product')
            ->whereIn('status', ['pending', 'paid'])
            ->orderBy('created_at')
            ->get();
        $diproses  = Order::where('status', 'paid')->orderBy('created_at')->get();
        $siapAmbil = Order::where('status', 'completed')->orderBy('updated_at', 'desc')->get();

        return view('admin.dashboard', compact('products', 'orders', 'diproses', 'siapAmbil'));
    }

    // API JSON: data pesanan untuk auto-refresh AJAX di tab KDS & Lobi
    public function data(): JsonResponse
    {
        $orders    = Order::with('orderDetails.product')
            ->whereIn('status', ['pending', 'paid'])
            ->orderBy('created_at')
            ->get();
        $diproses  = Order::where('status', 'paid')->orderBy('created_at')->get();
        $siapAmbil = Order::where('status', 'completed')->orderBy('updated_at', 'desc')->get();

        return response()->json(compact('orders', 'diproses', 'siapAmbil'));
    }
}
