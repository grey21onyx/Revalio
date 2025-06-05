<?php

namespace Database\Seeders;

use App\Models\WasteBuyer;
use App\Models\WasteBuyerType;
use App\Models\WasteType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WasteBuyerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cek apakah data sudah ada
        if (WasteBuyer::count() > 0 && WasteBuyerType::count() > 0) {
            $this->command->info('Waste Buyer data already exists. Skipping seeding.');
            return;
        }
        
        // Membuat data pembeli sampah
        $wasteBuyers = [
            [
                'nama_pembeli' => 'Bank Sampah Bersih',
                'jenis_pembeli' => 'bank sampah',
                'alamat' => 'Jl. Kebersihan No. 123, Jakarta Selatan',
                'kontak' => '021-12345678',
                'email' => 'info@banksampahbersih.com',
                'website' => 'https://www.banksampahbersih.com',
                'jam_operasional' => 'Senin-Jumat: 08.00-16.00, Sabtu: 08.00-12.00',
            ],
            [
                'nama_pembeli' => 'PT Daur Ulang Plastik Indonesia',
                'jenis_pembeli' => 'pabrik',
                'alamat' => 'Kawasan Industri Pulogadung Blok J1-2, Jakarta Timur',
                'kontak' => '021-87654321',
                'email' => 'contact@daurulangplastik.co.id',
                'website' => 'https://www.daurulangplastik.co.id',
                'jam_operasional' => 'Senin-Jumat: 08.00-17.00',
            ],
            [
                'nama_pembeli' => 'Pengepul Karya Mandiri',
                'jenis_pembeli' => 'pengepul',
                'alamat' => 'Jl. Kemandirian No. 45, Depok',
                'kontak' => '0812-3456-7890',
                'email' => 'karyamandiri@gmail.com',
                'website' => null,
                'jam_operasional' => 'Senin-Minggu: 07.00-18.00',
            ],
            [
                'nama_pembeli' => 'Bank Sampah Hijau',
                'jenis_pembeli' => 'bank sampah',
                'alamat' => 'Jl. Lingkungan Hijau No. 7, Bogor',
                'kontak' => '0813-9876-5432',
                'email' => 'cs@banksampahijau.org',
                'website' => 'https://www.banksampahijau.org',
                'jam_operasional' => 'Senin-Sabtu: 08.00-15.00',
            ],
            [
                'nama_pembeli' => 'CV Logam Jaya',
                'jenis_pembeli' => 'pabrik',
                'alamat' => 'Jl. Industri Raya Blok C5, Tangerang',
                'kontak' => '021-55667788',
                'email' => 'info@logamjaya.com',
                'website' => 'https://www.logamjaya.com',
                'jam_operasional' => 'Senin-Jumat: 08.00-16.30',
            ],
        ];
        
        // Membuat pembeli sampah
        foreach ($wasteBuyers as $buyer) {
            WasteBuyer::firstOrCreate(
                ['nama_pembeli' => $buyer['nama_pembeli']],
                $buyer
            );
        }
        
        // Tambah beberapa pembeli sampah secara acak jika jumlahnya masih kurang
        $remainingCount = 10 - WasteBuyer::count();
        if ($remainingCount > 0) {
            WasteBuyer::factory($remainingCount)->create();
        }
        
        // Buat relasi antara pembeli sampah dan jenis sampah yang mereka beli
        $wasteBuyers = WasteBuyer::all();
        $wasteTypes = WasteType::all();
        
        // Skip relasi bila tidak ada waste types
        if ($wasteTypes->isEmpty()) {
            $this->command->info('Tidak ada jenis sampah tersedia untuk direlasikan dengan pembeli');
            return;
        }
        
        // Pembeli 1 (Bank Sampah Bersih) - membeli berbagai jenis sampah
        $buyer = $wasteBuyers->where('nama_pembeli', 'Bank Sampah Bersih')->first();
        if ($buyer) {
            // Tidak lagi mencari tipe sampah spesifik yang dihapus (Botol PET, dll)
            // Gunakan jenis sampah yang tersedia
            $availableTypes = $wasteTypes->take(min(3, $wasteTypes->count()));
            
            foreach($availableTypes as $index => $wasteType) {
                // Get waste type ID based on column name
                $wasteIdColumn = isset($wasteType->waste_id) ? 'waste_id' : 'id';
                
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->$wasteIdColumn
                    ],
                    [
                        'harga_beli' => 5000 - ($index * 1000), // Varied prices
                        'syarat_minimum' => 'Minimal ' . (($index + 1) * 5) . ' kg',
                        'catatan' => 'Sampah harus bersih dan dipisahkan',
                    ]
                );
            }
        }
        
        // Pembeli 2 (PT Daur Ulang Plastik Indonesia) - fokus pada plastik dengan harga yang lebih tinggi
        $buyer = $wasteBuyers->where('nama_pembeli', 'PT Daur Ulang Plastik Indonesia')->first();
        if ($buyer && $wasteTypes->count() > 0) {
            // Ambil tipe sampah yang tersedia
            $availableType = $wasteTypes->first();
            $wasteIdColumn = isset($availableType->waste_id) ? 'waste_id' : 'id';
            
            WasteBuyerType::firstOrCreate(
                [
                    'pembeli_id' => $buyer->pembeli_id,
                    'waste_id' => $availableType->$wasteIdColumn
                ],
                [
                    'harga_beli' => 5500,
                    'syarat_minimum' => 'Minimal 100 kg',
                    'catatan' => 'Pembelian dalam jumlah besar, perlu konfirmasi terlebih dahulu',
                ]
            );
            
            // Check if there's at least one more waste type
            if ($wasteTypes->count() > 1) {
                $anotherType = $wasteTypes->last();
                $wasteIdColumn = isset($anotherType->waste_id) ? 'waste_id' : 'id';
                
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $anotherType->$wasteIdColumn
                    ],
                    [
                        'harga_beli' => 4500,
                        'syarat_minimum' => 'Minimal 50 kg',
                        'catatan' => 'Hanya untuk sampah bersih dan tidak tercampur',
                    ]
                );
            }
        }
        
        // Pembeli 3 (Pengepul Karya Mandiri) - membeli berbagai jenis dengan syarat minimum rendah
        $buyer = $wasteBuyers->where('nama_pembeli', 'Pengepul Karya Mandiri')->first();
        if ($buyer) {
            // Ensure there are enough waste types before picking random ones
            $randomCount = min(5, $wasteTypes->count());
            if ($randomCount > 0) {
                $randomWasteTypes = $wasteTypes->random($randomCount);
                
                foreach ($randomWasteTypes as $wasteType) {
                    // Get waste type ID based on column name
                    $wasteIdColumn = isset($wasteType->waste_id) ? 'waste_id' : 'id';
                    
                    WasteBuyerType::firstOrCreate(
                        [
                            'pembeli_id' => $buyer->pembeli_id,
                            'waste_id' => $wasteType->$wasteIdColumn
                        ],
                        [
                            'harga_beli' => rand(2000, 10000),
                            'syarat_minimum' => 'Minimal 1 kg',
                            'catatan' => 'Bisa dijemput untuk pembelian di atas 20 kg',
                        ]
                    );
                }
            }
        }
        
        // Pembeli 5 (CV Logam Jaya) - fokus pada logam
        $buyer = $wasteBuyers->where('nama_pembeli', 'CV Logam Jaya')->first();
        if ($buyer && !$wasteTypes->isEmpty()) {
            // Instead of filtering by category, just take available waste types
            $typesToUse = $wasteTypes->take(min(3, $wasteTypes->count()));
            
            foreach ($typesToUse as $wasteType) {
                // Get waste type ID based on column name
                $wasteIdColumn = isset($wasteType->waste_id) ? 'waste_id' : 'id';
                
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->$wasteIdColumn
                    ],
                    [
                        'harga_beli' => rand(8000, 15000),
                        'syarat_minimum' => 'Minimal 20 kg',
                        'catatan' => 'Harga dapat berubah tergantung kualitas dan kondisi pasar',
                    ]
                );
            }
        }
        
        // Buat relasi acak untuk pembeli lainnya
        foreach ($wasteBuyers->whereNotIn('nama_pembeli', [
            'Bank Sampah Bersih', 
            'PT Daur Ulang Plastik Indonesia', 
            'Pengepul Karya Mandiri', 
            'CV Logam Jaya'
        ]) as $buyer) {
            // Skip jika tidak ada jenis sampah
            if ($wasteTypes->isEmpty()) {
                continue;
            }
            
            // Buat 2-5 jenis sampah yang dibeli oleh setiap pembeli
            $buyWasteCount = min(rand(2, 5), $wasteTypes->count());
            if ($buyWasteCount > 0) {
                $randomWasteTypes = $wasteTypes->random($buyWasteCount);
                
                foreach ($randomWasteTypes as $wasteType) {
                    // Get waste type ID based on column name
                    $wasteIdColumn = isset($wasteType->waste_id) ? 'waste_id' : 'id';
                    
                    WasteBuyerType::firstOrCreate(
                        [
                            'pembeli_id' => $buyer->pembeli_id,
                            'waste_id' => $wasteType->$wasteIdColumn
                        ],
                        [
                            'harga_beli' => rand(2000, 10000),
                            'syarat_minimum' => 'Minimal 1 kg',
                            'catatan' => 'Bisa dijemput untuk pembelian di atas 20 kg',
                        ]
                    );
                }
            }
        }
    }
} 