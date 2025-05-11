<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Lingkungan', 'Edukasi', 'Daur Ulang', 'Reuse', 'Reduce', 'Teknologi Hijau', 'Komunitas', 'Bank Sampah'];
        $tags = ['#daurulang', '#sampah', '#lingkungan', '#zerowaste', '#banksampah', '#usaha', '#ramahlingkungan'];
        
        // Ambil random tags (1-4 tags)
        $randomTags = $this->faker->randomElements($tags, $this->faker->numberBetween(1, 4));
        
        return [
            'judul' => $this->faker->sentence(),
            'deskripsi_singkat' => $this->faker->paragraph(),
            'konten' => $this->faker->paragraphs(10, true),
            'kategori' => $this->faker->randomElement($categories),
            'penulis_id' => User::inRandomOrder()->first()->user_id ?? 1,
            'tanggal_publikasi' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'status' => $this->faker->randomElement(['PUBLISHED', 'DRAFT']),
            'gambar_utama' => 'articles/default.jpg',
            'tags' => implode(', ', $randomTags),
        ];
    }
    
    /**
     * Menentukan artikel yang telah dipublikasikan
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'PUBLISHED',
        ]);
    }
    
    /**
     * Menentukan artikel yang masih draft
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'DRAFT',
        ]);
    }
}