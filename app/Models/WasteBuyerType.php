<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteBuyerType extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'waste_buyer_types';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'pembeli_id',
        'waste_id',
        'harga_beli',
        'syarat_minimum',
        'catatan',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'harga_beli' => 'decimal:2',
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['syarat_minimum', 'catatan'];
    
    /**
     * Method tambahan untuk memfilter berdasarkan harga
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param float $minPrice
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeMinimumPrice($query, $minPrice)
    {
        return $query->where('harga_beli', '>=', $minPrice);
    }
    
    /**
     * Relasi ke model WasteBuyer (pembeli sampah).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function wasteBuyer(): BelongsTo
    {
        return $this->belongsTo(WasteBuyer::class, 'pembeli_id', 'pembeli_id');
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