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
        $query = ForumThread::with(['user', 'comments'])
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
            $query->withCount('comments')
                  ->orderBy('comments_count', $sortOrder);
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
            $threads->getCollection()->transform(function($thread) use ($userId) {
                $thread->is_liked = $thread->likes()->where('user_id', $userId)->exists();
                return $thread;
            });
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
        $thread = ForumThread::with(['user'])->findOrFail($id);
        
        // Increment view count
        $thread->increment('view_count');
        
        // Add is_liked property for authenticated users
        if (Auth::check()) {
            $userId = Auth::id();
            $thread->is_liked = $thread->likes()->where('user_id', $userId)->exists();
        } else {
            $thread->is_liked = false;
        }
        
        return response()->json([
            'thread' => new ForumThreadResource($thread)
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
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $thread = ForumThread::findOrFail($id);
        
        // Check if user is authorized to update this thread
        if (Auth::id() !== $thread->user_id && !Auth::user()->isadmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        $request->validate([
            'judul' => 'sometimes|required|string|max:100',
            'konten' => 'sometimes|required|string|max:10000',
            'tags' => 'nullable|string|max:255',
            'status' => 'sometimes|string|in:AKTIF,TIDAK_AKTIF',
        ]);
        
        $data = $request->only(['judul', 'konten', 'tags', 'status']);
        
        if (isset($data['status']) && !Auth::user()->isadmin()) {
            unset($data['status']); // Only admins can change status
        }
        
        $thread->update($data);
        
        return response()->json([
            'message' => 'Thread berhasil diperbarui',
            'thread' => new ForumThreadResource($thread)
        ]);
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
        
        $thread = ForumThread::findOrFail($id);
        
        // Check if user is authorized to delete this thread
        if (Auth::id() !== $thread->user_id && !Auth::user()->isadmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        // Set thread status to TIDAK_AKTIF instead of hard delete
        $thread->update(['status' => 'TIDAK_AKTIF']);
        
        return response()->json([
            'message' => 'Thread berhasil dihapus'
        ]);
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
        
        return response()->json([
            'message' => $message,
            'is_liked' => $isLiked,
            'likes_count' => $thread->likes_count
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
        $query = ForumThread::aktif()->with(['user']);
        
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
            $query->withCount('comments')
                  ->orderBy('comments_count', $sortOrder);
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
} 