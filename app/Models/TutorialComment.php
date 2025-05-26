<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TutorialComment extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'user_id',
        'tutorial_id',
        'content',
        'status',
    ];
    
    /**
     * Relasi dengan tutorial
     */
    public function tutorial(): BelongsTo
    {
        return $this->belongsTo(Tutorial::class, 'tutorial_id');
    }
    
    /**
     * Relasi dengan pengguna
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
} 