<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
            WasteCategorySeeder::class,
            WasteTypeSeeder::class,
            WasteValueSeeder::class,
            WasteBuyerSeeder::class,
            TutorialAndArticleSeeder::class,
            BusinessOpportunitySeeder::class,
            ForumSeeder::class,
            UserWasteTrackingSeeder::class,
        ]);
    }
}
