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
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['nama_pembeli', 'alamat', 'email', 'jenis_pembeli'];
    
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
     * Relasi ke model WasteBuyerType (jenis sampah yang dibeli).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function wasteTypes(): HasMany
    {
        return $this->hasMany(WasteBuyerType::class, 'pembeli_id', 'pembeli_id');
    }
} 