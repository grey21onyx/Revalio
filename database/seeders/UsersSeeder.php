<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Periksa apakah sudah ada data users
        if (User::count() > 0) {
            $this->command->info('User data already exists. Skipping seeding.');
            return;
        }
        
        // Membuat pengguna admin
        User::firstOrCreate(
            ['email' => 'admin@revalio.com'],
            [
                'nama_lengkap' => 'admin Revalio',
                'role' => 'admin',
                'password' => Hash::make('password123'),
                'no_telepon' => '08123456789',
                'alamat' => 'Jalan admin No. 1, Jakarta',
                'foto_profil' => 'profiles/default.jpg',
                'status_akun' => 'AKTIF',
                'preferensi_sampah' => 'Plastik, Kertas, Logam',
                'updated_at' => now(),
                'tanggal_registrasi' => now()
            ]
        );
        
        
        // Membuat pengguna regular
        User::firstOrCreate(
            ['email' => 'user@revalio.com'],
            [
                'nama_lengkap' => 'Siti Pengguna',
                'role' => 'user',
                'password' => Hash::make('password123'),
                'no_telepon' => '08345678901',
                'alamat' => 'Jalan Pengguna No. 3, Surabaya',
                'foto_profil' => 'profiles/default.jpg',
                'status_akun' => 'AKTIF',
                'preferensi_sampah' => 'Organik, Kertas',
                'updated_at' => now(),
                'tanggal_registrasi' => now()
            ]
        );
        
        // Buat pengguna acak menggunakan factory hanya jika jumlah pengguna kurang dari yang diharapkan
        $targetUserCount = 13; // 3 pengguna default + 10 dari factory
        $currentUserCount = User::count();
        
        if ($currentUserCount < $targetUserCount) {
            $usersToCreate = $targetUserCount - $currentUserCount;
            User::factory($usersToCreate)->create();
        }
    }
}