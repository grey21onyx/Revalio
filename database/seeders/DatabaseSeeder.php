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
            WasteBuyerSeeder::class,
            TutorialAndArticleSeeder::class,
            ForumSeeder::class,
            UserWasteTrackingSeeder::class,
            ForumThreadSeeder::class,
        ]);

        // Add Forum Reports
        $this->call(ForumReportSeeder::class);
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
}
