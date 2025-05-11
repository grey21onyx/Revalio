<?php

namespace Database\Factories;

use App\Models\WasteBuyer;
use App\Models\WasteType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WasteBuyerType>
 */
class WasteBuyerTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pembeli_id' => WasteBuyer::inRandomOrder()->first()->pembeli_id ?? 1, 
            'waste_id' => WasteType::inRandomOrder()->first()->waste_id ?? 1,
            'harga_beli' => $this->faker->numberBetween(1000, 20000),
            'syarat_minimum' => $this->faker->randomElement([
                'Minimal 10 kg',
                'Minimal 5 kg',
                'Minimal 20 kg',
                'Minimal 50 unit',
                'Tidak ada minimum',
            ]),
            'catatan' => $this->faker->optional(0.7)->paragraph(),
        ];
    }
} 