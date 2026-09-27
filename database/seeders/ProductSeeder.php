<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $menus = [
            // ── Promotion ──────────────────────────────────────────────
            ['name' => 'Super Promo Hemat',       'category' => 'promotion', 'price' => 28000,  'image' => 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Combo Berdua Super',       'category' => 'promotion', 'price' => 52000,  'image' => 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80'],

            // ── Limited Time Offer ────────────────────────────────────
            ['name' => 'Chaki Spicy Fire Ayam',    'category' => 'lto',       'price' => 26000,  'image' => 'https://images.unsplash.com/photo-1625938146369-ad802ce17300?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Smoky Honey BBQ Box',      'category' => 'lto',       'price' => 42000,  'image' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'],

            // ── Chicken ───────────────────────────────────────────────
            ['name' => '1 Pcs Ayam Crispy',        'category' => 'chicken',   'price' => 19500,  'image' => 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80'],
            ['name' => '1 Pcs Ayam Original',      'category' => 'chicken',   'price' => 19500,  'image' => 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=500&auto=format&fit=crop&q=80'],
            ['name' => '2 Pcs Ayam Combo',         'category' => 'chicken',   'price' => 38000,  'image' => 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80'],

            // ── Box ───────────────────────────────────────────────────
            ['name' => 'Super Family Box',         'category' => 'box',       'price' => 85000,  'image' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Crispy Bento Box',         'category' => 'box',       'price' => 35000,  'image' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'],

            // ── Bucket & Sharing ──────────────────────────────────────
            ['name' => 'Bucket 9 Pcs Ayam',        'category' => 'bucket',    'price' => 145000, 'image' => 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Snack Bucket Family',      'category' => 'bucket',    'price' => 68000,  'image' => 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80'],

            // ── Bowl / Burger ─────────────────────────────────────────
            ['name' => 'Zinger Burger Super',      'category' => 'burger',    'price' => 34000,  'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Oriental Chicken Bowl',    'category' => 'burger',    'price' => 27000,  'image' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80'],

            // ── Snack / Sides ─────────────────────────────────────────
            ['name' => 'French Fries Large',       'category' => 'snack',     'price' => 21000,  'image' => 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Chicken Strips 3 Pcs',     'category' => 'snack',     'price' => 24000,  'image' => 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Crispy Skin / Kulit Ayam', 'category' => 'snack',     'price' => 16000,  'image' => 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80'],

            // ── Beverage ──────────────────────────────────────────────
            ['name' => 'Pepsi Zero Sugar',         'category' => 'beverage',  'price' => 12000,  'image' => 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Iced Lemon Tea',           'category' => 'beverage',  'price' => 10000,  'image' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Air Mineral 600ml',        'category' => 'beverage',  'price' => 7000,   'image' => 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80'],

            // ── Kids Meal ─────────────────────────────────────────────
            ['name' => 'Chaki Kids Combo A',       'category' => 'kids',      'price' => 38000,  'image' => 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Chaki Kids Burger Pack',   'category' => 'kids',      'price' => 36000,  'image' => 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80'],

            // ── Breakfast ─────────────────────────────────────────────
            ['name' => 'Riser Chicken Roll',       'category' => 'breakfast', 'price' => 18000,  'image' => 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Bubur Ayam Original',      'category' => 'breakfast', 'price' => 15000,  'image' => 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80'],

            // ── Dessert ───────────────────────────────────────────────
            ['name' => 'Sundae Chocolate',         'category' => 'dessert',   'price' => 11000,  'image' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80'],
            ['name' => 'Egg Tart Warm',            'category' => 'dessert',   'price' => 13000,  'image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80'],
        ];

        foreach ($menus as $menu) {
            Product::create($menu + ['stock' => 100, 'is_available' => true]);
        }
    }
}
