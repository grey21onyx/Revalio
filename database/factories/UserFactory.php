<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_lengkap' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'no_telepon' => fake()->phoneNumber(),
            'alamat' => fake()->address(),
            'foto_profil' => null,
            'tanggal_registrasi' => now(),
            'status_akun' => 'AKTIF',
            'preferensi_sampah' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's status should be inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status_akun' => 'NONAKTIF',
        ]);
    }
}
