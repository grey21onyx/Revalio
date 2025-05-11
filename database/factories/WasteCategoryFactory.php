<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WasteCategory>
 */
class WasteCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Plastik',
            'Kertas',
            'Logam',
            'Kaca',
            'Tekstil',
            'Elektronik',
            'Organik',
            'Kayu',
            'Karet',
            'Minyak Bekas'
        ];

        return [
            'nama_kategori' => $this->faker->unique()->randomElement($categories),
            'deskripsi' => $this->faker->paragraph(),
            'ikon' => null,
        ];
    }
}
