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
        // Pastikan kontributor/penulis tutorial ada jika tersedia
        $kontributor = null;
        if ($this->resource->relationLoaded('user') && $this->user) {
            $kontributor = [
                'nama' => $this->user->nama_lengkap ?? 'Kontributor',
                'avatar' => $this->user->foto_profil ? url('storage/' . $this->user->foto_profil) : null
            ];
        }

        // Siapkan koleksi komentar jika dimuat
        $comments = [];
        if ($this->resource->relationLoaded('comments')) {
            $comments = $this->comments->map(function($comment) {
                return [
                    'id' => $comment->id,
                    'user' => [
                        'nama_lengkap' => $comment->user ? $comment->user->nama_lengkap : 'Pengguna',
                        'foto_profil' => $comment->user && $comment->user->foto_profil ? url('storage/' . $comment->user->foto_profil) : null
                    ],
                    'content' => $comment->content,
                    'rating' => $comment->rating,
                    'created_at' => $comment->created_at
                ];
            });
        }

        // Menangani konten yang dalam bentuk JSON atau string
        $konten = $this->konten;
        if (is_string($konten) && json_decode($konten)) {
            $konten = json_decode($konten, true);
        } elseif (!is_array($konten)) {
            // Jika konten bukan array dan bukan JSON string, buat struktur default
            $konten = [
                'bahan_dan_alat' => [],
                'langkah_langkah' => [],
                'tips' => ''
            ];
            
            // Coba konversi data lama ke format baru jika ada
            if (!empty($this->alat_bahan)) {
                $konten['bahan_dan_alat'] = $this->parseAlatBahan($this->alat_bahan);
            }
            
            if (!empty($this->langkah_langkah)) {
                $konten['langkah_langkah'] = $this->parseLangkahLangkah($this->langkah_langkah);
            }
        }

        return [
            'id' => $this->tutorial_id,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'tingkat_kesulitan' => $this->tingkat_kesulitan,
            'estimasi_waktu' => $this->estimasi_waktu,
            'jenis_tutorial' => $this->jenis_tutorial,
            'konten' => $konten,
            'gambar' => $this->gambar ? url('storage/' . $this->gambar) : null,
            'average_rating' => $this->average_rating,
            'rating_count' => $this->ratings_count ?? $this->ratings()->count(),
            'view_count' => $this->view_count,
            'jenis_sampah' => $this->whenLoaded('wasteType', function() {
                return [
                    'nama' => $this->wasteType->nama_sampah,
                    'kategori_id' => $this->wasteType->kategori_id
                ];
            }),
            'kontributor' => $kontributor,
            'comments' => $comments,
            'is_saved' => $this->when(isset($this->is_saved), $this->is_saved),
            'is_completed' => $this->when(isset($this->is_completed), $this->is_completed),
            'user_rating' => $this->when(isset($this->user_rating), $this->user_rating),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Parse alat dan bahan dari format string lama ke format array
     * 
     * @param string $alatBahan
     * @return array
     */
    private function parseAlatBahan($alatBahan)
    {
        $items = [];
        $lines = explode("\n", trim($alatBahan));
        
        foreach ($lines as $line) {
            if (!empty(trim($line))) {
                $items[] = [
                    'nama' => trim($line),
                    'gambar' => '/assets/images/materials/default.jpg'
                ];
            }
        }
        
        return $items;
    }
    
    /**
     * Parse langkah-langkah dari format string lama ke format array
     * 
     * @param string $langkahLangkah
     * @return array
     */
    private function parseLangkahLangkah($langkahLangkah)
    {
        $steps = [];
        $lines = explode("\n", trim($langkahLangkah));
        $stepNumber = 1;
        
        foreach ($lines as $line) {
            if (!empty(trim($line))) {
                $steps[] = [
                    'langkah' => $stepNumber,
                    'judul' => "Langkah $stepNumber",
                    'deskripsi' => trim($line),
                    'media' => '/assets/images/steps/default.jpg'
                ];
                $stepNumber++;
            }
        }
        
        return $steps;
    }
} 