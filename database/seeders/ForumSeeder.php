<?php

namespace Database\Seeders;

use App\Models\ForumComment;
use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Periksa apakah sudah ada data forum
        if (ForumThread::count() > 0 && ForumComment::count() > 0) {
            // Jika sudah ada data, tidak perlu menjalankan seeder lagi
            $this->command->info('Forum data already exists. Skipping seeding.');
            return;
        }
        
        // Ambil beberapa user untuk membuat thread dan komentar
        $users = User::all();
        
        if ($users->isEmpty()) {
            // Jika belum ada user, buat user terlebih dahulu
            $users = User::factory(5)->create();
        }
        
        // Buat thread forum sampel
        $threads = [
            [
                'user_id' => $users->random()->user_id,
                'judul' => 'Bagaimana cara mendaur ulang botol plastik?',
                'konten' => "<p>Halo semua,</p>
                <p>Saya baru mulai mengumpulkan botol plastik di rumah dan ingin mencoba mendaur ulangnya sendiri. Ada yang punya pengalaman atau saran cara mengolah botol plastik menjadi sesuatu yang berguna?</p>
                <p>Terima kasih sebelumnya.</p>",
                'tanggal_posting' => now()->subDays(30),
                'status' => 'AKTIF',
                'tags' => '#daurulang, #plastik, #pertanyaan',
            ],
            [
                'user_id' => $users->random()->user_id,
                'judul' => 'Diskusi: Apakah bank sampah di area Anda efektif?',
                'konten' => "<p>Selamat siang rekan-rekan peduli lingkungan,</p>
                <p>Saya ingin memulai diskusi tentang efektivitas bank sampah di sekitar tempat tinggal kita. Di daerah saya, bank sampah sudah berjalan selama 2 tahun, tapi saya merasa masih banyak masyarakat yang belum memanfaatkannya dengan optimal.</p>
                <p>Bagaimana pengalaman Anda dengan bank sampah di daerah Anda? Apakah berjalan dengan baik? Apa saja kendala yang dihadapi?</p>
                <p>Mari berbagi pengalaman.</p>",
                'tanggal_posting' => now()->subDays(20),
                'status' => 'AKTIF',
                'tags' => '#banksampah, #diskusi, #lingkungan',
            ],
            [
                'user_id' => $users->random()->user_id,
                'judul' => 'Ide Bisnis: Kerajinan dari Sampah Tekstil',
                'konten' => "<p>Hai semuanya!</p>
                <p>Saya ingin berbagi ide bisnis yang telah saya mulai beberapa bulan terakhir: membuat kerajinan tangan dari kain perca dan pakaian bekas.</p>
                <p>Ternyata banyak sekali yang bisa dibuat, dari tas, dompet, hingga aksesoris rumah seperti sarung bantal dan taplak meja. Modalnya kecil dan bisa dikerjakan di rumah.</p>
                <p>Ada yang tertarik mencoba atau sudah memiliki usaha serupa? Mari berdiskusi tentang pasar dan peluangnya.</p>",
                'tanggal_posting' => now()->subDays(15),
                'status' => 'AKTIF',
                'tags' => '#idebisnis, #kerajinan, #tekstil, #usaha',
            ],
        ];
        
        // Buat thread forum
        $createdThreads = [];
        foreach ($threads as $thread) {
            // Menggunakan firstOrCreate untuk mencegah duplikasi
            $createdThreads[] = ForumThread::firstOrCreate(
                ['judul' => $thread['judul']],
                $thread
            );
        }
        
        // Periksa jumlah thread yang sudah ada
        $threadCount = ForumThread::count();
        if ($threadCount < 10) {
            // Buat thread tambahan secara acak jika jumlahnya kurang dari target
            $randomThreads = ForumThread::factory(10 - $threadCount)->create();
            $allThreads = array_merge($createdThreads, $randomThreads->all());
        } else {
            $allThreads = ForumThread::all();
        }
        
        // Buat komentar untuk thread pertama (cara mendaur ulang botol plastik)
        if (!empty($createdThreads)) {
            $thread1 = $createdThreads[0];
            
            // Periksa apakah thread sudah memiliki komentar
            if ($thread1->comments()->count() === 0) {
                $comments = [
                    [
                        'thread_id' => $thread1->thread_id,
                        'user_id' => $users->random()->user_id,
                        'konten' => "<p>Hai! Saya sudah beberapa bulan mendaur ulang botol plastik. Beberapa ide sederhana yang bisa kamu coba:</p>
                                    <ul>
                                        <li>Potong bagian bawah botol untuk dijadikan pot kecil untuk tanaman</li>
                                        <li>Buat tempat pensil dari botol yang dipotong dan dihias</li>
                                        <li>Gunakan sebagai wadah untuk menyimpan biji-bijian atau rempah di dapur</li>
                                    </ul>
                                    <p>Semoga membantu!</p>",
                        'tanggal_komentar' => now()->subDays(29),
                        'parent_komentar_id' => null,
                    ],
                    [
                        'thread_id' => $thread1->thread_id,
                        'user_id' => $users->random()->user_id,
                        'konten' => "<p>Kalau mau lebih canggih, coba cari tutorial di YouTube untuk membuat sapu atau kerajinan yang lebih kompleks dari botol plastik. Ada banyak video yang menjelaskan langkah-langkahnya dengan detail.</p>",
                        'tanggal_komentar' => now()->subDays(28),
                        'parent_komentar_id' => null,
                    ],
                ];
                
                $parentComment1 = ForumComment::create($comments[0]);
                $parentComment2 = ForumComment::create($comments[1]);
                
                // Buat balasan untuk komentar pertama
                $replies = [
                    [
                        'thread_id' => $thread1->thread_id,
                        'user_id' => $thread1->user_id, // OP merespon
                        'konten' => "<p>Terima kasih atas sarannya! Saya akan mencoba membuat pot tanaman dulu karena sepertinya paling mudah.</p>",
                        'tanggal_komentar' => now()->subDays(28)->addHours(2),
                        'parent_komentar_id' => $parentComment1->komentar_id,
                    ],
                    [
                        'thread_id' => $thread1->thread_id,
                        'user_id' => $users->random()->user_id,
                        'konten' => "<p>Saya juga suka ide pot tanaman ini. Sudah saya coba dan hasilnya cukup bagus. Kuncinya adalah membuat lubang kecil di bagian bawah untuk drainase.</p>",
                        'tanggal_komentar' => now()->subDays(27),
                        'parent_komentar_id' => $parentComment1->komentar_id,
                    ],
                ];
                
                foreach ($replies as $reply) {
                    ForumComment::create($reply);
                }
            }
        }
        
        // Periksa setiap thread untuk melihat apakah memerlukan komentar tambahan
        foreach ($allThreads as $thread) {
            // Hitung komentar yang sudah ada
            $existingCommentCount = ForumComment::where('thread_id', $thread->thread_id)->count();
            
            // Jika komentar kurang, tambahkan komentar baru
            if ($existingCommentCount < 3) { // Minimal 3 komentar per thread
                // Tentukan berapa komentar yang perlu ditambahkan
                $commentCount = rand(3, 8) - $existingCommentCount;
                if ($commentCount > 0) {
                    $comments = ForumComment::factory($commentCount)->create([
                        'thread_id' => $thread->thread_id
                    ]);
                    
                    // Buat 1-3 balasan untuk beberapa komentar
                    foreach ($comments->random(min(2, $commentCount)) as $comment) {
                        ForumComment::factory(rand(1, 3))->asReply()->create([
                            'thread_id' => $thread->thread_id,
                            'parent_komentar_id' => $comment->komentar_id
                        ]);
                    }
                }
            }
        }
    }
} 