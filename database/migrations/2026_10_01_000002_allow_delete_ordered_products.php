<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Rincian pesanan (order_details) tadinya memakai FK "restrict" ke products,
 * jadi produk yang sudah pernah dipesan tidak bisa dihapus dari CMS.
 *
 * Sekarang manajer boleh menghapus produk kapan saja, jadi FK-nya dilonggarkan
 * jadi cascade: begitu produk dihapus, rincian pesanannya ikut terhapus supaya
 * tidak ada data yatim.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('restrict');
        });
    }
};
