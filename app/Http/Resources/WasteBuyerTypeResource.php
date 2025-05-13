<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteBuyerTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->type_id,
            'nama' => $this->nama_tipe,
            'deskripsi' => $this->deskripsi,
            'ikon' => $this->ikon ? url('storage/app/public/' . $this->ikon) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'pembeli' => $this->whenLoaded('buyers', function() {
                return WasteBuyerResource::collection($this->buyers);
            }),
        ];
    }
} 