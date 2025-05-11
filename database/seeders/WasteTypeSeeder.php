<?php

namespace Database\Seeders;

use App\Models\WasteType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WasteTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data sampel untuk setiap kategori sampah
        $wasteTypes = [
            // Kategori 1: Plastik
            [
                'nama_sampah' => 'Botol PET',
                'kategori_id' => 1,
                'deskripsi' => 'Botol plastik Polyethylene Terephthalate, banyak digunakan untuk kemasan minuman.',
                'cara_sortir' => 'Buang tutupnya (jika dari plastik berbeda), bilas dengan air, keringkan dan tekan untuk menghemat ruang.',
                'cara_penyimpanan' => 'Simpan di wadah kering, hindari paparan sinar matahari langsung agar tidak meleleh.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Kantong Kresek',
                'kategori_id' => 1,
                'deskripsi' => 'Kantong plastik tipis yang biasa digunakan untuk kemasan belanja.',
                'cara_sortir' => 'Pisahkan dari sampah lainnya, bersihkan dari kotoran, pastikan kering.',
                'cara_penyimpanan' => 'Lipat rapi untuk menghemat ruang, masukkan ke dalam wadah tertutup.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Plastik PP',
                'kategori_id' => 1,
                'deskripsi' => 'Polypropylene, biasa digunakan untuk wadah makanan tahan panas, tutup botol, sedotan.',
                'cara_sortir' => 'Pisahkan berdasarkan jenis, bersihkan dari sisa makanan.',
                'cara_penyimpanan' => 'Simpan di tempat kering, pisahkan berdasarkan warna untuk mempermudah daur ulang.',
                'status_aktif' => true,
            ],
            
            // Kategori 2: Kertas
            [
                'nama_sampah' => 'Kardus',
                'kategori_id' => 2,
                'deskripsi' => 'Kardus bekas kemasan produk, kotak pengiriman.',
                'cara_sortir' => 'Lepaskan selotip atau label, lipat rata untuk menghemat ruang.',
                'cara_penyimpanan' => 'Simpan di tempat kering, hindari terkena air atau lembab agar tetap bernilai.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Koran',
                'kategori_id' => 2,
                'deskripsi' => 'Koran bekas yang sudah dibaca.',
                'cara_sortir' => 'Pisahkan dari sampah lain, hindari koran yang basah atau berminyak.',
                'cara_penyimpanan' => 'Tumpuk rapi atau ikat agar mudah ditangani, simpan di tempat kering.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Kertas HVS',
                'kategori_id' => 2,
                'deskripsi' => 'Kertas putih bekas cetak atau fotokopi, dokumen yang sudah tidak digunakan.',
                'cara_sortir' => 'Pisahkan dari kertas warna atau kertas glossy, lepaskan klip atau staples.',
                'cara_penyimpanan' => 'Simpan di tempat kering dalam keadaan rata agar tidak kusut.',
                'status_aktif' => true,
            ],
            
            // Kategori 3: Logam
            [
                'nama_sampah' => 'Kaleng Aluminium',
                'kategori_id' => 3,
                'deskripsi' => 'Kaleng minuman ringan, kaleng bir, dll yang terbuat dari aluminium.',
                'cara_sortir' => 'Bilas untuk menghilangkan sisa cairan, remukkan untuk menghemat ruang.',
                'cara_penyimpanan' => 'Simpan di wadah yang kuat, hati-hati terhadap tepi kaleng yang tajam.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Besi',
                'kategori_id' => 3,
                'deskripsi' => 'Berbagai jenis besi bekas seperti pipa, peralatan, atau pagar usang.',
                'cara_sortir' => 'Pisahkan dari material non-logam, bersihkan dari cat atau karat jika memungkinkan.',
                'cara_penyimpanan' => 'Simpan di area yang kuat dan tahan berat, hindari kontak dengan air untuk mencegah karat.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Kaleng Makanan',
                'kategori_id' => 3,
                'deskripsi' => 'Kaleng bekas makanan kaleng.',
                'cara_sortir' => 'Bilas untuk menghilangkan sisa makanan, lepaskan label kertas jika ada.',
                'cara_penyimpanan' => 'Simpan di tempat kering, hindari penumpukan yang berantakan.',
                'status_aktif' => true,
            ],
            
            // Kategori 4: Kaca
            [
                'nama_sampah' => 'Botol Kaca',
                'kategori_id' => 4,
                'deskripsi' => 'Botol kaca bekas minuman, saus, dll.',
                'cara_sortir' => 'Bilas dari sisa cairan, lepaskan tutup dan label jika memungkinkan.',
                'cara_penyimpanan' => 'Simpan dengan hati-hati untuk menghindari pecah, wadah kokoh dengan lapisan bantalan.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Gelas Kaca',
                'kategori_id' => 4,
                'deskripsi' => 'Gelas minum atau wadah kaca bekas.',
                'cara_sortir' => 'Bersihkan dari sisa cairan atau makanan, hati-hati terhadap retakan.',
                'cara_penyimpanan' => 'Letakkan di wadah kokoh, lapisi dengan koran atau kertas untuk menghindari pecah.',
                'status_aktif' => true,
            ],
            
            // Kategori 7: Organik
            [
                'nama_sampah' => 'Sisa Makanan',
                'kategori_id' => 7,
                'deskripsi' => 'Sisa makanan dari dapur atau makanan yang tidak termakan.',
                'cara_sortir' => 'Pisahkan dari sampah non-organik, buang kemasan sebelum membuang makanan.',
                'cara_penyimpanan' => 'Gunakan wadah tertutup dan kedap udara untuk mengurangi bau, kosongkan secara rutin.',
                'status_aktif' => true,
            ],
            [
                'nama_sampah' => 'Daun Kering',
                'kategori_id' => 7,
                'deskripsi' => 'Daun-daun kering dari tanaman atau pohon.',
                'cara_sortir' => 'Pisahkan dari material non-organik seperti plastik atau logam.',
                'cara_penyimpanan' => 'Simpan di karung atau wadah berventilasi, jaga agar tetap kering jika digunakan untuk kompos.',
                'status_aktif' => true,
            ],
            
            // Kategori 10: Minyak Bekas
            [
                'nama_sampah' => 'Minyak Goreng Bekas',
                'kategori_id' => 10,
                'deskripsi' => 'Minyak goreng yang sudah digunakan untuk memasak.',
                'cara_sortir' => 'Saring untuk menghilangkan sisa makanan, simpan di botol atau wadah tertutup.',
                'cara_penyimpanan' => 'Gunakan wadah kedap yang tahan bocor, tidak tercampur dengan sampah lain.',
                'status_aktif' => true,
            ],
        ];
        
        foreach ($wasteTypes as $wasteType) {
            WasteType::create($wasteType);
        }
        
        // Tambahkan beberapa data acak menggunakan factory
        WasteType::factory(15)->create();
    }
} 