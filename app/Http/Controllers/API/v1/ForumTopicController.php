<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ForumTopic;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ForumTopicController extends Controller
{
    /**
     * Display a listing of forum topics for public access.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function publicIndex(Request $request)
    {
        $limit = $request->input('limit', 10);
        $topics = ForumTopic::with('user')
            ->withCount(['comments', 'likes', 'views'])
            ->orderBy('created_at', 'desc')
            ->paginate($limit);
            
        return response()->json($topics);
    }

    /**
     * Display the specified forum topic for public access.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function publicShow($id)
    {
        try {
            $topic = ForumTopic::with(['user', 'comments.user'])
                ->withCount(['comments', 'likes', 'views'])
                ->findOrFail($id);
                
            return response()->json($topic);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Forum topic not found'], 404);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $topics = ForumTopic::with('user')
            ->withCount(['comments', 'likes', 'views'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json($topics);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'tags' => 'nullable|string',
        ]);

        $topic = new ForumTopic();
        $topic->user_id = Auth::id();
        $topic->judul = $request->judul;
        $topic->konten = $request->konten;
        $topic->tags = $request->tags;
        $topic->save();

        return response()->json($topic, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $topic = ForumTopic::with(['user', 'comments.user'])
                ->withCount(['comments', 'likes', 'views'])
                ->findOrFail($id);
                
            return response()->json($topic);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Forum topic not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'tags' => 'nullable|string',
        ]);

        try {
            $topic = ForumTopic::findOrFail($id);
            
            // Check if user is authorized to update this topic
            if ($topic->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $topic->judul = $request->judul;
            $topic->konten = $request->konten;
            $topic->tags = $request->tags;
            $topic->save();

            return response()->json($topic);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Forum topic not found'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $topic = ForumTopic::findOrFail($id);
            
            // Check if user is authorized to delete this topic
            if ($topic->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $topic->delete();
            
            return response()->json(['message' => 'Forum topic deleted successfully']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Forum topic not found'], 404);
        }
    }

    /**
     * Toggle like for a forum topic.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleLike($id)
    {
        try {
            $topic = ForumTopic::findOrFail($id);
            $user = Auth::user();
            
            if ($topic->likes()->where('user_id', $user->id)->exists()) {
                $topic->likes()->detach($user->id);
                $message = 'Like removed';
            } else {
                $topic->likes()->attach($user->id);
                $message = 'Like added';
            }
            
            return response()->json([
                'message' => $message,
                'likes_count' => $topic->likes()->count()
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Forum topic not found'], 404);
        }
    }
} 