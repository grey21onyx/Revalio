<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserWasteTrackingResource;
use App\Models\UserWasteTracking;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserWasteTrackingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = UserWasteTracking::query();
        
        // Filter by logged in user if not admin
        if (!$request->user()->is_admin) {
            $query->where('user_id', $request->user()->user_id);
        } elseif ($request->has('user_id')) {
            // Admin can filter by specific user
            $query->where('user_id', $request->user_id);
        }
        
        // Eager loading
        $relations = [];
        if ($request->has('with_user') && $request->with_user) {
            $relations[] = 'user';
        }
        if ($request->has('with_waste_type') && $request->with_waste_type) {
            $relations[] = 'wasteType';
        }
        
        if (!empty($relations)) {
            $query->with($relations);
        }
        
        // Filter by waste type
        if ($request->has('waste_type_id')) {
            $query->where('waste_type_id', $request->waste_type_id);
        }
        
        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('tanggal_dicatat', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->where('tanggal_dicatat', '<=', $request->date_to);
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_dicatat');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $trackings = $query->paginate($perPage);
        
        return UserWasteTrackingResource::collection($trackings)
            ->additional([
                'meta' => [
                    'total' => $trackings->total(),
                    'per_page' => $trackings->perPage(),
                    'current_page' => $trackings->currentPage(),
                    'last_page' => $trackings->lastPage(),
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
        $request->validate([
            'waste_type_id' => 'required|exists:waste_types,waste_type_id',
            'jumlah' => 'required|numeric|min:0',
            'satuan' => 'required|string|max:20',
            'tanggal_dicatat' => 'nullable|date',
            'estimasi_nilai' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except('foto');
        
        // Set user ID
        $data['user_id'] = $request->user()->user_id;
        
        // Set default date if not provided
        if (!isset($data['tanggal_dicatat'])) {
            $data['tanggal_dicatat'] = now();
        }
        
        // Calculate estimated value if not provided
        if (!isset($data['estimasi_nilai']) && $data['jumlah'] > 0) {
            // Get the waste type and its current value
            $wasteType = WasteType::with('values')->find($data['waste_type_id']);
            if ($wasteType && $wasteType->values->isNotEmpty()) {
                $latestValue = $wasteType->values->sortByDesc('tanggal_update')->first();
                $avgValue = ($latestValue->nilai_minimal + $latestValue->nilai_maksimal) / 2;
                $data['estimasi_nilai'] = $data['jumlah'] * $avgValue;
            }
        }

        // Handle file upload
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = 'tracking_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/tracking', $filename);
            $data['foto'] = 'tracking/' . $filename;
        }

        $tracking = UserWasteTracking::create($data);
        
        // Load relationships
        $tracking->load(['user', 'wasteType']);

        return response()->json([
            'message' => 'Catatan sampah berhasil disimpan',
            'tracking' => new UserWasteTrackingResource($tracking)
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
        $query = UserWasteTracking::where('tracking_id', $id);
        
        // Restrict to own records for non-admin users
        if (!$request->user()->is_admin) {
            $query->where('user_id', $request->user()->user_id);
        }
        
        // Eager loading
        $relations = ['user', 'wasteType'];
        $query->with($relations);
        
        $tracking = $query->firstOrFail();
        
        return response()->json(new UserWasteTrackingResource($tracking));
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
        $tracking = UserWasteTracking::findOrFail($id);
        
        // Restrict to own records for non-admin users
        if (!$request->user()->is_admin && $request->user()->user_id !== $tracking->user_id) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk mengedit catatan ini'
            ], 403);
        }
        
        $request->validate([
            'waste_type_id' => 'sometimes|exists:waste_types,waste_type_id',
            'jumlah' => 'sometimes|numeric|min:0',
            'satuan' => 'sometimes|string|max:20',
            'tanggal_dicatat' => 'nullable|date',
            'estimasi_nilai' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except(['foto', '_method']);

        // Handle file upload
        if ($request->hasFile('foto')) {
            // Delete old image if exists
            if ($tracking->foto) {
                Storage::delete('public/' . $tracking->foto);
            }
            
            $file = $request->file('foto');
            $filename = 'tracking_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/tracking', $filename);
            $data['foto'] = 'tracking/' . $filename;
        }

        // Recalculate estimated value if quantity changed
        if (isset($data['jumlah']) && (!isset($data['estimasi_nilai']) || $request->has('recalculate_value'))) {
            // Get the waste type and its current value
            $wasteTypeId = $data['waste_type_id'] ?? $tracking->waste_type_id;
            $wasteType = WasteType::with('values')->find($wasteTypeId);
            if ($wasteType && $wasteType->values->isNotEmpty()) {
                $latestValue = $wasteType->values->sortByDesc('tanggal_update')->first();
                $avgValue = ($latestValue->nilai_minimal + $latestValue->nilai_maksimal) / 2;
                $data['estimasi_nilai'] = $data['jumlah'] * $avgValue;
            }
        }

        $tracking->update($data);
        
        // Load relationships
        $tracking->load(['user', 'wasteType']);

        return response()->json([
            'message' => 'Catatan sampah berhasil diperbarui',
            'tracking' => new UserWasteTrackingResource($tracking)
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
        $tracking = UserWasteTracking::findOrFail($id);
        
        // Restrict to own records for non-admin users
        if (!$request->user()->is_admin && $request->user()->user_id !== $tracking->user_id) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menghapus catatan ini'
            ], 403);
        }
        
        // Delete image if exists
        if ($tracking->foto) {
            Storage::delete('public/' . $tracking->foto);
        }
        
        $tracking->delete();

        return response()->json([
            'message' => 'Catatan sampah berhasil dihapus'
        ]);
    }
    
    /**
     * Get user's waste tracking summary.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSummary(Request $request)
    {
        // Get user ID (use authenticated user if not specified)
        $userId = $request->input('user_id', $request->user()->user_id);
        
        // Restrict to own records for non-admin users
        if (!$request->user()->is_admin && $request->user()->user_id !== $userId) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk melihat ringkasan ini'
            ], 403);
        }
        
        // Date range
        $dateFrom = $request->input('date_from', now()->subMonths(3)->startOfDay()->toDateTimeString());
        $dateTo = $request->input('date_to', now()->endOfDay()->toDateTimeString());
        
        // Get total amount by waste type
        $byWasteType = UserWasteTracking::where('user_id', $userId)
            ->whereBetween('tanggal_dicatat', [$dateFrom, $dateTo])
            ->with('wasteType')
            ->get()
            ->groupBy('waste_type_id')
            ->map(function ($items) {
                $firstItem = $items->first();
                return [
                    'waste_type_id' => $firstItem->waste_type_id,
                    'waste_type_name' => $firstItem->wasteType->nama_sampah ?? 'Unknown',
                    'total_amount' => $items->sum('jumlah'),
                    'unit' => $firstItem->satuan,
                    'total_value' => $items->sum('estimasi_nilai'),
                    'entries_count' => $items->count(),
                ];
            })
            ->values();
            
        // Get monthly totals
        $monthly = UserWasteTracking::where('user_id', $userId)
            ->whereBetween('tanggal_dicatat', [$dateFrom, $dateTo])
            ->get()
            ->groupBy(function ($item) {
                return \Carbon\Carbon::parse($item->tanggal_dicatat)->format('Y-m');
            })
            ->map(function ($items, $month) {
                return [
                    'month' => $month,
                    'total_amount' => $items->sum('jumlah'),
                    'total_value' => $items->sum('estimasi_nilai'),
                    'entries_count' => $items->count(),
                ];
            })
            ->values();
            
        // Get overall stats
        $overall = [
            'total_records' => UserWasteTracking::where('user_id', $userId)
                ->whereBetween('tanggal_dicatat', [$dateFrom, $dateTo])
                ->count(),
            'total_value' => UserWasteTracking::where('user_id', $userId)
                ->whereBetween('tanggal_dicatat', [$dateFrom, $dateTo])
                ->sum('estimasi_nilai'),
            'waste_types_count' => $byWasteType->count(),
            'first_entry_date' => UserWasteTracking::where('user_id', $userId)
                ->min('tanggal_dicatat'),
        ];
        
        return response()->json([
            'user_id' => $userId,
            'date_range' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
            'overall' => $overall,
            'by_waste_type' => $byWasteType,
            'monthly' => $monthly,
        ]);
    }
} 