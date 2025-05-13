<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserWasteTracking;
use App\Models\WasteType;
use Illuminate\Database\Seeder;

class UserWasteTrackingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dapatkan semua user kecuali admin
        $users = User::where('email', '!=', 'admin@revalio.com')->get();
        $wasteTypes = WasteType::all();
        
        // Untuk setiap user, buat 3-8 record tracking sampah
        foreach ($users as $user) {
            $numRecords = random_int(3, 8);
            
            for ($i = 0; $i < $numRecords; $i++) {
                // Pilih jenis sampah secara acak
                $wasteType = $wasteTypes->random();
                
                // Buat waktu pengumpulan secara acak dalam 3 bulan terakhir
                $collectionDate = now()->subDays(random_int(1, 90));
                
                // Berat sampah antara 0.5 - 10 kg
                $weight = round(mt_rand(5, 100) / 10, 1);
                
                // Nilai ekonomis = berat * nilai per kg (jika tersedia)
                $economicValue = $weight * ($wasteType->harga_per_kg ?? 1000);
                
                UserWasteTracking::create([
                    'user_id' => $user->user_id,
                    'waste_id' => $wasteType->waste_id,
                    'jumlah' => $weight,
                    'satuan' => 'kg',
                    'tanggal_pencatatan' => $collectionDate,
                    'status_pengelolaan' => ['disimpan', 'dijual', 'didaur ulang'][random_int(0, 2)],
                    'nilai_estimasi' => $economicValue,
                    'catatan' => 'Sampah ' . $wasteType->nama . ' dikumpulkan pada ' . $collectionDate->format('d/m/Y'),
                ]);
            }
        }
    }
}
