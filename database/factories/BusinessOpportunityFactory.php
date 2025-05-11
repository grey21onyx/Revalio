<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BusinessOpportunity>
 */
class BusinessOpportunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Daur Ulang Plastik', 
            'Pengolahan Kaca', 
            'Pengolahan Logam', 
            'Pengolahan Kertas', 
            'Pengolahan Tekstil',
            'Kompos',
            'Bank Sampah',
            'Kerajinan Tangan',
            'Produk Inovatif',
        ];
        
        $investasi = [500000, 1000000, 2000000, 5000000, 10000000, 25000000, 50000000];
        
        return [
            'judul' => 'Usaha ' . $this->faker->randomElement($categories),
            'deskripsi' => $this->faker->paragraphs(3, true),
            'kategori' => $this->faker->randomElement($categories),
            'investasi_awal' => $this->faker->randomElement($investasi),
            'potensi_pendapatan' => $this->faker->paragraph(),
            'tantangan' => $this->faker->paragraphs(2, true),
            'saran_implementasi' => $this->faker->paragraphs(2, true),
        ];
    }
}