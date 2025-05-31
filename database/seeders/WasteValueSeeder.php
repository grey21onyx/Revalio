<?php

namespace Database\Seeders;

use App\Models\WasteType;
use App\Models\WasteValue;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WasteValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Mendapatkan ID yang sudah ada di tabel waste_types
        $wasteTypes = WasteType::pluck('waste_id', 'nama_sampah')->toArray();
        
        // Memastikan ada data di dalam waste_types
        if (empty($wasteTypes)) {
            $this->command->info('Tidak ada jenis sampah yang ditemukan. Pastikan WasteTypeSeeder sudah dijalankan.');
            return;
        }

        // Mapping nama sampah ke ID yang sudah ada
        $botolPetId = $wasteTypes['Botol PET'] ?? null;
        $kardusId = $wasteTypes['Kardus'] ?? null;
        $kalengAluminiumId = $wasteTypes['Kaleng Aluminium'] ?? null;
        
        // Memastikan ID ada sebelum lanjut
        if (!$botolPetId || !$kardusId || !$kalengAluminiumId) {
            $this->command->info('Beberapa jenis sampah tidak ditemukan. Pastikan WasteTypeSeeder sudah dijalankan dengan benar.');
            return;
        }

        // Menghapus data nilai sampah yang ada untuk mencegah duplikasi
        WasteValue::truncate();
        
        // Buat data historis untuk 6 bulan terakhir
        $this->createHistoricalData($botolPetId, 'Botol PET', 'Bank Sampah Indonesia');
        $this->createHistoricalData($kardusId, 'Kardus', 'Bank Sampah Indonesia');
        $this->createHistoricalData($kalengAluminiumId, 'Kaleng Aluminium', 'Pengepul Logam');
        
        // Dapatkan semua jenis sampah yang belum memiliki nilai
        $wasteIdsWithValues = WasteValue::pluck('waste_id')->toArray();
        $wasteTypesWithoutValues = WasteType::whereNotIn('waste_id', $wasteIdsWithValues)->get();
        
        // Buat nilai untuk setiap jenis sampah yang belum memiliki nilai
        foreach ($wasteTypesWithoutValues as $wasteType) {
            // Periksa lagi untuk memastikan tidak ada nilai yang dibuat secara bersamaan
            if (!WasteValue::where('waste_id', $wasteType->waste_id)->exists()) {
                // Buat data default untuk setiap jenis sampah
                WasteValue::create([
                    'waste_id' => $wasteType->waste_id,
                    'harga_minimum' => 1000.00, // Harga default minimum
                    'harga_maksimum' => 2000.00, // Harga default maksimum
                    'satuan' => 'kg',
                    'tanggal_update' => now(),
                    'sumber_data' => 'Default Value',
                ]);
            }
        }
    }
    
    /**
     * Buat data historis untuk 6 bulan terakhir
     */
    private function createHistoricalData($wasteId, $wasteName, $source)
    {
        // Tentukan harga awal dan perubahan maksimal per bulan
        $initialPrices = [
            'Botol PET' => ['min' => 3500, 'max' => 5000],
            'Kardus' => ['min' => 2000, 'max' => 3000],
            'Kaleng Aluminium' => ['min' => 8000, 'max' => 13000],
        ];
        
        $baseMin = $initialPrices[$wasteName]['min'];
        $baseMax = $initialPrices[$wasteName]['max'];
        
        // Buat data untuk 6 bulan terakhir
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            
            // Simulasi fluktuasi harga (antara -5% sampai +8%)
            $fluctuationMin = rand(-5, 8) / 100;
            $fluctuationMax = rand(-3, 10) / 100;
            
            $min = max(round($baseMin * (1 + $fluctuationMin), -2), 500); // Bulatkan ke 100 terdekat, minimal 500
            $max = max(round($baseMax * (1 + $fluctuationMax), -2), $min + 500); // Selalu lebih tinggi dari min
            
            // Update harga basis untuk bulan berikutnya
            $baseMin = $min;
            $baseMax = $max;
            
            WasteValue::create([
                'waste_id' => $wasteId,
                'harga_minimum' => $min,
                'harga_maksimum' => $max,
                'satuan' => 'kg',
                'tanggal_update' => $date,
                'sumber_data' => $source,
            ]);
        }
    }
}