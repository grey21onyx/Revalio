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
use Illuminate\Support\Facades\Log;

class ForumCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     * @param  int  $threadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, $threadId)
    {
        try {
            Log::info('Loading comments for thread', ['thread_id' => $threadId]);
            
            // Check if thread exists
            $thread = ForumThread::findOrFail($threadId);
            
            // Filter berdasarkan status - hanya menerima nilai status yang valid
            $statusFilter = 'AKTIF'; // Default ke AKTIF
            if ($request->has('status') && in_array($request->status, ['AKTIF', 'TIDAK_AKTIF', 'DILAPORKAN'])) {
                $statusFilter = $request->status;
            }
            
            Log::info('Fetching comments with filter', [
                'thread_id' => $threadId,
                'status' => $statusFilter
            ]);
            
            // Ambil semua komentar utama terlebih dahulu
            $parentComments = ForumComment::with(['user'])
                ->where('thread_id', $threadId)
                ->where('status', $statusFilter)
                ->whereNull('parent_komentar_id')
                ->orderBy('tanggal_komentar', 'desc')  // Urutkan dari yang terbaru
                ->get();
            
            // Untuk setiap komentar utama, ambil balasannya
            $formattedComments = [];
            
            foreach ($parentComments as $parentComment) {
                // Tambahkan komentar utama ke array
                $commentData = $parentComment->toArray();
                
                // Periksa jika user telah menyukai komentar
                if (Auth::check()) {
                    $userId = Auth::id();
                    $commentData['is_liked'] = $parentComment->likes()->where('user_id', $userId)->exists();
                } else {
                    $commentData['is_liked'] = false;
                }
                
                // Ambil balasan untuk komentar ini
                $replies = ForumComment::with(['user'])
                    ->where('thread_id', $threadId)
                    ->where('parent_komentar_id', $parentComment->komentar_id)
                    ->where('status', $statusFilter)
                    ->orderBy('tanggal_komentar', 'asc')  // Balasan diurutkan dari yang terlama
                    ->get();
                
                // Format balasan dan tambahkan informasi like jika user terautentikasi
                $formattedReplies = [];
                foreach ($replies as $reply) {
                    $replyData = $reply->toArray();
                    if (Auth::check()) {
                        $userId = Auth::id();
                        $replyData['is_liked'] = $reply->likes()->where('user_id', $userId)->exists();
                    } else {
                        $replyData['is_liked'] = false;
                    }
                    $formattedReplies[] = $replyData;
                }
                
                // Tambahkan balasan ke komentar utama
                $commentData['replies'] = $formattedReplies;
                
                // Tambahkan ke array hasil
                $formattedComments[] = $commentData;
            }
            
            Log::info('Comments loaded successfully', [
                'thread_id' => $threadId,
                'parent_count' => count($formattedComments),
                'total_replies' => array_sum(array_map(function($comment) {
                    return count($comment['replies'] ?? []);
                }, $formattedComments))
            ]);
            
            return response()->json([
                'data' => $formattedComments,
                'meta' => [
                    'total' => count($formattedComments)
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error loading comments for thread', [
                'thread_id' => $threadId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Gagal memuat komentar',
                'error' => $e->getMessage()
            ], 500);
        }
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
            Log::warning('Unauthorized attempt to create comment', ['thread_id' => $threadId]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        try {
            Log::info('Creating new comment', [
                'thread_id' => $threadId,
                'user_id' => Auth::id(),
                'user_name' => Auth::user()->name ?? Auth::user()->nama ?? 'Unknown',
                'has_parent' => $request->has('parent_komentar_id'),
                'request_all' => $request->all()
            ]);
            
            // Check if thread exists and is active
            $thread = ForumThread::findOrFail($threadId);
            Log::info('Thread found', [
                'thread_id' => $thread->thread_id,
                'thread_title' => $thread->judul,
                'thread_status' => $thread->status
            ]);
            
            if ($thread->status !== 'AKTIF') {
                Log::warning('Attempt to comment on inactive thread', [
                    'thread_id' => $threadId,
                    'status' => $thread->status
                ]);
                return response()->json([
                    'message' => 'Thread tidak aktif, tidak bisa menambahkan komentar'
                ], 403);
            }
            
            try {
                $request->validate([
                    'konten' => 'required|string|max:5000',
                    'parent_komentar_id' => 'nullable|exists:forum_comments,komentar_id'
                ]);
            } catch (\Illuminate\Validation\ValidationException $e) {
                Log::error('Validation failed', [
                    'errors' => $e->errors(),
                    'thread_id' => $threadId
                ]);
                throw $e;
            }
            
            // If this is a reply, ensure parent comment exists and belongs to the thread
            if ($request->has('parent_komentar_id') && $request->parent_komentar_id) {
                $parentComment = ForumComment::where('komentar_id', $request->parent_komentar_id)
                    ->where('thread_id', $threadId)
                    ->firstOrFail();
                
                Log::info('Reply to parent comment', [
                    'parent_id' => $parentComment->komentar_id,
                    'parent_user_id' => $parentComment->user_id
                ]);
            }
            
            $commentData = [
                'thread_id' => $threadId,
                'user_id' => Auth::id(),
                'konten' => $request->konten,
                'parent_komentar_id' => $request->parent_komentar_id,
                'tanggal_komentar' => now(),
                'status' => 'AKTIF'
            ];
            
            Log::info('Creating comment with data', ['data' => $commentData]);
            
            $comment = ForumComment::create($commentData);
            
            Log::info('Comment created successfully', [
                'comment_id' => $comment->komentar_id,
                'thread_id' => $comment->thread_id
            ]);
            
            // Load the user
            $comment->load('user');
            
            return response()->json([
                'message' => 'Komentar berhasil ditambahkan',
                'comment' => new ForumCommentResource($comment)
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating comment', [
                'thread_id' => $threadId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'request_data' => $request->all()
            ]);
            
            // Return a more informative error
            $statusCode = 500;
            $message = 'Gagal menambahkan komentar: ' . $e->getMessage();
            
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                $statusCode = 404;
                $message = 'Thread atau komentar parent tidak ditemukan';
            } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                $statusCode = 422;
                $message = 'Validasi gagal: ' . implode(', ', array_map(function($msgs) {
                    return implode(', ', $msgs);
                }, $e->errors()));
            }
            
            return response()->json([
                'message' => $message,
                'error' => $e->getMessage(),
                'error_type' => get_class($e)
            ], $statusCode);
        }
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
        
        // Check if user is authorized to update this comment - ONLY the comment owner
        if (Auth::id() !== $comment->user_id) {
            return response()->json([
                'message' => 'Forbidden', 
                'error' => 'Anda hanya dapat mengedit komentar milik Anda sendiri'
            ], 403);
        }
        
        $request->validate([
            'konten' => 'required|string|max:5000',
        ]);
        
        $data = $request->only(['konten']);
        
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
        
        // Log untuk debugging
        Log::info('Menghapus komentar', [
            'thread_id' => $threadId,
            'komentar_id' => $id,
            'user_id' => Auth::id()
        ]);
        
        try {
            // Check if thread exists
            $thread = ForumThread::findOrFail($threadId);
            
            // Get comment - validasi ID numerik
            if (!is_numeric($id)) {
                return response()->json([
                    'message' => 'ID komentar tidak valid',
                    'error' => 'ID harus berupa angka'
                ], 400);
            }
            
            $comment = ForumComment::where('thread_id', $threadId)
                ->where('komentar_id', $id)
                ->first();
                
            if (!$comment) {
                return response()->json([
                    'message' => 'Komentar tidak ditemukan'
                ], 404);
            }
            
            // Check if user is authorized to delete this comment - ONLY the comment owner
            if (Auth::id() !== $comment->user_id) {
                return response()->json([
                    'message' => 'Forbidden',
                    'error' => 'Anda hanya dapat menghapus komentar milik Anda sendiri'
                ], 403);
            }
            
            // Optimize the deletion process
            DB::beginTransaction();
            try {
                // Use a more optimized approach
                // First delete likes - this is often the bottleneck
                if (method_exists($comment, 'likes')) {
                    DB::table('likes')
                        ->where('likeable_id', $comment->komentar_id)
                        ->where('likeable_type', get_class($comment))
                        ->delete();
                }
                
                // If this is a parent comment that has replies from other users,
                // just change the status to "DIHAPUS" instead of hard delete
                if (!$comment->parent_komentar_id) {
                    $hasOtherUserReplies = ForumComment::where('parent_komentar_id', $comment->komentar_id)
                        ->where('user_id', '!=', Auth::id())
                        ->exists();
                    
                    if ($hasOtherUserReplies) {
                        // Set content to indicate it was deleted
                        $comment->konten = '[Komentar ini telah dihapus]';
                        $comment->status = 'DIHAPUS';
                        $comment->save();
                        
                        DB::commit();
                        return response()->json([
                            'message' => 'Komentar berhasil dihapus',
                            'comment_id' => $id,
                            'status' => 'soft_delete'
                        ]);
                    }
                }
                
                // For parent comments with no replies or only own replies, and for replies,
                // perform a regular delete
                
                // Delete all own replies if this is a parent comment
                if (!$comment->parent_komentar_id) {
                    $ownReplies = ForumComment::where('parent_komentar_id', $comment->komentar_id)
                        ->where('user_id', Auth::id())
                        ->get();
                    
                    foreach ($ownReplies as $reply) {
                        $reply->delete();
                    }
                }
                
                // Finally delete the comment
                $comment->delete();
                
                DB::commit();
                
                return response()->json([
                    'message' => 'Komentar berhasil dihapus',
                    'comment_id' => $id,
                    'status' => 'hard_delete'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error saat menghapus komentar', [
                    'thread_id' => $threadId,
                    'komentar_id' => $id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                return response()->json([
                    'message' => 'Gagal menghapus komentar',
                    'error' => $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error menghapus komentar', [
                'error' => $e->getMessage(),
                'thread_id' => $threadId,
                'comment_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Terjadi kesalahan saat menghapus komentar',
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function getReplies(Request $request, $threadId, $commentId)
    {
        try {
            // Check if thread exists
            $thread = ForumThread::findOrFail($threadId);
            
            // Check if parent comment exists
            $parentComment = ForumComment::where('thread_id', $threadId)
                ->where('komentar_id', $commentId)
                ->firstOrFail();
            
            // Get all replies for this comment
            $replies = ForumComment::with('user')
                ->where('thread_id', $threadId)
                ->where('parent_komentar_id', $commentId)
                ->where('status', 'AKTIF')
                ->orderBy('tanggal_komentar', 'asc')
                ->get();
                
            // Add is_liked flag if user is authenticated
            $formattedReplies = [];
            foreach ($replies as $reply) {
                $replyData = $reply->toArray();
                if (Auth::check()) {
                    $userId = Auth::id();
                    $replyData['is_liked'] = $reply->likes()->where('user_id', $userId)->exists();
                }
                $formattedReplies[] = $replyData;
            }
            
            return response()->json([
                'data' => $formattedReplies,
                'meta' => [
                    'total' => count($formattedReplies),
                    'parent_comment_id' => $commentId
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting replies', [
                'thread_id' => $threadId,
                'comment_id' => $commentId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to load replies',
                'error' => $e->getMessage()
            ], 500);
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
        
        try {
            // Check if thread exists
            $thread = ForumThread::findOrFail($threadId);
            
            // Get comment
            $comment = ForumComment::where('thread_id', $threadId)
                ->where('komentar_id', $id)
                ->firstOrFail();
            
            $user = Auth::user();
            $isLiked = false;
            
            // Check if user already liked this comment
            $existingLike = $comment->likes()->where('user_id', $user->user_id)->first();
            
            if ($existingLike) {
                // Unlike
                $existingLike->delete();
                $message = 'Like berhasil dihapus';
            } else {
                // Like
                $like = new Like();
                $like->user_id = $user->user_id;
                $like->likeable_id = $comment->komentar_id;
                $like->likeable_type = ForumComment::class;
                $like->save();
                
                $isLiked = true;
                $message = 'Komentar berhasil disukai';
            }
            
            // Get updated like count
            $likesCount = $comment->likes()->count();
            
            return response()->json([
                'message' => $message,
                'is_liked' => $isLiked,
                'likes_count' => $likesCount
            ]);
        } catch (\Exception $e) {
            Log::error('Error toggling like', [
                'thread_id' => $threadId,
                'comment_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to toggle like',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 