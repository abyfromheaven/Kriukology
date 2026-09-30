<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /** API: Daftar kategori untuk CMS dan kiosk (urutan tampil) */
    public function index(): JsonResponse
    {
        $categories = Category::orderBy('sort_order')
            ->orderBy('label_id')
            ->get();

        return response()->json($categories);
    }

    /** API: Menambah kategori baru */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label_id'   => 'required|string|max:255',
            'label_en'   => 'required|string|max:255',
            'icon'       => 'nullable|string|max:255',
            'emoji'      => 'nullable|string|max:16',
            'sort_order' => 'nullable|integer|min:0|max:9999',
        ]);

        $slug = $this->buatSlug($validated['label_id']);

        $category = Category::create([
            'slug'       => $slug,
            'label_id'   => $validated['label_id'],
            'label_en'   => $validated['label_en'],
            'icon'       => $validated['icon'] ?: 'fa-solid fa-utensils',
            'emoji'      => $validated['emoji'] ?: '🍗',
            'sort_order' => $validated['sort_order'] ?? $this->sortOrderBerikutnya(),
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Kategori berhasil ditambahkan',
            'category' => $category,
        ], 201);
    }

    /** API: Memperbarui kategori */
    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'label_id'   => 'required|string|max:255',
            'label_en'   => 'required|string|max:255',
            'icon'       => 'nullable|string|max:255',
            'emoji'      => 'nullable|string|max:16',
            'sort_order' => 'nullable|integer|min:0|max:9999',
        ]);

        $category->update([
            'label_id'   => $validated['label_id'],
            'label_en'   => $validated['label_en'],
            'icon'       => $validated['icon'] ?: $category->icon,
            'emoji'      => $validated['emoji'] ?: $category->emoji,
            'sort_order' => $validated['sort_order'] ?? $category->sort_order,
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Kategori berhasil diperbarui',
            'category' => $category->fresh(),
        ]);
    }

    /** API: Menghapus kategori — ditolak kalau masih dipakai produk */
    public function destroy($id): JsonResponse
    {
        $category = Category::withCount('products')->findOrFail($id);

        if ($category->products_count > 0) {
            return response()->json([
                'success' => false,
                'message' => "Kategori \"{$category->label_id}\" masih dipakai {$category->products_count} produk. Pindahkan produknya ke kategori lain terlebih dahulu.",
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus',
        ]);
    }

    /** Slug unik dari label, berdasarkan nama Indonesia */
    private function buatSlug(string $label): string
    {
        $base = Str::slug($label) ?: 'kategori';
        $slug = $base;
        $suffix = 2;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }

    private function sortOrderBerikutnya(): int
    {
        return (int) Category::max('sort_order') + 1;
    }
}