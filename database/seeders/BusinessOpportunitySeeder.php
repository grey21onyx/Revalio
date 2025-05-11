<?php

namespace Database\Seeders;

use App\Models\BusinessOpportunity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
                'kategori' => 'Bank Sampah',
                'investasi_awal' => 5000000,
                'potensi_pendapatan' => 'Rp 5-15 juta per bulan tergantung volume sampah yang dikumpulkan dan dikelola. Pendapatan berasal dari penjualan sampah terpilah ke pengepul besar, komisi dari pengelolaan pembelian sampah, dan layanan pengangkutan sampah.',
                'tantangan' => "1. Membutuhkan ruang penyimpanan dan pemilahan yang cukup\n2. Perlu membangun jaringan dengan pengepul sampah\n3. Membutuhkan pengetahuan teknis tentang jenis sampah dan nilainya\n4. Sosialisasi kepada masyarakat sekitar tentang pentingnya pemilahan sampah",
                'saran_implementasi' => "1. Mulai dari lingkungan perumahan dengan 100-200 kepala keluarga\n2. Buat sistem pembukuan dan pencatatan yang transparan\n3. Buat jadwal pengumpulan sampah yang rutin dan terpercaya\n4. Sediakan fasilitas penimbangan yang akurat\n5. Berikan edukasi tentang pemilahan sampah kepada masyarakat\n6. Jalin kerjasama dengan pengepul besar untuk kepastian penjualan",
            ],
            [
                'judul' => 'Produksi Kerajinan dari Sampah Plastik',
                'deskripsi' => 'Bisnis pembuatan berbagai produk kerajinan dari sampah plastik, seperti tas, dompet, dan aksesoris rumah tangga.',
                'kategori' => 'Kerajinan Tangan',
                'investasi_awal' => 3000000,
                'potensi_pendapatan' => 'Rp 3-10 juta per bulan. Produk kerajinan dari sampah plastik bisa dijual dengan harga yang cukup tinggi, terutama jika memiliki desain yang unik dan menarik. Margin keuntungan bisa mencapai 100-200% dari biaya produksi.',
                'tantangan' => "1. Membutuhkan keterampilan dalam desain dan produksi kerajinan\n2. Persaingan dengan produk serupa di pasaran\n3. Perlu strategi pemasaran yang tepat untuk mendidik konsumen tentang nilai produk daur ulang\n4. Diperlukan inovasi desain secara berkelanjutan",
                'saran_implementasi' => "1. Mulai dengan beberapa jenis produk unggulan\n2. Buat branding yang kuat dengan fokus pada aspek ramah lingkungan\n3. Gunakan media sosial untuk pemasaran dan edukasi\n4. Jalin kerjasama dengan komunitas atau LSM lingkungan\n5. Pertimbangkan untuk menjual produk secara online dan offline\n6. Ikuti pameran produk kerajinan untuk membangun jaringan",
            ],
            [
                'judul' => 'Usaha Pengolahan Sampah Organik menjadi Kompos',
                'deskripsi' => 'Bisnis pengolahan sampah organik rumah tangga dan pasar menjadi pupuk kompos berkualitas untuk pertanian dan perkebunan.',
                'kategori' => 'Kompos',
                'investasi_awal' => 10000000,
                'potensi_pendapatan' => 'Rp 8-20 juta per bulan. Kompos berkualitas tinggi bisa dijual ke petani, taman kota, perkebunan, dan masyarakat umum dengan harga Rp 15.000-30.000 per kilogram tergantung kualitas dan kemasan.',
                'tantangan' => "1. Membutuhkan lahan yang cukup untuk pengomposan\n2. Perlu mengelola bau yang ditimbulkan selama proses\n3. Membutuhkan pengetahuan tentang proses pengomposan yang tepat\n4. Perlu memastikan kualitas kompos yang konsisten\n5. Membutuhkan jaringan pemasaran yang kuat",
                'saran_implementasi' => "1. Mulai dengan teknologi pengomposan sederhana seperti metode Takakura atau bak kompos\n2. Bangun kerjasama dengan pasar tradisional untuk mendapatkan sampah organik\n3. Lakukan pengujian kualitas kompos secara berkala\n4. Kembangkan paket kompos dalam berbagai ukuran sesuai kebutuhan konsumen\n5. Tawarkan layanan konsultasi tentang penggunaan kompos yang tepat\n6. Jalin kerjasama dengan komunitas pertanian dan perkebunan",
            ],
            [
                'judul' => 'Daur Ulang Sampah Kertas untuk Produksi Kertas Kerajinan',
                'deskripsi' => 'Usaha pengolahan sampah kertas menjadi kertas khusus untuk kerajinan, undangan, dan produk kertas premium.',
                'kategori' => 'Pengolahan Kertas',
                'investasi_awal' => 15000000,
                'potensi_pendapatan' => 'Rp 10-25 juta per bulan. Kertas daur ulang dengan kualitas artistik bisa dijual dengan harga premium, terutama untuk kebutuhan undangan pernikahan, seni, dan produk kemasan eksklusif.',
                'tantangan' => "1. Membutuhkan peralatan khusus untuk pengolahan bubur kertas\n2. Perlu keterampilan dalam pembuatan kertas dengan tekstur dan kualitas konsisten\n3. Persaingan dengan produsen kertas komersial\n4. Membutuhkan pasokan sampah kertas yang konsisten dan bersih",
                'saran_implementasi' => "1. Mulai dengan skala kecil dan fokus pada kualitas produk\n2. Kembangkan teknik pembuatan kertas yang unik sebagai nilai jual\n3. Jalin kerjasama dengan seniman, desainer, dan perencana acara\n4. Bangun jaringan dengan kantor-kantor untuk mendapatkan sampah kertas\n5. Buat katalog produk dengan berbagai variasi tekstur, warna, dan ketebalan\n6. Tawarkan workshop pembuatan kertas daur ulang sebagai strategi pemasaran",
            ],
        ];
        
        foreach ($opportunities as $opportunity) {
            BusinessOpportunity::create($opportunity);
        }
        
        // Buat peluang bisnis acak tambahan
        BusinessOpportunity::factory(6)->create();
    }
} 