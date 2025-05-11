<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DeletedRecord>
 */
class DeletedRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tables = [
            'waste_types',
            'tutorials',
            'articles',
            'forum_threads',
            'forum_comments',
            'business_opportunities',
        ];
        
        $selectedTable = $this->faker->randomElement($tables);
        
        // Data dummy per tabel
        $recordData = [];
        switch ($selectedTable) {
            case 'waste_types':
                $recordData = [
                    'waste_id' => $this->faker->numberBetween(1, 100),
                    'nama_sampah' => $this->faker->word(),
                    'kategori_id' => $this->faker->numberBetween(1, 10),
                    'deskripsi' => $this->faker->paragraph(),
                ];
                break;
            case 'tutorials':
                $recordData = [
                    'tutorial_id' => $this->faker->numberBetween(1, 100),
                    'judul' => $this->faker->sentence(),
                    'deskripsi' => $this->faker->paragraph(),
                ];
                break;
            // default untuk tabel lain
            default:
                $recordData = [
                    'id' => $this->faker->numberBetween(1, 100),
                    'judul' => $this->faker->sentence(),
                    'content' => $this->faker->paragraph(),
                ];
        }
        
        return [
            'table_name' => $selectedTable,
            'record_id' => $this->faker->numberBetween(1, 100),
            'record_data' => json_encode($recordData),
            'deletion_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'user_id' => User::inRandomOrder()->first()->user_id ?? null,
            'restoration_status' => $this->faker->randomElement(['NOT_RESTORED', 'RESTORED']),
        ];
    }
    
    /**
     * Menentukan record yang belum direstorasi
     */
    public function notRestored(): static
    {
        return $this->state(fn (array $attributes) => [
            'restoration_status' => 'NOT_RESTORED',
        ]);
    }
    
    /**
     * Menentukan record yang sudah direstorasi
     */
    public function restored(): static
    {
        return $this->state(fn (array $attributes) => [
            'restoration_status' => 'RESTORED',
        ]);
    }
} 