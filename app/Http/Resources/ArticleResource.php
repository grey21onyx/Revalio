<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->article_id,
            'judul' => $this->judul,
            'konten' => $this->konten,
            'ringkasan' => $this->ringkasan,
            'gambar_sampul' => $this->gambar_sampul ? url('storage/app/public/' . $this->gambar_sampul) : null,
            'tanggal_publikasi' => $this->tanggal_publikasi,
            'tag' => $this->tag,
            'kategori' => $this->kategori,
            'status' => $this->status,
            'penulis_id' => $this->penulis_id,
            'penulis' => $this->whenLoaded('author', function() {
                return new UserResource($this->author);
            }),
        ];
    }
} 