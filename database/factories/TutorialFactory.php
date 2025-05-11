<?php

namespace Database\Factories;

use App\Models\WasteType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tutorial>
 */
class TutorialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tingkat_kesulitan = ['VERY_EASY', 'EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT'];
        
        return [
            'waste_id' => WasteType::inRandomOrder()->first()->waste_id ?? null,
            'judul' => $this->faker->sentence(5),
            'deskripsi' => $this->faker->paragraph(),
            'jenis_tutorial' => $this->faker->randomElement(['daur ulang', 'reuse']),
            'konten' => $this->faker->paragraphs(5, true),
            'media' => json_encode(['video' => 'https://www.youtube.com/watch?v=example']),
            'tingkat_kesulitan' => $this->faker->randomElement($tingkat_kesulitan),
            'estimasi_waktu' => $this->faker->numberBetween(10, 120), // dalam menit
        ];
    }
    
    /**
     * Menentukan tutorial daur ulang
     */
    public function daurUlang(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis_tutorial' => 'daur ulang',
        ]);
    }
    
    /**
     * Menentukan tutorial reuse
     */
    public function reuse(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis_tutorial' => 'reuse',
        ]);
    }
} 