<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->waste_type_id,
            'nama' => $this->nama_sampah,
            'deskripsi' => $this->deskripsi,
            'karakteristik' => $this->karakteristik,
            'tingkat_kesulitan' => $this->tingkat_kesulitan,
            'gambar' => $this->gambar ? url('storage/app/public/' . $this->gambar) : null,
            'dampak_lingkungan' => $this->dampak_lingkungan,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'kategori' => $this->whenLoaded('category', function() {
                return new WasteCategoryResource($this->category);
            }),
            'nilai' => $this->whenLoaded('values', function() {
                return WasteValueResource::collection($this->values);
            }),
            'tutorial' => $this->whenLoaded('tutorials', function() {
                return TutorialResource::collection($this->tutorials);
            }),
        ];
    }
} 