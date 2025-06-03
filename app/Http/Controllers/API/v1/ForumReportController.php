<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\ForumComment;
use App\Models\ForumReport;
use App\Models\ForumThread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ForumReportController extends Controller
{
    /**
     * Get reports list (for admin)
     */
    public function index(Request $request)
    {
        // Check if user is admin using both field methods
        if (Auth::user()->role !== 'admin' && !Auth::user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $status = $request->get('status', 'all'); // 'all', 'reported', 'resolved', 'rejected'
        
        try {
            $query = ForumReport::with([
                'user' => function($query) {
                    $query->select('user_id', 'nama_lengkap as name', 'email', 'foto_profil')
                          ->withTrashed(); // Include soft deleted users
                },
                'reportedBy' => function($query) {
                    $query->select('user_id', 'nama_lengkap as name', 'email', 'foto_profil')
                          ->withTrashed(); // Include soft deleted users
                },
                'thread:thread_id,judul,user_id',
                'comment:komentar_id,konten,user_id,thread_id'
            ]);
            
            // Filter berdasarkan status
            if ($status !== 'all') {
                $query->where('status', $status);
            }
            
            // Filter berdasarkan jenis entitas (thread/comment)
            if ($request->has('type')) {
                $type = $request->get('type');
                if ($type === 'thread' || $type === 'comment') {
                    $query->where('reportable_type', $type);
                }
            }
            
            // Pengurutan (default: terbaru)
            $query->orderBy('created_at', 'desc');
            
            $reports = $query->paginate(10);
            
            // Menyiapkan data untuk tampilan
            $data = [];
            
            foreach ($reports as $report) {
                $reportData = [
                    'id' => $report->id,
                    'reportable_type' => $report->reportable_type,
                    'reportable_id' => $report->reportable_id,
                    'thread_id' => $report->thread_id,
                    'comment_id' => $report->comment_id,
                    'status' => $report->status,
                    'report_reason' => $report->report_reason,
                    'description' => $report->description,
                    'reported_at' => $report->reported_at,
                    'resolved_at' => $report->resolved_at,
                    'resolution_note' => $report->resolution_note,
                    'reported_by' => $report->reportedBy ? [
                        'id' => $report->reportedBy->user_id,
                        'name' => $report->reportedBy->name,
                        'avatar' => $report->reportedBy->foto_profil
                    ] : null
                ];
                
                // Get user who created reported content
                $reportData['user'] = $report->user ? [
                    'id' => $report->user->user_id,
                    'name' => $report->user->name,
                    'avatar' => $report->user->foto_profil
                ] : null;
                
                // Get thread data
                if ($report->thread) {
                    $reportData['thread'] = [
                        'id' => $report->thread->thread_id,
                        'judul' => $report->thread->judul,
                        'user_id' => $report->thread->user_id
                    ];
                }
                
                // Get comment data if this is a comment report
                if ($report->reportable_type === 'comment' && $report->comment) {
                    $reportData['konten'] = $report->comment->konten;
                }
                
                $data[] = $reportData;
            }
            
            // Menyiapkan data statistik
            $stats = [
                'total' => ForumReport::count(),
                'pending' => ForumReport::where('status', 'reported')->count(),
                'resolved' => ForumReport::where('status', 'resolved')->count(),
                'rejected' => ForumReport::where('status', 'rejected')->count()
            ];
            
            return response()->json([
                'data' => $data,
                'stats' => $stats,
                'pagination' => [
                    'current_page' => $reports->currentPage(),
                    'last_page' => $reports->lastPage(),
                    'per_page' => $reports->perPage(),
                    'total' => $reports->total()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch reports',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTrace() : []
            ], 500);
        }
    }
    
    /**
     * Submit a new report for a thread
     */
    public function reportThread(Request $request, $threadId)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'reason' => 'required|in:inappropriate,spam,harassment,misinformation,other',
            'description' => 'nullable|string|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Pastikan thread ada
        $thread = ForumThread::find($threadId);
        if (!$thread) {
            return response()->json(['error' => 'Thread not found'], 404);
        }
        
        // Cek apakah user sudah melaporkan thread ini sebelumnya
        $existingReport = ForumReport::where([
            'reported_by_id' => Auth::id(),
            'reportable_type' => 'thread',
            'reportable_id' => $threadId
        ])->first();
        
        if ($existingReport) {
            return response()->json(['error' => 'Anda sudah melaporkan thread ini sebelumnya'], 422);
        }
        
        // Buat laporan baru
        $report = new ForumReport([
            'reportable_type' => 'thread',
            'reportable_id' => $threadId,
            'thread_id' => $threadId,
            'comment_id' => null,
            'user_id' => $thread->user_id, // User ID of the thread author
            'reported_by_id' => Auth::id(),  // User ID of the reporter
            'report_reason' => $request->reason,
            'description' => $request->description,
            'status' => 'reported'
        ]);
        
        $report->save();
        
        return response()->json([
            'message' => 'Laporan berhasil dikirim',
            'data' => $report
        ]);
    }
    
    /**
     * Submit a new report for a comment
     */
    public function reportComment(Request $request, $threadId, $commentId)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'reason' => 'required|in:inappropriate,spam,harassment,misinformation,other',
            'description' => 'nullable|string|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Pastikan thread dan komentar ada
        $comment = ForumComment::where([
            'komentar_id' => $commentId,
            'thread_id' => $threadId
        ])->first();
        
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }
        
        // Cek apakah user sudah melaporkan komentar ini sebelumnya
        $existingReport = ForumReport::where([
            'reported_by_id' => Auth::id(),
            'reportable_type' => 'comment',
            'reportable_id' => $commentId
        ])->first();
        
        if ($existingReport) {
            return response()->json(['error' => 'Anda sudah melaporkan komentar ini sebelumnya'], 422);
        }
        
        // Buat laporan baru
        $report = new ForumReport([
            'reportable_type' => 'comment',
            'reportable_id' => $commentId,
            'thread_id' => $threadId,
            'comment_id' => $commentId,
            'user_id' => $comment->user_id, // User ID of the comment author
            'reported_by_id' => Auth::id(),  // User ID of the reporter
            'report_reason' => $request->reason,
            'description' => $request->description,
            'status' => 'reported'
        ]);
        
        $report->save();
        
        return response()->json([
            'message' => 'Laporan berhasil dikirim',
            'data' => $report
        ]);
    }
    
    /**
     * Update report status (for admin)
     */
    public function moderate(Request $request, $id)
    {
        // Check if user is admin using both field methods
        if (Auth::user()->role !== 'admin' && !Auth::user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Validasi input
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:approve,reject,delete',
            'resolution_note' => 'nullable|string|max:1000',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Dapatkan laporan
        $report = ForumReport::findOrFail($id);
        
        // Periksa apakah laporan bisa diperbarui (hanya yang masih reported/pending)
        if ($report->status !== 'reported') {
            return response()->json(['error' => 'Laporan ini sudah diproses sebelumnya'], 422);
        }
        
        // Proses berdasarkan action
        $action = $request->action;
        
        if ($action === 'approve' || $action === 'delete') {
            // Setujui laporan dan ambil tindakan pada kontennya
            $report->status = 'resolved';
            $report->resolution_note = $request->resolution_note ?? 'Laporan disetujui dan konten telah ditinjau';
            $report->resolved_at = now();
            // Store the admin ID in 'reported_by_id' field
            $report->save();
            
            // Jika action adalah delete, hapus atau blokir kontennya
            if ($action === 'delete') {
                if ($report->reportable_type === 'comment' && $report->comment) {
                    // Hapus komentar
                    $report->comment->delete();
                } elseif ($report->reportable_type === 'thread' && $report->thread) {
                    // Hapus thread
                    $report->thread->delete();
                }
            }
        } else {
            // Tolak laporan
            $report->status = 'rejected';
            $report->resolution_note = $request->resolution_note ?? 'Laporan ditolak setelah ditinjau';
            $report->resolved_at = now();
            $report->save();
        }
        
        return response()->json([
            'message' => 'Status laporan berhasil diperbarui',
            'data' => [
                'id' => $report->id,
                'status' => $report->status,
                'resolution_note' => $report->resolution_note,
                'resolved_at' => $report->resolved_at,
                'action_taken' => $action
            ]
        ]);
    }
    
    /**
     * Get report statistics
     */
    public function statistics()
    {
        // Check if user is admin using both field methods
        if (Auth::user()->role !== 'admin' && !Auth::user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $stats = [
            'total' => ForumReport::count(),
            'pending' => ForumReport::where('status', 'reported')->count(),
            'resolved' => ForumReport::where('status', 'resolved')->count(),
            'rejected' => ForumReport::where('status', 'rejected')->count(),
            'thread_reports' => ForumReport::where('reportable_type', 'thread')->count(),
            'comment_reports' => ForumReport::where('reportable_type', 'comment')->count()
        ];
        
        return response()->json($stats);
    }
    
    /**
     * Delete all reports (for admin)
     */
    public function deleteAll()
    {
        // Check if user is admin using both field methods
        if (Auth::user()->role !== 'admin' && !Auth::user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        try {
            // Hitung total laporan sebelum dihapus
            $totalReports = ForumReport::count();
            
            // Hapus semua laporan
            $deleted = ForumReport::truncate();
            
            return response()->json([
                'message' => 'Semua laporan berhasil dihapus',
                'data' => [
                    'total_deleted' => $totalReports
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete reports',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTrace() : []
            ], 500);
        }
    }
}
