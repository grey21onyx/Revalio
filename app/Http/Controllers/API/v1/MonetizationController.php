<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\WasteBuyerResource;
use App\Models\Article;
use App\Models\WasteBuyer;
use Illuminate\Http\Request;

class MonetizationController extends Controller
{
    /**
     * Get monetization tips from articles.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMonetizationTips(Request $request)
    {
        // Get articles related to monetization
        $query = Article::where('kategori', 'Tips Monetisasi')
            ->where('status', 'PUBLIKASI');
            
        // Apply any search filter if provided
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('ringkasan', 'like', "%{$searchTerm}%");
            });
        }
        
        // Sort by publication date
        $query->latest('tanggal_publikasi');
        
        // Limit results if specified, otherwise paginate
        if ($request->has('limit')) {
            $tips = $query->take($request->limit)->get();
            return ArticleResource::collection($tips);
        } else {
            $perPage = $request->input('per_page', 10);
            $tips = $query->paginate($perPage);
            
            return ArticleResource::collection($tips)
                ->additional([
                    'meta' => [
                        'total' => $tips->total(),
                        'per_page' => $tips->perPage(),
                        'current_page' => $tips->currentPage(),
                        'last_page' => $tips->lastPage(),
                    ],
                ]);
        }
    }

    /**
     * Get recommended waste buyers based on user preferences or waste types.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRecommendedBuyers(Request $request)
    {
        // Base query for active waste buyers
        $query = WasteBuyer::where('status', 'AKTIF');
        
        // If waste type ID is provided, filter by that
        if ($request->has('waste_id')) {
            $query->whereHas('wasteTypes', function($q) use ($request) {
                $q->where('waste_id', $request->waste_id);
            });
        }
        
        // If user is authenticated, try to recommend based on their location
        if ($request->user() && $request->user()->alamat) {
            // This is a simplified approach - in a real app, 
            // you would use more sophisticated location matching
            $userLocation = $request->user()->kota ?? '';
            if (!empty($userLocation)) {
                $query->where('kota', $userLocation);
            }
        }
        
        // Get buyers with highest ratings first
        $query->orderBy('rating', 'desc');
        
        // Include waste types data
        $query->with('wasteTypes.wasteType');
        
        // Limit results or paginate
        if ($request->has('limit')) {
            $buyers = $query->take($request->limit)->get();
            return WasteBuyerResource::collection($buyers);
        } else {
            $perPage = $request->input('per_page', 10);
            $buyers = $query->paginate($perPage);
            
            return WasteBuyerResource::collection($buyers)
                ->additional([
                    'meta' => [
                        'total' => $buyers->total(),
                        'per_page' => $buyers->perPage(),
                        'current_page' => $buyers->currentPage(),
                        'last_page' => $buyers->lastPage(),
                    ],
                ]);
        }
    }

    /**
     * Get monetization summary data for home page or dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMonetizationSummary()
    {
        // Get featured tips
        $tips = Article::where('kategori', 'Tips Monetisasi')
            ->where('status', 'PUBLIKASI')
            ->latest('tanggal_publikasi')
            ->take(3)
            ->get();
        
        // Get top-rated buyers
        $topBuyers = WasteBuyer::where('status', 'AKTIF')
            ->orderBy('rating', 'desc')
            ->take(3)
            ->get();
        
        // Count of all active buyers
        $totalBuyers = WasteBuyer::where('status', 'AKTIF')->count();
        
        return response()->json([
            'featured_tips' => ArticleResource::collection($tips),
            'top_buyers' => WasteBuyerResource::collection($topBuyers),
            'total_buyers' => $totalBuyers,
            'last_updated' => now()->format('Y-m-d H:i:s')
        ]);
    }
}
