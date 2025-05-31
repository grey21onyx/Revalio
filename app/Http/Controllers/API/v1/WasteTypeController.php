<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteTypeCollection;
use App\Http\Resources\WasteTypeResource;
use App\Http\Resources\WasteTypeDetailResource;
use App\Http\Resources\TutorialResource;
use App\Http\Resources\WasteBuyerResource;
use App\Models\WasteType;
use App\Models\Tutorial;
use App\Models\WasteBuyer;
use App\Models\WasteValue;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class WasteTypeController extends Controller
{
    /**
     * Cache prefix untuk jenis sampah
     */
    private const CACHE_PREFIX = 'waste_types';
    
    /**
     * Waktu cache dalam menit
     */
    private const CACHE_MINUTES = 60; // 1 jam
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Membuat cache key berdasarkan semua parameter request
        $cacheKey = CacheService::makeKey(self::CACHE_PREFIX . '_index', $request->all());
        
        // Menggunakan cache untuk query
        $wasteTypes = CacheService::remember($cacheKey, self::CACHE_MINUTES, function () use ($request) {
            $query = WasteType::query();
            
            // Eager loading
            $relations = [];
            if ($request->has('with_category') && $request->with_category) {
                $relations[] = 'category';
            }
            if ($request->has('with_values') && $request->with_values) {
                $relations[] = 'values';
            }
            if ($request->has('with_tutorials') && $request->with_tutorials) {
                $relations[] = 'tutorials';
            }
            
            if (!empty($relations)) {
                $query->with($relations);
            }
            
            // Search
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('nama_sampah', 'like', "%{$searchTerm}%")
                      ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                      ->orWhere('karakteristik', 'like', "%{$searchTerm}%");
                });
            }
            
            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }
            
            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            // Filter by difficulty level
            if ($request->has('tingkat_kesulitan')) {
                $query->where('tingkat_kesulitan', $request->tingkat_kesulitan);
            }
            
            // Pagination
            $perPage = $request->input('per_page', 15);
            return $query->paginate($perPage);
        });
        
        return response()->json(new WasteTypeCollection($wasteTypes));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_sampah' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'karakteristik' => 'nullable|string',
            'tingkat_kesulitan' => 'required|string|in:MUDAH,SEDANG,SULIT',
            'category_id' => 'required|exists:waste_categories,category_id',
            'dampak_lingkungan' => 'nullable|string',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except('gambar');
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'waste_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/waste_types', $filename);
            $data['gambar'] = 'waste_types/' . $filename;
        }

        $wasteType = WasteType::create($data);
        
        // Hapus cache ketika menambahkan data baru
        CacheService::forgetByPrefix(self::CACHE_PREFIX);

        return response()->json([
            'message' => 'Jenis sampah berhasil dibuat',
            'waste_type' => new WasteTypeResource($wasteType)
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        // Membuat cache key berdasarkan ID dan parameter request
        $cacheKey = CacheService::makeKey(self::CACHE_PREFIX . '_show_' . $id, $request->all());
        
        // Menggunakan cache untuk query
        $wasteType = CacheService::remember($cacheKey, self::CACHE_MINUTES, function () use ($request, $id) {
            $query = WasteType::where('waste_type_id', $id);
            
            // Eager loading
            $relations = [];
            if ($request->has('with_category') && $request->with_category) {
                $relations[] = 'category';
            }
            if ($request->has('with_values') && $request->with_values) {
                $relations[] = 'values';
            }
            if ($request->has('with_tutorials') && $request->with_tutorials) {
                $relations[] = 'tutorials';
            }
            
            if (!empty($relations)) {
                $query->with($relations);
            }
            
            return $query->firstOrFail();
        });
        
        return response()->json(new WasteTypeResource($wasteType));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $wasteType = WasteType::findOrFail($id);
        
        $request->validate([
            'nama_sampah' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'karakteristik' => 'nullable|string',
            'tingkat_kesulitan' => 'sometimes|string|in:MUDAH,SEDANG,SULIT',
            'category_id' => 'sometimes|exists:waste_categories,category_id',
            'dampak_lingkungan' => 'nullable|string',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except(['gambar', '_method']);
        
        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'waste_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/waste_types', $filename);
            $data['gambar'] = 'waste_types/' . $filename;
        }

        $wasteType->update($data);
        
        // Hapus cache ketika mengupdate data
        CacheService::forgetByPrefix(self::CACHE_PREFIX);

        return response()->json([
            'message' => 'Jenis sampah berhasil diperbarui',
            'waste_type' => new WasteTypeResource($wasteType)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $wasteType = WasteType::findOrFail($id);
        
        // Check if wasteType has RecyclableTrait
        if (method_exists($wasteType, 'recycle')) {
            $wasteType->recycle();
            $message = 'Jenis sampah berhasil dipindahkan ke recycle bin';
        } else {
            $wasteType->delete();
            $message = 'Jenis sampah berhasil dihapus';
        }
        
        // Hapus cache ketika menghapus data
        CacheService::forgetByPrefix(self::CACHE_PREFIX);

        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * Display a listing of waste types for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        // Membuat cache key berdasarkan parameter request
        $cacheKey = CacheService::makeKey(self::CACHE_PREFIX . '_public', $request->all());
        
        // Menggunakan cache untuk query
        $wasteTypes = CacheService::remember($cacheKey, self::CACHE_MINUTES, function () use ($request) {
            $query = WasteType::query();
            
            // Eager loading
            $relations = [];
            if ($request->has('with_category') && $request->with_category) {
                $relations[] = 'category';
            }
            if ($request->has('with_waste_values') && $request->with_waste_values) {
                $relations[] = 'wasteValues';
            }
            if ($request->has('with_tutorials') && $request->with_tutorials) {
                $relations[] = 'tutorials';
            }
            
            if (!empty($relations)) {
                $query->with($relations);
            }
            
            // Search
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('nama_sampah', 'like', "%{$searchTerm}%")
                      ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
                });
            }
            
            // Filter by category
            if ($request->has('category_id')) {
                $query->where('kategori_id', $request->category_id);
            }
            
            // Filter by difficulty level
            if ($request->has('tingkat_kesulitan')) {
                $query->where('tingkat_kesulitan', $request->tingkat_kesulitan);
            }
            
            // Pagination
            $perPage = $request->input('per_page', 15);
            return $query->paginate($perPage);
        });
        
        return response()->json(new WasteTypeCollection($wasteTypes));
    }
    
    /**
     * Mendapatkan daftar ID sampah favorit user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserFavorites()
    {
        if (!auth()->check()) {
            return response()->json(['favorites' => []], 200);
        }
        
        $favorites = auth()->user()
            ->favoriteWasteTypes()
            ->pluck('waste_id')
            ->toArray();
            
        return response()->json(['favorites' => $favorites], 200);
    }

    /**
     * Toggle status favorit untuk jenis sampah
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleFavorite($id)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $user = auth()->user();
        $wasteType = WasteType::findOrFail($id);
        
        if ($user->favoriteWasteTypes()->where('waste_id', $id)->exists()) {
            $user->favoriteWasteTypes()->detach($id);
            $message = 'Removed from favorites';
            $isFavorite = false;
        } else {
            $user->favoriteWasteTypes()->attach($id);
            $message = 'Added to favorites';
            $isFavorite = true;
        }
        
        return response()->json([
            'message' => $message,
            'is_favorite' => $isFavorite
        ], 200);
    }

    /**
     * Display detailed information about the specified waste type
     * including price history, related tutorials, and potential buyers.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showDetail($id)
    {
        try {
            $wasteType = WasteType::with([
                'category',
                'wasteValues',
                'tutorials',
                'buyers.wasteBuyer',
            ])->findOrFail($id);
            
            // Get price history grouped by month
            $priceHistory = WasteValue::where('waste_id', $id)
                ->orderBy('tanggal_update', 'asc')
                ->get()
                ->groupBy(function($date) {
                    return Carbon::parse($date->tanggal_update)->format('Y-m');
                })
                ->map(function($group) {
                    return [
                        'min' => $group->avg('harga_minimum'),
                        'max' => $group->avg('harga_maksimum'),
                    ];
                });
            
            // Check if the user has favorited this waste type
            $isFavorite = false;
            if (auth()->check()) {
                $isFavorite = auth()->user()->favoriteWasteTypes()->where('waste_id', $id)->exists();
            }
            
            return response()->json([
                'waste_type' => new WasteTypeDetailResource($wasteType),
                'price_history' => $priceHistory,
                'is_favorite' => $isFavorite,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in showDetail: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json([
                'error' => 'Terjadi kesalahan saat memproses data',
                'message' => env('APP_DEBUG') ? $e->getMessage() : 'Hubungi administrator untuk bantuan',
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null,
            ], 500);
        }
    }

    /**
     * Get related tutorials for a waste type
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRelatedTutorials($id)
    {
        try {
            $wasteType = WasteType::findOrFail($id);
            
            // Berdasarkan migrasi, field di tabel tutorials adalah waste_id
            $tutorials = Tutorial::where('waste_id', $id)
                ->orWhereHas('wasteType', function($query) use ($wasteType) {
                    // Jika tidak ada tutorial langsung, coba ambil dari kategori yang sama
                    if ($wasteType->kategori_id) {
                        $query->where('kategori_id', $wasteType->kategori_id);
                    }
                })
                ->take(5)
                ->get();
                
            return response()->json([
                'tutorials' => TutorialResource::collection($tutorials)
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getRelatedTutorials: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Kembalikan response kosong daripada error 500
            return response()->json([
                'tutorials' => [],
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Tidak dapat memuat data tutorial terkait'
            ], 200); // Return 200 with empty data instead of 500
        }
    }

    /**
     * Get potential buyers for a waste type
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPotentialBuyers($id)
    {
        try {
            // Temukan WasteType dulu
            $wasteType = WasteType::findOrFail($id);
            
            // Coba dapatkan buyers, jika relasi tidak ada, gunakan pendekatan alternatif
            try {
                $buyers = WasteBuyer::whereHas('wasteTypes', function($query) use ($id) {
                    $query->where('waste_id', $id);
                })->with(['wasteTypes' => function($query) use ($id) {
                    $query->where('waste_id', $id);
                }])->get();
            } catch (\Exception $e) {
                // Fallback jika relasi tidak berfungsi dengan benar
                \Log::warning('Error finding buyers with wasteTypes relation: ' . $e->getMessage());
                
                // Coba alternatif - ambil semua pembeli
                $buyers = WasteBuyer::take(5)->get();
            }
            
            return response()->json([
                'buyers' => WasteBuyerResource::collection($buyers)
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getPotentialBuyers: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Kembalikan response kosong daripada error 500
            return response()->json([
                'buyers' => [],
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Tidak dapat memuat data pembeli potensial'
            ], 200); // Return 200 with empty data instead of 500
        }
    }
} 