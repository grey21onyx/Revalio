<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ForumCommentResource;
use App\Models\ForumComment;
use App\Models\ForumLike;
use App\Models\ForumThread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ForumCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $threadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, $threadId)
    {
        // Verify thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        $query = ForumComment::where('thread_id', $threadId)
            ->whereNull('parent_id'); // Only top-level comments
        
        // Eager loading
        $relations = ['user'];
        if ($request->has('with_replies') && $request->with_replies) {
            $relations[] = 'replies.user';
        }
        
        $query->with($relations);
        
        // Count likes
        if ($request->has('with_counts') && $request->with_counts) {
            $query->withCount('likes');
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_posting');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $comments = $query->paginate($perPage);
        
        return ForumCommentResource::collection($comments)
            ->additional([
                'meta' => [
                    'total' => $comments->total(),
                    'per_page' => $comments->perPage(),
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                    'thread_id' => $threadId,
                ],
            ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $threadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $threadId)
    {
        // Verify thread exists
        $thread = ForumThread::findOrFail($threadId);
        
        $request->validate([
            'konten' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'parent_id' => 'nullable|exists:forum_comments,comment_id',
        ]);

        $data = $request->except('gambar');
        $data['thread_id'] = $threadId;
        $data['user_id'] = $request->user()->user_id;
        $data['tanggal_posting'] = now();
        $data['status'] = 'AKTIF';

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'comment_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/comments', $filename);
            $data['gambar'] = 'comments/' . $filename;
        }

        $comment = ForumComment::create($data);

        // Load the comment with user
        $comment->load('user');
        if ($comment->parent_id) {
            $comment->load('parent.user');
        }

        return response()->json([
            'message' => 'Komentar berhasil dibuat',
            'comment' => new ForumCommentResource($comment)
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $threadId
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $threadId, $id)
    {
        $comment = ForumComment::where('thread_id', $threadId)
            ->where('comment_id', $id)
            ->firstOrFail();
        
        // Eager loading
        $relations = ['user'];
        if ($request->has('with_replies') && $request->with_replies) {
            $relations[] = 'replies.user';
        }
        
        $comment->load($relations);
        
        // Count likes
        $comment->loadCount('likes');
        
        // Check if user has liked this comment
        if ($request->user()) {
            $comment->user_has_liked = ForumLike::where('user_id', $request->user()->user_id)
                ->where('comment_id', $comment->comment_id)
                ->exists();
        } else {
            $comment->user_has_liked = false;
        }
        
        return response()->json(new ForumCommentResource($comment));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $threadId
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $threadId, $id)
    {
        $comment = ForumComment::where('thread_id', $threadId)
            ->where('comment_id', $id)
            ->firstOrFail();
        
        // Check if user is authorized to update
        if ($request->user()->user_id !== $comment->user_id && !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk mengedit komentar ini'
            ], 403);
        }
        
        $request->validate([
            'konten' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable|string|in:AKTIF,TERVERIFIKASI,DITOLAK,SPAM',
        ]);

        $data = $request->except(['gambar', '_method']);

        // Handle file upload
        if ($request->hasFile('gambar')) {
            // Delete old image if exists
            if ($comment->gambar) {
                Storage::delete('public/' . $comment->gambar);
            }
            
            $file = $request->file('gambar');
            $filename = 'comment_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/comments', $filename);
            $data['gambar'] = 'comments/' . $filename;
        }

        $comment->update($data);

        // Load the comment with user
        $comment->load('user');
        if ($comment->parent_id) {
            $comment->load('parent.user');
        }

        return response()->json([
            'message' => 'Komentar berhasil diperbarui',
            'comment' => new ForumCommentResource($comment)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $threadId
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $threadId, $id)
    {
        $comment = ForumComment::where('thread_id', $threadId)
            ->where('comment_id', $id)
            ->firstOrFail();
        
        // Check if user is authorized to delete
        if ($request->user()->user_id !== $comment->user_id && !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Anda tidak memiliki izin untuk menghapus komentar ini'
            ], 403);
        }
        
        // Check if comment has RecyclableTrait
        if (method_exists($comment, 'recycle')) {
            $comment->recycle();
            $message = 'Komentar berhasil dipindahkan ke recycle bin';
        } else {
            // Delete image if exists
            if ($comment->gambar) {
                Storage::delete('public/' . $comment->gambar);
            }
            
            $comment->delete();
            $message = 'Komentar berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }
    
    /**
     * Get replies for a comment.
     *
     * @param  int  $threadId
     * @param  int  $commentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getReplies(Request $request, $threadId, $commentId)
    {
        // Verify comment exists and belongs to the thread
        $parentComment = ForumComment::where('thread_id', $threadId)
            ->where('comment_id', $commentId)
            ->firstOrFail();
        
        $query = ForumComment::where('parent_id', $commentId)
            ->with('user')
            ->withCount('likes');
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_posting');
        $direction = $request->input('direction', 'asc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $replies = $query->paginate($perPage);
        
        return ForumCommentResource::collection($replies)
            ->additional([
                'meta' => [
                    'total' => $replies->total(),
                    'per_page' => $replies->perPage(),
                    'current_page' => $replies->currentPage(),
                    'last_page' => $replies->lastPage(),
                    'thread_id' => $threadId,
                    'parent_comment_id' => $commentId,
                ],
            ]);
    }
    
    /**
     * Like or unlike a comment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $threadId
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleLike(Request $request, $threadId, $id)
    {
        $comment = ForumComment::where('thread_id', $threadId)
            ->where('comment_id', $id)
            ->firstOrFail();
            
        $userId = $request->user()->user_id;
        
        $existingLike = ForumLike::where('comment_id', $id)
            ->where('user_id', $userId)
            ->first();
            
        if ($existingLike) {
            $existingLike->delete();
            $message = 'Like dibatalkan';
            $liked = false;
        } else {
            ForumLike::create([
                'comment_id' => $id,
                'user_id' => $userId,
                'tanggal_like' => now()
            ]);
            $message = 'Komentar disukai';
            $liked = true;
        }
        
        // Get updated like count
        $likeCount = ForumLike::where('comment_id', $id)->count();
        
        return response()->json([
            'message' => $message,
            'liked' => $liked,
            'likes_count' => $likeCount
        ]);
    }
} 