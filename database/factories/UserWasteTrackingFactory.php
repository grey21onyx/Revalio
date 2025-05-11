<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WasteType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserWasteTracking>
 */
class UserWasteTrackingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = ['disimpan', 'dijual', 'didaur ulang'];
        $satuan = ['kg', 'gram', 'ton', 'pcs', 'liter'];
        
        $jumlah = $this->faker->randomFloat(2, 1, 100);
        $nilai = $jumlah * $this->faker->numberBetween(5000, 20000);
        
        return [
            'user_id' => User::inRandomOrder()->first()->user_id ?? 1,
            'waste_id' => WasteType::inRandomOrder()->first()->waste_id ?? 1,
            'jumlah' => $jumlah,
            'satuan' => $this->faker->randomElement($satuan),
            'tanggal_pencatatan' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'status_pengelolaan' => $this->faker->randomElement($status),
            'nilai_estimasi' => $nilai,
            'catatan' => $this->faker->optional(0.7)->sentence(),
            'foto' => null,
        ];
    }
    
    /**
     * Menentukan status disimpan
     */
    public function disimpan(): static
    {
        return $this->state(fn (array $attributes) => [
            'status_pengelolaan' => 'disimpan',
        ]);
    }
    
    /**
     * Menentukan status dijual
     */
    public function dijual(): static
    {
        return $this->state(fn (array $attributes) => [
            'status_pengelolaan' => 'dijual',
        ]);
    }
    
    /**
     * Menentukan status didaur ulang
     */
    public function didaurUlang(): static
    {
        return $this->state(fn (array $attributes) => [
            'status_pengelolaan' => 'didaur ulang',
        ]);
    }
} 