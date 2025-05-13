<?php

namespace Database\Factories;

use App\Models\WasteCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WasteType>
 */
class WasteTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Sampel nama sampah
        $wasteNames = [
            'Botol PET', 'Plastik HDPE', 'Kantong Kresek', 'Kardus', 'Koran', 
            'Kaleng Aluminium', 'Besi', 'Botol Kaca', 'Pakaian Bekas', 
            'HP Bekas', 'Sisa Makanan', 'Kayu Bekas', 'Ban Bekas', 'Minyak Goreng Bekas'
        ];
        
        // Pastikan ada kategori sampah dulu sebelum membuat jenis sampah
        if (WasteCategory::count() === 0) {
            // Buat kategori baru jika tidak ada
            $category = WasteCategory::factory()->create();
        } else {
            // Gunakan kategori yang sudah ada
            $category = WasteCategory::inRandomOrder()->first();
        }

        return [
            'nama_sampah' => $this->faker->randomElement($wasteNames),
            'kategori_id' => $category->kategori_id,
            'deskripsi' => $this->faker->paragraph(),
            'cara_sortir' => $this->faker->text(),
            'cara_penyimpanan' => $this->faker->text(),
            'gambar' => null,
            'status_aktif' => true,
        ];
    }
}
