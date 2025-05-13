<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TutorialResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->tutorial_id,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'tingkat_kesulitan' => $this->tingkat_kesulitan,
            'waktu_pengerjaan' => $this->waktu_pengerjaan,
            'alat_bahan' => $this->alat_bahan,
            'langkah_langkah' => $this->langkah_langkah,
            'video_url' => $this->video_url,
            'gambar' => $this->gambar ? url('storage/app/public/' . $this->gambar) : null,
            'tipe_tutorial' => $this->tipe_tutorial,
            'jenis_sampah_id' => $this->waste_type_id,
            'tanggal_publikasi' => $this->tanggal_publikasi,
            'status' => $this->status,
            'jenis_sampah' => $this->whenLoaded('wasteType', function() {
                return new WasteTypeResource($this->wasteType);
            }),
        ];
    }
} 