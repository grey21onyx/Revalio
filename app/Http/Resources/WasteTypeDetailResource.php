<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteTypeDetailResource extends JsonResource
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
            'cara_sortir' => $this->cara_sortir,
            'cara_penyimpanan' => $this->cara_penyimpanan,
            'gambar' => $this->gambar ? asset('storage/' . $this->gambar) : null,
            'status_aktif' => (bool) $this->status_aktif,
            
            'kategori' => $this->whenLoaded('category', function() {
                return [
                    'id' => $this->category->kategori_id,
                    'nama' => $this->category->nama_kategori,
                    'ikon' => $this->category->ikon ? asset('storage/' . $this->category->ikon) : null,
                ];
            }),
            
            'nilai_terkini' => $this->whenLoaded('values', function() {
                $latestValue = $this->values->sortByDesc('tanggal_update')->first();
                if ($latestValue) {
                    return [
                        'id' => $latestValue->nilai_id,
                        'min' => (float) $latestValue->harga_minimum,
                        'max' => (float) $latestValue->harga_maksimum,
                        'satuan' => $latestValue->satuan,
                        'tanggal_update' => $latestValue->tanggal_update->format('Y-m-d'),
                        'sumber_data' => $latestValue->sumber_data,
                    ];
                }
                return null;
            }),
            
            'nilai_history' => $this->whenLoaded('values', function() {
                return $this->values->map(function($value) {
                    return [
                        'id' => $value->nilai_id,
                        'min' => (float) $value->harga_minimum,
                        'max' => (float) $value->harga_maksimum,
                        'satuan' => $value->satuan,
                        'tanggal_update' => $value->tanggal_update->format('Y-m-d'),
                    ];
                });
            }),
            
            'panduan_terkait' => $this->whenLoaded('tutorials', function() {
                return TutorialResource::collection($this->tutorials);
            }),
            
            'pembeli_potensial' => $this->whenLoaded('buyers', function() {
                return $this->buyers->map(function($buyerType) {
                    return [
                        'id' => $buyerType->buyer->pembeli_id,
                        'nama_pembeli' => $buyerType->buyer->nama_pembeli,
                        'jenis_pembeli' => $buyerType->buyer->jenis_pembeli,
                        'alamat' => $buyerType->buyer->alamat,
                        'kontak' => $buyerType->buyer->kontak,
                        'harga_beli' => (float) $buyerType->harga_beli,
                        'syarat_minimum' => $buyerType->syarat_minimum,
                    ];
                });
            }),
            
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
