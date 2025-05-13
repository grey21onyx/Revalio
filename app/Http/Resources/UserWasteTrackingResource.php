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
            'waste_type_id' => $this->waste_type_id,
            'jumlah' => $this->jumlah,
            'satuan' => $this->satuan,
            'tanggal_dicatat' => $this->tanggal_dicatat,
            'estimasi_nilai' => $this->estimasi_nilai,
            'catatan' => $this->catatan,
            'foto' => $this->foto ? url('storage/app/public/' . $this->foto) : null,
            'user' => $this->whenLoaded('user', function() {
                return new UserResource($this->user);
            }),
            'jenis_sampah' => $this->whenLoaded('wasteType', function() {
                return new WasteTypeResource($this->wasteType);
            }),
        ];
    }
} 