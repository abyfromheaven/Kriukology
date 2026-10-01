<?php

namespace App\Http\Controllers\Kiosk;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Poster;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    // API: Daftar kategori + produk + poster untuk grid menu kiosk.
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

        // Poster untuk layar screensaver — dikelola dari CMS "Kelola Poster".
        $posters = Poster::orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'type', 'image']);

        return response()->json([
            'categories' => $categories,
            'products'   => $products,
            'posters'    => $posters,
        ]);
    }
}