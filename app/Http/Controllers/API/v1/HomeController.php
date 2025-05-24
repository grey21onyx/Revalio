<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ForumThreadResource;
use App\Http\Resources\TutorialResource;
use App\Http\Resources\WasteTypeResource;
use App\Models\Article;
use App\Models\ForumThread;
use App\Models\Tutorial;
use App\Models\UserWasteTracking;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Mendapatkan data agregat untuk halaman beranda
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Sampah bernilai terbaru (5 item)
        $wasteTypes = WasteType::with(['category', 'values'])
            ->where('status_aktif', true)
            ->latest()
            ->take(5)
            ->get();
            
        // Tutorial populer (5 item)
        $tutorials = Tutorial::withCount('wasteType')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Artikel terbaru (5 item)
        $articles = Article::where('status', 'PUBLISHED')
            ->latest('tanggal_publikasi')
            ->take(5)
            ->get();
            
        // Thread forum terbaru (5 item)
        $threads = ForumThread::with(['user', 'comments'])
            ->where('status', 'AKTIF')
            ->latest('tanggal_posting')
            ->take(5)
            ->get();
            
        // Statistik pengguna (jika login)
        $userStats = null;
        if (Auth::check()) {
            $userId = Auth::id();
            $userStats = [
                'total_waste' => UserWasteTracking::where('user_id', $userId)
                    ->sum('jumlah'),
                'estimated_value' => UserWasteTracking::where('user_id', $userId)
                    ->sum('nilai_estimasi'),
                'impact' => $this->calculateEnvironmentalImpact($userId)
            ];
        }
        
        return response()->json([
            'waste_types' => WasteTypeResource::collection($wasteTypes),
            'tutorials' => TutorialResource::collection($tutorials),
            'articles' => ArticleResource::collection($articles),
            'threads' => ForumThreadResource::collection($threads),
            'user_stats' => $userStats
        ]);
    }

    /**
     * Menghitung estimasi dampak lingkungan dari aktivitas pengguna
     * 
     * @param int $userId ID pengguna
     * @return array Data dampak lingkungan
     */
    protected function calculateEnvironmentalImpact($userId)
    {
        // Dapatkan tracking sampah user berdasarkan kategori
        $trackings = UserWasteTracking::where('user_id', $userId)
            ->whereHas('wasteType', function($query) {
                $query->whereHas('category');
            })
            ->with('wasteType.category')
            ->get();
        
        // Hitung berdasarkan kategori
        $totalPlastic = $trackings->filter(function($tracking) {
                return strtolower($tracking->wasteType->category->nama_kategori) === 'plastik';
            })->sum('jumlah');
            
        $totalPaper = $trackings->filter(function($tracking) {
                return strtolower($tracking->wasteType->category->nama_kategori) === 'kertas';
            })->sum('jumlah');
            
        $totalGlass = $trackings->filter(function($tracking) {
                return strtolower($tracking->wasteType->category->nama_kategori) === 'kaca';
            })->sum('jumlah');
            
        $totalMetal = $trackings->filter(function($tracking) {
                return strtolower($tracking->wasteType->category->nama_kategori) === 'logam';
            })->sum('jumlah');
        
        // Basis perhitungan dampak (nilai estimasi)
        return [
            'co2_reduction' => $totalPlastic * 2.5 + $totalPaper * 1.8 + $totalGlass * 0.3 + $totalMetal * 4.0, // kg CO2 yang dihemat
            'water_saved' => $totalPaper * 60 + $totalPlastic * 22, // liter air yang dihemat
            'trees_saved' => $totalPaper / 100, // jumlah pohon yang diselamatkan
            'energy_saved' => $totalPlastic * 5.8 + $totalPaper * 4.3 + $totalMetal * 14 + $totalGlass * 0.3, // kWh energi yang dihemat
        ];
    }
} 