<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            // Jalankan seeder dalam urutan yang memperhatikan dependensi antar tabel
            UsersSeeder::class,
            RolesAndPermissionsSeeder::class,
            WasteCategorySeeder::class,
            WasteTypeSeeder::class,
            WasteValueSeeder::class,
            WasteBuyerSeeder::class,
            TutorialAndArticleSeeder::class,
            BusinessOpportunitySeeder::class,
            ForumSeeder::class,
            UserWasteTrackingSeeder::class,
            ForumThreadSeeder::class,
        ]);

        // Seed waste categories
        $this->seedWasteCategories();
        
        // Seed business opportunities
        $this->seedBusinessOpportunities();
    }
    
    /**
     * Seed waste categories
     */
    private function seedWasteCategories(): void
    {
        $categories = [
            [
                'nama_kategori' => 'Plastik',
                'deskripsi' => 'Sampah berbahan dasar plastik seperti botol, kantong, dan wadah plastik.',
                'ikon' => 'plastic.png',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kategori' => 'Kertas',
                'deskripsi' => 'Sampah berbahan dasar kertas seperti koran, majalah, dan kardus.',
                'ikon' => 'paper.png',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kategori' => 'Logam',
                'deskripsi' => 'Sampah berbahan dasar logam seperti kaleng, besi, dan aluminium.',
                'ikon' => 'metal.png',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kategori' => 'Kaca',
                'deskripsi' => 'Sampah berbahan dasar kaca seperti botol dan gelas.',
                'ikon' => 'glass.png',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nama_kategori' => 'Organik',
                'deskripsi' => 'Sampah organik seperti sisa makanan dan daun.',
                'ikon' => 'organic.png',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        
        foreach ($categories as $category) {
            DB::table('waste_categories')->insertOrIgnore($category);
        }
    }
    
    /**
     * Seed business opportunities
     */
    private function seedBusinessOpportunities(): void
    {
        $opportunities = [
            [
                'judul' => 'Produksi Tas dari Sampah Plastik',
                'deskripsi' => 'Usaha pembuatan tas dan aksesoris dari sampah plastik yang didaur ulang.',
                'jenis_sampah_terkait' => 'Plastik',
                'investasi_minimal' => 2000000,
                'investasi_maksimal' => 5000000,
                'potensi_keuntungan' => 'Rp 3-5 juta per bulan',
                'gambar' => null,
                'sumber_informasi' => 'Studi Kasus Pengusaha Daur Ulang',
                'tanggal_publikasi' => now(),
                'status' => 'AKTIF',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'judul' => 'Pembuatan Kompos dari Sampah Organik',
                'deskripsi' => 'Usaha pembuatan kompos berkualitas tinggi dari sampah organik rumah tangga.',
                'jenis_sampah_terkait' => 'Organik',
                'investasi_minimal' => 1000000,
                'investasi_maksimal' => 3000000,
                'potensi_keuntungan' => 'Rp 2-4 juta per bulan',
                'gambar' => null,
                'sumber_informasi' => 'Kementerian Lingkungan Hidup',
                'tanggal_publikasi' => now(),
                'status' => 'AKTIF',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'judul' => 'Daur Ulang Kertas menjadi Kerajinan',
                'deskripsi' => 'Usaha pembuatan kerajinan dan produk dekoratif dari kertas bekas.',
                'jenis_sampah_terkait' => 'Kertas',
                'investasi_minimal' => 500000,
                'investasi_maksimal' => 2000000,
                'potensi_keuntungan' => 'Rp 1-3 juta per bulan',
                'gambar' => null,
                'sumber_informasi' => 'Komunitas Pengrajin Daur Ulang',
                'tanggal_publikasi' => now(),
                'status' => 'AKTIF',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'judul' => 'Pengolahan Botol Kaca menjadi Dekorasi',
                'deskripsi' => 'Usaha pembuatan lampu hias dan dekorasi dari botol kaca bekas.',
                'jenis_sampah_terkait' => 'Kaca',
                'investasi_minimal' => 1500000,
                'investasi_maksimal' => 4000000,
                'potensi_keuntungan' => 'Rp 3-6 juta per bulan',
                'gambar' => null,
                'sumber_informasi' => 'Asosiasi Pengusaha Kreatif',
                'tanggal_publikasi' => now(),
                'status' => 'AKTIF',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'judul' => 'Pengumpulan dan Penjualan Logam Bekas',
                'deskripsi' => 'Usaha pengumpulan, pemilahan, dan penjualan logam bekas ke pabrik daur ulang.',
                'jenis_sampah_terkait' => 'Logam',
                'investasi_minimal' => 5000000,
                'investasi_maksimal' => 15000000,
                'potensi_keuntungan' => 'Rp 5-10 juta per bulan',
                'gambar' => null,
                'sumber_informasi' => 'Asosiasi Pengepul Logam',
                'tanggal_publikasi' => now(),
                'status' => 'AKTIF',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        
        foreach ($opportunities as $opportunity) {
            DB::table('business_opportunities')->insertOrIgnore($opportunity);
        }

        // Tambah nilai sampah untuk waste_id 1
        DB::table('waste_values')->insertOrIgnore([
            'waste_id' => 1,
            'harga_minimum' => 1000,
            'harga_maksimum' => 2000,
            'satuan' => 'kg',
            'tanggal_update' => now(),
            'sumber_data' => 'Seeder',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
