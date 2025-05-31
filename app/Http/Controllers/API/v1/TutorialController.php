<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TutorialResource;
use App\Http\Resources\CommentResource;
use App\Models\Tutorial;
use App\Models\TutorialComment;
use App\Models\TutorialRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TutorialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Tutorial::query();
        
        // Filter by type
        if ($request->has('jenis_tutorial')) {
            $query->where('jenis_tutorial', $request->jenis_tutorial);
        }
        
        // Filter by difficulty
        if ($request->has('tingkat_kesulitan')) {
            if(is_array($request->tingkat_kesulitan)) {
                $query->whereIn('tingkat_kesulitan', $request->tingkat_kesulitan);
            } else {
                $query->where('tingkat_kesulitan', $request->tingkat_kesulitan);
            }
        }
        
        // Filter by time
        if ($request->has('max_time')) {
            $query->where('estimasi_waktu', '<=', $request->max_time);
        }
        
        // Filter by waste type
        if ($request->has('waste_id')) {
            $query->where('waste_id', $request->waste_id);
        }
        
        // Search by title
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }
        
        // Filter tried/untried
        if ($request->has('tried') && Auth::check()) {
            $userId = Auth::id();
            if ($request->tried === 'true' || $request->tried === true) {
                $query->whereHas('completedByUsers', function($q) use ($userId) {
                    $q->where('user_completed_tutorials.user_id', $userId);
                });
            } else {
                $query->whereDoesntHave('completedByUsers', function($q) use ($userId) {
                    $q->where('user_completed_tutorials.user_id', $userId);
                });
            }
        }
        
        // Sort
        $sortBy = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);
        
        // Paginate
        $perPage = $request->per_page ?? 12;
        $tutorials = $query->paginate($perPage);
        
        // Attach user specific data
        if (Auth::check()) {
            $userId = Auth::id();
            $tutorials->getCollection()->transform(function($tutorial) use ($userId) {
                $tutorial->is_completed = $tutorial->completedByUsers()->where('user_completed_tutorials.user_id', $userId)->exists();
                $tutorial->is_saved = $tutorial->savedByUsers()->where('user_saved_tutorials.user_id', $userId)->exists();
                $tutorial->user_rating = $tutorial->ratings()->where('user_id', $userId)->value('rating');
                return $tutorial;
            });
        }
        
        return TutorialResource::collection($tutorials);
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
            'deskripsi' => 'required|string',
            'tingkat_kesulitan' => 'required|string|in:MUDAH,SEDANG,SULIT',
            'waktu_pengerjaan' => 'nullable|string|max:50',
            'alat_bahan' => 'required|string',
            'langkah_langkah' => 'required|string',
            'video_url' => 'nullable|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tipe_tutorial' => 'required|string|in:DAUR_ULANG,REUSE,KOMPOS,LAINNYA',
            'waste_type_id' => 'required|exists:waste_types,waste_type_id',
            'status' => 'nullable|string|in:AKTIF,DRAFT,TIDAK_AKTIF',
        ]);

        $data = $request->except('gambar');
        
        if (!isset($data['status'])) {
            $data['status'] = 'AKTIF';
        }
        
        $data['tanggal_publikasi'] = now();

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'tutorial_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/tutorials', $filename);
            $data['gambar'] = 'tutorials/' . $filename;
        }

        $tutorial = Tutorial::create($data);

        return response()->json([
            'message' => 'Tutorial berhasil dibuat',
            'tutorial' => new TutorialResource($tutorial)
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
        try {
            // Cari tutorial dengan relasi yang dibutuhkan
            $tutorial = Tutorial::with([
                'wasteType',
                'user', // Tambahkan relasi user/kontributor
                'comments.user', // Load comments dengan user untuk tampilan komentar
                'ratings'        // Load ratings untuk perhitungan rata-rata
            ])->findOrFail($id);
            
            // Increment view count
            $tutorial->incrementViewCount();
            
            // Add user specific data jika user login
            if (Auth::check()) {
                $userId = Auth::id();
                
                // Cek status tutorial untuk user yang login (completed, saved, rated)
                $tutorial->is_completed = $tutorial->completedByUsers()->where('user_id', $userId)->exists();
                $tutorial->is_saved = $tutorial->savedByUsers()->where('user_id', $userId)->exists();
                $tutorial->user_rating = $tutorial->ratings()->where('user_id', $userId)->value('rating');
                
                // Tambahkan status sudah mengakses tutorial jika belum
                $this->recordTutorialView($userId, $id);
            } else {
                // Default values jika tidak login
                $tutorial->is_completed = false;
                $tutorial->is_saved = false;
                $tutorial->user_rating = null;
            }
            
            // Hitung jumlah rating
            $tutorial->ratings_count = $tutorial->ratings()->count();
            
            return new TutorialResource($tutorial);
        } catch (\Exception $e) {
            // Log error untuk debugging
            \Log::error('Error in TutorialController@show: ' . $e->getMessage(), [
                'tutorial_id' => $id,
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'message' => 'Terjadi kesalahan saat memuat tutorial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Record tutorial view for logged in users
     * This can be used for history, recommendations, etc.
     *
     * @param int $userId
     * @param int $tutorialId
     * @return void
     */
    private function recordTutorialView($userId, $tutorialId)
    {
        // This can be expanded to record detailed view history if needed
        // For now, just a placeholder for future enhancement
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
        $tutorial = Tutorial::findOrFail($id);
        
        $request->validate([
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'tingkat_kesulitan' => 'sometimes|string|in:MUDAH,SEDANG,SULIT',
            'waktu_pengerjaan' => 'nullable|string|max:50',
            'alat_bahan' => 'sometimes|string',
            'langkah_langkah' => 'sometimes|string',
            'video_url' => 'nullable|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tipe_tutorial' => 'sometimes|string|in:DAUR_ULANG,REUSE,KOMPOS,LAINNYA',
            'waste_type_id' => 'sometimes|exists:waste_types,waste_type_id',
            'status' => 'nullable|string|in:AKTIF,DRAFT,TIDAK_AKTIF',
        ]);

        $data = $request->except(['gambar', '_method']);

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = 'tutorial_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/tutorials', $filename);
            $data['gambar'] = 'tutorials/' . $filename;
        }

        $tutorial->update($data);

        return response()->json([
            'message' => 'Tutorial berhasil diperbarui',
            'tutorial' => new TutorialResource($tutorial)
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
        $tutorial = Tutorial::findOrFail($id);
        
        // Check if tutorial has RecyclableTrait
        if (method_exists($tutorial, 'recycle')) {
            $tutorial->recycle();
            $message = 'Tutorial berhasil dipindahkan ke recycle bin';
        } else {
            $tutorial->delete();
            $message = 'Tutorial berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }
    
    /**
     * Get tutorials by waste type.
     *
     * @param  int  $wasteTypeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByWasteType($wasteTypeId)
    {
        $tutorials = Tutorial::where('waste_id', $wasteTypeId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return TutorialResource::collection($tutorials);
    }

    /**
     * Display a listing of tutorials for public access.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function public(Request $request)
    {
        $query = Tutorial::where('status', 'AKTIF');
        
        // Eager loading with only active waste types
        if ($request->has('with_waste_type') && $request->with_waste_type) {
            $query->with(['wasteType' => function($q) {
                $q->where('status', 'AKTIF');
            }]);
        }
        
        // Filter to only include tutorials for active waste types
        $query->whereHas('wasteType', function($q) {
            $q->where('status', 'AKTIF');
        });
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                  ->orWhere('deskripsi', 'like', "%{$searchTerm}%")
                  ->orWhere('alat_bahan', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by waste type
        if ($request->has('waste_type_id')) {
            $query->where('waste_type_id', $request->waste_type_id);
        }
        
        // Filter by difficulty level
        if ($request->has('tingkat_kesulitan')) {
            if (is_array($request->tingkat_kesulitan)) {
                $query->whereIn('tingkat_kesulitan', $request->tingkat_kesulitan);
            } else {
                $query->where('tingkat_kesulitan', $request->tingkat_kesulitan);
            }
        }
        
        // Filter by tutorial type
        if ($request->has('tipe_tutorial')) {
            $query->where('tipe_tutorial', $request->tipe_tutorial);
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'tanggal_publikasi');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sortBy, $direction);
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $tutorials = $query->paginate($perPage);
        
        return TutorialResource::collection($tutorials)
            ->additional([
                'meta' => [
                    'total' => $tutorials->total(),
                    'per_page' => $tutorials->perPage(),
                    'current_page' => $tutorials->currentPage(),
                    'last_page' => $tutorials->lastPage(),
                ],
            ]);
    }

    /**
     * Toggle status completed
     */
    public function toggleCompleted($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $user = Auth::user();
        $tutorial = Tutorial::findOrFail($id);
        
        if ($tutorial->completedByUsers()->where('user_id', $user->user_id)->exists()) {
            $tutorial->completedByUsers()->detach($user->user_id);
            $message = 'Tutorial dihapus dari daftar selesai';
            $isCompleted = false;
        } else {
            $tutorial->completedByUsers()->attach($user->user_id, ['completed_at' => now()]);
            $message = 'Tutorial ditandai sebagai selesai';
            $isCompleted = true;
        }
        
        return response()->json([
            'message' => $message,
            'is_completed' => $isCompleted
        ]);
    }
    
    /**
     * Toggle status saved
     */
    public function toggleSaved($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $user = Auth::user();
        $tutorial = Tutorial::findOrFail($id);
        
        if ($tutorial->savedByUsers()->where('user_id', $user->user_id)->exists()) {
            $tutorial->savedByUsers()->detach($user->user_id);
            $message = 'Tutorial dihapus dari daftar simpan';
            $isSaved = false;
        } else {
            $tutorial->savedByUsers()->attach($user->user_id);
            $message = 'Tutorial disimpan';
            $isSaved = true;
        }
        
        return response()->json([
            'message' => $message,
            'is_saved' => $isSaved
        ]);
    }
    
    /**
     * Rating tutorial
     */
    public function rate(Request $request, $id)
    {
        $this->validate($request, [
            'rating' => 'required|integer|min:1|max:5'
        ]);
        
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $user = Auth::user();
        $tutorial = Tutorial::findOrFail($id);
        
        // Create or update rating
        $tutorial->ratings()->updateOrCreate(
            ['user_id' => $user->user_id],
            ['rating' => $request->rating]
        );
        
        // Update average rating
        $tutorial->updateAverageRating();
        
        return response()->json([
            'message' => 'Rating berhasil diperbarui',
            'average_rating' => $tutorial->average_rating,
            'user_rating' => $request->rating
        ]);
    }
    
    /**
     * Tambah komentar tutorial
     */
    public function addComment(Request $request, $id)
    {
        $this->validate($request, [
            'content' => 'required|string|max:1000'
        ]);
        
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $user = Auth::user();
        $tutorial = Tutorial::findOrFail($id);
        
        $comment = TutorialComment::create([
            'user_id' => $user->user_id,
            'tutorial_id' => $id,
            'content' => $request->content,
            'status' => 'AKTIF'
        ]);
        
        // Reload with user relationship
        $comment->load('user');
        
        return response()->json([
            'message' => 'Komentar berhasil ditambahkan',
            'comment' => new CommentResource($comment)
        ], 201);
    }
    
    /**
     * Daftar komentar tutorial
     */
    public function getComments($id, Request $request)
    {
        $tutorial = Tutorial::findOrFail($id);
        
        $query = TutorialComment::with('user')
            ->where('tutorial_id', $id)
            ->where('status', 'AKTIF');
        
        // Sort
        $sortField = $request->sort_field ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortField, $sortOrder);
        
        // Paginate
        $perPage = $request->per_page ?? 10;
        $comments = $query->paginate($perPage);
        
        return CommentResource::collection($comments);
    }
}
