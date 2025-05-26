<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessOpportunityResource;
use App\Models\BusinessOpportunity;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class BusinessOpportunityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = BusinessOpportunity::query();
        
        // Filter: Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter: Status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter: Investment range
        if ($request->has('min_investment')) {
            $query->where('investasi_minimal', '>=', $request->min_investment);
        }
        
        if ($request->has('max_investment')) {
            $query->where('investasi_maksimal', '<=', $request->max_investment);
        }
        
        // Filter: Waste type
        if ($request->has('waste_type')) {
            $wasteType = $request->waste_type;
            $query->where(function($q) use ($wasteType) {
                $q->where('jenis_sampah_terkait', 'like', "%{$wasteType}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType}");
            })
            ->orWhereHas('wasteTypes', function($q) use ($wasteType) {
                $q->where('waste_type', 'like', "%{$wasteType}%");
            });
        }
        
        // Filter: By specific waste type ID
        if ($request->has('waste_id')) {
            $query->whereHas('wasteTypes', function($q) use ($request) {
                $q->where('waste_types.waste_id', $request->waste_id);
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $validSortFields = ['judul', 'tanggal_publikasi', 'investasi_minimal', 'investasi_maksimal'];
        
        if (in_array($sortBy, $validSortFields)) {
            $query->orderBy($sortBy, $direction);
        } else {
            $query->orderBy('tanggal_publikasi', 'desc');
        }
        
        // Eager load waste types
        $query->with('wasteTypes');
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $opportunities = $query->paginate($perPage);
        
        return BusinessOpportunityResource::collection($opportunities)
            ->additional([
                'meta' => [
                    'total' => $opportunities->total(),
                    'per_page' => $opportunities->perPage(),
                    'current_page' => $opportunities->currentPage(),
                    'last_page' => $opportunities->lastPage(),
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
        // Only admin should be able to add business opportunities
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menambahkan peluang bisnis'
            ], 403);
        }
        
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'jenis_sampah_terkait' => 'nullable|string',
            'investasi_minimal' => 'required|numeric|min:0',
            'investasi_maksimal' => 'required|numeric|min:0|gte:investasi_minimal',
            'potensi_keuntungan' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'sumber_informasi' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
            'waste_types' => 'nullable|array',
            'waste_types.*' => 'exists:waste_types,waste_id',
        ]);

        $data = $request->except(['gambar', 'waste_types']);
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }
        
        $data['tanggal_publikasi'] = now();

        DB::beginTransaction();
        
        try {
            // Handle file upload
            if ($request->hasFile('gambar')) {
                $file = $request->file('gambar');
                $filename = 'opportunity_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('opportunities', $filename, 'public');
                $data['gambar'] = $path;
            }

            $opportunity = BusinessOpportunity::create($data);
            
            // Sync waste types
            if ($request->has('waste_types') && is_array($request->waste_types)) {
                $opportunity->wasteTypes()->sync($request->waste_types);
            }
            
            DB::commit();
            
            // Reload with waste types
            $opportunity->load('wasteTypes');
            
            return response()->json([
                'message' => 'Peluang bisnis berhasil dibuat',
                'data' => new BusinessOpportunityResource($opportunity)
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Gagal membuat peluang bisnis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $opportunity = BusinessOpportunity::with('wasteTypes')->findOrFail($id);
        
        return response()->json([
            'data' => new BusinessOpportunityResource($opportunity)
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
        // Only admin should be able to update business opportunities
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk memperbarui peluang bisnis'
            ], 403);
        }
        
        $opportunity = BusinessOpportunity::findOrFail($id);
        
        $request->validate([
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'jenis_sampah_terkait' => 'nullable|string',
            'investasi_minimal' => 'sometimes|numeric|min:0',
            'investasi_maksimal' => 'sometimes|numeric|min:0|gte:investasi_minimal',
            'potensi_keuntungan' => 'sometimes|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'sumber_informasi' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
            'waste_types' => 'nullable|array',
            'waste_types.*' => 'exists:waste_types,waste_id',
        ]);

        $data = $request->except(['gambar', '_method', 'waste_types']);
        
        DB::beginTransaction();
        
        try {
            // Handle file upload
            if ($request->hasFile('gambar')) {
                // Delete old image if exists
                if ($opportunity->gambar) {
                    Storage::disk('public')->delete($opportunity->gambar);
                }
                
                $file = $request->file('gambar');
                $filename = 'opportunity_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('opportunities', $filename, 'public');
                $data['gambar'] = $path;
            }

            $opportunity->update($data);
            
            // Sync waste types if provided
            if ($request->has('waste_types') && is_array($request->waste_types)) {
                $opportunity->wasteTypes()->sync($request->waste_types);
            }
            
            DB::commit();
            
            // Reload with waste types
            $opportunity->load('wasteTypes');

            return response()->json([
                'message' => 'Peluang bisnis berhasil diperbarui',
                'data' => new BusinessOpportunityResource($opportunity)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Gagal memperbarui peluang bisnis',
                'error' => $e->getMessage()
            ], 500);
        }
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
        // Only admin should be able to delete business opportunities
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menghapus peluang bisnis'
            ], 403);
        }
        
        $opportunity = BusinessOpportunity::findOrFail($id);
        
        // Check if opportunity has RecyclableTrait
        if (method_exists($opportunity, 'recycle')) {
            $opportunity->recycle();
            $message = 'Peluang bisnis berhasil dipindahkan ke recycle bin';
        } else {
            // Delete image if exists
            if ($opportunity->gambar) {
                Storage::disk('public')->delete($opportunity->gambar);
            }
            
            // Delete related waste types
            $opportunity->wasteTypes()->detach();
            
            $opportunity->delete();
            $message = 'Peluang bisnis berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }
    
    /**
     * Display a listing of business opportunities for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = BusinessOpportunity::with('wasteTypes')->where('status', 'AKTIF');
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter: Investment range
        if ($request->has('min_investment')) {
            $query->where('investasi_minimal', '>=', $request->min_investment);
        }
        
        if ($request->has('max_investment')) {
            $query->where('investasi_maksimal', '<=', $request->max_investment);
        }
        
        // Filter: Waste type
        if ($request->has('waste_type')) {
            $wasteType = $request->waste_type;
            $query->where(function($q) use ($wasteType) {
                $q->where('jenis_sampah_terkait', 'like', "%{$wasteType}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType}");
            })
            ->orWhereHas('wasteTypes', function($q) use ($wasteType) {
                $q->where('waste_type', 'like', "%{$wasteType}%");
            });
        }
        
        // Filter: By specific waste type ID
        if ($request->has('waste_id')) {
            $query->whereHas('wasteTypes', function($q) use ($request) {
                $q->where('waste_types.waste_id', $request->waste_id);
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $validSortFields = ['judul', 'tanggal_publikasi', 'investasi_minimal', 'investasi_maksimal'];
        
        if (in_array($sortBy, $validSortFields)) {
            $query->orderBy($sortBy, $direction);
        } else {
            $query->orderBy('tanggal_publikasi', 'desc');
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $opportunities = $query->paginate($perPage);
        
        return BusinessOpportunityResource::collection($opportunities)
            ->additional([
                'meta' => [
                    'total' => $opportunities->total(),
                    'per_page' => $opportunities->perPage(),
                    'current_page' => $opportunities->currentPage(),
                    'last_page' => $opportunities->lastPage(),
                ],
            ]);
    }
    
    /**
     * Get all distinct waste types from business opportunities.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWasteTypes()
    {
        $wasteTypes = WasteType::whereHas('businessOpportunities', function($q) {
            $q->where('status', 'AKTIF');
        })->get();
        
        return response()->json([
            'waste_types' => $wasteTypes
        ]);
    }
    
    /**
     * Get investment range (min and max) from business opportunities.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInvestmentRange()
    {
        $minInvestment = BusinessOpportunity::where('status', 'AKTIF')->min('investasi_minimal');
        $maxInvestment = BusinessOpportunity::where('status', 'AKTIF')->max('investasi_maksimal');
        
        return response()->json([
            'min_investment' => $minInvestment ?? 0,
            'max_investment' => $maxInvestment ?? 0
        ]);
    }
} 