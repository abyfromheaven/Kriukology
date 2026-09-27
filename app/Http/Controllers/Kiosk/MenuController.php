<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    // API: Ambil daftar produk aktif untuk grid menu kiosk
    public function index(): JsonResponse
    {
        $products = Product::where('is_available', true)
            ->orderBy('category')
            ->get(['id', 'name', 'category', 'price', 'image', 'stock']);

        return response()->json($products);
    }
}
