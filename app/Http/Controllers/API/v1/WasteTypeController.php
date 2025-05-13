<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteTypeCollection;
use App\Http\Resources\WasteTypeResource;
use App\Models\WasteType;
use App\Services\CacheService;
use Illuminate\Http\Request;

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
            $query = WasteType::where('status', 'AKTIF');
            
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
                      ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
                });
            }
            
            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
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
} 