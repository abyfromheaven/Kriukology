<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Tambah kolom `type` supaya satu entri bisa berupa gambar (poster) ATAU
 * video. Isi 'image' untuk data yang sudah ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posters', function (Blueprint $table) {
            $table->string('type')->default('image')->after('name');
        });

        DB::table('posters')->update(['type' => 'image']);
    }

    public function down(): void
    {
        Schema::table('posters', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
