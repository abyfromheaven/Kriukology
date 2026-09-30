<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $menus = [
            // ── Chicken ───────────────────────────────────────────────
            ['name' => 'Ayam Goreng Crispy 1 Ekor', 'category' => 'chicken',   'price' => 28000, 'image' => '/assets/produk/Chicken%201%20Ekor.png'],
            ['name' => 'Chicken Sayap 6 Pcs',       'category' => 'chicken',   'price' => 32000, 'image' => '/assets/produk/Chicken%20Sayap.jpg'],

            // ── Bowl / Burger ─────────────────────────────────────────
            ['name' => 'Yakiniku Don',             'category' => 'burger',    'price' => 29000, 'image' => '/assets/produk/Yakiniku%20Don.jpg'],
            ['name' => 'Zinger Burger',            'category' => 'burger',    'price' => 34000, 'image' => '/assets/produk/Burger.jpg'],

            // ── Snack / Sides ─────────────────────────────────────────
            ['name' => 'Chicken Popcorn',          'category' => 'snack',     'price' => 26000, 'image' => '/assets/produk/Chicken%20Popcorn.jpg'],
            ['name' => 'French Fries',             'category' => 'snack',     'price' => 14000, 'image' => '/assets/produk/French%20Fries.jpg'],
            ['name' => 'Cream Soup',               'category' => 'snack',     'price' => 15000, 'image' => '/assets/produk/Cream%20Soup.jpg'],

            // ── Dessert ───────────────────────────────────────────────
            ['name' => 'Coconut Sundae',           'category' => 'dessert',   'price' => 14000, 'image' => '/assets/produk/Choconut%20Sundae.jpg'],
            ['name' => 'Donut Gula',               'category' => 'dessert',   'price' => 12000, 'image' => '/assets/produk/Donut.jpg'],

            // ── Beverage ──────────────────────────────────────────────
            ['name' => 'Iced Cappuccino Float',    'category' => 'beverage',  'price' => 22000, 'image' => '/assets/produk/Iced%20Cappucino%20Float.jpg'],
            ['name' => 'Mocha Float',              'category' => 'beverage',  'price' => 24000, 'image' => '/assets/produk/Mocha%20Float.jpg'],
        ];

        foreach ($menus as $menu) {
            Product::create($menu + ['stock' => 100, 'is_available' => true]);
        }
    }
}
