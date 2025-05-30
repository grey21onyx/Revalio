<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ForumThreadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Pastikan nilai rating dan view_count selalu dalam format numerik yang tepat
        $averageRating = $this->average_rating ?? null;
        $ratingCount = $this->rating_count ?? null;
        $viewCount = $this->view_count ?? null;
        
        // Log debug info untuk data rating
        \Illuminate\Support\Facades\Log::debug("ForumThreadResource: {$this->thread_id} - average_rating: " . 
            ($averageRating !== null ? $averageRating : 'null') . 
            ", type: " . gettype($averageRating));
        
        // Buat array resource dengan validasi data numerik
        $resourceArray = [
            'id' => $this->thread_id,
            'judul' => $this->judul,
            'konten' => $this->konten,
            'tanggal_posting' => $this->tanggal_posting ? $this->tanggal_posting->toIso8601String() : null,
            'status' => $this->status,
            'tags' => $this->tags,
            'user_id' => $this->user_id,
            'user' => $this->when($this->relationLoaded('user'), function () {
                return [
                    'id' => $this->user->user_id,
                    'name' => $this->user->name,
                    'nama' => $this->user->nama ?? null,
                    'nama_lengkap' => $this->user->nama_lengkap ?? null,
                    'email' => $this->user->email,
                    'foto_profil' => $this->user->foto_profil,
                    'role' => $this->user->role,
                    'created_at' => $this->user->created_at,
                    'tanggal_registrasi' => $this->user->created_at
                ];
            }),
            'comments_count' => isset($this->comments_count) ? (int) $this->comments_count : null,
            'likes_count' => isset($this->likes_count) ? (int) $this->likes_count : null,
            'is_liked' => $this->when(isset($this->is_liked), $this->is_liked),
            'view_count' => $viewCount !== null ? (int) $viewCount : 0,
            'average_rating' => $averageRating !== null ? (float) $averageRating : 0,
            'rating_count' => $ratingCount !== null ? (int) $ratingCount : 0,
        ];
        
        // Log resource array untuk debugging
        \Illuminate\Support\Facades\Log::debug("ForumThreadResource output for thread {$this->thread_id}", [
            'view_count' => $resourceArray['view_count'],
            'average_rating' => $resourceArray['average_rating'],
            'rating_count' => $resourceArray['rating_count']
        ]);
        
        return $resourceArray;
    }
} 