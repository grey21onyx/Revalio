<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->category_id,
            'nama' => $this->nama_kategori,
            'deskripsi' => $this->deskripsi,
            'ikon' => $this->ikon ? url('storage/app/public/' . $this->ikon) : null,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'jenis_sampah' => $this->whenLoaded('wasteTypes', function() {
                return WasteTypeResource::collection($this->wasteTypes);
            }),
        ];
    }
} 