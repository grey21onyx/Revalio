<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumTopic extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'judul',
        'konten',
        'tags',
        'view_count',
    ];

    /**
     * Get the user that owns the forum topic.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the comments for the forum topic.
     */
    public function comments()
    {
        return $this->hasMany(ForumComment::class, 'topic_id');
    }

    /**
     * The users that liked this topic.
     */
    public function likes()
    {
        return $this->belongsToMany(User::class, 'forum_topic_likes', 'topic_id', 'user_id')
            ->withTimestamps();
    }

    /**
     * Get the views for the forum topic.
     */
    public function views()
    {
        return $this->hasMany(ForumView::class, 'topic_id');
    }

    /**
     * Get the ratings for the forum topic.
     */
    public function ratings()
    {
        return $this->hasMany(ForumRating::class, 'topic_id');
    }

    /**
     * Calculate average rating
     */
    public function getAverageRatingAttribute()
    {
        return $this->ratings()->avg('rating') ?: 0;
    }

    /**
     * Get rating count
     */
    public function getRatingCountAttribute()
    {
        return $this->ratings()->count();
    }
} 