<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteBuyerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $wasteTypeData = $this->whenLoaded('wasteTypes', function () {
            return $this->wasteTypes->map(function ($wasteType) {
                return [
                    'waste_id' => $wasteType->waste_id,
                    'nama_sampah' => $wasteType->wasteType->nama_sampah ?? null,
                    'harga_beli' => $wasteType->harga_beli,
                    'syarat_minimum' => $wasteType->syarat_minimum,
                    'catatan' => $wasteType->catatan,
                ];
            });
        }, []);
        
        $result = [
            'buyer_id' => $this->pembeli_id,
            'nama_pembeli' => $this->nama_pembeli,
            'jenis_pembeli' => $this->jenis_pembeli,
            'alamat' => $this->alamat,
            'kota' => $this->kota,
            'provinsi' => $this->provinsi,
            'kontak' => $this->kontak,
            'email' => $this->email,
            'website' => $this->website,
            'jam_operasional' => $this->jam_operasional,
            'status' => $this->status,
            'rating' => (float) $this->rating,
            'jumlah_rating' => $this->jumlah_rating,
            'foto' => $this->foto ? url('storage/' . $this->foto) : null,
            'deskripsi' => $this->deskripsi,
        ];

        // Tambahkan data GIS jika tersedia
        if ($this->latitude && $this->longitude) {
            $result['lokasi'] = [
                'latitude' => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
            ];
        }

        // Tambahkan jarak jika tersedia (hasil dari query getNearbyLocations)
        if (isset($this->distance)) {
            $result['jarak'] = round($this->distance, 2); // Dalam kilometer, dibulatkan 2 desimal
        }

        // Tambahkan data jenis sampah jika tersedia
        if (count($wasteTypeData) > 0) {
            $result['sampah_diterima'] = $wasteTypeData;
        }

        return $result;
    }
} 