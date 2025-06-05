<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Schema;

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
        'name',
        'description',
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['nama_kategori', 'deskripsi', 'name', 'description'];
    
    /**
     * Accessor to always return a name regardless of schema
     *
     * @return string
     */
    public function getNameAttribute($value)
    {
        if (Schema::hasColumn('waste_categories', 'name') && !empty($value)) {
            return $value;
        }
        
        return $this->attributes['nama_kategori'] ?? '';
    }
    
    /**
     * Accessor to always return a description regardless of schema
     *
     * @return string
     */
    public function getDescriptionAttribute($value)
    {
        if (Schema::hasColumn('waste_categories', 'description') && !empty($value)) {
            return $value;
        }
        
        return $this->attributes['deskripsi'] ?? '';
    }
    
    /**
     * Relasi ke model WasteType (jenis sampah).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function wasteTypes(): HasMany
    {
        return $this->hasMany(WasteType::class, 'kategori_id', 'kategori_id');
    }
    
    /**
     * Relasi ke model WasteType menggunakan kolom baru.
     */
    public function wasteTypesNew(): HasMany
    {
        return $this->hasMany(WasteType::class, 'waste_category_id', 'kategori_id');
    }
}
