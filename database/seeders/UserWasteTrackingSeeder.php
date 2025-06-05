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
        
        if ($users->isEmpty() || $wasteTypes->isEmpty()) {
            $this->command->info('No users or waste types found. Skipping UserWasteTracking seeder.');
            return;
        }
        
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
                
                // Since we're not seeding waste values, set a default value for calculation
                $economicValue = $weight * 1000; // Assume 1000 per kg as default
                
                // Get proper ID field based on model
                $userId = $user->id ?? $user->user_id;
                $wasteTypeId = $wasteType->id ?? $wasteType->waste_id;
                $wasteName = $wasteType->name ?? $wasteType->nama_sampah;
                
                UserWasteTracking::create([
                    'user_id' => $userId,
                    'waste_type_id' => $wasteTypeId,
                    'amount' => $weight,
                    'unit' => 'kg',
                    'tracking_date' => $collectionDate,
                    'management_status' => ['disimpan', 'dijual', 'didaur ulang'][random_int(0, 2)],
                    'estimated_value' => $economicValue,
                    'notes' => 'Sampah ' . $wasteName . ' dikumpulkan pada ' . $collectionDate->format('d/m/Y'),
                ]);
            }
        }
    }
}
