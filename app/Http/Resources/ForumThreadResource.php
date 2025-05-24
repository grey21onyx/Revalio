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
            'tanggal_posting' => $this->tanggal_posting,
            'status' => $this->status,
            'tags' => $this->tags,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => $this->whenLoaded('user', function() {
                return new UserResource($this->user);
            }),
            'comments' => $this->whenLoaded('comments', function() {
                return ForumCommentResource::collection($this->comments);
            }),
            'comments_count' => $this->whenCounted('comments')
        ];
    }
} 