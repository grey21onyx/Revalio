<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteValueResource;
use App\Models\WasteValue;
use Illuminate\Http\Request;

class WasteValueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = WasteValue::query();
        
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
                $query->orderBy('tanggal_update', $direction);
            }
        } else {
            // Default sort by latest update
            $query->orderBy('tanggal_update', 'desc');
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $values = $query->paginate($perPage);
        
        return WasteValueResource::collection($values)
            ->additional([
                'meta' => [
                    'total' => $values->total(),
                    'per_page' => $values->perPage(),
                    'current_page' => $values->currentPage(),
                    'last_page' => $values->lastPage(),
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
            'nilai_minimal' => 'required|numeric|min:0',
            'nilai_maksimal' => 'required|numeric|min:0|gte:nilai_minimal',
            'satuan' => 'required|string|max:50',
            'sumber_data' => 'nullable|string|max:255',
            'catatan' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['tanggal_update'] = now();

        $value = WasteValue::create($data);

        return response()->json([
            'message' => 'Nilai sampah berhasil dibuat',
            'waste_value' => new WasteValueResource($value)
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
        $value = WasteValue::findOrFail($id);
        
        $request->validate([
            'waste_type_id' => 'sometimes|exists:waste_types,waste_type_id',
            'nilai_minimal' => 'sometimes|numeric|min:0',
            'nilai_maksimal' => 'sometimes|numeric|min:0|gte:nilai_minimal',
            'satuan' => 'sometimes|string|max:50',
            'sumber_data' => 'nullable|string|max:255',
            'catatan' => 'nullable|string',
        ]);

        $data = $request->except('_method');
        $data['tanggal_update'] = now();

        $value->update($data);

        return response()->json([
            'message' => 'Nilai sampah berhasil diperbarui',
            'waste_value' => new WasteValueResource($value)
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
        $value = WasteValue::findOrFail($id);
        
        $value->delete();

        return response()->json([
            'message' => 'Nilai sampah berhasil dihapus'
        ]);
    }
    
    /**
     * Get value history for a waste type.
     *
     * @param  int  $wasteTypeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getValueHistory($wasteTypeId)
    {
        $values = WasteValue::where('waste_type_id', $wasteTypeId)
            ->orderBy('tanggal_update', 'desc')
            ->get();
            
        return response()->json([
            'waste_type_id' => $wasteTypeId,
            'history' => WasteValueResource::collection($values)
        ]);
    }

    /**
     * Display a listing of waste values for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
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
                $query->orderBy('tanggal_update', $direction);
            }
        } else {
            // Default sort by latest update
            $query->orderBy('tanggal_update', 'desc');
        }
        
        // Get the latest value for each waste type
        $query->whereIn('value_id', function($subquery) {
            $subquery->selectRaw('MAX(value_id)')
                ->from('waste_values')
                ->groupBy('waste_type_id');
        });
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $values = $query->paginate($perPage);
        
        return WasteValueResource::collection($values)
            ->additional([
                'meta' => [
                    'total' => $values->total(),
                    'per_page' => $values->perPage(),
                    'current_page' => $values->currentPage(),
                    'last_page' => $values->lastPage(),
                ],
            ]);
    }
}