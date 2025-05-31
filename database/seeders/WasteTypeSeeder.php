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
        
        // Seeder untuk jenis sampah plastik
        $petBottleId = $this->createWasteTypeIfNotExists(
            'Botol PET',
            $plasticCategoryId,
            'Botol plastik PET (Polyethylene terephthalate) biasa digunakan untuk kemasan minuman. Memiliki kode daur ulang 1 dan bisa didaur ulang menjadi berbagai produk seperti serat polyester, kemasan, dan sebagainya.',
            "1. Kosongkan isi botol\n2. Bilas dengan air\n3. Keringkan\n4. Pisahkan tutup botol (biasanya berbahan PP)\n5. Tekan botol untuk mengurangi volume",
            "1. Pastikan botol sudah kering\n2. Tekan untuk memadatkan\n3. Kumpulkan dalam wadah tertutup\n4. Simpan di tempat yang kering dan tidak terkena sinar matahari langsung",
            'waste_types/botol_pet.jpg'
        );
        
        // Cek apakah waste value sudah ada
        if (!DB::table('waste_values')->where('waste_id', $petBottleId)->exists()) {
            // Seeder untuk nilai ekonomis sampah
            DB::table('waste_values')->insert([
                'waste_id' => $petBottleId,
                'harga_minimum' => 2500,
                'harga_maksimum' => 5000,
                'satuan' => 'kg',
                'tanggal_update' => Carbon::now()->subDays(30),
                'sumber_data' => 'Survey Pasar',
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ]);
            
            DB::table('waste_values')->insert([
                'waste_id' => $petBottleId,
                'harga_minimum' => 3000,
                'harga_maksimum' => 5500,
                'satuan' => 'kg',
                'tanggal_update' => Carbon::now()->subDays(15),
                'sumber_data' => 'Survey Pasar',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ]);
            
            DB::table('waste_values')->insert([
                'waste_id' => $petBottleId,
                'harga_minimum' => 3500,
                'harga_maksimum' => 6000,
                'satuan' => 'kg',
                'tanggal_update' => Carbon::now(),
                'sumber_data' => 'Survey Pasar',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
        
        // Seeder untuk sampah kertas
        $cardboardId = $this->createWasteTypeIfNotExists(
            'Kardus',
            $paperCategoryId,
            'Kardus atau karton bergelombang merupakan jenis kemasan berbahan kertas yang memiliki nilai ekonomis tinggi untuk didaur ulang. Kardus dapat diproses menjadi kardus baru atau produk kertas lainnya.',
            "1. Buka dan ratakan kardus\n2. Buang selotip, staples, dan elemen non-kertas lainnya\n3. Pastikan kardus tidak basah atau terkontaminasi minyak/makanan\n4. Tumpuk dan ikat agar tidak berantakan",
            "1. Simpan di tempat kering\n2. Hindari terkena air atau lembab\n3. Ikat rapi agar tidak tercecer\n4. Jauhkan dari sumber panas dan api",
            'waste_types/kardus.jpg'
        );
        
        if (!DB::table('waste_values')->where('waste_id', $cardboardId)->exists()) {
            DB::table('waste_values')->insert([
                'waste_id' => $cardboardId,
                'harga_minimum' => 1500,
                'harga_maksimum' => 3000,
                'satuan' => 'kg',
                'tanggal_update' => Carbon::now(),
                'sumber_data' => 'Survey Pasar',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
        
        // Seeder untuk sampah logam
        $aluminumCanId = $this->createWasteTypeIfNotExists(
            'Kaleng Aluminium',
            $metalCategoryId,
            'Kaleng aluminium biasa digunakan untuk kemasan minuman bersoda atau bir. Aluminium dapat didaur ulang dengan efisiensi energi yang tinggi dan dapat didaur ulang berulang kali tanpa kehilangan kualitas.',
            "1. Kosongkan isi kaleng\n2. Bilas dengan air\n3. Keringkan\n4. Tekan untuk mengurangi volume\n5. Pisahkan dari sampah lain",
            "1. Pastikan kaleng sudah kering\n2. Tekan untuk memadatkan (opsional)\n3. Kumpulkan dalam wadah khusus logam\n4. Simpan di tempat yang kering",
            'waste_types/kaleng_aluminium.jpg'
        );
        
        if (!DB::table('waste_values')->where('waste_id', $aluminumCanId)->exists()) {
            DB::table('waste_values')->insert([
                'waste_id' => $aluminumCanId,
                'harga_minimum' => 10000,
                'harga_maksimum' => 15000,
                'satuan' => 'kg',
                'tanggal_update' => Carbon::now(),
                'sumber_data' => 'Survey Pasar',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
        
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
            if (DB::getSchemaBuilder()->hasTable('waste_buyer_types')) {
                $this->createBuyerTypeIfNotExists($buyerId, $petBottleId, 5500, 'Minimal 5kg');
                $this->createBuyerTypeIfNotExists($buyerId, $cardboardId, 2800, 'Minimal 10kg');
                $this->createBuyerTypeIfNotExists($buyerId, $aluminumCanId, 14500, 'Minimal 2kg');
            }
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