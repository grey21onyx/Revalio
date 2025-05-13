<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tutorial extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'tutorials';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'tutorial_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'waste_id',
        'judul',
        'deskripsi',
        'jenis_tutorial',
        'konten',
        'media',
        'tingkat_kesulitan',
        'estimasi_waktu',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estimasi_waktu' => 'integer',
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
    protected $searchableFields = ['judul', 'deskripsi', 'konten', 'jenis_tutorial'];
    
    /**
     * Method tambahan untuk memfilter tutorial berdasarkan tingkat kesulitan
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $difficulty
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithDifficulty($query, $difficulty)
    {
        return $query->where('tingkat_kesulitan', $difficulty);
    }
    
    /**
     * Method tambahan untuk memfilter tutorial berdasarkan jenis
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('jenis_tutorial', $type);
    }
    
    /**
     * Relasi ke model WasteType (jenis sampah).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function wasteType(): BelongsTo
    {
        return $this->belongsTo(WasteType::class, 'waste_id', 'waste_id');
    }
} 