<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteBuyerResource;
use App\Models\WasteBuyer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WasteBuyerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = WasteBuyer::query();
        
        // Eager loading
        if ($request->has('with_type') && $request->with_type) {
            $query->with('buyerType');
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama', 'like', "%{$searchTerm}%")
                  ->orWhere('alamat', 'like', "%{$searchTerm}%")
                  ->orWhere('kota', 'like', "%{$searchTerm}%")
                  ->orWhere('provinsi', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by type
        if ($request->has('buyer_type_id')) {
            $query->where('buyer_type_id', $request->buyer_type_id);
        }
        
        // Filter by location
        if ($request->has('kota')) {
            $query->where('kota', $request->kota);
        }
        
        if ($request->has('provinsi')) {
            $query->where('provinsi', $request->provinsi);
        }
        
        // Filter by waste type
        if ($request->has('waste_type')) {
            $wasteType = $request->waste_type;
            $query->where(function($q) use ($wasteType) {
                $q->where('jenis_sampah_diterima', 'like', "%{$wasteType}%")
                  ->orWhere('jenis_sampah_diterima', 'like', "%,{$wasteType},%")
                  ->orWhere('jenis_sampah_diterima', 'like', "{$wasteType},%")
                  ->orWhere('jenis_sampah_diterima', 'like', "%,{$wasteType}");
            });
        }
        
        // Sort by distance if lat/lng provided
        if ($request->has('lat') && $request->has('lng')) {
            // Implement distance-based sorting here if database supports it
            // For MySQL, would use ST_Distance_Sphere or similar function
        } else {
            // Default sort by name
            $sortBy = $request->input('sort_by', 'nama');
            $direction = $request->input('direction', 'asc');
            if ($sortBy === 'rating') {
                $query->orderBy('rating', 'desc');
            } else {
                $query->orderBy($sortBy, $direction);
            }
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Only admin should be able to add buyers
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menambahkan pembeli sampah'
            ], 403);
        }
        
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'kota' => 'required|string|max:100',
            'provinsi' => 'required|string|max:100',
            'kontak' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'jam_operasional' => 'nullable|string',
            'jenis_sampah_diterima' => 'required|string',
            'persyaratan_pembelian' => 'nullable|string',
            'kisaran_harga' => 'nullable|string',
            'metode_pembayaran' => 'nullable|string',
            'buyer_type_id' => 'required|exists:waste_buyer_types,type_id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'rating' => 'nullable|numeric|min:0|max:5',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF,PENDING',
        ]);

        $data = $request->except('foto');
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }
        
        if (!isset($data['rating'])) {
            $data['rating'] = 0;
        }

        // Handle file upload
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = 'buyer_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/buyers', $filename);
            $data['foto'] = 'buyers/' . $filename;
        }

        $buyer = WasteBuyer::create($data);

        return response()->json([
            'message' => 'Pembeli sampah berhasil dibuat',
            'waste_buyer' => new WasteBuyerResource($buyer)
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
        $query = WasteBuyer::where('buyer_id', $id);
        
        // Eager loading
        if ($request->has('with_type') && $request->with_type) {
            $query->with('buyerType');
        }
        
        $buyer = $query->firstOrFail();
        
        return response()->json(new WasteBuyerResource($buyer));
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
        // Only admin should be able to update buyers
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk memperbarui pembeli sampah'
            ], 403);
        }
        
        $buyer = WasteBuyer::findOrFail($id);
        
        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'alamat' => 'sometimes|string',
            'kota' => 'sometimes|string|max:100',
            'provinsi' => 'sometimes|string|max:100',
            'kontak' => 'sometimes|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'jam_operasional' => 'nullable|string',
            'jenis_sampah_diterima' => 'sometimes|string',
            'persyaratan_pembelian' => 'nullable|string',
            'kisaran_harga' => 'nullable|string',
            'metode_pembayaran' => 'nullable|string',
            'buyer_type_id' => 'sometimes|exists:waste_buyer_types,type_id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'rating' => 'nullable|numeric|min:0|max:5',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF,PENDING',
        ]);

        $data = $request->except(['foto', '_method']);

        // Handle file upload
        if ($request->hasFile('foto')) {
            // Delete old image if exists
            if ($buyer->foto) {
                Storage::delete('public/' . $buyer->foto);
            }
            
            $file = $request->file('foto');
            $filename = 'buyer_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/buyers', $filename);
            $data['foto'] = 'buyers/' . $filename;
        }

        $buyer->update($data);

        return response()->json([
            'message' => 'Pembeli sampah berhasil diperbarui',
            'waste_buyer' => new WasteBuyerResource($buyer)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        // Only admin should be able to delete buyers
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menghapus pembeli sampah'
            ], 403);
        }
        
        $buyer = WasteBuyer::findOrFail($id);
        
        // Check if buyer has RecyclableTrait
        if (method_exists($buyer, 'recycle')) {
            $buyer->recycle();
            $message = 'Pembeli sampah berhasil dipindahkan ke recycle bin';
        } else {
            // Delete image if exists
            if ($buyer->foto) {
                Storage::delete('public/' . $buyer->foto);
            }
            
            $buyer->delete();
            $message = 'Pembeli sampah berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }
    
    /**
     * Get cities with waste buyers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCities()
    {
        $cities = WasteBuyer::where('status', 'AKTIF')
            ->select('kota')
            ->distinct()
            ->orderBy('kota')
            ->get()
            ->pluck('kota');
            
        return response()->json([
            'data' => $cities
        ]);
    }
    
    /**
     * Get provinces with waste buyers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProvinces()
    {
        $provinces = WasteBuyer::where('status', 'AKTIF')
            ->select('provinsi')
            ->distinct()
            ->orderBy('provinsi')
            ->get()
            ->pluck('provinsi');
            
        return response()->json([
            'data' => $provinces
        ]);
    }
    
    /**
     * Rate a waste buyer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function rate(Request $request, $id)
    {
        $buyer = WasteBuyer::findOrFail($id);
        
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
        ]);

        // In a real app, we would store individual ratings and calculate average
        // For now, we'll just update the rating directly (simplified)
        $buyer->rating = ($buyer->rating + $request->rating) / 2;
        $buyer->save();

        return response()->json([
            'message' => 'Rating berhasil diberikan',
            'new_rating' => $buyer->rating
        ]);
    }
    
    /**
     * Display a listing of waste buyers for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = WasteBuyer::where('status', 'AKTIF');
        
        // Eager loading
        if ($request->has('with_type') && $request->with_type) {
            $query->with('buyerType');
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama', 'like', "%{$searchTerm}%")
                  ->orWhere('alamat', 'like', "%{$searchTerm}%")
                  ->orWhere('kota', 'like', "%{$searchTerm}%")
                  ->orWhere('provinsi', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by type
        if ($request->has('buyer_type_id')) {
            $query->where('buyer_type_id', $request->buyer_type_id);
        }
        
        // Filter by location
        if ($request->has('kota')) {
            $query->where('kota', $request->kota);
        }
        
        if ($request->has('provinsi')) {
            $query->where('provinsi', $request->provinsi);
        }
        
        // Filter by waste type
        if ($request->has('waste_type')) {
            $wasteType = $request->waste_type;
            $query->where(function($q) use ($wasteType) {
                $q->where('jenis_sampah_diterima', 'like', "%{$wasteType}%")
                  ->orWhere('jenis_sampah_diterima', 'like', "%,{$wasteType},%")
                  ->orWhere('jenis_sampah_diterima', 'like', "{$wasteType},%")
                  ->orWhere('jenis_sampah_diterima', 'like', "%,{$wasteType}");
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'nama');
        $direction = $request->input('direction', 'asc');
        
        if ($sortBy === 'rating') {
            $query->orderBy('rating', 'desc');
        } else {
            $query->orderBy($sortBy, $direction);
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
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