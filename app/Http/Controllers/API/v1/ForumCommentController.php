<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumCommentResource;
use App\Models\ForumComment;
use App\Models\ForumThread;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ForumCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     * @param  int  $threadId
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request, $threadId)
    {
        // Check if thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        $query = ForumComment::with(['user'])
            ->where('thread_id', $threadId)
            ->where('status', 'AKTIF')
            ->whereNull('parent_komentar_id'); // Hanya komentar tingkat atas
        
        // Sorting
        $sortField = $request->input('sort_by', 'tanggal_komentar');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortField, $sortOrder);
        
        // Pagination
        $perPage = $request->input('per_page', 20);
        $comments = $query->paginate($perPage);
        
        // Load replies for each comment
        $comments->getCollection()->transform(function($comment) use ($sortOrder) {
            $comment->replies = ForumComment::with(['user'])
                ->where('parent_komentar_id', $comment->komentar_id)
                ->where('status', 'AKTIF')
                ->orderBy('tanggal_komentar', $sortOrder)
                ->get();
                
            // If user is authenticated, check if they liked each reply
            if (Auth::check()) {
                $userId = Auth::id();
                $comment->replies->transform(function($reply) use ($userId) {
                    $reply->is_liked = $reply->likes()->where('user_id', $userId)->exists();
                    return $reply;
                });
            }
            
            return $comment;
        });
        
        // If user is authenticated, check if they liked each comment
        if (Auth::check()) {
            $userId = Auth::id();
            $comments->getCollection()->transform(function($comment) use ($userId) {
                $comment->is_liked = $comment->likes()->where('user_id', $userId)->exists();
                return $comment;
            });
        }
        
        return ForumCommentResource::collection($comments)
            ->additional([
                'meta' => [
                    'total' => $comments->total(),
                    'per_page' => $comments->perPage(),
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                ]
            ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @param  int  $threadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $threadId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // Check if thread exists and is active
        $thread = ForumThread::where('thread_id', $threadId)
            ->where('status', 'AKTIF')
            ->firstOrFail();
        
        $request->validate([
            'konten' => 'required|string|max:5000',
            'parent_komentar_id' => 'nullable|exists:forum_comments,komentar_id'
        ]);
        
        // If this is a reply, ensure parent comment exists and belongs to the thread
        if ($request->has('parent_komentar_id') && $request->parent_komentar_id) {
            $parentComment = ForumComment::where('komentar_id', $request->parent_komentar_id)
                ->where('thread_id', $threadId)
                ->firstOrFail();
        }
        
        $comment = ForumComment::create([
            'thread_id' => $threadId,
            'user_id' => Auth::id(),
            'konten' => $request->konten,
            'parent_komentar_id' => $request->parent_komentar_id,
            'tanggal_komentar' => now(),
            'status' => 'AKTIF'
        ]);
        
        // Load the user
        $comment->load('user');
        
        return response()->json([
            'message' => 'Komentar berhasil ditambahkan',
            'comment' => new ForumCommentResource($comment)
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  Request  $request
     * @param  int  $threadId
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $threadId, $id)
    {
        // Check if thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        // Get comment with user
        $comment = ForumComment::with(['user'])
            ->where('thread_id', $threadId)
            ->where('komentar_id', $id)
            ->firstOrFail();
        
        // If user is authenticated, check if they liked the comment
        if (Auth::check()) {
            $userId = Auth::id();
            $comment->is_liked = $comment->likes()->where('user_id', $userId)->exists();
        } else {
            $comment->is_liked = false;
        }
        
        // Load replies if this is a parent comment
        if (!$comment->parent_komentar_id) {
            $replies = ForumComment::with(['user'])
                ->where('parent_komentar_id', $comment->komentar_id)
                ->orderBy('tanggal_komentar', 'asc')
                ->get();
                
            if (Auth::check()) {
                $userId = Auth::id();
                $replies->transform(function($reply) use ($userId) {
                    $reply->is_liked = $reply->likes()->where('user_id', $userId)->exists();
                    return $reply;
                });
            }
            
            $comment->replies = $replies;
        }
        
        return response()->json([
            'comment' => new ForumCommentResource($comment)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $threadId
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $threadId, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // Check if thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        // Get comment
        $comment = ForumComment::where('thread_id', $threadId)
            ->where('komentar_id', $id)
            ->firstOrFail();
        
        // Check if user is authorized to update this comment
        if (Auth::id() !== $comment->user_id && !Auth::user()->isadmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        $request->validate([
            'konten' => 'required|string|max:5000',
            'status' => 'sometimes|string|in:AKTIF,TIDAK_AKTIF',
        ]);
        
        $data = $request->only(['konten']);
        
        // Only admins can change status
        if ($request->has('status') && Auth::user()->isadmin()) {
            $data['status'] = $request->status;
        }
        
        // Update comment
        $comment->update($data);
        
        // Reload the user
        $comment->load('user');
        
        // If user is authenticated, check if they liked the comment
        if (Auth::check()) {
            $userId = Auth::id();
            $comment->is_liked = $comment->likes()->where('user_id', $userId)->exists();
        } else {
            $comment->is_liked = false;
        }
        
        return response()->json([
            'message' => 'Komentar berhasil diperbarui',
            'comment' => new ForumCommentResource($comment)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Request  $request
     * @param  int  $threadId
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $threadId, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // Check if thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        // Get comment
        $comment = ForumComment::where('thread_id', $threadId)
            ->where('komentar_id', $id)
            ->firstOrFail();
        
        // Check if user is authorized to delete this comment
        if (Auth::id() !== $comment->user_id && !Auth::user()->isadmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        // If this is a parent comment, update status for all replies too
        DB::beginTransaction();
        try {
            // Set comment status to TIDAK_AKTIF instead of hard delete
            $comment->update(['status' => 'TIDAK_AKTIF']);
            
            // Update all replies if this is a parent comment
            if (!$comment->parent_komentar_id) {
                ForumComment::where('parent_komentar_id', $comment->komentar_id)
                    ->update(['status' => 'TIDAK_AKTIF']);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Komentar berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Gagal menghapus komentar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get replies for a comment.
     *
     * @param Request $request
     * @param int $threadId
     * @param int $commentId
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getReplies(Request $request, $threadId, $commentId)
    {
        // Check if thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        // Check if parent comment exists
        $parentComment = ForumComment::where('thread_id', $threadId)
            ->where('komentar_id', $commentId)
            ->firstOrFail();
        
        // Get replies
        $query = ForumComment::with(['user'])
            ->where('thread_id', $threadId)
            ->where('parent_komentar_id', $commentId)
            ->where('status', 'AKTIF');
        
        // Sorting
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy('tanggal_komentar', $sortOrder);
        
        // Pagination (optional)
        if ($request->has('per_page')) {
            $perPage = $request->input('per_page');
            $replies = $query->paginate($perPage);
            
            // If user is authenticated, check if they liked each reply
            if (Auth::check()) {
                $userId = Auth::id();
                $replies->getCollection()->transform(function($reply) use ($userId) {
                    $reply->is_liked = $reply->likes()->where('user_id', $userId)->exists();
                    return $reply;
                });
            }
            
            return ForumCommentResource::collection($replies);
        } else {
            // Get all replies without pagination
            $replies = $query->get();
            
            // If user is authenticated, check if they liked each reply
            if (Auth::check()) {
                $userId = Auth::id();
                $replies->transform(function($reply) use ($userId) {
                    $reply->is_liked = $reply->likes()->where('user_id', $userId)->exists();
                    return $reply;
                });
            }
            
            return ForumCommentResource::collection($replies);
        }
    }

    /**
     * Toggle like for a comment.
     *
     * @param Request $request
     * @param int $threadId
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleLike(Request $request, $threadId, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // Check if thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        // Get comment
        $comment = ForumComment::where('thread_id', $threadId)
            ->where('komentar_id', $id)
            ->firstOrFail();
        
        $user = Auth::user();
        
        if ($comment->isLikedBy($user)) {
            $comment->unlike($user);
            $message = 'Like berhasil dihapus';
            $isLiked = false;
        } else {
            $comment->like($user);
            $message = 'Komentar berhasil disukai';
            $isLiked = true;
        }
        
        // Get updated like count
        $comment->loadCount('likes');
        
        return response()->json([
            'message' => $message,
            'is_liked' => $isLiked,
            'likes_count' => $comment->likes_count
        ]);
    }
} 