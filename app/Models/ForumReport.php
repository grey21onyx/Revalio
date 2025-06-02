<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumReport extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'reportable_type',
        'reportable_id',
        'thread_id',
        'comment_id',
        'user_id',
        'reported_by_id',
        'report_reason',
        'description',
        'status',
        'resolution_note',
        'reported_at',
        'resolved_at',
    ];
    
    protected $casts = [
        'reported_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];
    
    /**
     * Get the reportable entity (thread or comment)
     */
    public function reportable()
    {
        return $this->morphTo('reportable', 'reportable_type', 'reportable_id');
    }
    
    /**
     * Get the thread associated with the report
     */
    public function thread()
    {
        return $this->belongsTo(ForumThread::class, 'thread_id', 'thread_id');
    }
    
    /**
     * Get the comment associated with the report
     */
    public function comment()
    {
        return $this->belongsTo(ForumComment::class, 'comment_id', 'komentar_id');
    }
    
    /**
     * Get the user who created the reported content
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }
    
    /**
     * Get the user who reported the content
     */
    public function reportedBy()
    {
        return $this->belongsTo(User::class, 'reported_by_id')->withTrashed();
    }
    
    /**
     * Dapatkan admin yang menyelesaikan laporan
     */
    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by')->withTrashed();
    }
    
    /**
     * Scope untuk laporan yang menunggu
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
    
    /**
     * Scope untuk laporan yang sudah diselesaikan
     */
    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }
    
    /**
     * Scope untuk laporan yang ditolak
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
