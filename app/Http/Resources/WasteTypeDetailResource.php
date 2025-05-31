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
            'kategori_id' => $this->kategori_id,
            'category' => $this->whenLoaded('category', function() {
                return [
                    'id' => $this->category->kategori_id,
                    'nama' => $this->category->nama_kategori,
                    'ikon' => $this->category->ikon ? asset('storage/' . $this->category->ikon) : null,
                ];
            }),
            'wasteValues' => $this->whenLoaded('wasteValues', function() {
                return $this->wasteValues->map(function($value) {
                    return [
                        'nilai_id' => $value->nilai_id,
                        'harga_minimum' => (float) $value->harga_minimum,
                        'harga_maksimum' => (float) $value->harga_maksimum,
                        'satuan' => $value->satuan,
                        'tanggal_update' => $value->tanggal_update,
                        'sumber_data' => $value->sumber_data,
                        'created_at' => $value->created_at,
                        'updated_at' => $value->updated_at,
                    ];
                })->sortByDesc('tanggal_update')->values();
            }),
            'tutorials' => $this->whenLoaded('tutorials', function() {
                return $this->tutorials->map(function($tutorial) {
                    return [
                        'id' => $tutorial->id,
                        'judul' => $tutorial->judul,
                        'slug' => $tutorial->slug,
                        'deskripsi' => $tutorial->deskripsi,
                        'gambar' => $tutorial->gambar ? asset('storage/' . $tutorial->gambar) : null,
                    ];
                });
            }),
            'dampak_lingkungan' => $this->dampak_lingkungan ?? null,
            'karakteristik' => $this->karakteristik ?? null,
            'tips_penggunaan' => $this->tips_penggunaan ?? null,
            'tingkat_kesulitan' => $this->tingkat_kesulitan ?? 'MEDIUM',
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
