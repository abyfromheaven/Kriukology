<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Membuat akun pengelola CMS.
 *
 * Karena halaman login tidak punya pendaftaran & pemulihan password, ini
 * satu-satunya cara menambah/mengganti akses — jadi harus dijalankan dari
 * server, bukan dari browser.
 *
 * Contoh:
 *   php artisan cms:make-user --name="Kasir Tono" --username=tono --password="Rahasia123"
 */
class MakeCmsUser extends Command
{
    protected $signature = 'cms:make-user
        {--name= : Nama lengkap (mis. "Kasir Tono")}
        {--username= : Username untuk login}
        {--password= : Password}';

    protected $description = 'Buat akun login untuk CMS Kriukology';

    public function handle(): int
    {
        $name = trim((string) $this->option('name'));
        $username = Str::lower(trim((string) $this->option('username')));
        $password = (string) $this->option('password');

        if ($name === '' || $username === '' || $password === '') {
            $this->error('Semua opsi wajib diisi.');
            $this->line('  Contoh:');
            $this->line('    php artisan cms:make-user --name="Kasir Tono" --username=tono --password="Rahasia123"');

            return self::FAILURE;
        }

        if (!preg_match('/^[a-z0-9._-]{3,255}$/', $username)) {
            $this->error('Username tidak valid. Gunakan 3-255 karakter: huruf kecil, angka, titik, underscore, atau strip.');

            return self::FAILURE;
        }

        if (strlen($password) < 8) {
            $this->error('Password minimal 8 karakter.');

            return self::FAILURE;
        }

        $ada = User::where('username', $username)->first();

        if ($ada) {
            $this->warn("Username '{$username}' sudah dipakai. Mengganti password & nama lama.");
            $ada->update([
                'name'     => $name,
                'password' => Hash::make($password),
            ]);
            $this->info("Akun '{$username}' diperbarui.");
            $this->line('  Password lama tidak berlaku lagi.');

            return self::SUCCESS;
        }

        User::create([
            'name'     => $name,
            'username' => $username,
            // Di-hash bcrypt oleh cast 'hashed' pada model User
            'password' => $password,
        ]);

        $this->info("Akun CMS '{$username}' dibuat untuk {$name}.");
        $this->line('  Login di: /cms/login');

        return self::SUCCESS;
    }
}
