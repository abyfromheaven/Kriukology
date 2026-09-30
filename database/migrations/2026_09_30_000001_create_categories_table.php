<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('label_id');
            $table->string('label_en');
            $table->string('icon')->default('fa-solid fa-utensils');
            $table->string('emoji', 16)->default('🍗');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Isi 5 kategori yang sebelumnya hardcode di src/data/kategori.js
        $defaults = [
            ['slug' => 'chicken',  'label_id' => 'Chicken',      'label_en' => 'Chicken',      'icon' => 'fa-solid fa-drumstick-bite', 'emoji' => '🍗', 'sort_order' => 1],
            ['slug' => 'burger',   'label_id' => 'Bowl / Burger', 'label_en' => 'Bowl / Burger', 'icon' => 'fa-solid fa-burger',         'emoji' => '🍔', 'sort_order' => 2],
            ['slug' => 'snack',    'label_id' => 'Snack / Sides', 'label_en' => 'Snack / Sides', 'icon' => 'fa-solid fa-cookie-bite',    'emoji' => '🍟', 'sort_order' => 3],
            ['slug' => 'dessert',  'label_id' => 'Dessert',       'label_en' => 'Dessert',       'icon' => 'fa-solid fa-ice-cream',      'emoji' => '🍦', 'sort_order' => 4],
            ['slug' => 'beverage', 'label_id' => 'Beverage',      'label_en' => 'Beverage',      'icon' => 'fa-solid fa-mug-hot',        'emoji' => '🥤', 'sort_order' => 5],
        ];

        foreach ($defaults as $row) {
            DB::table('categories')->insert($row + ['created_at' => now(), 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};