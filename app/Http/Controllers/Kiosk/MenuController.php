<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    // API: Daftar kategori + produk untuk grid menu kiosk.
    // Kategori dikirim terpisah supaya tab kiosk bisa digambar dari server,
    // termasuk kategori yang belum punya produk.
    public function index(): JsonResponse
    {
        $categories = Category::orderBy('sort_order')
            ->orderBy('label_id')
            ->get(['id', 'slug', 'label_id', 'label_en', 'icon', 'emoji', 'sort_order']);

        $products = Product::with('category:id,slug,label_id,label_en,icon,emoji,sort_order')
            ->orderBy('sort_order')
            ->orderBy('id', 'asc')
            ->get(['id', 'name', 'category_id', 'price', 'image', 'stock', 'is_available']);

        return response()->json([
            'categories' => $categories,
            'products'   => $products,
        ]);
    }
}