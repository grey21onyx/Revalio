<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheControl
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        // Setting Cache-Control header
        $path = $request->path();
        
        // Jika request ke asset statis seperti CSS, JS, gambar, dll.
        if (
            $this->isAsset($path) && 
            !str_contains($path, 'livewire') && 
            !$request->is('admin/*')
        ) {
            // Set cache untuk 1 bulan untuk asset statis
            $response->header('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
        } elseif ($request->isMethod('GET') && !$request->is('admin/*')) {
            // Set cache untuk halaman publik selama 1 jam
            $response->header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300');
        } else {
            // Tidak cache untuk admin dan request non-GET
            $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            $response->header('Pragma', 'no-cache');
            $response->header('Expires', '0');
        }
        
        return $response;
    }
    
    /**
     * Menentukan apakah path adalah asset statis
     */
    private function isAsset(string $path): bool
    {
        $assetExtensions = [
            'js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp',
            'woff', 'woff2', 'ttf', 'eot', 'otf', 'mp4', 'webm', 'ogg', 'mp3',
            'pdf', 'zip', 'json'
        ];
        
        $pathInfo = pathinfo($path);
        
        return isset($pathInfo['extension']) && in_array($pathInfo['extension'], $assetExtensions);
    }
} 