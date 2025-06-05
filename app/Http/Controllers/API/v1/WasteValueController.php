<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteValueResource;
use App\Models\WasteValue;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class WasteValueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            if (Schema::hasTable('waste_values_new')) {
                // Gunakan tabel baru jika sudah tersedia
                $wasteTypes = \App\Models\WasteType::with(['wasteCategory', 'wasteValue'])
                    ->whereHas('wasteValue', function($query) {
                        $query->where('price_per_unit', '>', 0);
                    })
                    ->get()
                    ->map(function($wasteType) {
                        $price = 0;
                        $lastUpdated = $wasteType->created_at;
                        
                        if ($wasteType->wasteValue) {
                            $price = $wasteType->wasteValue->price_per_unit;
                            $lastUpdated = $wasteType->wasteValue->updated_at;
                        }
                        
                        // Support kedua struktur kolom 
                        $categoryName = $wasteType->wasteCategory ? $wasteType->wasteCategory->name : 'Uncategorized';
                        
                        // Explicitly use waste_id as the ID to ensure consistency
                        return [
                            'id' => $wasteType->waste_id, // Use waste_id explicitly instead of id
                            'waste_id' => $wasteType->waste_id, // Add explicitly for frontend normalization
                            'waste_type_id' => $wasteType->waste_id, // Add explicitly for frontend normalization
                            'name' => $wasteType->name ?? $wasteType->nama_sampah,
                            'category_id' => $wasteType->waste_category_id ?? $wasteType->kategori_id,
                            'category_name' => $categoryName,
                            'price_per_kg' => $price,
                            'price_per_unit' => $price, // Add for frontend compatibility
                            'last_updated' => $lastUpdated ? $lastUpdated->format('Y-m-d') : null,
                        ];
                    });

                // Log to debug IDs being returned
                \Log::debug('WasteValueController index - Sample IDs being returned:', [
                    'first_few_ids' => $wasteTypes->take(3)->pluck('id')->toArray(),
                    'id_types' => $wasteTypes->take(3)->map(function($item) { 
                        return ['id' => $item['id'], 'type' => gettype($item['id'])]; 
                    })->toArray()
                ]);
                
                return response()->json([
                    'success' => true,
                    'data' => $wasteTypes
                ]);
            } else {
                // Fallback ke implementasi lama
                $query = \App\Models\WasteValue::query();
                
                // Eager loading
                if ($request->has('with_waste_type') && $request->with_waste_type) {
                    $query->with('wasteType');
                }
                
                // Filter by waste type
                if ($request->has('waste_type_id')) {
                    $query->where('waste_type_id', $request->waste_type_id);
                }
                
                // Filter by min and max value
                if ($request->has('min_value')) {
                    $query->where('nilai_minimal', '>=', $request->min_value);
                }
                
                if ($request->has('max_value')) {
                    $query->where('nilai_maksimal', '<=', $request->max_value);
                }
                
                // Order by value
                if ($request->has('order_by')) {
                    $orderBy = $request->order_by;
                    $direction = $request->has('direction') ? $request->direction : 'asc';
                    
                    if ($orderBy === 'value') {
                        $query->orderBy('nilai_maksimal', $direction);
                    } elseif ($orderBy === 'date') {
                        $query->orderBy('updated_at', $direction);
                    }
                } else {
                    // Default sort by latest update
                    $query->orderBy('updated_at', 'desc');
                }
                
                // Pagination
                $perPage = $request->input('per_page', 15);
                $values = $query->paginate($perPage);
                
                return \App\Http\Resources\WasteValueResource::collection($values)
                    ->additional([
                        'success' => true,
                        'meta' => [
                            'total' => $values->total(),
                            'per_page' => $values->perPage(),
                            'current_page' => $values->currentPage(),
                            'last_page' => $values->lastPage(),
                        ],
                    ]);
            }
        } catch (\Exception $e) {
            \Log::error('Error in WasteValueController@index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:waste_categories,kategori_id',
                'price_per_kg' => 'required|numeric|min:0',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            DB::beginTransaction();
            try {
                // Create new waste type handling both old and new column names
                $wasteType = new WasteType();
                
                // Always set both old and new column names to ensure compatibility
                if (Schema::hasColumn('waste_types', 'nama_sampah')) {
                    $wasteType->nama_sampah = $request->name;
                }
                
                if (Schema::hasColumn('waste_types', 'name')) {
                    $wasteType->name = $request->name;
                }
                
                if (Schema::hasColumn('waste_types', 'kategori_id')) {
                    $wasteType->kategori_id = $request->category_id;
                }
                
                if (Schema::hasColumn('waste_types', 'waste_category_id')) {
                    $wasteType->waste_category_id = $request->category_id;
                }
                
                if (Schema::hasColumn('waste_types', 'deskripsi')) {
                    $wasteType->deskripsi = $request->description ?? 'Deskripsi untuk ' . $request->name;
                }
                
                if (Schema::hasColumn('waste_types', 'description')) {
                    $wasteType->description = $request->description ?? 'Description for ' . $request->name;
                }
                
                if (Schema::hasColumn('waste_types', 'unit')) {
                    $wasteType->unit = 'kg';
                }
                
                if (Schema::hasColumn('waste_types', 'status_aktif')) {
                    $wasteType->status_aktif = true;
                }
                
                $wasteType->save();
                // Get the correct ID field based on the table structure
                $wasteTypeId = Schema::hasColumn('waste_types', 'waste_id') ? $wasteType->waste_id : $wasteType->id;
                \Log::info('Created waste type with ID: ' . $wasteTypeId);
    
                // Create waste value using the appropriate table structure
                if (Schema::hasTable('waste_values_new')) {
                    $wasteValue = new WasteValue();
                    $wasteValue->waste_type_id = $wasteTypeId; // Use the correct ID
                    $wasteValue->price_per_unit = $request->price_per_kg;
                    $wasteValue->is_active = true;
                    $wasteValue->save();
                    \Log::info('Created waste value in waste_values_new with waste_type_id: ' . $wasteTypeId);
                } else {
                    // Fallback to old structure
                    $wasteValueId = DB::table('waste_values')->insertGetId([
                        'waste_id' => $wasteTypeId, // Use the correct ID
                        'harga_minimum' => $request->price_per_kg,
                        'harga_maksimum' => $request->price_per_kg,
                        'satuan' => 'kg',
                        'tanggal_update' => now(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    \Log::info('Created waste value in waste_values with ID: ' . $wasteValueId . ' for waste_id: ' . $wasteTypeId);
                }
                
                // Get category name
                $categoryName = '';
                $category = DB::table('waste_categories')
                    ->where('kategori_id', $request->category_id)
                    ->first();
                    
                if ($category) {
                    // Use name if available, otherwise use nama_kategori
                    $categoryName = $category->name ?? $category->nama_kategori ?? '';
                }
                
                DB::commit();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Jenis sampah dan harga berhasil ditambahkan',
                    'data' => [
                        'id' => $wasteTypeId, // Use the correct ID
                        'name' => $request->name,
                        'category_id' => $request->category_id,
                        'category_name' => $categoryName,
                        'price_per_kg' => $request->price_per_kg,
                        'last_updated' => now()->format('Y-m-d')
                    ]
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error('Error in transaction: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                throw $e;
            }
        } catch (\Exception $e) {
            \Log::error('Error in WasteValueController@store: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage(),
                'error_details' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $query = WasteValue::where('value_id', $id);
        
        // Eager loading
        if ($request->has('with_waste_type') && $request->with_waste_type) {
            $query->with('wasteType');
        }
        
        $value = $query->firstOrFail();
        
        return response()->json(new WasteValueResource($value));
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
        try {
            // Add debug logging for the incoming ID
            \Log::debug("WasteValueController update - Processing update for ID: $id");
            
            $validator = Validator::make($request->all(), [
                'price_per_kg' => 'required|numeric|min:0',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Find the waste type using the proper ID field
            $wasteType = null;
            
            // First try with waste_id (primary key in waste_types)
            $wasteType = WasteType::where('waste_id', $id)->first();
            
            if (!$wasteType) {
                // Log the failed lookup attempt
                \Log::debug("WasteValueController update - Could not find waste type with waste_id=$id");
                
                // Try with regular id as fallback
                $wasteType = WasteType::find($id);
                
                if (!$wasteType) {
                    // Log the final failure and return error
                    \Log::error("WasteValueController update - Failed to find waste type with any ID field: $id");
                    
                    return response()->json([
                        'success' => false,
                        'message' => "Jenis sampah dengan ID '$id' tidak ditemukan"
                    ], 404);
                }
                
                \Log::debug("WasteValueController update - Found waste type using id field", [
                    'waste_id' => $wasteType->waste_id,
                    'id' => $wasteType->id
                ]);
            } else {
                \Log::debug("WasteValueController update - Found waste type using waste_id field", [
                    'waste_id' => $wasteType->waste_id
                ]);
            }
            
            // Get the waste ID to use consistently
            $wasteTypeId = $wasteType->waste_id;
            
            // Check if updated fields are provided
            if ($request->has('name')) {
                // Update both fields for compatibility
                if (Schema::hasColumn('waste_types', 'name')) {
                    $wasteType->name = $request->name;
                }
                
                if (Schema::hasColumn('waste_types', 'nama_sampah')) {
                    $wasteType->nama_sampah = $request->name;
                }
            }
            
            // Check if category_id is provided
            if ($request->has('category_id')) {
                // Update both fields for compatibility
                if (Schema::hasColumn('waste_types', 'waste_category_id')) {
                    $wasteType->waste_category_id = $request->category_id;
                }
                
                if (Schema::hasColumn('waste_types', 'kategori_id')) {
                    $wasteType->kategori_id = $request->category_id;
                }
            }
            
            // Save any changes to waste type
            $wasteType->save();
            
            // Now update the price in waste_values
            $price = $request->price_per_kg;
            
            // Try to find existing waste value with the right ID field
            if (Schema::hasTable('waste_values_new')) {
                // Check if there's an existing value entry
                $wasteValue = WasteValue::where('waste_type_id', $wasteTypeId)->first();
                
                // Log waste value lookup
                \Log::debug("WasteValueController update - Looking up waste value", [
                    'waste_type_id' => $wasteTypeId,
                    'found_waste_value' => $wasteValue ? true : false
                ]);
                
                if (!$wasteValue) {
                    // Create new waste value if none exists
                    \Log::info("WasteValueController update - Creating new waste value for waste_type_id=$wasteTypeId");
                    $wasteValue = new WasteValue();
                    $wasteValue->waste_type_id = $wasteTypeId;
                    $wasteValue->is_active = true;
                }
                
                // Update price
                $wasteValue->price_per_unit = $price;
                $wasteValue->save();
                
                \Log::info("WasteValueController update - Updated waste value", [
                    'waste_value_id' => $wasteValue->id,
                    'waste_type_id' => $wasteValue->waste_type_id,
                    'new_price' => $wasteValue->price_per_unit
                ]);
            } else if (Schema::hasTable('waste_values')) {
                // Try old table format
                $updated = DB::table('waste_values')
                    ->where('waste_id', $wasteTypeId)
                    ->update([
                        'harga_minimum' => $price,
                        'harga_maksimum' => $price,
                        'tanggal_update' => now(),
                        'updated_at' => now()
                    ]);
                    
                if (!$updated) {
                    // Insert if not existing
                    DB::table('waste_values')->insert([
                        'waste_id' => $wasteTypeId,
                        'harga_minimum' => $price,
                        'harga_maksimum' => $price,
                        'satuan' => 'kg',
                        'tanggal_update' => now(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
            
            // Prepare a response with consistent fields
            $categoryName = '';
            if ($wasteType->wasteCategory) {
                $categoryName = $wasteType->wasteCategory->name;
            } else if ($wasteType->category) {
                $categoryName = $wasteType->category->name;
            }
            
            $result = [
                'id' => $wasteTypeId,  // Use waste_id consistently
                'waste_id' => $wasteTypeId,  // Add for frontend normalization
                'waste_type_id' => $wasteTypeId,  // Add for frontend normalization
                'name' => $wasteType->name ?? $wasteType->nama_sampah,
                'category_id' => $wasteType->waste_category_id ?? $wasteType->kategori_id,
                'category_name' => $categoryName,
                'price_per_kg' => $price,
                'price_per_unit' => $price,  // Add for frontend compatibility
                'last_updated' => now()->format('Y-m-d'),
            ];
            
            \Log::debug("WasteValueController update - Returning successful response", [
                'result' => $result
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Harga sampah berhasil diperbarui',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            \Log::error("WasteValueController update - Error: {$e->getMessage()}", [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui harga: ' . $e->getMessage(),
            ], 500);
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
        try {
            // Validate that the ID is valid
            if (!$id) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID tidak valid'
                ], 400);
            }

            // Find the waste type using the proper primary key
            if (Schema::hasColumn('waste_types', 'waste_id')) {
                $wasteType = WasteType::where('waste_id', $id)->first();
                if (!$wasteType) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Jenis sampah tidak ditemukan'
                    ], 404);
                }
                $wasteTypeId = $wasteType->waste_id;
            } else {
                $wasteType = WasteType::find($id);
                if (!$wasteType) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Jenis sampah tidak ditemukan'
                    ], 404);
                }
                $wasteTypeId = $wasteType->id;
            }

            // Check if waste type is being used in user_waste_trackings
            // First, check if the table exists to avoid errors
            if (Schema::hasTable('user_waste_trackings')) {
                $isBeingUsed = DB::table('user_waste_trackings')
                    ->where('waste_type_id', $wasteTypeId)
                    ->whereNull('deleted_at')
                    ->exists();
                    
                if ($isBeingUsed) {
                    return response()->json([
                        'success' => false, 
                        'message' => 'Tidak dapat menghapus jenis sampah karena masih digunakan dalam pencatatan sampah pengguna'
                    ], 422);
                }
            } else if (Schema::hasTable('user_waste_tracking')) {
                // Try legacy table name
                $isBeingUsed = DB::table('user_waste_tracking')
                    ->where('waste_id', $wasteTypeId)
                    ->whereNull('deleted_at')
                    ->exists();
                    
                if ($isBeingUsed) {
                    return response()->json([
                        'success' => false, 
                        'message' => 'Tidak dapat menghapus jenis sampah karena masih digunakan dalam pencatatan sampah pengguna'
                    ], 422);
                }
            }

            // Check which waste_values table exists and delete from it
            if (Schema::hasTable('waste_values_new')) {
                // Delete from new table structure
                DB::table('waste_values_new')
                    ->where('waste_type_id', $wasteTypeId)
                    ->delete();
            }
            
            if (Schema::hasTable('waste_values')) {
                // Also delete from old table structure if it exists
                DB::table('waste_values')
                    ->where('waste_id', $wasteTypeId)
                    ->delete();
            }

            // Delete the waste type itself
            $wasteType->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Jenis sampah berhasil dihapus'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error in WasteValueController@destroy: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Get value history for a waste type.
     *
     * @param  int  $wasteTypeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getValueHistory($wasteTypeId)
    {
        try {
            $values = WasteValue::where('waste_type_id', $wasteTypeId)
                ->orderBy('updated_at', 'desc')
                ->get();
                
            return response()->json([
                'success' => true,
                'waste_type_id' => $wasteTypeId,
                'history' => $values->map(function($value) {
                    return [
                        'id' => $value->id,
                        'price_per_unit' => $value->price_per_unit,
                        'updated_at' => $value->updated_at->format('Y-m-d'),
                        'is_active' => $value->is_active
                    ];
                })
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in WasteValueController@getValueHistory: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a listing of waste values for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        try {
            $query = WasteValue::query();
            
            // Eager loading with only active waste types
            if ($request->has('with_waste_type') && $request->with_waste_type) {
                $query->with(['wasteType' => function($q) {
                    $q->where('status', 'AKTIF');
                }]);
            }
            
            // Filter to only include values for active waste types
            $query->whereHas('wasteType', function($q) {
                $q->where('status', 'AKTIF');
            });
            
            // Filter by waste type
            if ($request->has('waste_type_id')) {
                $query->where('waste_type_id', $request->waste_type_id);
            }
            
            // Filter by min and max value
            if ($request->has('min_value')) {
                $query->where('price_per_unit', '>=', $request->min_value);
            }
            
            if ($request->has('max_value')) {
                $query->where('price_per_unit', '<=', $request->max_value);
            }
            
            // Order by value
            if ($request->has('order_by')) {
                $orderBy = $request->order_by;
                $direction = $request->has('direction') ? $request->direction : 'asc';
                
                if ($orderBy === 'value') {
                    $query->orderBy('price_per_unit', $direction);
                } elseif ($orderBy === 'date') {
                    $query->orderBy('updated_at', $direction);
                }
            } else {
                // Default sort by latest update
                $query->orderBy('updated_at', 'desc');
            }
            
            // Get the latest value for each waste type
            $query->whereIn('id', function($subquery) {
                $subquery->selectRaw('MAX(id)')
                    ->from('waste_values_new')
                    ->groupBy('waste_type_id');
            });
            
            // Pagination
            $perPage = $request->input('per_page', 15);
            $values = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $values->map(function($value) {
                    return [
                        'id' => $value->id,
                        'waste_type_id' => $value->waste_type_id,
                        'price_per_unit' => $value->price_per_unit,
                        'updated_at' => $value->updated_at->format('Y-m-d'),
                        'is_active' => $value->is_active,
                        'waste_type' => $value->wasteType ? [
                            'id' => $value->wasteType->id,
                            'name' => $value->wasteType->name,
                            'category_id' => $value->wasteType->waste_category_id
                        ] : null
                    ];
                }),
                'meta' => [
                    'total' => $values->total(),
                    'per_page' => $values->perPage(),
                    'current_page' => $values->currentPage(),
                    'last_page' => $values->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in WasteValueController@public: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all waste values with their waste type and category
     */
    // Method index sudah didefinisikan di atas

    /**
     * Get waste value categories for filtering
     */
    public function categories()
    {
        try {
            // Always use the correct column names for waste_categories
            $idColumn = 'kategori_id';
            $nameColumn = Schema::hasColumn('waste_categories', 'name') ? 'name' : 'nama_kategori';
            $descColumn = Schema::hasColumn('waste_categories', 'description') ? 'description' : 'deskripsi';
            
            // Pull categories using dynamic column names
            $categories = DB::table('waste_categories')
                ->select(
                    "$idColumn as id", 
                    "$nameColumn as name",
                    "$descColumn as description"
                )->get();
            
            // Validasi bahwa kita mendapatkan data
            if ($categories->isEmpty()) {
                // If no categories, return empty array with message
                return response()->json([
                    'success' => true,
                    'data' => [], 
                    'message' => 'Tidak ada kategori yang tersedia'
                ]);
            }
            
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in WasteValueController@categories: ' . $e->getMessage());
            
            // Fallback to hardcoded default categories
            $defaultCategories = [
                ['id' => 1, 'name' => 'Plastik', 'description' => 'Sampah berbahan plastik'],
                ['id' => 2, 'name' => 'Kertas', 'description' => 'Sampah berbahan kertas'],
                ['id' => 3, 'name' => 'Kaca', 'description' => 'Sampah berbahan kaca'],
                ['id' => 4, 'name' => 'Logam', 'description' => 'Sampah berbahan logam'],
                ['id' => 5, 'name' => 'Elektronik', 'description' => 'Sampah elektronik']
            ];
            
            return response()->json([
                'success' => true,
                'data' => $defaultCategories,
                'message' => 'Data kategori default (error: ' . $e->getMessage() . ')'
            ]);
        }
    }

    /**
     * Update prices in bulk (e.g., increase all prices by percentage)
     * 
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function bulkUpdate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'percentage' => 'required|numeric|min:-50|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $percentage = $request->percentage;
            $factor = 1 + ($percentage / 100);
            
            // Check if we're using new table structure
            if (Schema::hasTable('waste_values_new')) {
                // Get all waste values
                $wasteValues = WasteValue::all();
                
                if ($wasteValues->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Tidak ada data harga sampah untuk diperbarui.'
                    ], 404);
                }
                
                foreach ($wasteValues as $value) {
                    $value->price_per_unit = round($value->price_per_unit * $factor);
                    $value->save();
                }
            } else {
                // Fallback to old structure if needed
                $affected = DB::table('waste_values')
                    ->update([
                        'harga_minimum' => DB::raw("ROUND(harga_minimum * $factor)"),
                        'harga_maksimum' => DB::raw("ROUND(harga_maksimum * $factor)"),
                        'updated_at' => now()
                    ]);
                    
                if ($affected == 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Tidak ada data harga sampah untuk diperbarui.'
                    ], 404);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Semua harga berhasil diperbarui',
                'data' => [
                    'updated_count' => isset($wasteValues) ? $wasteValues->count() : $affected,
                    'percentage' => $percentage
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in WasteValueController@bulkUpdate: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}