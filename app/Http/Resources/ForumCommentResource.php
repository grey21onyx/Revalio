<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ForumCommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->comment_id,
            'thread_id' => $this->thread_id,
            'parent_id' => $this->parent_id,
            'konten' => $this->konten,
            'gambar' => $this->gambar ? url('storage/app/public/' . $this->gambar) : null,
            'tanggal_posting' => $this->tanggal_posting,
            'status' => $this->status,
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', function() {
                return new UserResource($this->user);
            }),
            'replies' => $this->whenLoaded('replies', function() {
                return ForumCommentResource::collection($this->replies);
            }),
            'likes_count' => $this->whenCounted('likes'),
        ];
    }
} 