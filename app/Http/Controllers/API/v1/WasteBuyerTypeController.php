<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteBuyerTypeResource;
use App\Models\WasteBuyerType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WasteBuyerTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = WasteBuyerType::query();
        
        // Eager loading
        if ($request->has('with_buyers') && $request->with_buyers) {
            $query->with(['buyers' => function($q) {
                $q->where('status', 'AKTIF');
            }]);
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama_tipe', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'nama_tipe');
        $direction = $request->input('direction', 'asc');
        $query->orderBy($sortBy, $direction);
        
        $types = $query->get();
        
        return WasteBuyerTypeResource::collection($types);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Only admin should be able to add buyer types
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menambahkan tipe pembeli sampah'
            ], 403);
        }
        
        $request->validate([
            'nama_tipe' => 'required|string|max:100|unique:waste_buyer_types,nama_tipe',
            'deskripsi' => 'required|string',
            'ikon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $data = $request->except('ikon');

        // Handle file upload
        if ($request->hasFile('ikon')) {
            $file = $request->file('ikon');
            $filename = 'buyer_type_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/buyer_types', $filename);
            $data['ikon'] = 'buyer_types/' . $filename;
        }

        $type = WasteBuyerType::create($data);

        return response()->json([
            'message' => 'Tipe pembeli sampah berhasil dibuat',
            'buyer_type' => new WasteBuyerTypeResource($type)
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
        $query = WasteBuyerType::where('type_id', $id);
        
        // Eager loading
        if ($request->has('with_buyers') && $request->with_buyers) {
            $query->with(['buyers' => function($q) {
                $q->where('status', 'AKTIF');
            }]);
        }
        
        $type = $query->firstOrFail();
        
        return response()->json(new WasteBuyerTypeResource($type));
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
        // Only admin should be able to update buyer types
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk memperbarui tipe pembeli sampah'
            ], 403);
        }
        
        $type = WasteBuyerType::findOrFail($id);
        
        $request->validate([
            'nama_tipe' => 'sometimes|string|max:100|unique:waste_buyer_types,nama_tipe,' . $id . ',type_id',
            'deskripsi' => 'sometimes|string',
            'ikon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $data = $request->except(['ikon', '_method']);

        // Handle file upload
        if ($request->hasFile('ikon')) {
            // Delete old image if exists
            if ($type->ikon) {
                Storage::delete('public/' . $type->ikon);
            }
            
            $file = $request->file('ikon');
            $filename = 'buyer_type_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/buyer_types', $filename);
            $data['ikon'] = 'buyer_types/' . $filename;
        }

        $type->update($data);

        return response()->json([
            'message' => 'Tipe pembeli sampah berhasil diperbarui',
            'buyer_type' => new WasteBuyerTypeResource($type)
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
        // Only admin should be able to delete buyer types
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menghapus tipe pembeli sampah'
            ], 403);
        }
        
        $type = WasteBuyerType::findOrFail($id);
        
        // Check if there are related buyers
        if ($type->buyers()->count() > 0) {
            return response()->json([
                'message' => 'Tipe pembeli sampah tidak dapat dihapus karena masih memiliki pembeli terkait'
            ], 422);
        }
        
        // Delete image if exists
        if ($type->ikon) {
            Storage::delete('public/' . $type->ikon);
        }
        
        $type->delete();

        return response()->json([
            'message' => 'Tipe pembeli sampah berhasil dihapus'
        ]);
    }
    
    /**
     * Display a listing of buyer types for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = WasteBuyerType::query();
        
        // Eager loading with active buyers only
        if ($request->has('with_buyers') && $request->with_buyers) {
            $query->with(['buyers' => function($q) {
                $q->where('status', 'AKTIF');
            }])
            // Only include types that have active buyers
            ->whereHas('buyers', function($q) {
                $q->where('status', 'AKTIF');
            });
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama_tipe', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'nama_tipe');
        $direction = $request->input('direction', 'asc');
        $query->orderBy($sortBy, $direction);
        
        $types = $query->get();
        
        return WasteBuyerTypeResource::collection($types);
    }
} 