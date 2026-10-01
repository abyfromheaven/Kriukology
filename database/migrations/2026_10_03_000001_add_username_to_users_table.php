<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Login CMS memakai USERNAME, bukan email.
 *
 * Tabel `users` bawaan Laravel memaksa `email` jadi NOT NULL, padahal di
 * project ini CMS tidak butuh email sama sekali. Jadi `email` dilonggarkan
 * jadi boleh kosong, dan ditambahkan kolom `username` yang unik sebagai
 * identitas login.
 *
 * Tidak ada register dan tidak ada pemulihan password — akun dibuat lewat
 * perintah `php artisan cms:make-user`.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->after('name')->unique();
            $table->string('email')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropColumn('username');
        });
    }
};
