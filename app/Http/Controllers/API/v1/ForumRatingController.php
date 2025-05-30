<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\ForumRating;
use App\Models\ForumThread;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class ForumRatingController extends Controller
{
    /**
     * Menambahkan atau memperbarui rating untuk thread
     *
     * @param Request $request
     * @param int $threadId
     * @return JsonResponse
     */
    public function rateThread(Request $request, int $threadId): JsonResponse
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            // Gunakan transaksi database untuk mencegah race condition
            DB::beginTransaction();
            
            try {
                // Cek apakah thread ada - gunakan lockForUpdate untuk menghindari race condition
                $thread = ForumThread::lockForUpdate()->find($threadId);
                if (!$thread) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Thread forum tidak ditemukan'
                    ], Response::HTTP_NOT_FOUND);
                }

                // Ambil ID user yang sedang login
                $userId = Auth::id();
                if (!$userId) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'User tidak terautentikasi'
                    ], Response::HTTP_UNAUTHORIZED);
                }
                
                // Validasi nilai rating lagi untuk keamanan ekstra
                $rating = (int)$request->rating;
                if ($rating < 1 || $rating > 5) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Rating harus antara 1 sampai 5'
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
                
                // Cari rating yang sudah ada atau buat yang baru - dengan locking
                $existingRating = ForumRating::where('user_id', $userId)
                    ->where('thread_id', $threadId)
                    ->lockForUpdate()
                    ->first();
                    
                if ($existingRating) {
                    // Update rating yang sudah ada
                    $existingRating->rating = $rating;
                    $existingRating->save();
                    $ratingModel = $existingRating;
                } else {
                    // Buat rating baru
                    $ratingModel = new ForumRating([
                        'user_id' => $userId,
                        'thread_id' => $threadId,
                        'rating' => $rating
                    ]);
                    $ratingModel->save();
                }

                // Update average rating di thread
                $thread->updateAverageRating();
                
                // Ambil data thread setelah update untuk mendapatkan nilai terbaru
                $thread->refresh();
                
                DB::commit();
                
                // Pastikan semua nilai yang dikembalikan selalu numerik
                return response()->json([
                    'message' => 'Rating berhasil disimpan',
                    'data' => [
                        'thread_id' => (int)$threadId,
                        'user_id' => (int)$userId,
                        'rating' => (int)$ratingModel->rating,
                        'average_rating' => (float)$thread->average_rating,
                        'rating_count' => (int)$thread->rating_count
                    ]
                ], Response::HTTP_OK);
                
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            // Log error
            \Illuminate\Support\Facades\Log::error("Error saving rating: " . $e->getMessage(), [
                'thread_id' => $threadId,
                'user_id' => Auth::id(),
                'rating' => $request->rating
            ]);
            
            return response()->json([
                'message' => 'Gagal menyimpan rating',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Mendapatkan rating user untuk thread tertentu
     *
     * @param int $threadId
     * @return JsonResponse
     */
    public function getUserRating(int $threadId): JsonResponse
    {
        // Cek apakah thread ada
        $thread = ForumThread::find($threadId);
        if (!$thread) {
            return response()->json([
                'message' => 'Thread forum tidak ditemukan'
            ], Response::HTTP_NOT_FOUND);
        }

        // Ambil ID user yang sedang login
        $userId = Auth::id();
        
        // Cari rating yang sudah ada
        $rating = ForumRating::where('user_id', $userId)
                            ->where('thread_id', $threadId)
                            ->first();
        
        // Pastikan semua nilai yang dikembalikan selalu numerik
        return response()->json([
            'data' => [
                'thread_id' => (int)$threadId,
                'user_rating' => $rating ? (int)$rating->rating : 0,
                'average_rating' => (float)$thread->average_rating,
                'rating_count' => (int)$thread->rating_count
            ]
        ], Response::HTTP_OK);
    }
}
