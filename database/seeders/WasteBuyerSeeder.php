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
        
        // Pembeli 1 (Bank Sampah Bersih) - membeli berbagai jenis sampah
        $buyer = $wasteBuyers->where('nama_pembeli', 'Bank Sampah Bersih')->first();
        if ($buyer) {
            // Beli plastik dengan harga relatif rendah
            $wasteType = $wasteTypes->where('nama_sampah', 'Botol PET')->first();
            if ($wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
                    ],
                    [
                        'harga_beli' => 5000,
                        'syarat_minimum' => 'Minimal 5 kg',
                        'catatan' => 'Botol harus bersih dan dipisahkan berdasarkan warna',
                    ]
                );
            }
            
            // Beli kertas
            $wasteType = $wasteTypes->where('nama_sampah', 'Kardus')->first();
            if ($wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
                    ],
                    [
                        'harga_beli' => 3000,
                        'syarat_minimum' => 'Minimal 10 kg',
                        'catatan' => 'Kardus harus kering dan dilipat rapi',
                    ]
                );
            }
            
            // Beli logam
            $wasteType = $wasteTypes->where('nama_sampah', 'Kaleng Aluminium')->first();
            if ($wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
                    ],
                    [
                        'harga_beli' => 12000,
                        'syarat_minimum' => 'Minimal 2 kg',
                        'catatan' => 'Kaleng harus bersih dan diremukkan',
                    ]
                );
            }
        }
        
        // Pembeli 2 (PT Daur Ulang Plastik Indonesia) - fokus pada plastik dengan harga yang lebih tinggi
        $buyer = $wasteBuyers->where('nama_pembeli', 'PT Daur Ulang Plastik Indonesia')->first();
        if ($buyer) {
            // Beli plastik dengan harga tinggi
            $wasteType = $wasteTypes->where('nama_sampah', 'Botol PET')->first();
            if ($wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
                    ],
                    [
                        'harga_beli' => 5500,
                        'syarat_minimum' => 'Minimal 100 kg',
                        'catatan' => 'Pembelian dalam jumlah besar, perlu konfirmasi terlebih dahulu',
                    ]
                );
            }
            
            $wasteType = $wasteTypes->where('nama_sampah', 'Plastik PP')->first();
            if ($wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
                    ],
                    [
                        'harga_beli' => 4500,
                        'syarat_minimum' => 'Minimal 50 kg',
                        'catatan' => 'Hanya untuk plastik bersih dan tidak tercampur',
                    ]
                );
            }
        }
        
        // Pembeli 3 (Pengepul Karya Mandiri) - membeli berbagai jenis dengan syarat minimum rendah
        $buyer = $wasteBuyers->where('nama_pembeli', 'Pengepul Karya Mandiri')->first();
        if ($buyer) {
            // Ambil beberapa jenis sampah acak
            $randomWasteTypes = $wasteTypes->random(5);
            
            foreach ($randomWasteTypes as $wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
                    ],
                    [
                        'harga_beli' => rand(2000, 10000),
                        'syarat_minimum' => 'Minimal 1 kg',
                        'catatan' => 'Bisa dijemput untuk pembelian di atas 20 kg',
                    ]
                );
            }
        }
        
        // Pembeli 5 (CV Logam Jaya) - fokus pada logam
        $buyer = $wasteBuyers->where('nama_pembeli', 'CV Logam Jaya')->first();
        if ($buyer) {
            // Beli logam dengan harga tinggi
            $logamTypes = $wasteTypes->filter(function ($wasteType) {
                return $wasteType->kategori_id == 3; // ID kategori logam
            })->take(3);
            
            foreach ($logamTypes as $wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
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
            // Buat 2-5 jenis sampah yang dibeli oleh setiap pembeli
            $buyWasteCount = rand(2, 5);
            $randomWasteTypes = $wasteTypes->random($buyWasteCount);
            
            foreach ($randomWasteTypes as $wasteType) {
                WasteBuyerType::firstOrCreate(
                    [
                        'pembeli_id' => $buyer->pembeli_id,
                        'waste_id' => $wasteType->waste_id
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