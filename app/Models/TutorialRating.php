<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TutorialRating extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'tutorial_id',
        'rating',
    ];
    
    protected $casts = [
        'rating' => 'integer',
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
    
    /**
     * Validasi rating 1-5
     */
    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = min(5, max(1, $value));
    }
} 