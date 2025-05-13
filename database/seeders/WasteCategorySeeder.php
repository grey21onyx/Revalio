<?php

namespace Database\Seeders;

use App\Models\WasteCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WasteCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'nama_kategori' => 'Plastik',
                'deskripsi' => 'Sampah jenis plastik yang dapat didaur ulang atau digunakan kembali.',
                'ikon' => 'plastic.png',
            ],
            [
                'nama_kategori' => 'Kertas',
                'deskripsi' => 'Sampah jenis kertas yang dapat didaur ulang menjadi produk kertas baru.',
                'ikon' => 'paper.png',
            ],
            [
                'nama_kategori' => 'Logam',
                'deskripsi' => 'Sampah logam yang dapat dilebur dan dibentuk kembali menjadi barang baru.',
                'ikon' => 'metal.png',
            ],
            [
                'nama_kategori' => 'Kaca',
                'deskripsi' => 'Sampah berbahan kaca yang dapat dilebur dan dibentuk kembali menjadi produk kaca baru.',
                'ikon' => 'glass.png',
            ],
            [
                'nama_kategori' => 'Tekstil',
                'deskripsi' => 'Limbah tekstil dan pakaian bekas yang masih dapat dimanfaatkan kembali.',
                'ikon' => 'textile.png',
            ],
            [
                'nama_kategori' => 'Elektronik',
                'deskripsi' => 'Limbah elektronik yang dapat diambil komponennya untuk digunakan kembali.',
                'ikon' => 'electronic.png',
            ],
            [
                'nama_kategori' => 'Organik',
                'deskripsi' => 'Sampah organik yang dapat dikompos menjadi pupuk.',
                'ikon' => 'organic.png',
            ],
            [
                'nama_kategori' => 'Kayu',
                'deskripsi' => 'Limbah kayu yang dapat diolah kembali menjadi produk baru.',
                'ikon' => 'wood.png',
            ],
            [
                'nama_kategori' => 'Karet',
                'deskripsi' => 'Sampah berbahan karet yang dapat didaur ulang menjadi produk baru.',
                'ikon' => 'rubber.png',
            ],
            [
                'nama_kategori' => 'Minyak Bekas',
                'deskripsi' => 'Minyak bekas pakai yang dapat diolah kembali menjadi bahan bakar atau produk lain.',
                'ikon' => 'oil.png',
            ],
        ];
        
        foreach ($categories as $category) {
            WasteCategory::firstOrCreate(
                ['nama_kategori' => $category['nama_kategori']],
                $category
            );
        }
    }
}
