<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserWasteTrackingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->tracking_id,
            'user_id' => $this->user_id,
            'waste_id' => $this->waste_id,
            'waste_type' => $this->whenLoaded('wasteType', function() {
                return [
                    'id' => $this->wasteType->waste_id,
                    'name' => $this->wasteType->nama_sampah,
                    'category' => $this->wasteType->category ? [
                        'id' => $this->wasteType->category->kategori_id,
                        'name' => $this->wasteType->category->nama_kategori
                    ] : null
                ];
            }),
            'jumlah' => $this->jumlah,
            'satuan' => $this->satuan,
            'tanggal_pencatatan' => $this->tanggal_pencatatan->format('Y-m-d H:i:s'),
            'status_pengelolaan' => $this->status_pengelolaan,
            'nilai_estimasi' => $this->nilai_estimasi,
            'catatan' => $this->catatan,
            'foto' => $this->foto ? asset('storage/' . $this->foto) : null,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
} 