<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class HealthController extends Controller
{
    /**
     * Endpoint health check untuk load balancer
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function check()
    {
        $status = 'healthy';
        $checks = [
            'app' => true,
            'database' => true,
            'cache' => true
        ];
        
        try {
            // Check database connection
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $status = 'unhealthy';
            $checks['database'] = false;
            Log::error('Health check failed - Database: ' . $e->getMessage());
        }
        
        try {
            // Check cache connection
            Cache::set('health-check-test', 'ok', 1);
            $cacheTest = Cache::get('health-check-test');
            if ($cacheTest !== 'ok') {
                throw new \Exception('Cache test failed');
            }
        } catch (\Exception $e) {
            $status = 'unhealthy';
            $checks['cache'] = false;
            Log::error('Health check failed - Cache: ' . $e->getMessage());
        }
        
        // Check disk space
        $disk = disk_free_space('/');
        $diskTotal = disk_total_space('/');
        $diskPercentage = ($disk / $diskTotal) * 100;
        $diskStats = [
            'free_space' => $disk,
            'total_space' => $diskTotal,
            'free_percentage' => $diskPercentage
        ];
        
        // Check memory
        $memInfo = $this->getMemoryInfo();
        
        // Server info
        $serverInfo = [
            'server_name' => config('scaling.load_balancing.server_id'),
            'php_version' => PHP_VERSION,
            'os' => PHP_OS,
            'server_time' => now()->toIso8601String(),
        ];
        
        return response()->json([
            'status' => $status,
            'checks' => $checks,
            'server' => $serverInfo,
            'resources' => [
                'disk' => $diskStats,
                'memory' => $memInfo
            ]
        ], $status === 'healthy' ? 200 : 503);
    }
    
    /**
     * Mendapatkan informasi memori
     * 
     * @return array
     */
    private function getMemoryInfo()
    {
        if (function_exists('sys_getloadavg')) {
            $load = sys_getloadavg();
            $loadInfo = [
                'load_1min' => $load[0],
                'load_5min' => $load[1],
                'load_15min' => $load[2]
            ];
        } else {
            $loadInfo = [
                'load_1min' => 'N/A',
                'load_5min' => 'N/A',
                'load_15min' => 'N/A'
            ];
        }
        
        return [
            'load' => $loadInfo,
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true)
        ];
    }
} 