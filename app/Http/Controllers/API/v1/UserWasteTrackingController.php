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
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpFoundation\Response;

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
        
        $query = UserWasteTracking::where('user_id', $user->user_id)
            ->with('wasteType.category');
            
        // Filter by waste type
        if ($request->has('waste_type_id')) {
            $query->where('waste_id', $request->waste_type_id);
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status_pengelolaan', $request->status);
        }
        
        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal_pencatatan', [$request->start_date, $request->end_date]);
        } else if ($request->has('start_date')) {
            $query->where('tanggal_pencatatan', '>=', $request->start_date);
        } else if ($request->has('end_date')) {
            $query->where('tanggal_pencatatan', '<=', $request->end_date);
        }
        
        // Search in notes
        if ($request->has('search')) {
            $query->where('catatan', 'like', '%' . $request->search . '%');
        }
        
        // Order by date
        $query->orderBy('tanggal_pencatatan', 'desc');
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $trackings = $query->paginate($perPage);
        
        // Process data to include waste name and category
        $data = $trackings->getCollection()->map(function ($tracking) {
            $wasteType = $tracking->wasteType;
            return [
                'id' => $tracking->tracking_id,
                'waste_type_id' => $tracking->waste_id,
                'waste_name' => $wasteType ? $wasteType->nama_sampah : 'Unknown',
                'category_name' => $wasteType && $wasteType->category ? $wasteType->category->nama_kategori : 'Unknown',
                'amount' => $tracking->jumlah,
                'unit' => $tracking->satuan,
                'tracking_date' => $tracking->tanggal_pencatatan,
                'management_status' => $tracking->status_pengelolaan,
                'estimated_value' => $tracking->nilai_estimasi,
                'notes' => $tracking->catatan,
                'photo' => $tracking->foto ? url('storage/' . $tracking->foto) : null,
                'created_at' => $tracking->created_at,
                'updated_at' => $tracking->updated_at,
            ];
        });
        
        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $trackings->currentPage(),
                'from' => $trackings->firstItem(),
                'last_page' => $trackings->lastPage(),
                'per_page' => $trackings->perPage(),
                'to' => $trackings->lastItem(),
                'total' => $trackings->total(),
            ]
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
            'waste_type_id' => 'required|exists:waste_types,waste_id',
            'amount' => 'required|numeric|min:0.01',
            'unit' => 'required|in:kg,liter,pcs',
            'tracking_date' => 'required|date',
            'management_status' => 'required|in:disimpan,dijual,didaur ulang',
            'notes' => 'nullable|string|max:500',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'estimated_value' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = Auth::user();
        
        // Calculate estimated value if not provided
        $estimatedValue = $request->estimated_value;
        if (!$estimatedValue) {
            $wasteType = WasteType::with('value')->find($request->waste_type_id);
            if ($wasteType && $wasteType->value) {
                $estimatedValue = $wasteType->value->nilai_per_satuan * $request->amount;
            } else {
                $estimatedValue = 0;
            }
        }
        
        $data = [
            'user_id' => $user->user_id,
            'waste_id' => $request->waste_type_id,
            'jumlah' => $request->amount,
            'satuan' => $request->unit,
            'tanggal_pencatatan' => $request->tracking_date,
            'status_pengelolaan' => $request->management_status,
            'nilai_estimasi' => $estimatedValue,
            'catatan' => $request->notes,
        ];
        
        // Handle photo upload
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = 'waste_tracking_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/waste_tracking', $filename);
            $data['foto'] = 'waste_tracking/' . $filename;
        }
        
        $tracking = UserWasteTracking::create($data);
        
        // Load waste type data
        $tracking->load('wasteType.category');
        
        // Format response
        $response = [
            'id' => $tracking->tracking_id,
            'waste_type_id' => $tracking->waste_id,
            'waste_name' => $tracking->wasteType ? $tracking->wasteType->nama_sampah : 'Unknown',
            'category_name' => $tracking->wasteType && $tracking->wasteType->category ? $tracking->wasteType->category->nama_kategori : 'Unknown',
            'amount' => $tracking->jumlah,
            'unit' => $tracking->satuan,
            'tracking_date' => $tracking->tanggal_pencatatan,
            'management_status' => $tracking->status_pengelolaan,
            'estimated_value' => $tracking->nilai_estimasi,
            'notes' => $tracking->catatan,
            'photo' => $tracking->foto ? url('storage/' . $tracking->foto) : null,
            'created_at' => $tracking->created_at,
            'updated_at' => $tracking->updated_at,
        ];
        
        return response()->json([
            'status' => 'success',
            'message' => 'Data tracking sampah berhasil disimpan',
            'data' => $response
        ], Response::HTTP_CREATED);
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
        
        try {
            $tracking = UserWasteTracking::where('tracking_id', $id)
                ->where('user_id', $user->user_id)
                ->with('wasteType.category')
                ->firstOrFail();
                
            // Format response
            $response = [
                'id' => $tracking->tracking_id,
                'waste_type_id' => $tracking->waste_id,
                'waste_name' => $tracking->wasteType ? $tracking->wasteType->nama_sampah : 'Unknown',
                'category_name' => $tracking->wasteType && $tracking->wasteType->category ? $tracking->wasteType->category->nama_kategori : 'Unknown',
                'amount' => $tracking->jumlah,
                'unit' => $tracking->satuan,
                'tracking_date' => $tracking->tanggal_pencatatan,
                'management_status' => $tracking->status_pengelolaan,
                'estimated_value' => $tracking->nilai_estimasi,
                'notes' => $tracking->catatan,
                'photo' => $tracking->foto ? url('storage/' . $tracking->foto) : null,
                'created_at' => $tracking->created_at,
                'updated_at' => $tracking->updated_at,
            ];
            
            return response()->json([
                'status' => 'success',
                'data' => $response
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tracking sampah tidak ditemukan'
            ], Response::HTTP_NOT_FOUND);
        }
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
        $user = Auth::user();
        
        try {
            $tracking = UserWasteTracking::where('tracking_id', $id)
                ->where('user_id', $user->user_id)
                ->firstOrFail();
                
            $validator = Validator::make($request->all(), [
                'waste_type_id' => 'sometimes|exists:waste_types,waste_id',
                'amount' => 'sometimes|numeric|min:0.01',
                'unit' => 'sometimes|in:kg,liter,pcs',
                'tracking_date' => 'sometimes|date',
                'management_status' => 'sometimes|in:disimpan,dijual,didaur ulang',
                'notes' => 'nullable|string|max:500',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'estimated_value' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            
            $data = [];
            
            if ($request->has('waste_type_id')) {
                $data['waste_id'] = $request->waste_type_id;
            }
            
            if ($request->has('amount')) {
                $data['jumlah'] = $request->amount;
            }
            
            if ($request->has('unit')) {
                $data['satuan'] = $request->unit;
            }
            
            if ($request->has('tracking_date')) {
                $data['tanggal_pencatatan'] = $request->tracking_date;
            }
            
            if ($request->has('management_status')) {
                $data['status_pengelolaan'] = $request->management_status;
            }
            
            if ($request->has('notes')) {
                $data['catatan'] = $request->notes;
            }
            
            // Calculate estimated value if waste_type or amount changed
            if ($request->has('estimated_value')) {
                $data['nilai_estimasi'] = $request->estimated_value;
            } else if ($request->has('waste_type_id') || $request->has('amount')) {
                $wasteId = $request->waste_type_id ?? $tracking->waste_id;
                $amount = $request->amount ?? $tracking->jumlah;
                
                $wasteType = WasteType::with('value')->find($wasteId);
                if ($wasteType && $wasteType->value) {
                    $data['nilai_estimasi'] = $wasteType->value->nilai_per_satuan * $amount;
                }
            }
            
            // Handle photo upload
            if ($request->hasFile('photo')) {
                // Delete old photo if exists
                if ($tracking->foto) {
                    Storage::delete('public/' . $tracking->foto);
                }
                
                $file = $request->file('photo');
                $filename = 'waste_tracking_' . time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/waste_tracking', $filename);
                $data['foto'] = 'waste_tracking/' . $filename;
            }
            
            $tracking->update($data);
            
            // Reload with waste type data
            $tracking->load('wasteType.category');
            
            // Format response
            $response = [
                'id' => $tracking->tracking_id,
                'waste_type_id' => $tracking->waste_id,
                'waste_name' => $tracking->wasteType ? $tracking->wasteType->nama_sampah : 'Unknown',
                'category_name' => $tracking->wasteType && $tracking->wasteType->category ? $tracking->wasteType->category->nama_kategori : 'Unknown',
                'amount' => $tracking->jumlah,
                'unit' => $tracking->satuan,
                'tracking_date' => $tracking->tanggal_pencatatan,
                'management_status' => $tracking->status_pengelolaan,
                'estimated_value' => $tracking->nilai_estimasi,
                'notes' => $tracking->catatan,
                'photo' => $tracking->foto ? url('storage/' . $tracking->foto) : null,
                'created_at' => $tracking->created_at,
                'updated_at' => $tracking->updated_at,
            ];
            
            return response()->json([
                'status' => 'success',
                'message' => 'Data tracking sampah berhasil diupdate',
                'data' => $response
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tracking sampah tidak ditemukan'
            ], Response::HTTP_NOT_FOUND);
        }
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
        
        try {
            $tracking = UserWasteTracking::where('tracking_id', $id)
                ->where('user_id', $user->user_id)
                ->firstOrFail();
                
            // Delete photo if exists
            if ($tracking->foto) {
                Storage::delete('public/' . $tracking->foto);
            }
            
            $tracking->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Data tracking sampah berhasil dihapus'
            ]);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tracking sampah tidak ditemukan'
            ], Response::HTTP_NOT_FOUND);
        }
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
        
        $query = UserWasteTracking::where('user_id', $user->user_id)
            ->with('wasteType.category');
            
        // Apply filters similar to index method
        if ($request->has('waste_type_id')) {
            $query->where('waste_id', $request->waste_type_id);
        }
        
        if ($request->has('status')) {
            $query->where('status_pengelolaan', $request->status);
        }
        
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal_pencatatan', [$request->start_date, $request->end_date]);
        } else if ($request->has('start_date')) {
            $query->where('tanggal_pencatatan', '>=', $request->start_date);
        } else if ($request->has('end_date')) {
            $query->where('tanggal_pencatatan', '<=', $request->end_date);
        }
        
        if ($request->has('search')) {
            $query->where('catatan', 'like', '%' . $request->search . '%');
        }
        
        $query->orderBy('tanggal_pencatatan', 'desc');
        
        $trackings = $query->get();
        
        // Prepare data for export
        $exportData = [];
        
        // Add headers
        $exportData[] = [
            'ID', 
            'Jenis Sampah', 
            'Kategori', 
            'Jumlah', 
            'Satuan', 
            'Tanggal Pencatatan', 
            'Status Pengelolaan', 
            'Nilai Estimasi (Rp)', 
            'Catatan'
        ];
        
        // Add data rows
        foreach ($trackings as $tracking) {
            $exportData[] = [
                $tracking->tracking_id,
                $tracking->wasteType ? $tracking->wasteType->nama_sampah : 'Unknown',
                $tracking->wasteType && $tracking->wasteType->category ? $tracking->wasteType->category->nama_kategori : 'Unknown',
                $tracking->jumlah,
                $tracking->satuan,
                $tracking->tanggal_pencatatan->format('Y-m-d'),
                $tracking->status_pengelolaan,
                $tracking->nilai_estimasi,
                $tracking->catatan,
            ];
        }
        
        // Generate file based on format
        $filename = 'waste_tracking_' . date('Y-m-d') . '.' . $format;
        $tempFile = tempnam(sys_get_temp_dir(), 'export_');
        
        if ($format === 'csv') {
            $file = fopen($tempFile, 'w');
            foreach ($exportData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
            
            return response()->download($tempFile, $filename, [
                'Content-Type' => 'text/csv',
            ])->deleteFileAfterSend(true);
        } else if ($format === 'xlsx') {
            // For Excel format, we would typically use a package like PhpSpreadsheet
            // But for simplicity, we'll return CSV for now
            $file = fopen($tempFile, 'w');
            foreach ($exportData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
            
            return response()->download($tempFile, 'waste_tracking_' . date('Y-m-d') . '.csv', [
                'Content-Type' => 'text/csv',
            ])->deleteFileAfterSend(true);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Format tidak didukung'
            ], Response::HTTP_BAD_REQUEST);
        }
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
        $totalAmount = UserWasteTracking::where('user_id', $user->user_id)->sum('jumlah');
        
        // Total estimated value
        $totalValue = UserWasteTracking::where('user_id', $user->user_id)->sum('nilai_estimasi');
        
        // Waste by category
        $wasteByCategory = UserWasteTracking::where('user_id', $user->user_id)
            ->with('wasteType.category')
            ->get()
            ->groupBy(function($tracking) {
                return $tracking->wasteType && $tracking->wasteType->category 
                    ? $tracking->wasteType->category->nama_kategori 
                    : 'Uncategorized';
            })
            ->map(function($group, $category) {
                return [
                    'category' => $category,
                    'amount' => $group->sum('jumlah'),
                    'value' => $group->sum('nilai_estimasi')
                ];
            })
            ->values();
            
        // Waste by status
        $wasteByStatus = UserWasteTracking::where('user_id', $user->user_id)
            ->get()
            ->groupBy('status_pengelolaan')
            ->map(function($group, $status) {
                return [
                    'status' => $status,
                    'amount' => $group->sum('jumlah'),
                    'value' => $group->sum('nilai_estimasi'),
                    'count' => $group->count()
                ];
            })
            ->values();
            
        // Monthly trends (last 6 months)
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();
        $monthlyTrends = UserWasteTracking::where('user_id', $user->user_id)
            ->where('tanggal_pencatatan', '>=', $sixMonthsAgo)
            ->get()
            ->groupBy(function($tracking) {
                return $tracking->tanggal_pencatatan->format('Y-m');
            })
            ->map(function($group, $month) {
                return [
                    'month' => $month,
                    'amount' => $group->sum('jumlah'),
                    'value' => $group->sum('nilai_estimasi'),
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
     * Get waste types for tracking form
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWasteTypes()
    {
        $wasteTypes = WasteType::with(['category', 'wasteValues'])->get();
        
        // Format the response
        $formattedTypes = $wasteTypes->map(function($type) {
            // Get the latest waste value
            $value = $type->wasteValues->sortByDesc('tanggal_update')->first();
            
            // Calculate average value per unit
            $valuePerUnit = 0;
            if ($value) {
                // Average of min and max price
                $valuePerUnit = ($value->harga_minimum + $value->harga_maksimum) / 2;
            }
            
            return [
                'id' => $type->waste_id,
                'name' => $type->nama_sampah,
                'category_id' => $type->category ? $type->category->kategori_id : null,
                'category_name' => $type->category ? $type->category->nama_kategori : 'Uncategorized',
                'value_per_unit' => $valuePerUnit
            ];
        });
        
        return response()->json([
            'status' => 'success',
            'data' => $formattedTypes
        ]);
    }
} 