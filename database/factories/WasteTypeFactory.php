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
        // Sampel nama sampah berdasarkan kategori
        $wasteTypes = [
            // Plastik
            ['Botol PET', 'Plastik HDPE', 'Kantong Kresek', 'Plastik PP', 'Plastik PVC', 'Sterofoam'],
            // Kertas
            ['Kardus', 'Koran', 'Buku', 'Kertas HVS', 'Majalah', 'Kertas Berwarna'],
            // Logam
            ['Kaleng Aluminium', 'Besi', 'Tembaga', 'Seng', 'Paku Bekas', 'Kawat'],
            // Kaca
            ['Botol Kaca', 'Gelas Kaca', 'Pecahan Kaca', 'Lampu Neon', 'Cermin Bekas'],
            // Tekstil
            ['Pakaian Bekas', 'Kain Perca', 'Sepatu Bekas', 'Tas Bekas', 'Handuk Bekas'],
            // Elektronik
            ['HP Bekas', 'Laptop Rusak', 'Kabel', 'Charger', 'Baterai', 'PCB'],
            // Organik
            ['Sisa Makanan', 'Daun Kering', 'Ranting', 'Buah Busuk', 'Ampas Kopi'],
            // Kayu
            ['Kayu Bekas', 'Furnitur Rusak', 'Potongan Kayu', 'Triplek Bekas'],
            // Karet
            ['Ban Bekas', 'Sandal Karet', 'Karet Gelang', 'Sarung Tangan Karet'],
            // Minyak Bekas
            ['Minyak Goreng Bekas', 'Oli Bekas', 'Minyak Pelumas']
        ];

        $kategoriId = $this->faker->numberBetween(1, 10);
        $kategoriIndex = $kategoriId - 1;
        
        // Pastikan indeks kategori tidak melebihi array
        $typeIndex = $this->faker->numberBetween(0, count($wasteTypes[$kategoriIndex]) - 1);

        return [
            'nama_sampah' => $wasteTypes[$kategoriIndex][$typeIndex],
            'kategori_id' => $kategoriId,
            'deskripsi' => $this->faker->paragraph(),
            'cara_sortir' => $this->faker->text(),
            'cara_penyimpanan' => $this->faker->text(),
            'gambar' => null,
            'status_aktif' => true,
        ];
    }
}
