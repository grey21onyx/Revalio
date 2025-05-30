<?php

namespace Database\Seeders;

use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ForumThreadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Pastikan ada pengguna di database
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->error('Tidak ada pengguna di database. Seeder dibatalkan.');
            return;
        }

        // Hapus data thread yang sudah ada (opsional)
        // ForumThread::truncate();

        // Data contoh thread forum
        $threads = [
            [
                'judul' => 'Tips Mengelola Sampah Rumah Tangga',
                'konten' => '<p>Halo teman-teman Revalio! Saya ingin berbagi beberapa tips tentang cara mengelola sampah rumah tangga secara efektif:</p><p>1. Pisahkan sampah organik dan anorganik</p><p>2. Gunakan kantong sampah yang berbeda untuk tiap jenis sampah</p><p>3. Buat kompos dari sampah organik</p><p>4. Daur ulang sampah plastik, kertas, dan kardus</p><p>5. Jual sampah yang masih memiliki nilai ekonomi</p><p>Apa pengalaman kalian dalam mengelola sampah di rumah?</p>',
                'tags' => 'tips,sampah rumah tangga,pengelolaan sampah',
                'view_count' => 120,
                'average_rating' => 4.5,
                'rating_count' => 12
            ],
            [
                'judul' => 'Mengubah Botol Plastik Menjadi Pot Tanaman',
                'konten' => '<p>Daripada membuang botol plastik bekas, kita bisa mengubahnya menjadi pot tanaman yang cantik. Berikut langkah-langkahnya:</p><p>1. Potong botol plastik menjadi dua bagian</p><p>2. Buat lubang drainase di bagian bawah</p><p>3. Hias dengan cat atau tali</p><p>4. Isi dengan tanah dan tanaman</p><p>Sudah pernah mencoba membuat pot dari botol plastik?</p>',
                'tags' => 'daur ulang,botol plastik,kerajinan,tips',
                'view_count' => 85,
                'average_rating' => 4.2,
                'rating_count' => 8
            ],
            [
                'judul' => 'Diskusi: Tantangan dalam Memulai Bank Sampah',
                'konten' => '<p>Saya tertarik untuk memulai bank sampah di lingkungan perumahan saya. Namun, ada beberapa tantangan yang saya hadapi:</p><p>1. Sulit mengajak warga untuk berpartisipasi</p><p>2. Keterbatasan tempat penyimpanan sampah</p><p>3. Sistem pencatatan dan pembukuan</p><p>4. Mencari pengepul yang konsisten</p><p>Bagi yang sudah pernah memulai atau terlibat dalam bank sampah, bagaimana cara Anda mengatasi tantangan-tantangan tersebut?</p>',
                'tags' => 'bank sampah,komunitas,sampah,tips',
                'view_count' => 150,
                'average_rating' => 4.8,
                'rating_count' => 15
            ],
            [
                'judul' => 'Membuat Kerajinan dari Sampah Kardus',
                'konten' => '<p>Kardus bekas bisa diubah menjadi berbagai kerajinan yang berguna. Beberapa ide kerajinan dari kardus:</p><p>1. Kotak penyimpanan</p><p>2. Bingkai foto</p><p>3. Rak buku sederhana</p><p>4. Mainan anak-anak</p><p>5. Alas pot tanaman</p><p>Mari berbagi kreasi kardus bekas kalian di thread ini!</p>',
                'tags' => 'daur ulang,kardus,kerajinan',
                'view_count' => 95,
                'average_rating' => 4.0,
                'rating_count' => 10
            ],
            [
                'judul' => 'Tanya: Bagaimana Cara Mendaur Ulang Sampah Elektronik?',
                'konten' => '<p>Saya memiliki beberapa barang elektronik yang sudah tidak terpakai seperti handphone lama, charger rusak, dan beberapa komponen komputer. Saya tahu bahwa sampah elektronik tidak boleh dibuang sembarangan karena mengandung bahan berbahaya.</p><p>Adakah yang tahu cara tepat untuk mendaur ulang sampah elektronik ini? Atau adakah tempat khusus yang menerima sampah elektronik di Indonesia?</p>',
                'tags' => 'sampah elektronik,daur ulang,tanya',
                'view_count' => 110,
                'average_rating' => 4.3,
                'rating_count' => 9
            ]
        ];

        $this->command->info('Memulai seeding forum threads...');

        foreach ($threads as $threadData) {
            // Pilih user secara acak
            $randomUser = $users->random();
            
            // Tambahkan data user_id dan tanggal_posting
            $threadData['user_id'] = $randomUser->user_id;
            $threadData['tanggal_posting'] = now()->subDays(rand(1, 30));
            $threadData['status'] = 'AKTIF';
            
            // Buat thread baru
            ForumThread::create($threadData);
        }

        $this->command->info('Seeding forum threads selesai!');
    }
} 