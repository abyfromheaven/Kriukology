<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Idempotent — 5 kategori ini sudah dibuat oleh migration, seeder ini
     * hanya memastikan isinya sinkron (aman dijalankan berulang).
     */
    public function run(): void
    {
        $defaults = [
            ['slug' => 'chicken',  'label_id' => 'Chicken',      'label_en' => 'Chicken',      'icon' => 'fa-solid fa-drumstick-bite', 'emoji' => '🍗', 'sort_order' => 1],
            ['slug' => 'burger',   'label_id' => 'Bowl / Burger', 'label_en' => 'Bowl / Burger', 'icon' => 'fa-solid fa-burger',         'emoji' => '🍔', 'sort_order' => 2],
            ['slug' => 'snack',    'label_id' => 'Snack / Sides', 'label_en' => 'Snack / Sides', 'icon' => 'fa-solid fa-cookie-bite',    'emoji' => '🍟', 'sort_order' => 3],
            ['slug' => 'dessert',  'label_id' => 'Dessert',       'label_en' => 'Dessert',       'icon' => 'fa-solid fa-ice-cream',      'emoji' => '🍦', 'sort_order' => 4],
            ['slug' => 'beverage', 'label_id' => 'Beverage',      'label_en' => 'Beverage',      'icon' => 'fa-solid fa-mug-hot',        'emoji' => '🥤', 'sort_order' => 5],
        ];

        foreach ($defaults as $row) {
            Category::updateOrCreate(['slug' => $row['slug']], $row);
        }
    }
}