<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'articles';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'artikel_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'judul',
        'deskripsi_singkat',
        'konten',
        'kategori',
        'penulis_id',
        'tanggal_publikasi',
        'status',
        'gambar_utama',
        'tags',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_publikasi' => 'datetime',
    ];
    
    /**
     * Menentukan bahwa model hanya menggunakan timestamp updated_at.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['judul', 'deskripsi_singkat', 'konten', 'kategori', 'tags'];
    
    /**
     * Kolom tanggal untuk pengurutan data terbaru
     *
     * @var string
     */
    protected $dateColumn = 'tanggal_publikasi';
    
    /**
     * Nilai yang menunjukkan status aktif
     *
     * @var string
     */
    protected $activeStatusValue = 'PUBLISHED';
    
    /**
     * Relasi ke model User (penulis artikel).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function penulis(): BelongsTo
    {
        return $this->belongsTo(User::class, 'penulis_id', 'user_id');
    }
} 