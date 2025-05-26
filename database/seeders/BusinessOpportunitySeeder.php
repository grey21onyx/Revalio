<?php

namespace Database\Seeders;

use App\Models\BusinessOpportunity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BusinessOpportunitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat peluang bisnis sampel
        $opportunities = [
            [
                'judul' => 'Bisnis Bank Sampah Mini',
                'deskripsi' => 'Peluang bisnis untuk mendirikan bank sampah skala kecil di lingkungan perumahan atau kompleks apartemen.',
                'jenis_sampah_terkait' => 'Sampah Rumah Tangga',
                'investasi_minimal' => 5000000,
                'investasi_maksimal' => 7500000,
                'potensi_keuntungan' => 'Rp 5-15 juta per bulan tergantung volume sampah yang dikumpulkan dan dikelola. Pendapatan berasal dari penjualan sampah terpilah ke pengepul besar, komisi dari pengelolaan pembelian sampah, dan layanan pengangkutan sampah.',
                'sumber_informasi' => 'Penelitian Pengelolaan Sampah',
                'tanggal_publikasi' => Carbon::now(),
                'status' => 'AKTIF',
            ],
            [
                'judul' => 'Produksi Kerajinan dari Sampah Plastik',
                'deskripsi' => 'Bisnis pembuatan berbagai produk kerajinan dari sampah plastik, seperti tas, dompet, dan aksesoris rumah tangga.',
                'jenis_sampah_terkait' => 'Plastik',
                'investasi_minimal' => 3000000,
                'investasi_maksimal' => 5000000,
                'potensi_keuntungan' => 'Rp 3-10 juta per bulan. Produk kerajinan dari sampah plastik bisa dijual dengan harga yang cukup tinggi, terutama jika memiliki desain yang unik dan menarik. Margin keuntungan bisa mencapai 100-200% dari biaya produksi.',
                'sumber_informasi' => 'Asosiasi Pengrajin Daur Ulang',
                'tanggal_publikasi' => Carbon::now()->subDays(5),
                'status' => 'AKTIF',
            ],
            [
                'judul' => 'Usaha Pengolahan Sampah Organik menjadi Kompos',
                'deskripsi' => 'Bisnis pengolahan sampah organik rumah tangga dan pasar menjadi pupuk kompos berkualitas untuk pertanian dan perkebunan.',
                'jenis_sampah_terkait' => 'Organik',
                'investasi_minimal' => 10000000,
                'investasi_maksimal' => 15000000,
                'potensi_keuntungan' => 'Rp 8-20 juta per bulan. Kompos berkualitas tinggi bisa dijual ke petani, taman kota, perkebunan, dan masyarakat umum dengan harga Rp 15.000-30.000 per kilogram tergantung kualitas dan kemasan.',
                'sumber_informasi' => 'Forum Pertanian Organik',
                'tanggal_publikasi' => Carbon::now()->subDays(10),
                'status' => 'AKTIF',
            ],
            [
                'judul' => 'Daur Ulang Sampah Kertas untuk Produksi Kertas Kerajinan',
                'deskripsi' => 'Usaha pengolahan sampah kertas menjadi kertas khusus untuk kerajinan, undangan, dan produk kertas premium.',
                'jenis_sampah_terkait' => 'Kertas',
                'investasi_minimal' => 15000000,
                'investasi_maksimal' => 20000000,
                'potensi_keuntungan' => 'Rp 10-25 juta per bulan. Kertas daur ulang dengan kualitas artistik bisa dijual dengan harga premium, terutama untuk kebutuhan undangan pernikahan, seni, dan produk kemasan eksklusif.',
                'sumber_informasi' => 'Asosiasi Produsen Kertas',
                'tanggal_publikasi' => Carbon::now()->subDays(15),
                'status' => 'AKTIF',
            ],
        ];
        
        foreach ($opportunities as $opportunity) {
            BusinessOpportunity::create($opportunity);
        }
        
        // Buat peluang bisnis acak tambahan
        BusinessOpportunity::factory(6)->create();
    }
} 