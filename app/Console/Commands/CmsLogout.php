<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Memaksa semua session CMS ditutup.
 *
 * Dipakai kalau halaman CMS dibiarkan terbuka di komputer bersama dan mau
 * mengeluarkan pengelola tanpa harus menunggu session berakhir sendiri.
 */
class CmsLogout extends Command
{
    protected $signature = 'cms:logout';

    protected $description = 'Tutup semua session login CMS';

    public function handle(): int
    {
        $jumlah = DB::table('sessions')->count();

        // Menghapus semua baris session = semua orang otomatis logout.
        DB::table('sessions')->delete();

        $this->info("Semua session CMS ditutup ({$jumlah} session dihapus).");
        $this->line('  Pengelogga perlu login ulang di /cms/login.');

        return self::SUCCESS;
    }
}
