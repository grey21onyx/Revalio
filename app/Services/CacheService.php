<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Carbon;

class CacheService
{
    /**
     * Mendapatkan data dari cache atau menyimpannya jika tidak ada
     *
     * @param string $key
     * @param int $minutes
     * @param callable $callback
     * @return mixed
     */
    public static function remember(string $key, int $minutes, callable $callback)
    {
        return Cache::remember($key, Carbon::now()->addMinutes($minutes), $callback);
    }
    
    /**
     * Menghapus cache dengan key tertentu
     *
     * @param string $key
     * @return bool
     */
    public static function forget(string $key): bool
    {
        return Cache::forget($key);
    }
    
    /**
     * Menghapus cache dengan prefix
     *
     * @param string $prefix
     * @return void
     */
    public static function forgetByPrefix(string $prefix): void
    {
        $keys = collect(Cache::getStore()->keys("$prefix*"));
        
        if ($keys->isNotEmpty()) {
            $keys->each(function ($key) {
                Cache::forget(str_replace(Cache::getStore()->getPrefix(), '', $key));
            });
        }
    }
    
    /**
     * Membuat cache key yang unik berdasarkan parameter
     *
     * @param string $prefix
     * @param array $params
     * @return string
     */
    public static function makeKey(string $prefix, array $params = []): string
    {
        $key = $prefix;
        
        if (!empty($params)) {
            $key .= '_' . md5(serialize($params));
        }
        
        return $key;
    }
} 