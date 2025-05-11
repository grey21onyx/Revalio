<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WasteValue>
 */
class WasteValueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $min = $this->faker->numberBetween(1000, 10000);
        $max = $this->faker->numberBetween($min, $min + 5000);
        
        $satuan = $this->faker->randomElement(['kg', 'gram', 'liter', 'pcs']);
        
        return [
            'waste_id' => $this->faker->numberBetween(1, 30),
            'harga_minimum' => $min,
            'harga_maksimum' => $max,
            'satuan' => $satuan,
            'tanggal_update' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'sumber_data' => $this->faker->randomElement(['Survey Lapangan', 'Data Dinas', 'Bank Sampah Lokal', 'Pengepul']),
        ];
    }
}
