<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserWasteTrackingResource;
use App\Http\Resources\WasteTypeResource;
use App\Models\UserWasteTracking;
use App\Models\WasteType;
use App\Models\WasteValue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Schema;

class UserWasteTrackingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = UserWasteTracking::where('user_id', $user->id)
            ->with(['wasteType', 'wasteType.wasteCategory']);
        
        // Apply filters if provided
        if ($request->has('waste_type_id') && !empty($request->waste_type_id)) {
            $query->where('waste_type_id', $request->waste_type_id);
        }
        
        if ($request->has('status') && !empty($request->status)) {
            $query->where('management_status', $request->status);
        }
        
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('tracking_date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('tracking_date', '<=', $request->end_date);
        }
        
        // Sort records - newest first by default
        $query->orderBy('tracking_date', 'desc');
        
        $records = $query->get()->map(function($record) {
            return $this->formatTrackingRecord($record);
        });
        
        return response()->json([
            'success' => true,
            'data' => $records
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
        $validator = Validator::make($request->all(), [
            'waste_type_id' => 'required|exists:waste_types,id',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'unit' => 'required|string|in:kg,liter,pcs',
            'tracking_date' => 'required|date',
            'management_status' => 'required|string|in:disimpan,dijual,didaur ulang',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        // Calculate estimated value based on waste type and amount
        $estimatedValue = $this->calculateEstimatedValue($request->waste_type_id, $request->amount);
        
        $tracking = UserWasteTracking::create([
            'user_id' => $user->id,
            'waste_type_id' => $request->waste_type_id,
            'amount' => $request->amount,
            'unit' => $request->unit,
            'tracking_date' => $request->tracking_date,
            'management_status' => $request->management_status,
            'estimated_value' => $estimatedValue,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data sampah berhasil disimpan',
            'data' => $this->formatTrackingRecord($tracking->fresh(['wasteType', 'wasteType.wasteCategory']))
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $tracking = UserWasteTracking::where('user_id', $user->id)
            ->where('id', $id)
            ->with(['wasteType', 'wasteType.wasteCategory'])
            ->firstOrFail();
        
        return response()->json([
            'success' => true,
            'data' => $this->formatTrackingRecord($tracking)
        ]);
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
        $validator = Validator::make($request->all(), [
            'waste_type_id' => 'sometimes|required|exists:waste_types,id',
            'amount' => 'sometimes|required|numeric|min:0.01|max:99999999.99',
            'unit' => 'sometimes|required|string|in:kg,liter,pcs',
            'tracking_date' => 'sometimes|required|date',
            'management_status' => 'sometimes|required|string|in:disimpan,dijual,didaur ulang',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        $tracking = UserWasteTracking::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();
        
        // Update only provided fields
        if ($request->has('waste_type_id')) {
            $tracking->waste_type_id = $request->waste_type_id;
        }
        
        if ($request->has('amount')) {
            $tracking->amount = $request->amount;
        }
        
        if ($request->has('unit')) {
            $tracking->unit = $request->unit;
        }
        
        if ($request->has('tracking_date')) {
            $tracking->tracking_date = $request->tracking_date;
        }
        
        if ($request->has('management_status')) {
            $tracking->management_status = $request->management_status;
        }
        
        if ($request->has('notes')) {
            $tracking->notes = $request->notes;
        }
        
        // Recalculate estimated value if waste type or amount changed
        if ($request->has('waste_type_id') || $request->has('amount')) {
            $tracking->estimated_value = $this->calculateEstimatedValue($tracking->waste_type_id, $tracking->amount);
        }
        
        $tracking->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Data sampah berhasil diperbarui',
            'data' => $this->formatTrackingRecord($tracking->fresh(['wasteType', 'wasteType.wasteCategory']))
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
        $user = Auth::user();
        
        $tracking = UserWasteTracking::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();
        
        $tracking->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Data sampah berhasil dihapus',
        ]);
    }
    
    /**
     * Export waste tracking data to CSV or Excel
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $format
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function export(Request $request, $format = 'csv')
    {
        $user = Auth::user();
        
        $records = UserWasteTracking::where('user_id', $user->id)
            ->with(['wasteType', 'wasteType.wasteCategory'])
            ->orderBy('tracking_date', 'desc')
            ->get()
            ->map(function($record) {
                return [
                    'tracking_date' => $record->tracking_date,
                    'waste_name' => $record->wasteType->name,
                    'category' => $record->wasteType->wasteCategory->name ?? 'Tidak Terkategori',
                    'amount' => $record->amount,
                    'unit' => $record->unit,
                    'management_status' => $record->management_status,
                    'estimated_value' => $record->estimated_value,
                    'notes' => $record->notes
                ];
            });
            
        // Handle the export based on format (this would need additional logic)
        // For now, just return the data
        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Export would be handled here in a real implementation'
        ]);
    }
    
    /**
     * Get summary statistics for dashboard
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $user = Auth::user();
        
        // Total waste amount
        $totalAmount = UserWasteTracking::where('user_id', $user->id)->sum('amount');
        
        // Total estimated value
        $totalValue = UserWasteTracking::where('user_id', $user->id)->sum('estimated_value');
        
        // Waste by category
        $wasteByCategory = UserWasteTracking::where('user_id', $user->id)
            ->with('wasteType.wasteCategory')
            ->get()
            ->groupBy(function($tracking) {
                return $tracking->wasteType && $tracking->wasteType->wasteCategory 
                    ? $tracking->wasteType->wasteCategory->name 
                    : 'Uncategorized';
            })
            ->map(function($group, $category) {
                return [
                    'category' => $category,
                    'amount' => $group->sum('amount'),
                    'value' => $group->sum('estimated_value')
                ];
            })
            ->values();
            
        // Waste by status
        $wasteByStatus = UserWasteTracking::where('user_id', $user->id)
            ->get()
            ->groupBy('management_status')
            ->map(function($group, $status) {
                return [
                    'status' => $status,
                    'amount' => $group->sum('amount'),
                    'value' => $group->sum('estimated_value'),
                    'count' => $group->count()
                ];
            })
            ->values();
            
        // Monthly trends (last 6 months)
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();
        $monthlyTrends = UserWasteTracking::where('user_id', $user->id)
            ->where('tracking_date', '>=', $sixMonthsAgo)
            ->get()
            ->groupBy(function($tracking) {
                return $tracking->tracking_date->format('Y-m');
            })
            ->map(function($group, $month) {
                return [
                    'month' => $month,
                    'amount' => $group->sum('amount'),
                    'value' => $group->sum('estimated_value'),
                    'count' => $group->count()
                ];
            })
            ->values();
            
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_amount' => $totalAmount,
                'total_value' => $totalValue,
                'waste_by_category' => $wasteByCategory,
                'waste_by_status' => $wasteByStatus,
                'monthly_trends' => $monthlyTrends
            ]
        ]);
    }

    /**
     * Get waste types with their values for user tracking
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWasteTypes()
    {
        try {
            // Get waste types with their categories and values
            $wasteTypes = WasteType::with(['wasteCategory', 'wasteValue'])
                ->get()
                ->map(function($wasteType) {
                    $price = 0;
                    
                    if ($wasteType->wasteValue) {
                        $price = $wasteType->wasteValue->price_per_unit;
                    }
                    
                    // Support both column structures
                    $categoryName = '';
                    if ($wasteType->wasteCategory) {
                        $categoryName = $wasteType->wasteCategory->name ?? $wasteType->wasteCategory->nama_kategori ?? '';
                    }
                    
                    return [
                        'id' => $wasteType->waste_id,
                        'name' => $wasteType->name ?? $wasteType->nama_sampah ?? '',
                        'category_id' => $wasteType->waste_category_id ?? $wasteType->kategori_id ?? null,
                        'category_name' => $categoryName,
                        'price_per_kg' => $price,
                        'unit' => $wasteType->unit ?? 'kg',
                        'description' => $wasteType->description ?? $wasteType->deskripsi ?? ''
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $wasteTypes
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in UserWasteTrackingController@getWasteTypes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Format tracking record for consistent API response
     */
    private function formatTrackingRecord($record)
    {
        // Get waste name with fallbacks
        $wasteName = 'Unknown';
        $categoryId = null;
        $categoryName = 'Uncategorized';
        
        if ($record->wasteType) {
            // Get waste name
            if (isset($record->wasteType->name)) {
                $wasteName = $record->wasteType->name;
            } elseif (isset($record->wasteType->nama_sampah)) {
                $wasteName = $record->wasteType->nama_sampah;
            }
            
            // Get category ID
            if (isset($record->wasteType->waste_category_id)) {
                $categoryId = $record->wasteType->waste_category_id;
            } elseif (isset($record->wasteType->kategori_id)) {
                $categoryId = $record->wasteType->kategori_id;
            }
            
            // Get category name
            if ($record->wasteType->wasteCategory) {
                if (isset($record->wasteType->wasteCategory->name)) {
                    $categoryName = $record->wasteType->wasteCategory->name;
                } elseif (isset($record->wasteType->wasteCategory->nama_kategori)) {
                    $categoryName = $record->wasteType->wasteCategory->nama_kategori;
                }
            } elseif ($record->wasteType->category) {
                if (isset($record->wasteType->category->name)) {
                    $categoryName = $record->wasteType->category->name;
                } elseif (isset($record->wasteType->category->nama_kategori)) {
                    $categoryName = $record->wasteType->category->nama_kategori;
                }
            }
        }
        
        return [
            'id' => $record->id,
            'waste_type_id' => $record->waste_type_id,
            'waste_name' => $wasteName,
            'category_id' => $categoryId,
            'category_name' => $categoryName,
            'amount' => $record->amount,
            'unit' => $record->unit,
            'tracking_date' => $record->tracking_date,
            'management_status' => $record->management_status,
            'estimated_value' => $record->estimated_value,
            'notes' => $record->notes,
            'created_at' => $record->created_at,
            'updated_at' => $record->updated_at
        ];
    }
    
    /**
     * Calculate estimated value based on waste type and amount
     * 
     * Nilai estimasi (Rp) = jumlah × harga per satuan
     */
    private function calculateEstimatedValue($wasteTypeId, $amount)
    {
        try {
            // Check which waste_values table we should use
            if (Schema::hasTable('waste_values_new')) {
                // Get the waste value from the new table structure
                $wasteValue = DB::table('waste_values_new')
                    ->where('waste_type_id', $wasteTypeId)
                    ->where('is_active', true)
                    ->first();
                
                if ($wasteValue) {
                    // Calculate: amount * price_per_unit
                    return round($amount * $wasteValue->price_per_unit);
                }
            } 
            
            // Fallback to the old table structure
            if (Schema::hasTable('waste_values')) {
                $wasteValue = DB::table('waste_values')
                    ->where('waste_id', $wasteTypeId)
                    ->first();
                
                if ($wasteValue) {
                    // Use average of min and max price
                    $avgPrice = ($wasteValue->harga_minimum + $wasteValue->harga_maksimum) / 2;
                    return round($amount * $avgPrice);
                }
            }
            
            // No pricing information found
            return 0;
        } catch (\Exception $e) {
            \Log::error('Error calculating estimated value: ' . $e->getMessage());
            return 0; // Return 0 in case of error
        }
    }
} 