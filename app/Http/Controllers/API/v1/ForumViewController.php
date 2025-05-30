<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ForumViewController extends Controller
{
    /**
     * Menambah jumlah view pada thread forum
     *
     * @param Request $request
     * @param int $threadId
     * @return JsonResponse
     */
    public function incrementView(Request $request, int $threadId): JsonResponse
    {
        try {
            // Cek apakah thread ada
            $thread = ForumThread::find($threadId);
            if (!$thread) {
                return response()->json([
                    'message' => 'Thread forum tidak ditemukan'
                ], Response::HTTP_NOT_FOUND);
            }
            
            // Gunakan session untuk mencegah multiple increment dari user yang sama dalam satu sesi
            $sessionKey = "thread_viewed_{$threadId}";
            if ($request->session()->has($sessionKey)) {
                // Thread sudah dilihat dalam sesi ini, kembalikan view count saat ini
                Log::info("Thread {$threadId} already viewed in this session, skipping increment");
                return response()->json([
                    'message' => 'View count tidak diubah (sudah dilihat)',
                    'data' => [
                        'thread_id' => $threadId,
                        'view_count' => (int)$thread->view_count
                    ]
                ], Response::HTTP_OK);
            }
            
            // Tambahkan log untuk debugging
            Log::info("Incrementing view count for thread {$threadId}, current count: {$thread->view_count}");

            // Gunakan transaksi database untuk mencegah race condition
            DB::beginTransaction();
            try {
                // Gunakan lock for update untuk mencegah concurrent update
                $thread = ForumThread::lockForUpdate()->find($threadId);
                if (!$thread) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Thread forum tidak ditemukan'
                    ], Response::HTTP_NOT_FOUND);
                }
                
                // Tambahkan view count
                $currentViews = (int)$thread->view_count;
                $thread->view_count = $currentViews + 1;
                $thread->save();
                
                // Tandai thread sebagai sudah dilihat dalam sesi ini
                $request->session()->put($sessionKey, true);
                
                DB::commit();
                
                // Log setelah update untuk memastikan operasi berhasil
                Log::info("View count incremented for thread {$threadId}, new count: {$thread->view_count}");
                
                return response()->json([
                    'message' => 'View count berhasil ditambahkan',
                    'data' => [
                        'thread_id' => $threadId,
                        'view_count' => (int)$thread->view_count
                    ]
                ], Response::HTTP_OK);
                
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Error in view count transaction: " . $e->getMessage());
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error("Error incrementing view count: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal menambahkan view count',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
