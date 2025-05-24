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
            'id' => $this->komentar_id,
            'thread_id' => $this->thread_id,
            'user_id' => $this->user_id,
            'konten' => $this->konten,
            'tanggal_komentar' => $this->tanggal_komentar,
            'parent_komentar_id' => $this->parent_komentar_id,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => $this->whenLoaded('user', function() {
                return new UserResource($this->user);
            }),
            'thread' => $this->whenLoaded('thread', function() {
                return new ForumThreadResource($this->thread);
            }),
            'parent' => $this->whenLoaded('parent', function() {
                return new ForumCommentResource($this->parent);
            }),
            'replies' => $this->whenLoaded('replies', function() {
                return ForumCommentResource::collection($this->replies);
            }),
            'replies_count' => $this->whenCounted('replies')
        ];
    }
} 