<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ForumThread>
 */
class ForumThreadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tags = ['#sampah', '#daurulang', '#banksampah', '#reduce', '#reuse', '#recycle', 
                '#pertanyaan', '#diskusi', '#idebaru', '#lingkungan', '#usaha'];
        
        // Ambil random tags (1-4 tags)
        $randomTags = $this->faker->randomElements($tags, $this->faker->numberBetween(1, 4));
        
        return [
            'user_id' => User::inRandomOrder()->first()->user_id ?? 1,
            'judul' => substr($this->faker->sentence(4), 0, 90),
            'konten' => $this->faker->paragraphs(4, true),
            'tanggal_posting' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'status' => $this->faker->randomElement(['AKTIF', 'NONAKTIF']),
            'tags' => implode(', ', $randomTags),
        ];
    }
    
    /**
     * Menentukan thread yang aktif
     */
    public function aktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'AKTIF',
        ]);
    }
    
    /**
     * Menentukan thread yang nonaktif
     */
    public function nonaktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'NONAKTIF',
        ]);
    }
} 