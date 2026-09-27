<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Simpan produk baru dari form modal
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'price'    => 'required|integer|min:0',
            'image'    => 'nullable|image|mimes:jpeg,png,webp|max:2048',
        ]);

        // Upload gambar ke public/storage/images/, fallback ke default jika kosong
        $imageName = 'default-chicken.png';
        if ($request->hasFile('image')) {
            $imageName = $request->file('image')->store('images', 'public');
        }

        Product::create([
            ...$validated,
            'image' => $imageName,
            'stock' => 100,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Produk berhasil ditambahkan!');
    }

    // Hapus produk dari database
    public function destroy(Product $product)
    {
        // Hapus file gambar jika bukan default
        if ($product->image && $product->image !== 'default-chicken.png') {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return redirect()->route('admin.dashboard')->with('success', 'Produk berhasil dihapus!');
    }

    // Toggle ketersediaan stok produk (tersedia <-> habis)
    public function updateAvailability(Product $product)
    {
        $product->update(['is_available' => !$product->is_available]);
        return redirect()->route('admin.dashboard')->with('success', 'Status ketersediaan diperbarui!');
    }
}
