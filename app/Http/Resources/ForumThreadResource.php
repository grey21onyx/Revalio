<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ForumThreadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->thread_id,
            'judul' => $this->judul,
            'konten' => $this->konten,
            'gambar' => $this->gambar ? url('storage/app/public/' . $this->gambar) : null,
            'tanggal_posting' => $this->tanggal_posting,
            'kategori' => $this->kategori,
            'tag' => $this->tag,
            'status' => $this->status,
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', function() {
                return new UserResource($this->user);
            }),
            'comments' => $this->whenLoaded('comments', function() {
                return ForumCommentResource::collection($this->comments);
            }),
            'likes_count' => $this->whenCounted('likes'),
            'comments_count' => $this->whenCounted('comments'),
        ];
    }
} 