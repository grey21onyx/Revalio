<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WasteBuyer extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'waste_buyers';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'pembeli_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nama_pembeli',
        'jenis_pembeli',
        'alamat',
        'kontak',
        'email',
        'website',
        'jam_operasional',
        'latitude',
        'longitude',
        'status',
        'rating',
        'jumlah_rating',
        'kota',
        'provinsi',
        'foto',
        'deskripsi',
    ];

    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'rating' => 'decimal:2',
        'jumlah_rating' => 'integer',
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['nama_pembeli', 'alamat', 'email', 'jenis_pembeli', 'kota', 'provinsi'];
    
    /**
     * Method tambahan untuk memfilter berdasarkan jenis pembeli
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('jenis_pembeli', $type);
    }
    
    /**
     * Method tambahan untuk memfilter berdasarkan status aktif
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'AKTIF');
    }

    /**
     * Method tambahan untuk memfilter berdasarkan jenis sampah
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param mixed $wasteId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAcceptsWaste($query, $wasteId)
    {
        return $query->whereHas('wasteTypes', function ($q) use ($wasteId) {
            $q->where('waste_id', $wasteId);
        });
    }
    
    /**
     * Relasi ke model WasteBuyerType (jenis sampah yang dibeli).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function wasteTypes(): HasMany
    {
        return $this->hasMany(WasteBuyerType::class, 'pembeli_id', 'pembeli_id');
    }
} 