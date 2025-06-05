<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WasteTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Mendapatkan atau membuat kategori sampah
        $plasticCategoryId = $this->getOrCreateCategory('Plastik', 'Sampah berbahan dasar plastik yang dapat didaur ulang', 'kategori/plastik.png');
        $paperCategoryId = $this->getOrCreateCategory('Kertas', 'Sampah berbahan dasar kertas yang dapat didaur ulang', 'kategori/kertas.png');
        $metalCategoryId = $this->getOrCreateCategory('Logam', 'Sampah berbahan dasar logam yang dapat didaur ulang', 'kategori/logam.png');
        
        // We're removing the creation of specific waste types to prevent them from showing up with zero prices
        
        // Seeder untuk pembeli sampah jika tabel waste_buyers ada
        if (DB::getSchemaBuilder()->hasTable('waste_buyers')) {
            $buyerId = $this->getOrCreateBuyer(
                'Pengepul Sejahtera', 
                'Jl. Daur Ulang No. 123, Jakarta', 
                '081234567890', 
                'Membeli berbagai jenis sampah daur ulang dengan harga kompetitif', 
                'Senin-Sabtu, 08.00-17.00'
            );
            
            // Relasi pembeli dengan jenis sampah jika tabel waste_buyer_types ada
            // Remove these references since we no longer create the waste types
            // if (DB::getSchemaBuilder()->hasTable('waste_buyer_types')) {
            //     $this->createBuyerTypeIfNotExists($buyerId, $petBottleId, 5500, 'Minimal 5kg');
            //     $this->createBuyerTypeIfNotExists($buyerId, $cardboardId, 2800, 'Minimal 10kg');
            //     $this->createBuyerTypeIfNotExists($buyerId, $aluminumCanId, 14500, 'Minimal 2kg');
            // }
        }
    }
    
    /**
     * Mendapatkan atau membuat kategori sampah
     * 
     * @param string $nama
     * @param string $deskripsi
     * @param string $ikon
     * @return int
     */
    private function getOrCreateCategory($nama, $deskripsi, $ikon)
    {
        $existing = DB::table('waste_categories')
            ->where('nama_kategori', $nama)
            ->first();
            
        if ($existing) {
            return $existing->kategori_id;
        }
        
        return DB::table('waste_categories')->insertGetId([
            'nama_kategori' => $nama,
            'deskripsi' => $deskripsi,
            'ikon' => $ikon,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
    
    /**
     * Membuat jenis sampah jika belum ada
     * 
     * @param string $nama
     * @param int $kategoriId
     * @param string $deskripsi
     * @param string $caraSortir
     * @param string $caraPenyimpanan
     * @param string $gambar
     * @return int
     */
    private function createWasteTypeIfNotExists($nama, $kategoriId, $deskripsi, $caraSortir, $caraPenyimpanan, $gambar)
    {
        $existing = DB::table('waste_types')
            ->where('nama_sampah', $nama)
            ->where('kategori_id', $kategoriId)
            ->first();
            
        if ($existing) {
            return $existing->waste_id;
        }
        
        return DB::table('waste_types')->insertGetId([
            'nama_sampah' => $nama,
            'kategori_id' => $kategoriId,
            'deskripsi' => $deskripsi,
            'cara_sortir' => $caraSortir,
            'cara_penyimpanan' => $caraPenyimpanan,
            'gambar' => $gambar,
            'status_aktif' => true,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
    
    /**
     * Mendapatkan atau membuat pembeli sampah
     * 
     * @param string $nama
     * @param string $alamat
     * @param string $kontak
     * @param string $deskripsi
     * @param string $jamOperasional
     * @return int
     */
    private function getOrCreateBuyer($nama, $alamat, $kontak, $deskripsi, $jamOperasional)
    {
        $existing = DB::table('waste_buyers')
            ->where('nama_pembeli', $nama)
            ->first();
            
        if ($existing) {
            return $existing->pembeli_id;
        }
        
        return DB::table('waste_buyers')->insertGetId([
            'nama_pembeli' => $nama,
            'jenis_pembeli' => 'pengepul',
            'alamat' => $alamat,
            'kontak' => $kontak,
            'deskripsi' => $deskripsi,
            'jam_operasional' => $jamOperasional,
            'status' => 'AKTIF',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
    
    /**
     * Membuat relasi pembeli dan jenis sampah jika belum ada
     * 
     * @param int $buyerId
     * @param int $wasteId
     * @param float $hargaBeli
     * @param string $syaratMinimum
     * @return void
     */
    private function createBuyerTypeIfNotExists($buyerId, $wasteId, $hargaBeli, $syaratMinimum)
    {
        $existing = DB::table('waste_buyer_types')
            ->where('pembeli_id', $buyerId)
            ->where('waste_id', $wasteId)
            ->first();
            
        if ($existing) {
            return;
        }
        
        DB::table('waste_buyer_types')->insert([
            'pembeli_id' => $buyerId,
            'waste_id' => $wasteId,
            'harga_beli' => $hargaBeli,
            'syarat_minimum' => $syaratMinimum,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
} 