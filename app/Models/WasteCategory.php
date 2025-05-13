<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WasteCategory extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'waste_categories';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'kategori_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nama_kategori',
        'deskripsi',
        'ikon',
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['nama_kategori', 'deskripsi'];
    
    /**
     * Relasi ke model WasteType (jenis sampah).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function wasteTypes(): HasMany
    {
        return $this->hasMany(WasteType::class, 'kategori_id', 'kategori_id');
    }
}
