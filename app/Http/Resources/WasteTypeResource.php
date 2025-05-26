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
            'id' => $this->waste_id,
            'nama' => $this->nama_sampah,
            'deskripsi' => $this->deskripsi,
            'karakteristik' => $this->karakteristik,
            'tingkat_kesulitan' => $this->tingkat_kesulitan,
            'gambar' => $this->gambar ? url('storage/' . $this->gambar) : null,
            'dampak_lingkungan' => $this->dampak_lingkungan,
            'status_aktif' => $this->status_aktif,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'kategori_id' => $this->kategori_id,
            'kategori' => $this->whenLoaded('category', function() {
                return new WasteCategoryResource($this->category);
            }),
            'values' => $this->whenLoaded('wasteValues', function() {
                return WasteValueResource::collection($this->wasteValues);
            }),
            'tutorials' => $this->whenLoaded('tutorials', function() {
                return TutorialResource::collection($this->tutorials);
            }),
        ];
    }
} 