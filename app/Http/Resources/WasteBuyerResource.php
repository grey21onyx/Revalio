<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteBuyerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->buyer_id,
            'nama' => $this->nama,
            'alamat' => $this->alamat,
            'kota' => $this->kota,
            'provinsi' => $this->provinsi,
            'kontak' => $this->kontak,
            'email' => $this->email,
            'website' => $this->website,
            'jam_operasional' => $this->jam_operasional,
            'jenis_sampah_diterima' => $this->jenis_sampah_diterima,
            'persyaratan_pembelian' => $this->persyaratan_pembelian,
            'kisaran_harga' => $this->kisaran_harga,
            'metode_pembayaran' => $this->metode_pembayaran,
            'buyer_type_id' => $this->buyer_type_id,
            'foto' => $this->foto ? url('storage/app/public/' . $this->foto) : null,
            'rating' => $this->rating,
            'status' => $this->status,
            'tipe_pembeli' => $this->whenLoaded('buyerType', function() {
                return new WasteBuyerTypeResource($this->buyerType);
            }),
        ];
    }
} 