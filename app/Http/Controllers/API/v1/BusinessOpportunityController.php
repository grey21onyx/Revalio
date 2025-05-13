<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessOpportunityResource;
use App\Models\BusinessOpportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by investment range
        if ($request->has('min_investment')) {
            $query->where('investasi_minimal', '>=', $request->min_investment);
        }
        
        if ($request->has('max_investment')) {
            $query->where('investasi_maksimal', '<=', $request->max_investment);
        }
        
        // Filter by waste type
        if ($request->has('waste_type')) {
            $wasteType = $request->waste_type;
            $query->where(function($q) use ($wasteType) {
                $q->where('jenis_sampah_terkait', 'like', "%{$wasteType}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType}");
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
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
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menambahkan peluang bisnis'
            ], 403);
        }
        
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'jenis_sampah_terkait' => 'required|string',
            'investasi_minimal' => 'required|numeric|min:0',
            'investasi_maksimal' => 'required|numeric|min:0|gte:investasi_minimal',
            'potensi_keuntungan' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'sumber_informasi' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
        ]);

        $data = $request->except('gambar');
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }
        
        $data['tanggal_publikasi'] = now();

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'opportunity_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/opportunities', $filename);
            $data['gambar'] = 'opportunities/' . $filename;
        }

        $opportunity = BusinessOpportunity::create($data);

        return response()->json([
            'message' => 'Peluang bisnis berhasil dibuat',
            'opportunity' => new BusinessOpportunityResource($opportunity)
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
        $opportunity = BusinessOpportunity::findOrFail($id);
        
        return response()->json(new BusinessOpportunityResource($opportunity));
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
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk memperbarui peluang bisnis'
            ], 403);
        }
        
        $opportunity = BusinessOpportunity::findOrFail($id);
        
        $request->validate([
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'jenis_sampah_terkait' => 'sometimes|string',
            'investasi_minimal' => 'sometimes|numeric|min:0',
            'investasi_maksimal' => 'sometimes|numeric|min:0|gte:investasi_minimal',
            'potensi_keuntungan' => 'sometimes|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'sumber_informasi' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
        ]);

        $data = $request->except(['gambar', '_method']);

        // Handle file upload
        if ($request->hasFile('gambar')) {
            // Delete old image if exists
            if ($opportunity->gambar) {
                Storage::delete('public/' . $opportunity->gambar);
            }
            
            $file = $request->file('gambar');
            $filename = 'opportunity_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/opportunities', $filename);
            $data['gambar'] = 'opportunities/' . $filename;
        }

        $opportunity->update($data);

        return response()->json([
            'message' => 'Peluang bisnis berhasil diperbarui',
            'opportunity' => new BusinessOpportunityResource($opportunity)
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
        // Only admin should be able to delete business opportunities
        if (!$request->user()->is_admin) {
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
                Storage::delete('public/' . $opportunity->gambar);
            }
            
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
        $query = BusinessOpportunity::where('status', 'AKTIF');
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by investment range
        if ($request->has('min_investment')) {
            $query->where('investasi_minimal', '>=', $request->min_investment);
        }
        
        if ($request->has('max_investment')) {
            $query->where('investasi_maksimal', '<=', $request->max_investment);
        }
        
        // Filter by waste type
        if ($request->has('waste_type')) {
            $wasteType = $request->waste_type;
            $query->where(function($q) use ($wasteType) {
                $q->where('jenis_sampah_terkait', 'like', "%{$wasteType}%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "{$wasteType},%")
                  ->orWhere('jenis_sampah_terkait', 'like', "%,{$wasteType}");
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
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
} 