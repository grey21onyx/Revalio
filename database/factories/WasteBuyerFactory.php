<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WasteBuyer>
 */
class WasteBuyerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jenis_pembeli = ['bank sampah', 'pengepul', 'pabrik'];
        
        return [
            'nama_pembeli' => $this->faker->company(),
            'jenis_pembeli' => $this->faker->randomElement($jenis_pembeli),
            'alamat' => $this->faker->address(),
            'kontak' => $this->faker->phoneNumber(),
            'email' => $this->faker->companyEmail(),
            'website' => $this->faker->url(),
            'jam_operasional' => 'Senin-Jumat: 08.00-17.00, Sabtu: 08.00-12.00',
        ];
    }
    
    /**
     * Menentukan bank sampah
     */
    public function bankSampah(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis_pembeli' => 'bank sampah',
        ]);
    }
    
    /**
     * Menentukan pengepul
     */
    public function pengepul(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis_pembeli' => 'pengepul',
        ]);
    }
    
    /**
     * Menentukan pabrik
     */
    public function pabrik(): static
    {
        return $this->state(fn (array $attributes) => [
            'jenis_pembeli' => 'pabrik',
        ]);
    }
} 