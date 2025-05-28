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
        $preferensiSampah = ['Plastik', 'Kertas', 'Organik', 'Logam', 'Kaca'];
        $randomPreferensi = $this->faker->randomElements($preferensiSampah, $this->faker->numberBetween(1, 3));
        
        return [
            'nama_lengkap' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'role' => $this->faker->randomElement(['user', 'user', 'user', 'user', 'moderator']), // 80% user, 20% moderator
            'password' => static::$password ??= Hash::make('password123'),
            'no_telepon' => $this->faker->phoneNumber(),
            'alamat' => $this->faker->address(),
            'foto_profil' => 'profiles/default.jpg',
            'status_akun' => 'AKTIF',
            'preferensi_sampah' => implode(', ', $randomPreferensi),
            'tanggal_registrasi' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
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
