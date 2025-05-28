<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteBuyerResource;
use App\Models\WasteBuyer;
use App\Models\WasteBuyerType;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WasteBuyerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = WasteBuyer::with(['wasteTypes.wasteType']);
        
        // Filter by waste type
        if ($request->has('waste_id')) {
            $query->whereHas('wasteTypes', function($q) use ($request) {
                $q->where('waste_id', $request->waste_id);
            });
        }
        
        // Filter by location (city or province)
        if ($request->has('location')) {
            $location = $request->location;
            $query->where(function($q) use ($location) {
                $q->where('kota', 'like', "%{$location}%")
                  ->orWhere('provinsi', 'like', "%{$location}%")
                  ->orWhere('alamat', 'like', "%{$location}%");
            });
        }
        
        // Filter by buyer type
        if ($request->has('jenis_pembeli')) {
            $query->where('jenis_pembeli', $request->jenis_pembeli);
        }
        
        // Filter by rating minimum
        if ($request->has('rating_min') && is_numeric($request->rating_min)) {
            $query->where('rating', '>=', $request->rating_min);
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // Default to active buyers only
            $query->where('status', 'AKTIF');
        }
        
        // Sorting
        $sortField = $request->input('sort_by', 'nama_pembeli');
        $sortOrder = $request->input('sort_order', 'asc');
        
        if ($sortField === 'rating') {
            $query->orderBy('rating', $sortOrder);
        } else {
            $query->orderBy($sortField, $sortOrder);
        }
        
        // Pagination
        $perPage = $request->input('per_page', 10);
        $buyers = $query->paginate($perPage);
        
        return WasteBuyerResource::collection($buyers)
            ->additional([
                'meta' => [
                    'total' => $buyers->total(),
                    'per_page' => $buyers->perPage(),
                    'current_page' => $buyers->currentPage(),
                    'last_page' => $buyers->lastPage(),
                ]
            ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Verify user is authenticated and has admin role
        if (!Auth::check() || !Auth::user()->isadmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'nama_pembeli' => 'required|string|max:100',
            'jenis_pembeli' => 'required|string|max:50',
            'alamat' => 'required|string|max:255',
            'kota' => 'required|string|max:100',
            'provinsi' => 'required|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'kontak' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
            'jam_operasional' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'waste_types' => 'required|array',
            'waste_types.*.waste_id' => 'required|exists:waste_types,waste_id',
            'waste_types.*.harga_beli' => 'required|numeric|min:0',
        ]);
        
        DB::beginTransaction();
        
        try {
            // Handle image upload
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                $foto = $request->file('foto');
                $fileName = 'buyer_' . time() . '.' . $foto->getClientOriginalExtension();
                $fotoPath = $foto->storeAs('waste_buyers', $fileName, 'public');
            }
            
            // Create waste buyer record
            $wasteBuyer = WasteBuyer::create([
                'nama_pembeli' => $request->nama_pembeli,
                'jenis_pembeli' => $request->jenis_pembeli,
                'alamat' => $request->alamat,
                'kota' => $request->kota,
                'provinsi' => $request->provinsi,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'kontak' => $request->kontak,
                'deskripsi' => $request->deskripsi,
                'jam_operasional' => $request->jam_operasional,
                'website' => $request->website,
                'foto' => $fotoPath,
                'rating' => 0,
                'jumlah_rating' => 0,
                'status' => 'AKTIF',
            ]);
            
            // Add waste types with prices
            foreach ($request->waste_types as $wasteType) {
                WasteBuyerType::create([
                    'buyer_id' => $wasteBuyer->buyer_id,
                    'waste_id' => $wasteType['waste_id'],
                    'harga_beli' => $wasteType['harga_beli'],
                ]);
            }
            
            DB::commit();
            
            // Reload with waste types
            $wasteBuyer->load('wasteTypes.wasteType');
            
            return response()->json([
                'message' => 'Pembeli sampah berhasil dibuat',
                'waste_buyer' => new WasteBuyerResource($wasteBuyer)
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal membuat pembeli sampah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $wasteBuyer = WasteBuyer::with(['wasteTypes.wasteType'])
            ->findOrFail($id);
        
        return response()->json([
            'waste_buyer' => new WasteBuyerResource($wasteBuyer)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Verify user is authenticated and has admin role
        if (!Auth::check() || !Auth::user()->isadmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $wasteBuyer = WasteBuyer::findOrFail($id);
        
        $request->validate([
            'nama_pembeli' => 'sometimes|required|string|max:100',
            'jenis_pembeli' => 'sometimes|required|string|max:50',
            'alamat' => 'sometimes|required|string|max:255',
            'kota' => 'sometimes|required|string|max:100',
            'provinsi' => 'sometimes|required|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'kontak' => 'sometimes|required|string|max:50',
            'deskripsi' => 'nullable|string',
            'jam_operasional' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'waste_types' => 'sometimes|required|array',
            'waste_types.*.waste_id' => 'required|exists:waste_types,waste_id',
            'waste_types.*.harga_beli' => 'required|numeric|min:0',
            'status' => 'sometimes|string|in:AKTIF,TIDAK_AKTIF',
        ]);
        
        DB::beginTransaction();
        
        try {
            // Handle image upload if needed
            if ($request->hasFile('foto')) {
                $foto = $request->file('foto');
                $fileName = 'buyer_' . time() . '.' . $foto->getClientOriginalExtension();
                $fotoPath = $foto->storeAs('waste_buyers', $fileName, 'public');
                $wasteBuyer->foto = $fotoPath;
            }
            
            // Update waste buyer record
            $wasteBuyer->fill($request->except(['foto', 'waste_types']));
            $wasteBuyer->save();
            
            // Update waste types if provided
            if ($request->has('waste_types')) {
                // Remove existing waste types
                WasteBuyerType::where('buyer_id', $id)->delete();
                
                // Add new waste types
                foreach ($request->waste_types as $wasteType) {
                    WasteBuyerType::create([
                        'buyer_id' => $wasteBuyer->buyer_id,
                        'waste_id' => $wasteType['waste_id'],
                        'harga_beli' => $wasteType['harga_beli'],
                    ]);
                }
            }
            
            DB::commit();
            
            // Reload with waste types
            $wasteBuyer->load('wasteTypes.wasteType');
            
            return response()->json([
                'message' => 'Pembeli sampah berhasil diperbarui',
                'waste_buyer' => new WasteBuyerResource($wasteBuyer)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal memperbarui pembeli sampah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        // Verify user is authenticated and has admin role
        if (!Auth::check() || !Auth::user()->isadmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $wasteBuyer = WasteBuyer::findOrFail($id);
        
        // Set status to inactive instead of delete
        $wasteBuyer->update(['status' => 'TIDAK_AKTIF']);
        
        return response()->json([
            'message' => 'Pembeli sampah berhasil dinonaktifkan'
        ]);
    }

    /**
     * Get all distinct cities from waste buyers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCities()
    {
        $cities = WasteBuyer::where('status', 'AKTIF')
            ->select('kota')
            ->distinct()
            ->orderBy('kota', 'asc')
            ->get()
            ->pluck('kota');
        
        return response()->json([
            'cities' => $cities
        ]);
    }

    /**
     * Get all distinct provinces from waste buyers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProvinces()
    {
        $provinces = WasteBuyer::where('status', 'AKTIF')
            ->select('provinsi')
            ->distinct()
            ->orderBy('provinsi', 'asc')
            ->get()
            ->pluck('provinsi');
        
        return response()->json([
            'provinces' => $provinces
        ]);
    }

    /**
     * Rate a waste buyer.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function rate(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);
        
        $wasteBuyer = WasteBuyer::findOrFail($id);
        
        // Update rating
        $currentTotal = $wasteBuyer->rating * $wasteBuyer->jumlah_rating;
        $newTotal = $currentTotal + $request->rating;
        $wasteBuyer->jumlah_rating += 1;
        $wasteBuyer->rating = $newTotal / $wasteBuyer->jumlah_rating;
        $wasteBuyer->save();
        
        return response()->json([
            'message' => 'Rating berhasil ditambahkan',
            'new_rating' => $wasteBuyer->rating,
            'rating_count' => $wasteBuyer->jumlah_rating
        ]);
    }

    /**
     * Display a listing of public waste buyers.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function public(Request $request)
    {
        $query = WasteBuyer::with(['wasteTypes.wasteType'])
            ->where('status', 'AKTIF');
        
        // Filter by waste type
        if ($request->has('waste_id')) {
            $query->whereHas('wasteTypes', function($q) use ($request) {
                $q->where('waste_id', $request->waste_id);
            });
        }
        
        // Filter by location (city or province)
        if ($request->has('location')) {
            $location = $request->location;
            $query->where(function($q) use ($location) {
                $q->where('kota', 'like', "%{$location}%")
                  ->orWhere('provinsi', 'like', "%{$location}%")
                  ->orWhere('alamat', 'like', "%{$location}%");
            });
        }
        
        // Filter by buyer type
        if ($request->has('jenis_pembeli')) {
            $query->where('jenis_pembeli', $request->jenis_pembeli);
        }
        
        // Sorting
        $sortField = $request->input('sort_by', 'nama_pembeli');
        $sortOrder = $request->input('sort_order', 'asc');
        
        if ($sortField === 'rating') {
            $query->orderBy('rating', $sortOrder);
        } else {
            $query->orderBy($sortField, $sortOrder);
        }
        
        // Pagination
        $perPage = $request->input('per_page', 10);
        $buyers = $query->paginate($perPage);
        
        return WasteBuyerResource::collection($buyers)
            ->additional([
                'meta' => [
                    'total' => $buyers->total(),
                    'per_page' => $buyers->perPage(),
                    'current_page' => $buyers->currentPage(),
                    'last_page' => $buyers->lastPage(),
                ]
            ]);
    }
} 