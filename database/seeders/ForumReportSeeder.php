<?php

namespace Database\Seeders;

use App\Models\ForumComment;
use App\Models\ForumReport;
use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Database\Seeder;

class ForumReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cek apakah sudah ada data
        if (ForumReport::count() > 0) {
            $this->command->info('Forum reports already seeded - skipping...');
            return;
        }

        // Ambil beberapa user untuk pelapor dan admin
        $users = User::take(5)->get();
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $this->command->warn('Admin user not found. Using the first user as admin.');
            $admin = $users->first();
        }

        // Ambil beberapa thread untuk dilaporkan
        $threads = ForumThread::take(3)->get();
        
        if ($threads->isEmpty()) {
            $this->command->warn('No forum threads found. Skipping thread reports.');
        } else {
            // Buat laporan untuk thread
            foreach ($threads as $index => $thread) {
                if ($index < 2) {
                    // Laporan pending (now using 'reported' as status)
                    ForumReport::create([
                        'user_id' => $users->random()->user_id,
                        'reportable_type' => 'thread',
                        'reportable_id' => $thread->thread_id,
                        'thread_id' => $thread->thread_id,
                        'reported_by_id' => $users->random()->user_id,
                        'report_reason' => $this->getRandomReason(),
                        'description' => 'Thread ini tidak sesuai dengan pedoman forum kami.',
                        'status' => 'reported',
                        'reported_at' => now()->subDays(rand(1, 5)),
                        'created_at' => now()->subDays(rand(1, 5)),
                        'updated_at' => now()
                    ]);
                } else {
                    // Laporan yang sudah diselesaikan
                    ForumReport::create([
                        'user_id' => $users->random()->user_id,
                        'reportable_type' => 'thread',
                        'reportable_id' => $thread->thread_id,
                        'thread_id' => $thread->thread_id,
                        'reported_by_id' => $users->random()->user_id,
                        'report_reason' => $this->getRandomReason(),
                        'description' => 'Thread ini melanggar aturan forum.',
                        'status' => 'resolved',
                        'resolution_note' => 'Laporan valid. Thread telah dihapus.',
                        'resolved_at' => now()->subDays(rand(1, 3)),
                        'reported_at' => now()->subDays(rand(4, 7)),
                        'created_at' => now()->subDays(rand(4, 7)),
                        'updated_at' => now()
                    ]);
                }
            }
        }

        // Ambil beberapa komentar untuk dilaporkan
        $comments = ForumComment::take(5)->get();
        
        if ($comments->isEmpty()) {
            $this->command->warn('No forum comments found. Skipping comment reports.');
        } else {
            // Buat laporan untuk komentar
            foreach ($comments as $index => $comment) {
                if ($index < 3) {
                    // Laporan pending (now using 'reported' as status)
                    ForumReport::create([
                        'user_id' => $users->random()->user_id,
                        'reportable_type' => 'comment',
                        'reportable_id' => $comment->komentar_id,
                        'thread_id' => $comment->thread_id,
                        'comment_id' => $comment->komentar_id,
                        'reported_by_id' => $users->random()->user_id,
                        'report_reason' => $this->getRandomReason(),
                        'description' => 'Komentar ini berisi ujaran kebencian.',
                        'status' => 'reported',
                        'reported_at' => now()->subDays(rand(1, 3)),
                        'created_at' => now()->subDays(rand(1, 3)),
                        'updated_at' => now()
                    ]);
                } else if ($index == 3) {
                    // Laporan ditolak
                    ForumReport::create([
                        'user_id' => $users->random()->user_id,
                        'reportable_type' => 'comment',
                        'reportable_id' => $comment->komentar_id,
                        'thread_id' => $comment->thread_id,
                        'comment_id' => $comment->komentar_id,
                        'reported_by_id' => $users->random()->user_id,
                        'report_reason' => $this->getRandomReason(),
                        'description' => 'Komentar ini tidak pantas.',
                        'status' => 'rejected',
                        'resolution_note' => 'Laporan ditolak. Komentar tidak melanggar pedoman.',
                        'resolved_at' => now()->subDays(rand(1, 2)),
                        'reported_at' => now()->subDays(rand(3, 5)),
                        'created_at' => now()->subDays(rand(3, 5)),
                        'updated_at' => now()
                    ]);
                
                    // Laporan diselesaikan
                    ForumReport::create([
                        'user_id' => $users->random()->user_id,
                        'reportable_type' => 'comment',
                        'reportable_id' => $comment->komentar_id,
                        'thread_id' => $comment->thread_id,
                        'comment_id' => $comment->komentar_id,
                        'reported_by_id' => $users->random()->user_id,
                        'report_reason' => $this->getRandomReason(),
                        'description' => 'Komentar ini berisi spam.',
                        'status' => 'resolved',
                        'resolution_note' => 'Laporan valid. Komentar telah dihapus.',
                        'resolved_at' => now()->subDay(),
                        'reported_at' => now()->subDays(2),
                        'created_at' => now()->subDays(2),
                        'updated_at' => now()
                    ]);
                }
            }
        }

        $this->command->info('Forum reports seeded successfully.');
    }

    /**
     * Get a random reason for reporting
     */
    private function getRandomReason(): string
    {
        $reasons = ['inappropriate', 'spam', 'harassment', 'misinformation', 'other'];
        return $reasons[array_rand($reasons)];
    }
} 