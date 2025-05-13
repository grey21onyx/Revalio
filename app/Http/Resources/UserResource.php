<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->user_id,
            'nama' => $this->nama_lengkap,
            'email' => $this->email,
            'no_telepon' => $this->no_telepon,
            'alamat' => $this->alamat,
            'foto_profil' => $this->foto_profil ? url('storage/app/public/' . $this->foto_profil) : null,
            'tanggal_registrasi' => $this->tanggal_registrasi,
            'status_akun' => $this->status_akun,
            'preferensi_sampah' => $this->preferensi_sampah,
            'updated_at' => $this->updated_at,
        ];
    }
} 