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
        // Membuat pengguna admin
        User::create([
            'nama_lengkap' => 'Admin Revalio',
            'email' => 'admin@revalio.com',
            'password' => Hash::make('password123'),
            'no_telepon' => '08123456789',
            'alamat' => 'Jalan Admin No. 1, Jakarta',
            'foto_profil' => 'profiles/default.jpg',
            'status_akun' => 'AKTIF',
            'preferensi_sampah' => 'Plastik, Kertas, Logam',
            'updated_at' => now(),
            'tanggal_registrasi' => now()
        ]);
        
        // Membuat pengguna pengepul
        User::create([
            'nama_lengkap' => 'Budi Pengepul',
            'email' => 'pengepul@revalio.com',
            'password' => Hash::make('password123'),
            'no_telepon' => '08234567890',
            'alamat' => 'Jalan Pengepul No. 2, Bandung',
            'foto_profil' => 'profiles/default.jpg',
            'status_akun' => 'AKTIF',
            'preferensi_sampah' => 'Plastik, Logam, Kaca',
            'updated_at' => now(),
            'tanggal_registrasi' => now()
        ]);
        
        // Membuat pengguna regular
        User::create([
            'nama_lengkap' => 'Siti Pengguna',
            'email' => 'user@revalio.com',
            'password' => Hash::make('password123'),
            'no_telepon' => '08345678901',
            'alamat' => 'Jalan Pengguna No. 3, Surabaya',
            'foto_profil' => 'profiles/default.jpg',
            'status_akun' => 'AKTIF',
            'preferensi_sampah' => 'Organik, Kertas',
            'updated_at' => now(),
            'tanggal_registrasi' => now()
        ]);
        
        // Buat 10 pengguna acak menggunakan factory
        User::factory(10)->create();
    }
}