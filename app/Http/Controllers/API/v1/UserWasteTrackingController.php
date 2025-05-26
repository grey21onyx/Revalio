<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserWasteTrackingResource;
use App\Http\Resources\WasteTypeResource;
use App\Models\UserWasteTracking;
use App\Models\WasteType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserWasteTrackingController extends Controller
{
    /**
     * Daftar catatan tracking sampah dengan filter dan pagination
     */
    public function index(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userId = Auth::id();
        $query = UserWasteTracking::with('wasteType.category')
            ->where('user_id', $userId);
        
        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal_pencatatan', [
                $request->start_date,
                $request->end_date . ' 23:59:59'
            ]);
        }
        
        // Filter by waste type
        if ($request->has('waste_id')) {
            $query->where('waste_id', $request->waste_id);
        }
        
        // Filter by status
        if ($request->has('status_pengelolaan')) {
            $query->where('status_pengelolaan', $request->status_pengelolaan);
        }
        
        // Sort
        $sortField = $request->sort_by ?? 'tanggal_pencatatan';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortField, $sortOrder);
        
        $perPage = $request->per_page ?? 10;
        $trackingRecords = $query->paginate($perPage);
        
        return UserWasteTrackingResource::collection($trackingRecords);
    }
    
    /**
     * Mendapatkan daftar jenis sampah untuk form tambah
     */
    public function getWasteTypes()
    {
        $wasteTypes = WasteType::with('category')
            ->where('status_aktif', true)
            ->orderBy('nama_sampah')
            ->get();
            
        return WasteTypeResource::collection($wasteTypes);
    }
    
    /**
     * Menyimpan catatan tracking sampah baru
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $this->validate($request, [
            'waste_id' => 'required|exists:waste_types,waste_id',
            'jumlah' => 'required|numeric|min:0',
            'satuan' => 'required|string',
            'tanggal_pencatatan' => 'required|date',
            'status_pengelolaan' => 'required|in:disimpan,dijual,didaur ulang',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|image|max:2048'
        ]);
        
        $userId = Auth::id();
        $data = $request->except('foto');
        $data['user_id'] = $userId;
        
        // Upload foto jika ada
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('waste_tracking', 'public');
            $data['foto'] = $path;
        }
        
        // Hitung nilai estimasi
        $wasteType = WasteType::find($request->waste_id);
        $wasteValue = $wasteType->values()->latest('tanggal_update')->first();
        
        if ($wasteValue) {
            $avgPrice = ($wasteValue->harga_minimum + $wasteValue->harga_maksimum) / 2;
            $data['nilai_estimasi'] = $avgPrice * $request->jumlah;
        } else {
            $data['nilai_estimasi'] = 0;
        }
        
        $tracking = UserWasteTracking::create($data);
        
        return response()->json([
            'message' => 'Catatan tracking sampah berhasil dibuat',
            'tracking' => new UserWasteTrackingResource($tracking)
        ], 201);
    }
    
    /**
     * Menampilkan detail catatan tracking
     */
    public function show($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userId = Auth::id();
        $tracking = UserWasteTracking::with('wasteType.category')
            ->where('user_id', $userId)
            ->where('tracking_id', $id)
            ->firstOrFail();
            
        return new UserWasteTrackingResource($tracking);
    }
    
    /**
     * Update catatan tracking
     */
    public function update(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userId = Auth::id();
        $tracking = UserWasteTracking::where('user_id', $userId)
            ->where('tracking_id', $id)
            ->firstOrFail();
            
        $this->validate($request, [
            'waste_id' => 'sometimes|exists:waste_types,waste_id',
            'jumlah' => 'sometimes|numeric|min:0',
            'satuan' => 'sometimes|string',
            'tanggal_pencatatan' => 'sometimes|date',
            'status_pengelolaan' => 'sometimes|in:disimpan,dijual,didaur ulang',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|image|max:2048'
        ]);
        
        $data = $request->except(['foto', 'user_id']);
        
        // Upload foto jika ada
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($tracking->foto && Storage::disk('public')->exists($tracking->foto)) {
                Storage::disk('public')->delete($tracking->foto);
            }
            
            $path = $request->file('foto')->store('waste_tracking', 'public');
            $data['foto'] = $path;
        }
        
        // Hitung nilai estimasi jika jumlah atau jenis sampah berubah
        if ($request->has('jumlah') || $request->has('waste_id')) {
            $wasteId = $request->waste_id ?? $tracking->waste_id;
            $jumlah = $request->jumlah ?? $tracking->jumlah;
            
            $wasteType = WasteType::find($wasteId);
            $wasteValue = $wasteType->values()->latest('tanggal_update')->first();
            
            if ($wasteValue) {
                $avgPrice = ($wasteValue->harga_minimum + $wasteValue->harga_maksimum) / 2;
                $data['nilai_estimasi'] = $avgPrice * $jumlah;
            }
        }
        
        $tracking->update($data);
        
        return response()->json([
            'message' => 'Catatan tracking sampah berhasil diperbarui',
            'tracking' => new UserWasteTrackingResource($tracking)
        ]);
    }
    
    /**
     * Hapus catatan tracking
     */
    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userId = Auth::id();
        $tracking = UserWasteTracking::where('user_id', $userId)
            ->where('tracking_id', $id)
            ->firstOrFail();
            
        // Hapus foto jika ada
        if ($tracking->foto && Storage::disk('public')->exists($tracking->foto)) {
            Storage::disk('public')->delete($tracking->foto);
        }
        
        $tracking->delete();
        
        return response()->json([
            'message' => 'Catatan tracking sampah berhasil dihapus'
        ]);
    }
    
    /**
     * Mendapatkan statistik dan visualisasi data tracking
     */
    public function stats(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userId = Auth::id();
        
        // Filter by date range
        $startDate = $request->start_date ?? Carbon::now()->subYear();
        $endDate = $request->end_date ?? Carbon::now();
        
        // Total stats
        $totalStats = [
            'total_waste' => UserWasteTracking::where('user_id', $userId)
                ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
                ->sum('jumlah'),
            'total_value' => UserWasteTracking::where('user_id', $userId)
                ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
                ->sum('nilai_estimasi'),
            'total_records' => UserWasteTracking::where('user_id', $userId)
                ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
                ->count(),
        ];
        
        // Breakdown by waste category
        $categoryData = DB::table('user_waste_tracking')
            ->join('waste_types', 'user_waste_tracking.waste_id', '=', 'waste_types.waste_id')
            ->join('waste_categories', 'waste_types.kategori_id', '=', 'waste_categories.kategori_id')
            ->where('user_waste_tracking.user_id', $userId)
            ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
            ->select('waste_categories.nama_kategori', DB::raw('SUM(jumlah) as total_jumlah'))
            ->groupBy('waste_categories.nama_kategori')
            ->get();
        
        // Status breakdown
        $statusData = DB::table('user_waste_tracking')
            ->where('user_id', $userId)
            ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
            ->select('status_pengelolaan', DB::raw('COUNT(*) as total'))
            ->groupBy('status_pengelolaan')
            ->get();
        
        // Time series data for chart
        $timeSeriesData = UserWasteTracking::where('user_id', $userId)
            ->whereBetween('tanggal_pencatatan', [$startDate, $endDate])
            ->orderBy('tanggal_pencatatan')
            ->get()
            ->groupBy(function($date) {
                return Carbon::parse($date->tanggal_pencatatan)->format('Y-m');
            })
            ->map(function($group) {
                return [
                    'jumlah' => $group->sum('jumlah'),
                    'nilai' => $group->sum('nilai_estimasi'),
                    'tanggal' => Carbon::parse($group->first()->tanggal_pencatatan)->format('Y-m')
                ];
            })
            ->values()
            ->all();
        
        // Environmental impact estimation
        $environmentalImpact = $this->calculateEnvironmentalImpact($userId, $startDate, $endDate);
        
        return response()->json([
            'total_stats' => $totalStats,
            'category_data' => $categoryData,
            'status_data' => $statusData,
            'time_series' => $timeSeriesData,
            'environmental_impact' => $environmentalImpact
        ]);
    }
    
    /**
     * Menghitung estimasi dampak lingkungan dari sampah yang dikelola
     */
    protected function calculateEnvironmentalImpact($userId, $startDate = null, $endDate = null)
    {
        // Implementasi sederhana untuk estimasi dampak lingkungan 
        // berdasarkan jenis sampah dan jumlah
        $query = UserWasteTracking::where('user_id', $userId);
        
        if ($startDate && $endDate) {
            $query->whereBetween('tanggal_pencatatan', [$startDate, $endDate]);
        }
        
        // Total sampah plastik (kg)
        $totalPlastic = $query->whereHas('wasteType.category', function($q) {
            $q->where('nama_kategori', 'like', '%plastik%');
        })
        ->where('satuan', 'kg')
        ->sum('jumlah');
        
        // Total sampah kertas (kg)
        $totalPaper = $query->whereHas('wasteType.category', function($q) {
            $q->where('nama_kategori', 'like', '%kertas%');
        })
        ->where('satuan', 'kg')
        ->sum('jumlah');
        
        // Total sampah logam (kg)
        $totalMetal = $query->whereHas('wasteType.category', function($q) {
            $q->where('nama_kategori', 'like', '%logam%');
        })
        ->where('satuan', 'kg')
        ->sum('jumlah');
        
        // Total sampah kaca (kg)
        $totalGlass = $query->whereHas('wasteType.category', function($q) {
            $q->where('nama_kategori', 'like', '%kaca%');
        })
        ->where('satuan', 'kg')
        ->sum('jumlah');
        
        // Total sampah organik (kg)
        $totalOrganic = $query->whereHas('wasteType.category', function($q) {
            $q->where('nama_kategori', 'like', '%organik%');
        })
        ->where('satuan', 'kg')
        ->sum('jumlah');
        
        // Estimasi dampak lingkungan (berdasarkan faktor-faktor umum)
        return [
            'co2_reduction' => ($totalPlastic * 2.5 + $totalPaper * 1.8 + $totalMetal * 5.0 + $totalGlass * 0.6), // kg CO2 saved
            'water_saved' => ($totalPaper * 60 + $totalPlastic * 22), // liters of water saved
            'trees_saved' => $totalPaper / 100, // trees saved (penggunaan rata-rata dari 1 ton kertas ~ 17 pohon)
            'energy_saved' => ($totalPlastic * 5.8 + $totalPaper * 4.3 + $totalMetal * 14 + $totalGlass * 2.5), // kWh energy saved
            'landfill_space_saved' => ($totalPlastic * 0.12 + $totalPaper * 0.08 + $totalMetal * 0.06 + $totalGlass * 0.05 + $totalOrganic * 0.15), // volume in cubic meters
        ];
    }
} 