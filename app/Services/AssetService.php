<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class AssetService
{
    /**
     * Mendapatkan URL lengkap untuk aset
     *
     * @param string $path
     * @return string
     */
    public static function url(string $path): string
    {
        // Jika path sudah berupa URL lengkap, kembalikan langsung
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }
        
        // Jika menggunakan CDN
        if (config('app.asset_url')) {
            return rtrim(config('app.asset_url'), '/') . '/' . ltrim($path, '/');
        }
        
        // Jika tidak menggunakan CDN, gunakan asset URL biasa
        return asset($path);
    }
    
    /**
     * Mendapatkan URL untuk gambar dengan placeholder jika tidak ada
     *
     * @param string|null $path
     * @param string $placeholder
     * @return string
     */
    public static function image(?string $path, string $placeholder = 'images/placeholder.png'): string
    {
        if (empty($path)) {
            return self::url($placeholder);
        }
        
        return self::url($path);
    }
    
    /**
     * Mendapatkan URL untuk file JavaScript
     *
     * @param string $path
     * @return string
     */
    public static function js(string $path): string
    {
        return self::url('js/' . ltrim($path, '/'));
    }
    
    /**
     * Mendapatkan URL untuk file CSS
     *
     * @param string $path
     * @return string
     */
    public static function css(string $path): string
    {
        return self::url('css/' . ltrim($path, '/'));
    }
    
    /**
     * Mendapatkan URL untuk build assets dari Vite
     *
     * @param string $path
     * @return string
     */
    public static function viteBuild(string $path): string
    {
        return self::url('build/' . ltrim($path, '/'));
    }
} 