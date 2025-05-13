<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Likeable
{
    /**
     * Boot trait untuk menyiapkan relasi likes
     *
     * @return void
     */
    public static function bootLikeable()
    {
        static::deleting(function ($model) {
            // Hapus semua likes yang terkait dengan model ini
            $model->likes()->delete();
        });
    }

    /**
     * Relasi polymorphic untuk likes
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function likes(): MorphMany
    {
        return $this->morphMany('App\Models\Like', 'likeable');
    }

    /**
     * Menambahkan like dari user ke model
     *
     * @param User $user
     * @return bool
     */
    public function like(User $user): bool
    {
        if ($this->isLikedBy($user)) {
            return false;
        }

        $this->likes()->create([
            'user_id' => $user->user_id,
            'type' => 'like',
        ]);

        return true;
    }

    /**
     * Menghapus like dari user pada model
     *
     * @param User $user
     * @return bool
     */
    public function unlike(User $user): bool
    {
        return (bool) $this->likes()
            ->where('user_id', $user->user_id)
            ->where('type', 'like')
            ->delete();
    }

    /**
     * Memeriksa apakah model ini disukai oleh user tertentu
     *
     * @param User $user
     * @return bool
     */
    public function isLikedBy(User $user): bool
    {
        return (bool) $this->likes()
            ->where('user_id', $user->user_id)
            ->where('type', 'like')
            ->count();
    }

    /**
     * Mendapatkan jumlah like pada model
     *
     * @return int
     */
    public function getLikesCountAttribute(): int
    {
        return $this->likes()->where('type', 'like')->count();
    }
} 