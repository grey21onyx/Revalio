<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class DbMonitor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:monitor
                            {--max-connections=100 : Maximum allowed connections}
                            {--notify : Send notification if thresholds are exceeded}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor database performance metrics and connection count';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Running Database Performance Monitoring...');
        
        // Ambil parameter dari options
        $maxConnections = (int) $this->option('max-connections');
        $shouldNotify = (bool) $this->option('notify');
        
        try {
            // Cek koneksi database
            $isConnected = DB::connection()->getPdo() ? true : false;
            
            if (!$isConnected) {
                $this->error('Database connection failed');
                Log::error('DB Monitor: Connection to database failed');
                return 1;
            }
            
            // Cek jumlah koneksi aktif (MySQL/MariaDB)
            $connections = DB::select('SHOW STATUS WHERE Variable_name = "Threads_connected"');
            $activeConnections = $connections[0]->Value ?? 0;
            
            // Cek cache hit rate jika menggunakan cache
            $cacheHitRate = null;
            if (config('cache.default') === 'redis') {
                // Calculate Redis cache hit rate 
                $info = Cache::getRedis()->info();
                $hits = $info['Stats']['keyspace_hits'] ?? 0;
                $misses = $info['Stats']['keyspace_misses'] ?? 0;
                $total = $hits + $misses;
                $cacheHitRate = $total > 0 ? ($hits / $total) * 100 : 0;
            }
            
            // Cek query time terlama (only possible dengan query log enabled)
            $slowQueries = DB::select("SHOW GLOBAL STATUS LIKE 'Slow_queries'");
            $slowQueryCount = $slowQueries[0]->Value ?? 0;
            
            // Tampilkan hasil
            $this->info("Active Connections: {$activeConnections} / {$maxConnections}");
            if ($cacheHitRate !== null) {
                $this->info("Cache Hit Rate: " . number_format($cacheHitRate, 2) . "%");
            }
            $this->info("Slow Queries: {$slowQueryCount}");
            
            // Log metrik
            Log::info("DB Monitor: Active Connections: {$activeConnections}, Slow Queries: {$slowQueryCount}");
            
            // Buat warning jika threshold tercapai
            $warningMessages = [];
            
            if ($activeConnections > ($maxConnections * 0.8)) {
                $message = "High database connection usage: {$activeConnections}/{$maxConnections}";
                $this->warn($message);
                $warningMessages[] = $message;
            }
            
            if ($cacheHitRate !== null && $cacheHitRate < 70) {
                $message = "Low cache hit rate: " . number_format($cacheHitRate, 2) . "%";
                $this->warn($message);
                $warningMessages[] = $message;
            }
            
            if ($slowQueryCount > 10) {
                $message = "High number of slow queries: {$slowQueryCount}";
                $this->warn($message);
                $warningMessages[] = $message;
            }
            
            // Kirim notifikasi jika diperlukan
            if ($shouldNotify && !empty($warningMessages)) {
                Log::warning('DB Monitor Warning: ' . implode(', ', $warningMessages));
                // Di sini bisa ditambahkan kode untuk mengirim email atau notifikasi 
                // ke admin/developer jika diperlukan
            }
            
            return 0;
        } catch (\Exception $e) {
            $this->error('Error monitoring database: ' . $e->getMessage());
            Log::error('DB Monitor Error: ' . $e->getMessage());
            return 1;
        }
    }
} 