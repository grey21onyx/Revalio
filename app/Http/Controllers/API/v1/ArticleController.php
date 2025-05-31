<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Article::query();
        
        // Eager loading
        if ($request->has('with_author') && $request->with_author) {
            $query->with('author');
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('konten', 'like', "%{$searchTerm}%")
                  ->orWhere('ringkasan', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by category
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }
        
        // Filter by tag
        if ($request->has('tag')) {
            $tag = $request->tag;
            $query->where(function($q) use ($tag) {
                $q->where('tag', 'like', "%{$tag}%")
                  ->orWhere('tag', 'like', "%,{$tag},%")
                  ->orWhere('tag', 'like', "{$tag},%")
                  ->orWhere('tag', 'like', "%,{$tag}");
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $articles = $query->paginate($perPage);
        
        return ArticleResource::collection($articles)
            ->additional([
                'meta' => [
                    'total' => $articles->total(),
                    'per_page' => $articles->perPage(),
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
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
            'konten' => 'required|string',
            'ringkasan' => 'required|string|max:500',
            'gambar_sampul' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tag' => 'nullable|string',
            'kategori' => 'required|string',
            'status' => 'nullable|string|in:PUBLIKASI,DRAFT,TIDAK_AKTIF',
        ]);

        $data = $request->except('gambar_sampul');
        
        if (!isset($data['status'])) {
            $data['status'] = 'PUBLIKASI';
        }
        
        $data['penulis_id'] = $request->user()->user_id;
        $data['tanggal_publikasi'] = now();

        // Handle file upload
        if ($request->hasFile('gambar_sampul')) {
            $file = $request->file('gambar_sampul');
            $filename = 'article_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/articles', $filename);
            $data['gambar_sampul'] = 'articles/' . $filename;
        }

        $article = Article::create($data);

        return response()->json([
            'message' => 'Artikel berhasil dibuat',
            'article' => new ArticleResource($article)
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
        $query = Article::where('article_id', $id);
        
        // Eager loading
        if ($request->has('with_author') && $request->with_author) {
            $query->with('author');
        }
        
        $article = $query->firstOrFail();
        
        return response()->json(new ArticleResource($article));
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
        $article = Article::findOrFail($id);
        
        $request->validate([
            'judul' => 'sometimes|string|max:255',
            'konten' => 'sometimes|string',
            'ringkasan' => 'sometimes|string|max:500',
            'gambar_sampul' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tag' => 'nullable|string',
            'kategori' => 'sometimes|string',
            'status' => 'nullable|string|in:PUBLIKASI,DRAFT,TIDAK_AKTIF',
        ]);

        $data = $request->except(['gambar_sampul', '_method']);

        // Handle file upload
        if ($request->hasFile('gambar_sampul')) {
            // Delete old image if exists
            if ($article->gambar_sampul) {
                Storage::delete('public/' . $article->gambar_sampul);
            }
            
            $file = $request->file('gambar_sampul');
            $filename = 'article_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/articles', $filename);
            $data['gambar_sampul'] = 'articles/' . $filename;
        }

        $article->update($data);

        return response()->json([
            'message' => 'Artikel berhasil diperbarui',
            'article' => new ArticleResource($article)
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
        $article = Article::findOrFail($id);
        
        // Check if article has RecyclableTrait
        if (method_exists($article, 'recycle')) {
            $article->recycle();
            $message = 'Artikel berhasil dipindahkan ke recycle bin';
        } else {
            // Delete image if exists
            if ($article->gambar_sampul) {
                Storage::delete('public/' . $article->gambar_sampul);
            }
            
            $article->delete();
            $message = 'Artikel berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * Display a listing of articles for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = Article::where('status', 'PUBLIKASI');
        
        // Eager loading
        if ($request->has('with_author') && $request->with_author) {
            $query->with('author');
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('konten', 'like', "%{$searchTerm}%")
                  ->orWhere('ringkasan', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by category
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }
        
        // Filter by tag
        if ($request->has('tag')) {
            $tag = $request->tag;
            $query->where(function($q) use ($tag) {
                $q->where('tag', 'like', "%{$tag}%")
                  ->orWhere('tag', 'like', "%,{$tag},%")
                  ->orWhere('tag', 'like', "{$tag},%")
                  ->orWhere('tag', 'like', "%,{$tag}");
            });
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $articles = $query->paginate($perPage);
        
        return ArticleResource::collection($articles)
            ->additional([
                'meta' => [
                    'total' => $articles->total(),
                    'per_page' => $articles->perPage(),
                    'current_page' => $articles->currentPage(),
                    'last_page' => $articles->lastPage(),
                ],
            ]);
    }

    /**
     * Display a listing of articles for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function publicIndex(Request $request)
    {
        try {
            $query = Article::where('status', 'PUBLIKASI');
            
            // Eager loading
            if ($request->has('with_author') && $request->with_author) {
                $query->with('author');
            }
            
            // Search
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('judul', 'like', "%{$searchTerm}%")
                      ->orWhere('konten', 'like', "%{$searchTerm}%")
                      ->orWhere('ringkasan', 'like', "%{$searchTerm}%");
                });
            }
            
            // Filter by category
            if ($request->has('kategori')) {
                $query->where('kategori', $request->kategori);
            }
            
            // Filter by related waste type
            if ($request->has('related_to_waste')) {
                $wasteId = $request->related_to_waste;
                $query->where(function($q) use ($wasteId) {
                    $q->where('waste_id', $wasteId)
                      ->orWhere('related_waste_ids', 'like', "%{$wasteId}%")
                      ->orWhere('tags', 'like', '%sampah%'); // Fallback jika tidak ada yang terkait langsung
                });
            }
            
            // Filter by tag
            if ($request->has('tag')) {
                $tag = $request->tag;
                $query->where(function($q) use ($tag) {
                    $q->where('tag', 'like', "%{$tag}%")
                      ->orWhere('tag', 'like', "%,{$tag},%")
                      ->orWhere('tag', 'like', "{$tag},%")
                      ->orWhere('tag', 'like', "%,{$tag}");
                });
            }
            
            // Sort
            $sortBy = $request->input('sort_by', 'tanggal_publikasi');
            $direction = $request->input('direction', 'desc');
            $query->orderBy($sortBy, $direction);
            
            // Pagination
            $perPage = $request->input('per_page', 15);
            $articles = $query->paginate($perPage);
            
            return ArticleResource::collection($articles)
                ->additional([
                    'meta' => [
                        'total' => $articles->total(),
                        'per_page' => $articles->perPage(),
                        'current_page' => $articles->currentPage(),
                        'last_page' => $articles->lastPage(),
                    ],
                ]);
        } catch (\Exception $e) {
            \Log::error('Error in publicIndex: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Return empty data with 200 status code instead of 500 error
            return response()->json([
                'data' => [],
                'meta' => [
                    'total' => 0,
                    'per_page' => 15,
                    'current_page' => 1,
                    'last_page' => 1,
                ],
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Tidak dapat memuat data artikel'
            ], 200);
        }
    }
    
    /**
     * Display article details for public access
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function publicShow(Request $request, $id)
    {
        try {
            $query = Article::where('article_id', $id)
                           ->where('status', 'PUBLIKASI');
            
            // Eager loading
            if ($request->has('with_author') && $request->with_author) {
                $query->with('author');
            }
            
            $article = $query->firstOrFail();
            
            return response()->json(new ArticleResource($article));
        } catch (\Exception $e) {
            \Log::error('Error in publicShow: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Artikel tidak ditemukan atau tidak tersedia'
            ], 404);
        }
    }
} 