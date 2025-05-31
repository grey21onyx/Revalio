<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumRating extends Model
{
    use HasFactory;
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'thread_id',
        'rating',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
    ];
    
    /**
     * Relasi dengan thread forum
     */
    public function thread(): BelongsTo
    {
        return $this->belongsTo(ForumThread::class, 'thread_id', 'thread_id');
    }
    
    /**
     * Relasi dengan pengguna
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    
    /**
     * Validasi rating 1-5
     */
    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = min(5, max(1, (int)$value));
    }
}