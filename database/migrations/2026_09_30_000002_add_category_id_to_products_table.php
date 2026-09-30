<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tambah kolom (nullable dulu supaya aman saat backfill)
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('category')->constrained('categories');
        });

        // 2. Backfill: cocokkan tiap produk ke baris kategori berdasarkan slug.
        //    Kategori yang belum dikenal ikut dibuat, supaya tidak ada produk
        //    yang kehilangan kategori.
        foreach (DB::table('products')->select('id', 'category')->whereNotNull('category')->get() as $product) {
            $slug = strtolower(trim($product->category));

            if ($slug === '') {
                continue;
            }

            $categoryId = DB::table('categories')->where('slug', $slug)->value('id');

            if (!$categoryId) {
                $categoryId = DB::table('categories')->insertGetId([
                    'slug'       => $slug,
                    'label_id'   => $product->category,
                    'label_en'   => $product->category,
                    'icon'       => 'fa-solid fa-utensils',
                    'emoji'      => '🍗',
                    'sort_order' => 99,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('products')->where('id', $product->id)->update(['category_id' => $categoryId]);
        }

        // 3. Sisa produk tanpa kategori (mis. kolom kosong) → kategori paling awal
        if (DB::table('products')->whereNull('category_id')->exists()) {
            $fallback = DB::table('categories')->orderBy('sort_order')->value('id');

            if ($fallback) {
                DB::table('products')->whereNull('category_id')->update(['category_id' => $fallback]);
            }
        }

        // 4. Jadikan wajib
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('category_id')->references('id')->on('categories');
        });

        // 5. Buang kolom teks lama
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('category')->nullable()->after('name');
        });

        DB::table('products')->update([
            'category' => DB::raw('(SELECT slug FROM categories WHERE categories.id = products.category_id)'),
        ]);

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};