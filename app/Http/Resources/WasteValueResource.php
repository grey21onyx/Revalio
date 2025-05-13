<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteValueResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->value_id,
            'jenis_sampah_id' => $this->waste_type_id,
            'nilai_minimal' => $this->nilai_minimal,
            'nilai_maksimal' => $this->nilai_maksimal,
            'satuan' => $this->satuan,
            'tanggal_update' => $this->tanggal_update,
            'sumber_data' => $this->sumber_data,
            'catatan' => $this->catatan,
            'jenis_sampah' => $this->whenLoaded('wasteType', function() {
                return new WasteTypeResource($this->wasteType);
            }),
        ];
    }
} 