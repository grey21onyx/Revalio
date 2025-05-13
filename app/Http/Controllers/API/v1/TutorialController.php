<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TutorialResource;
use App\Models\Tutorial;
use Illuminate\Http\Request;

class TutorialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Tutorial::query();
        
        // Eager loading
        if ($request->has('with_waste_type') && $request->with_waste_type) {
            $query->with('wasteType');
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                  ->orWhere('alat_bahan', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by waste type
        if ($request->has('waste_type_id')) {
            $query->where('waste_type_id', $request->waste_type_id);
        }
        
        // Filter by difficulty level
        if ($request->has('tingkat_kesulitan')) {
            if (is_array($request->tingkat_kesulitan)) {
                $query->whereIn('tingkat_kesulitan', $request->tingkat_kesulitan);
            } else {
                $query->where('tingkat_kesulitan', $request->tingkat_kesulitan);
            }
        }
        
        // Filter by tutorial type
        if ($request->has('tipe_tutorial')) {
            $query->where('tipe_tutorial', $request->tipe_tutorial);
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $tutorials = $query->paginate($perPage);
        
        return TutorialResource::collection($tutorials)
            ->additional([
                'meta' => [
                    'total' => $tutorials->total(),
                    'per_page' => $tutorials->perPage(),
                    'current_page' => $tutorials->currentPage(),
                    'last_page' => $tutorials->lastPage(),
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
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tingkat_kesulitan' => 'required|string|in:MUDAH,SEDANG,SULIT',
            'waktu_pengerjaan' => 'nullable|string|max:50',
            'alat_bahan' => 'required|string',
            'langkah_langkah' => 'required|string',
            'video_url' => 'nullable|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tipe_tutorial' => 'required|string|in:DAUR_ULANG,REUSE,KOMPOS,LAINNYA',
            'waste_type_id' => 'required|exists:waste_types,waste_type_id',
            'status' => 'nullable|string|in:AKTIF,DRAFT,TIDAK_AKTIF',
        ]);

        $data = $request->except('gambar');
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }
        
        $data['tanggal_publikasi'] = now();

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'tutorial_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/tutorials', $filename);
            $data['gambar'] = 'tutorials/' . $filename;
        }

        $tutorial = Tutorial::create($data);

        return response()->json([
            'message' => 'Tutorial berhasil dibuat',
            'tutorial' => new TutorialResource($tutorial)
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
        $query = Tutorial::where('tutorial_id', $id);
        
        // Eager loading
        if ($request->has('with_waste_type') && $request->with_waste_type) {
            $query->with('wasteType');
        }
        
        $tutorial = $query->firstOrFail();
        
        return response()->json(new TutorialResource($tutorial));
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
        $tutorial = Tutorial::findOrFail($id);
        
        $request->validate([
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'tingkat_kesulitan' => 'sometimes|string|in:MUDAH,SEDANG,SULIT',
            'waktu_pengerjaan' => 'nullable|string|max:50',
            'alat_bahan' => 'sometimes|string',
            'langkah_langkah' => 'sometimes|string',
            'video_url' => 'nullable|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tipe_tutorial' => 'sometimes|string|in:DAUR_ULANG,REUSE,KOMPOS,LAINNYA',
            'waste_type_id' => 'sometimes|exists:waste_types,waste_type_id',
            'status' => 'nullable|string|in:AKTIF,DRAFT,TIDAK_AKTIF',
        ]);

        $data = $request->except(['gambar', '_method']);

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'tutorial_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/tutorials', $filename);
            $data['gambar'] = 'tutorials/' . $filename;
        }

        $tutorial->update($data);

        return response()->json([
            'message' => 'Tutorial berhasil diperbarui',
            'tutorial' => new TutorialResource($tutorial)
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
        $tutorial = Tutorial::findOrFail($id);
        
        // Check if tutorial has RecyclableTrait
        if (method_exists($tutorial, 'recycle')) {
            $tutorial->recycle();
            $message = 'Tutorial berhasil dipindahkan ke recycle bin';
        } else {
            $tutorial->delete();
            $message = 'Tutorial berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }
    
    /**
     * Get tutorials by waste type.
     *
     * @param  int  $wasteTypeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByWasteType($wasteTypeId)
    {
        $tutorials = Tutorial::where('waste_type_id', $wasteTypeId)
            ->where('status', 'AKTIF')
            ->orderBy('tanggal_publikasi', 'desc')
            ->get();
            
        return response()->json(TutorialResource::collection($tutorials));
    }

    /**
     * Display a listing of tutorials for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = Tutorial::where('status', 'AKTIF');
        
        // Eager loading with only active waste types
        if ($request->has('with_waste_type') && $request->with_waste_type) {
            $query->with(['wasteType' => function($q) {
                $q->where('status', 'AKTIF');
            }]);
        }
        
        // Filter to only include tutorials for active waste types
        $query->whereHas('wasteType', function($q) {
            $q->where('status', 'AKTIF');
        });
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                  ->orWhere('alat_bahan', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by waste type
        if ($request->has('waste_type_id')) {
            $query->where('waste_type_id', $request->waste_type_id);
        }
        
        // Filter by difficulty level
        if ($request->has('tingkat_kesulitan')) {
            if (is_array($request->tingkat_kesulitan)) {
                $query->whereIn('tingkat_kesulitan', $request->tingkat_kesulitan);
            } else {
                $query->where('tingkat_kesulitan', $request->tingkat_kesulitan);
            }
        }
        
        // Filter by tutorial type
        if ($request->has('tipe_tutorial')) {
            $query->where('tipe_tutorial', $request->tipe_tutorial);
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $tutorials = $query->paginate($perPage);
        
        return TutorialResource::collection($tutorials)
            ->additional([
                'meta' => [
                    'total' => $tutorials->total(),
                    'per_page' => $tutorials->perPage(),
                    'current_page' => $tutorials->currentPage(),
                    'last_page' => $tutorials->lastPage(),
                ],
            ]);
    }
} 