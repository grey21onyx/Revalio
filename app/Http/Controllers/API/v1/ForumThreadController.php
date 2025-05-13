<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumThreadResource;
use App\Models\ForumThread;
use App\Models\ForumLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ForumThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = ForumThread::query();
        
        // Eager loading
        $relations = [];
        if ($request->has('with_user') && $request->with_user) {
            $relations[] = 'user';
        }
        if ($request->has('with_comments') && $request->with_comments) {
            $relations[] = 'comments';
        }
        
        if (!empty($relations)) {
            $query->with($relations);
        }
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('konten', 'like', "%{$searchTerm}%");
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
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        // Count related
        if ($request->has('with_counts') && $request->with_counts) {
            $query->withCount(['likes', 'comments']);
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_posting');
        $direction = $request->input('direction', 'desc');
        
        if ($sortBy === 'popular') {
            $query->withCount('likes')->orderBy('likes_count', 'desc');
        } else if ($sortBy === 'most_comments') {
            $query->withCount('comments')->orderBy('comments_count', 'desc');
        } else {
            $query->orderBy($sortBy, $direction);
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $threads = $query->paginate($perPage);
        
        return ForumThreadResource::collection($threads)
            ->additional([
                'meta' => [
                    'total' => $threads->total(),
                    'per_page' => $threads->perPage(),
                    'current_page' => $threads->currentPage(),
                    'last_page' => $threads->lastPage(),
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
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'kategori' => 'required|string',
            'tag' => 'nullable|string',
            'status' => 'nullable|string|in:AKTIF,TERVERIFIKASI,DITOLAK,SPAM',
        ]);

        $data = $request->except('gambar');
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }
        
        $data['user_id'] = $request->user()->user_id;
        $data['tanggal_posting'] = now();

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'thread_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/threads', $filename);
            $data['gambar'] = 'threads/' . $filename;
        }

        $thread = ForumThread::create($data);

        // Load the thread with user and counts
        $thread->load('user');
        $thread->loadCount(['likes', 'comments']);

        return response()->json([
            'message' => 'Thread forum berhasil dibuat',
            'thread' => new ForumThreadResource($thread)
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
        $query = ForumThread::where('thread_id', $id);
        
        // Eager loading
        $relations = ['user'];
        if ($request->has('with_comments') && $request->with_comments) {
            $relations[] = 'comments.user';
            $relations[] = 'comments.replies.user';
        }
        
        $query->with($relations);
        
        // Count related
        $query->withCount(['likes', 'comments']);
        
        $thread = $query->firstOrFail();
        
        // Check if user has liked this thread
        if ($request->user()) {
            $thread->user_has_liked = ForumLike::where('user_id', $request->user()->user_id)
                ->where('thread_id', $thread->thread_id)
                ->exists();
        } else {
            $thread->user_has_liked = false;
        }
        
        return response()->json(new ForumThreadResource($thread));
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
        $thread = ForumThread::findOrFail($id);
        
        // Check if user is authorized to update
        if ($request->user()->user_id !== $thread->user_id && !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk mengedit thread ini'
            ], 403);
        }
        
        $request->validate([
            'judul' => 'sometimes|string|max:255',
            'konten' => 'sometimes|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'kategori' => 'sometimes|string',
            'tag' => 'nullable|string',
            'status' => 'nullable|string|in:AKTIF,TERVERIFIKASI,DITOLAK,SPAM',
        ]);

        $data = $request->except(['gambar', '_method']);

        // Handle file upload
        if ($request->hasFile('gambar')) {
            // Delete old image if exists
            if ($thread->gambar) {
                Storage::delete('public/' . $thread->gambar);
            }
            
            $file = $request->file('gambar');
            $filename = 'thread_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/threads', $filename);
            $data['gambar'] = 'threads/' . $filename;
        }

        $thread->update($data);

        // Reload the thread with user and counts
        $thread->load('user');
        $thread->loadCount(['likes', 'comments']);

        return response()->json([
            'message' => 'Thread forum berhasil diperbarui',
            'thread' => new ForumThreadResource($thread)
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
        $thread = ForumThread::findOrFail($id);
        
        // Check if user is authorized to delete
        if ($request->user()->user_id !== $thread->user_id && !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menghapus thread ini'
            ], 403);
        }
        
        // Check if thread has RecyclableTrait
        if (method_exists($thread, 'recycle')) {
            $thread->recycle();
            $message = 'Thread forum berhasil dipindahkan ke recycle bin';
        } else {
            // Delete image if exists
            if ($thread->gambar) {
                Storage::delete('public/' . $thread->gambar);
            }
            
            $thread->delete();
            $message = 'Thread forum berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }
    
    /**
     * Like or unlike a thread.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleLike(Request $request, $id)
    {
        $thread = ForumThread::findOrFail($id);
        $userId = $request->user()->user_id;
        
        $existingLike = ForumLike::where('thread_id', $id)
            ->where('user_id', $userId)
            ->first();
            
        if ($existingLike) {
            $existingLike->delete();
            $message = 'Like dibatalkan';
            $liked = false;
        } else {
            ForumLike::create([
                'thread_id' => $id,
                'user_id' => $userId,
                'tanggal_like' => now()
            ]);
            $message = 'Thread disukai';
            $liked = true;
        }
        
        // Get updated like count
        $likeCount = ForumLike::where('thread_id', $id)->count();
        
        return response()->json([
            'message' => $message,
            'liked' => $liked,
            'likes_count' => $likeCount
        ]);
    }
    
    /**
     * Display a listing of threads for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = ForumThread::where('status', 'AKTIF')
            ->orWhere('status', 'TERVERIFIKASI');
        
        // Eager loading
        $relations = ['user'];
        if ($request->has('with_comments') && $request->with_comments) {
            $relations[] = 'comments.user';
        }
        
        $query->with($relations);
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('konten', 'like', "%{$searchTerm}%");
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
        
        // Count related
        $query->withCount(['likes', 'comments']);
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_posting');
        $direction = $request->input('direction', 'desc');
        
        if ($sortBy === 'popular') {
            $query->orderBy('likes_count', 'desc');
        } else if ($sortBy === 'most_comments') {
            $query->orderBy('comments_count', 'desc');
        } else {
            $query->orderBy($sortBy, $direction);
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $threads = $query->paginate($perPage);
        
        return ForumThreadResource::collection($threads)
            ->additional([
                'meta' => [
                    'total' => $threads->total(),
                    'per_page' => $threads->perPage(),
                    'current_page' => $threads->currentPage(),
                    'last_page' => $threads->lastPage(),
                ],
            ]);
    }
    
    /**
     * Get popular threads for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function popular(Request $request)
    {
        $query = ForumThread::where(function($q) {
                $q->where('status', 'AKTIF')
                  ->orWhere('status', 'TERVERIFIKASI');
            })
            ->with('user')
            ->withCount(['likes', 'comments'])
            ->orderBy('likes_count', 'desc');
        
        // Limit
        $limit = $request->input('limit', 5);
        $threads = $query->limit($limit)->get();
        
        return response()->json([
            'data' => ForumThreadResource::collection($threads)
        ]);
    }
} 