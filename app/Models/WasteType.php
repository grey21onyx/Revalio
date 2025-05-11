<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WasteType extends Model
{
    use HasFactory;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'waste_types';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'waste_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nama_sampah',
        'kategori_id',
        'deskripsi',
        'cara_sortir',
        'cara_penyimpanan',
        'gambar',
        'status_aktif',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status_aktif' => 'boolean',
    ];
    
    /**
     * Menentukan bahwa model hanya menggunakan timestamp updated_at.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * Relasi ke model WasteCategory (kategori sampah).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(WasteCategory::class, 'kategori_id', 'kategori_id');
    }
    
    /**
     * Relasi ke model WasteValue (nilai ekonomis sampah).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function value(): HasOne
    {
        return $this->hasOne(WasteValue::class, 'waste_id', 'waste_id');
    }
    
    /**
     * Relasi ke model Tutorial.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tutorials(): HasMany
    {
        return $this->hasMany(Tutorial::class, 'waste_id', 'waste_id');
    }
    
    /**
     * Relasi ke model UserWasteTracking.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function trackings(): HasMany
    {
        return $this->hasMany(UserWasteTracking::class, 'waste_id', 'waste_id');
    }
    
    /**
     * Relasi ke model WasteBuyerType (pembeli sampah).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function buyers(): HasMany
    {
        return $this->hasMany(WasteBuyerType::class, 'waste_id', 'waste_id');
    }
}
