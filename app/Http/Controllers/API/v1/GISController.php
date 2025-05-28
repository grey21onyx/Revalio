<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteBuyerResource;
use App\Models\WasteBuyer;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GISController extends Controller
{
    /**
     * Mendapatkan semua lokasi pengepul sampah yang aktif
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllLocations(Request $request)
    {
        $query = WasteBuyer::with(['wasteTypes.wasteType'])
            ->active()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude');

        // Filter berdasarkan jenis sampah
        if ($request->has('waste_id')) {
            $query->acceptsWaste($request->waste_id);
        }

        // Filter berdasarkan jenis pembeli
        if ($request->has('jenis_pembeli')) {
            $query->ofType($request->jenis_pembeli);
        }

        // Filter berdasarkan kota
        if ($request->has('kota')) {
            $query->where('kota', $request->kota);
        }

        // Filter berdasarkan provinsi
        if ($request->has('provinsi')) {
            $query->where('provinsi', $request->provinsi);
        }

        $buyers = $query->get();

        return response()->json([
            'success' => true,
            'data' => WasteBuyerResource::collection($buyers),
        ]);
    }

    /**
     * Mendapatkan lokasi terdekat dari posisi pengguna
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNearbyLocations(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:0',
        ]);

        $lat = $request->latitude;
        $lon = $request->longitude;
        $radius = $request->radius ?? 10; // Default radius 10 km

        // Haversine formula untuk mencari jarak
        $buyers = WasteBuyer::active()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select([
                'waste_buyers.*',
                DB::raw("(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lon)) + sin(radians($lat)) * sin(radians(latitude)))) AS distance")
            ])
            ->having('distance', '<=', $radius)
            ->orderBy('distance', 'asc')
            ->with(['wasteTypes.wasteType'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => WasteBuyerResource::collection($buyers),
        ]);
    }

    /**
     * Memperbarui koordinat lokasi untuk pengepul sampah
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateLocation(Request $request, $id)
    {
        // Log request details untuk debugging
        \Log::debug('Update location request', [
            'user_id' => Auth::id(),
            'user_role' => Auth::user()->role ?? 'no role attribute', 
            'has_admin_role' => Auth::user()->hasRole('admin'),
            'buyer_id' => $id,
            'request_data' => $request->all(),
        ]);
        
        // Pengecekan autentikasi
        if (!Auth::check()) {
            \Log::warning('Unauthorized attempt to update location', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            return response()->json(['message' => 'Unauthorized: Login required'], 401);
        }
        
        // Cek apakah user memiliki role admin (baik menggunakan hasRole atau kolom role)
        $user = Auth::user();
        $hasAdminRole = $user->hasRole('admin');
        $isAdminByAttribute = $user->role === 'admin';
        
        if (!$hasAdminRole && !$isAdminByAttribute) {
            \Log::warning('Forbidden access attempt to update location', [
                'user_id' => $user->user_id,
                'has_role_admin' => $hasAdminRole,
                'role_attribute' => $user->role,
            ]);
            return response()->json([
                'message' => 'Forbidden: Admin privileges required to update location',
                'debug_info' => [
                    'has_admin_role' => $hasAdminRole,
                    'role_attribute' => $user->role,
                ]
            ], 403);
        }

        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $buyer = WasteBuyer::findOrFail($id);
        $buyer->latitude = $request->latitude;
        $buyer->longitude = $request->longitude;
        $buyer->save();

        \Log::info('Location updated successfully', [
            'user_id' => $user->user_id,
            'buyer_id' => $id,
            'new_coordinates' => [
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil diperbarui',
            'data' => new WasteBuyerResource($buyer),
        ]);
    }

    /**
     * Mendapatkan jenis sampah untuk filter peta
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWasteTypes()
    {
        $wasteTypes = WasteType::select('waste_id', 'nama_sampah')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('waste_buyer_types')
                    ->whereColumn('waste_buyer_types.waste_id', 'waste_types.waste_id');
            })
            ->orderBy('nama_sampah')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wasteTypes,
        ]);
    }
} 