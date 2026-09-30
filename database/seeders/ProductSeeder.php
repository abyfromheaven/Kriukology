<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $menus = [
            // ── Chicken ───────────────────────────────────────────────
            ['name' => 'Ayam Goreng Crispy 1 Ekor', 'slug' => 'chicken',   'price' => 28000, 'image' => '/assets/produk/Chicken%201%20Ekor.png'],
            ['name' => 'Chicken Sayap 6 Pcs',       'slug' => 'chicken',   'price' => 32000, 'image' => '/assets/produk/Chicken%20Sayap.jpg'],

            // ── Bowl / Burger ─────────────────────────────────────────
            ['name' => 'Yakiniku Don',             'slug' => 'burger',    'price' => 29000, 'image' => '/assets/produk/Yakiniku%20Don.jpg'],
            ['name' => 'Zinger Burger',            'slug' => 'burger',    'price' => 34000, 'image' => '/assets/produk/Burger.jpg'],

            // ── Snack / Sides ─────────────────────────────────────────
            ['name' => 'Chicken Popcorn',          'slug' => 'snack',     'price' => 26000, 'image' => '/assets/produk/Chicken%20Popcorn.jpg'],
            ['name' => 'French Fries',             'slug' => 'snack',     'price' => 14000, 'image' => '/assets/produk/French%20Fries.jpg'],
            ['name' => 'Cream Soup',               'slug' => 'snack',     'price' => 15000, 'image' => '/assets/produk/Cream%20Soup.jpg'],

            // ── Dessert ───────────────────────────────────────────────
            ['name' => 'Coconut Sundae',           'slug' => 'dessert',   'price' => 14000, 'image' => '/assets/produk/Choconut%20Sundae.jpg'],
            ['name' => 'Donut Gula',               'slug' => 'dessert',   'price' => 12000, 'image' => '/assets/produk/Donut.jpg'],

            // ── Beverage ──────────────────────────────────────────────
            ['name' => 'Iced Cappuccino Float',    'slug' => 'beverage',  'price' => 22000, 'image' => '/assets/produk/Iced%20Cappucino%20Float.jpg'],
            ['name' => 'Mocha Float',              'slug' => 'beverage',  'price' => 24000, 'image' => '/assets/produk/Mocha%20Float.jpg'],
        ];

        // Kategori dibuat oleh CategorySeeder, dipanggil lebih dulu di DatabaseSeeder
        $categoryIds = Category::pluck('id', 'slug');

        foreach ($menus as $menu) {
            $categoryId = $categoryIds[$menu['slug']] ?? null;

            if (!$categoryId) {
                throw new \RuntimeException("Kategori '{$menu['slug']}' belum ada. Jalankan CategorySeeder lebih dulu.");
            }

            unset($menu['slug']);

            Product::create($menu + ['category_id' => $categoryId, 'stock' => 100, 'is_available' => true]);
        }
    }
}
