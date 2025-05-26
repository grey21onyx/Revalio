<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessOpportunityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->peluang_id,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'jenis_sampah_terkait' => $this->jenis_sampah_terkait,
            'investasi_minimal' => $this->investasi_minimal,
            'investasi_maksimal' => $this->investasi_maksimal,
            'potensi_keuntungan' => $this->potensi_keuntungan,
            'gambar_url' => $this->gambar ? url('storage/' . $this->gambar) : null,
            'sumber_informasi' => $this->sumber_informasi,
            'tanggal_publikasi' => $this->tanggal_publikasi ? $this->tanggal_publikasi->format('Y-m-d H:i:s') : null,
            'status' => $this->status,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
            'waste_types' => isset($this->whenLoaded('wasteTypes')->first()->id) ? 
                WasteTypeResource::collection($this->whenLoaded('wasteTypes')) : [],
        ];
    }
} 