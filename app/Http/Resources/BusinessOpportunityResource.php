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
            'id' => $this->opportunity_id,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'jenis_sampah_terkait' => $this->jenis_sampah_terkait,
            'investasi_minimal' => $this->investasi_minimal,
            'investasi_maksimal' => $this->investasi_maksimal,
            'potensi_keuntungan' => $this->potensi_keuntungan,
            'gambar' => $this->gambar ? url('storage/app/public/' . $this->gambar) : null,
            'sumber_informasi' => $this->sumber_informasi,
            'tanggal_publikasi' => $this->tanggal_publikasi,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 