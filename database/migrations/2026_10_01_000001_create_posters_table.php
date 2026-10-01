<?php

namespace Database\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Isi 3 poster bawaan yang sebelumnya hardcode di
        // src/templates/layar-screensaver.js
        $bawaan = [
            ['name' => 'Poster 1', 'image' => '/assets/poster/poster1.webp', 'sort_order' => 1],
            ['name' => 'Poster 2', 'image' => '/assets/poster/poster2.webp', 'sort_order' => 2],
            ['name' => 'Poster 3', 'image' => '/assets/poster/poster3.webp', 'sort_order' => 3],
        ];

        foreach ($bawaan as $row) {
            DB::table('posters')->insert($row + ['created_at' => now(), 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('posters');
    }
};
