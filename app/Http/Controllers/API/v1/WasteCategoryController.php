<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WasteCategoryResource;
use App\Models\WasteCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WasteCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = WasteCategory::query();
        
        // Eager loading
        if ($request->has('with_waste_types') && $request->with_waste_types) {
            $query->with('wasteTypes');
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama_kategori', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $categories = $query->paginate($perPage);
        
        return WasteCategoryResource::collection($categories)
            ->additional([
                'meta' => [
                    'total' => $categories->total(),
                    'per_page' => $categories->perPage(),
                    'current_page' => $categories->currentPage(),
                    'last_page' => $categories->lastPage(),
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
            'nama_kategori' => 'required|string|max:255|unique:waste_categories',
            'deskripsi' => 'nullable|string',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
            'ikon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $data = $request->except('ikon');
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }

        // Handle file upload
        if ($request->hasFile('ikon')) {
            $file = $request->file('ikon');
            $filename = 'category_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/categories', $filename);
            $data['ikon'] = 'categories/' . $filename;
        }

        $category = WasteCategory::create($data);

        return response()->json([
            'message' => 'Kategori sampah berhasil dibuat',
            'waste_category' => new WasteCategoryResource($category)
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
        $query = WasteCategory::where('kategori_id', $id);
        
        // Eager loading
        if ($request->has('with_waste_types') && $request->with_waste_types) {
            $query->with('wasteTypes');
        }
        
        $category = $query->firstOrFail();
        
        return response()->json(new WasteCategoryResource($category));
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
        $category = WasteCategory::findOrFail($id);
        
        $request->validate([
            'nama_kategori' => 'sometimes|string|max:255|unique:waste_categories,nama_kategori,' . $id . ',kategori_id',
            'deskripsi' => 'nullable|string',
            'status' => 'nullable|string|in:AKTIF,TIDAK_AKTIF',
            'ikon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $data = $request->except(['ikon', '_method']);
        
        // Handle file upload
        if ($request->hasFile('ikon')) {
            $file = $request->file('ikon');
            $filename = 'category_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/categories', $filename);
            $data['ikon'] = 'categories/' . $filename;
        }

        $category->update($data);

        return response()->json([
            'message' => 'Kategori sampah berhasil diperbarui',
            'waste_category' => new WasteCategoryResource($category)
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
        $category = WasteCategory::findOrFail($id);
        
        // Check if there are related waste types
        if ($category->wasteTypes()->count() > 0) {
            return response()->json([
                'message' => 'Kategori sampah tidak dapat dihapus karena masih memiliki jenis sampah terkait'
            ], 422);
        }
        
        // Check if category has RecyclableTrait
        if (method_exists($category, 'recycle')) {
            $category->recycle();
            $message = 'Kategori sampah berhasil dipindahkan ke recycle bin';
        } else {
            $category->delete();
            $message = 'Kategori sampah berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * Display a listing of waste categories for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = WasteCategory::query();
        
        // Eager loading
        if ($request->has('with_waste_types') && $request->with_waste_types) {
            $query->with(['wasteTypes']);
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama_kategori', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
            });
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $categories = $query->paginate($perPage);
        
        return WasteCategoryResource::collection($categories)
            ->additional([
                'meta' => [
                    'total' => $categories->total(),
                    'per_page' => $categories->perPage(),
                    'current_page' => $categories->currentPage(),
                    'last_page' => $categories->lastPage(),
                ],
            ]);
    }
} 