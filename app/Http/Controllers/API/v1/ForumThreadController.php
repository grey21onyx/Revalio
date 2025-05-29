<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumThreadResource;
use App\Models\ForumThread;
use App\Models\ForumLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ForumThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = ForumThread::with(['user'])
            ->withCount('comments')
            ->where('status', 'AKTIF');
        
        // Filter by category (tags)
        if ($request->has('tags')) {
            $tags = explode(',', $request->tags);
            foreach($tags as $tag) {
                $query->withTag($tag);
            }
        }
        
        // Search by title/content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('konten', 'like', "%{$search}%");
            });
        }
        
        // Sort
        $sortField = $request->input('sort_by', 'tanggal_posting');
        $sortOrder = $request->input('sort_order', 'desc');
        
        if ($sortField === 'comments') {
            $query->orderBy('comments_count', $sortOrder);
        } elseif ($sortField === 'likes') {
            $query->withCount('likes')
                  ->orderBy('likes_count', $sortOrder);
        } else {
            $query->orderBy($sortField, $sortOrder);
        }
        
        $perPage = $request->input('per_page', 15);
        $threads = $query->paginate($perPage);
        
        // Attach additional information for authenticated users
        if (Auth::check()) {
            $userId = Auth::id();
            foreach ($threads->items() as $thread) {
                $thread->is_liked = $thread->likes()->where('user_id', $userId)->exists();
            }
        }
        
        return ForumThreadResource::collection($threads)
            ->additional([
                'meta' => [
                    'total' => $threads->total(),
                    'per_page' => $threads->perPage(),
                    'current_page' => $threads->currentPage(),
                    'last_page' => $threads->lastPage(),
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
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $request->validate([
            'judul' => 'required|string|max:100',
            'konten' => 'required|string|max:10000',
            'tags' => 'nullable|string|max:255',
        ]);
        
        $userId = Auth::id();
        
        $thread = ForumThread::create([
            'user_id' => $userId,
            'judul' => $request->judul,
            'konten' => $request->konten,
            'tags' => $request->tags,
            'tanggal_posting' => now(),
            'status' => 'AKTIF',
            'view_count' => 0,
        ]);
        
        return response()->json([
            'message' => 'Thread berhasil dibuat',
            'thread' => new ForumThreadResource($thread)
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        try {
            $thread = ForumThread::with(['user'])->withCount('comments')->findOrFail($id);
            
            try {
                // Increment view count langsung di tabel forum_threads
                DB::table('forum_threads')
                    ->where('thread_id', $id)
                    ->increment('view_count');
            } catch (\Exception $e) {
                // Log error tapi jangan kembali response error
                Log::error("Error incrementing view count: " . $e->getMessage());
                // Coba cara alternatif untuk increment view_count
                try {
                    // Update langsung menggunakan model
                    $thread->view_count = ($thread->view_count ?? 0) + 1;
                    $thread->save();
                } catch (\Exception $e2) {
                    Log::error("Alternative view count increment also failed: " . $e2->getMessage());
                    // Lanjutkan meskipun gagal incrementing view count
                }
            }
            
            // Add is_liked property for authenticated users
            if (Auth::check()) {
                $userId = Auth::id();
                try {
                    $thread->is_liked = $thread->likes()->where('user_id', $userId)->exists();
                } catch (\Exception $e) {
                    Log::error("Error checking likes: " . $e->getMessage());
                    $thread->is_liked = false;
                }
            } else {
                $thread->is_liked = false;
            }
            
            return response()->json([
                'thread' => new ForumThreadResource($thread)
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching thread detail: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal memuat thread',
                'error' => $e->getMessage()
            ], 500);
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
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        try {
            $thread = ForumThread::findOrFail($id);
            
            // Check if user is authorized to update this thread
            if (Auth::id() !== $thread->user_id && Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            
            $request->validate([
                'judul' => 'sometimes|required|string|max:100',
                'konten' => 'sometimes|required|string|max:10000',
                'tags' => 'nullable|string|max:255',
                'status' => 'sometimes|string|in:AKTIF,NONAKTIF',
            ]);
            
            $data = $request->only(['judul', 'konten', 'tags', 'status']);
            
            // Only admins can change status
            if (isset($data['status']) && Auth::user()->role !== 'admin') {
                unset($data['status']);
            }
            
            $thread->update($data);
            
            return response()->json([
                'message' => 'Thread berhasil diperbarui',
                'thread' => new ForumThreadResource($thread)
            ]);
        } catch (\Exception $e) {
            Log::error("Error updating thread {$id}: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal memperbarui thread',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        try {
            // Tambahkan log untuk debugging
            Log::info("Attempting to delete thread ID: {$id} by user: " . Auth::id());
            
            $thread = ForumThread::findOrFail($id);
            
            // Check if user is authorized to delete this thread
            if (Auth::id() !== $thread->user_id && Auth::user()->role !== 'admin') {
                Log::warning("Unauthorized delete attempt on thread {$id} by user " . Auth::id());
                return response()->json(['message' => 'Forbidden'], 403);
            }
            
            // Set thread status to NONAKTIF (sesuai enum di database) instead of hard delete
            $thread->status = 'NONAKTIF';
            $result = $thread->save();
            
            // Log the result for debugging
            Log::info("Thread {$id} deletion result: " . ($result ? 'success' : 'failed'));
            
            if (!$result) {
                return response()->json([
                    'message' => 'Gagal menghapus thread',
                    'error' => 'Database update failed'
                ], 500);
            }
            
            return response()->json([
                'message' => 'Thread berhasil dihapus',
                'thread_id' => $id
            ]);
            
        } catch (\Exception $e) {
            Log::error("Error deleting thread {$id}: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Gagal menghapus thread',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle like for a forum thread
     *
     * @param  Request $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleLike(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $user = Auth::user();
        $thread = ForumThread::findOrFail($id);
        
        try {
            if ($thread->isLikedBy($user)) {
                $thread->unlike($user);
                $message = 'Like berhasil dihapus';
                $isLiked = false;
            } else {
                $thread->like($user);
                $message = 'Thread berhasil disukai';
                $isLiked = true;
            }
            
            // Get updated like count
            $thread->loadCount('likes');
            $likesCount = $thread->likes_count ?? 0;
        } catch (\Exception $e) {
            Log::error("Error toggling like: " . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses like',
                'error' => $e->getMessage()
            ], 500);
        }
        
        return response()->json([
            'message' => $message,
            'is_liked' => $isLiked,
            'likes_count' => $likesCount
        ]);
    }

    /**
     * Display a listing of public forum threads.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function public(Request $request)
    {
        $query = ForumThread::aktif()->with(['user'])->withCount('comments');
        
        // Filter by category (tags)
        if ($request->has('tags')) {
            $tags = explode(',', $request->tags);
            foreach($tags as $tag) {
                $query->withTag($tag);
            }
        }
        
        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('konten', 'like', "%{$search}%");
            });
        }
        
        // Sort
        $sortField = $request->input('sort_by', 'tanggal_posting');
        $sortOrder = $request->input('sort_order', 'desc');
        
        if ($sortField === 'comments') {
            $query->orderBy('comments_count', $sortOrder);
        } elseif ($sortField === 'likes') {
            $query->withCount('likes')
                  ->orderBy('likes_count', $sortOrder);
        } else {
            $query->orderBy($sortField, $sortOrder);
        }
        
        $perPage = $request->input('per_page', 15);
        $threads = $query->paginate($perPage);
        
        return ForumThreadResource::collection($threads)
            ->additional([
                'meta' => [
                    'total' => $threads->total(),
                    'per_page' => $threads->perPage(),
                    'current_page' => $threads->currentPage(),
                    'last_page' => $threads->lastPage(),
                ]
            ]);
    }

    /**
     * Get popular forum threads.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function popular(Request $request)
    {
        $limit = $request->input('limit', 5);
        $timeFrame = $request->input('time_frame', 'week'); // day, week, month, all
        
        $query = ForumThread::aktif()
            ->with(['user'])
            ->withCount(['comments', 'likes']);
        
        // Apply time frame filter
        if ($timeFrame !== 'all') {
            $date = now();
            switch ($timeFrame) {
                case 'day':
                    $date = $date->subDay();
                    break;
                case 'week':
                    $date = $date->subWeek();
                    break;
                case 'month':
                    $date = $date->subMonth();
                    break;
            }
            
            $query->where('tanggal_posting', '>=', $date);
        }
        
        // Define a popularity score based on views, comments, and likes
        // Can be adjusted based on business requirements
        $threads = $query->orderByRaw('(view_count * 1 + comments_count * 3 + likes_count * 5) DESC')
            ->limit($limit)
            ->get();
        
        return ForumThreadResource::collection($threads);
    }

    /**
     * Get forum threads created by the authenticated user
     * 
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function myThreads(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userId = Auth::id();
        
        $query = ForumThread::with(['user'])
            ->withCount('comments')
            ->where('user_id', $userId)
            ->where('status', ForumThread::STATUS_AKTIF)
            ->orderBy('tanggal_posting', 'desc');
        
        $perPage = $request->input('per_page', 10);
        $threads = $query->paginate($perPage);
        
        return ForumThreadResource::collection($threads)
            ->additional([
                'meta' => [
                    'total' => $threads->total(),
                    'per_page' => $threads->perPage(),
                    'current_page' => $threads->currentPage(),
                    'last_page' => $threads->lastPage(),
                ]
            ]);
    }
    
    /**
     * Get comments posted by the authenticated user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function myComments(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userId = Auth::id();
        
        try {
            // Get comments with their thread information
            $comments = \App\Models\ForumComment::with(['thread', 'thread.user'])
                ->where('user_id', $userId)
                ->orderBy('tanggal_komentar', 'desc')
                ->paginate(10);
            
            // Format the response
            return response()->json([
                'data' => $comments->items(),
                'meta' => [
                    'total' => $comments->total(),
                    'per_page' => $comments->perPage(),
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memuat komentar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 