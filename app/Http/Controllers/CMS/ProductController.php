<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /** Batas ukuran gambar hasil decode: 2 MB */
    private const MAKS_GAMBAR_KB = 2048;

    // API: Ambil semua produk untuk CMS (termasuk yang stok 0)
    public function index(): JsonResponse
    {
        $products = Product::with('category')->orderBy('id', 'desc')->get();
        return response()->json($products);
    }

    // API: Menambah produk baru dari CMS
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'price'       => 'required|integer|min:1',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|string',
        ]);

        $imageUrl = $this->handleImageUpload($request, $request->input('image'));

        $product = Product::create([
            'name'         => $validated['name'],
            'category_id'  => $validated['category_id'],
            'price'        => $validated['price'],
            'stock'        => $validated['stock'],
            'image'        => $imageUrl ?: '/assets/menu-placeholder.svg',
            'is_available' => $validated['stock'] > 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan',
            'product' => $product->load('category'),
        ], 201);
    }

    // API: Memperbarui produk yang ada
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'price'       => 'required|integer|min:1',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|string',
        ]);

        $imageInput = $request->input('image');
        if (!empty($imageInput) && $imageInput !== $product->image) {
            $product->image = $this->handleImageUpload($request, $imageInput);
        }

        $product->name = $validated['name'];
        $product->category_id = $validated['category_id'];
        $product->price = $validated['price'];
        $product->stock = $validated['stock'];
        $product->is_available = $validated['stock'] > 0;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diperbarui',
            'product' => $product->load('category'),
        ]);
    }

    // API: Hapus produk
    // Produk yang pernah dipesan juga boleh dihapus — rincian pesanan ikut
    // terhapus lewat FK cascade (lihat migrasi relaxasi order_details).
    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus',
        ]);
    }

    // Helper: Penanganan Simpan Gambar (Base64 atau Upload File)
    private function handleImageUpload(Request $request, ?string $imageString): string
    {
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'product_' . time() . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            return Storage::url($path);
        }

        if ($imageString && preg_match('/^data:image\/(\w+);base64,/', $imageString, $type)) {
            $data = substr($imageString, strpos($imageString, ',') + 1);
            $type = strtolower($type[1]); // png, jpg, jpeg, webp

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                $type = 'webp';
            }

            $decoded = base64_decode($data, true);
            if ($decoded !== false) {
                if (strlen($decoded) > self::MAKS_GAMBAR_KB * 1024) {
                    throw ValidationException::withMessages([
                        'image' => 'Ukuran gambar maksimal ' . (self::MAKS_GAMBAR_KB / 1024) . ' MB.',
                    ]);
                }

                $filename = 'products/product_' . time() . '_' . Str::random(6) . '.' . $type;
                Storage::disk('public')->put($filename, $decoded);
                return Storage::url($filename);
            }
        }

        return $imageString ?: '/assets/menu-placeholder.svg';
    }
}