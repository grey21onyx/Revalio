<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'user' => $this->whenLoaded('user', function() {
                return [
                    'id' => $this->user->user_id,
                    'nama' => $this->user->nama_lengkap,
                    'foto_profil' => $this->user->foto_profil ? asset('storage/' . $this->user->foto_profil) : null,
                ];
            }),
            'tutorial_id' => $this->tutorial_id,
        ];
    }
} 