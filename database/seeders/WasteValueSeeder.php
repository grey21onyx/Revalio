<?php

namespace Database\Seeders;

use App\Models\WasteType;
use App\Models\WasteValue;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WasteValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data harga untuk beberapa sampah contoh
        $wasteValues = [
            // Plastik
            [
                'waste_id' => 1, // Botol PET
                'harga_minimum' => 4000.00,
                'harga_maksimum' => 5500.00,
                'satuan' => 'kg',
                'tanggal_update' => now(),
                'sumber_data' => 'Bank Sampah Indonesia',
            ],
            [
                'waste_id' => 2, // Kantong Kresek
                'harga_minimum' => 1000.00,
                'harga_maksimum' => 2000.00,
                'satuan' => 'kg',
                'tanggal_update' => now(),
                'sumber_data' => 'Pengepul Lokal',
            ],
            // Kertas
            [
                'waste_id' => 4, // Kardus
                'harga_minimum' => 2500.00,
                'harga_maksimum' => 3500.00,
                'satuan' => 'kg',
                'tanggal_update' => now(),
                'sumber_data' => 'Bank Sampah Indonesia',
            ],
            [
                'waste_id' => 5, // Koran
                'harga_minimum' => 3000.00,
                'harga_maksimum' => 4000.00,
                'satuan' => 'kg',
                'tanggal_update' => now(),
                'sumber_data' => 'Survey Lapangan',
            ],
            // Logam
            [
                'waste_id' => 7, // Kaleng Aluminium
                'harga_minimum' => 10000.00,
                'harga_maksimum' => 15000.00,
                'satuan' => 'kg',
                'tanggal_update' => now(),
                'sumber_data' => 'Pengepul Logam',
            ],
            [
                'waste_id' => 8, // Besi
                'harga_minimum' => 3000.00,
                'harga_maksimum' => 4500.00,
                'satuan' => 'kg',
                'tanggal_update' => now(),
                'sumber_data' => 'Pengepul Logam',
            ],
            // Minyak Bekas
            [
                'waste_id' => 14, // Minyak Goreng Bekas
                'harga_minimum' => 5000.00,
                'harga_maksimum' => 7000.00,
                'satuan' => 'liter',
                'tanggal_update' => now(),
                'sumber_data' => 'Pengumpul Minyak Bekas',
            ],
        ];
        
        foreach ($wasteValues as $value) {
            WasteValue::create($value);
        }
        
        // Dapatkan semua jenis sampah yang belum memiliki nilai
        $wasteIdsWithValues = WasteValue::pluck('waste_id')->toArray();
        $wasteTypesWithoutValues = WasteType::whereNotIn('waste_id', $wasteIdsWithValues)->get();
        
        // Buat nilai untuk setiap jenis sampah yang belum memiliki nilai
        foreach ($wasteTypesWithoutValues as $wasteType) {
            WasteValue::factory()->create(['waste_id' => $wasteType->waste_id]);
        }
    }
}