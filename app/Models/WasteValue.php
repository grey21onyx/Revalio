<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteValue extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'waste_type_id',
        'price_per_unit',
        'is_active',
        'notes'
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price_per_unit' => 'decimal:2',
        'is_active' => 'boolean',
        // Keep old casts for backward compatibility
        'harga_minimum' => 'decimal:2',
        'harga_maksimum' => 'decimal:2',
        'tanggal_update' => 'datetime',
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['waste_type_id', 'price_per_unit', 'notes'];
    
    /**
     * Kolom tanggal untuk pengurutan data terbaru
     *
     * @var string
     */
    protected $dateColumn = 'updated_at';
    
    /**
     * Method tambahan untuk memfilter berdasarkan range harga
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param float $min
     * @param float $max
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePriceRange($query, $min, $max)
    {
        return $query->where('price_per_unit', '>=', $min)
                     ->where('price_per_unit', '<=', $max);
    }
    
    /**
     * Get the waste type that owns this value.
     */
    public function wasteType()
    {
        return $this->belongsTo(WasteType::class, 'waste_type_id', 'waste_id');
    }

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'waste_values_new';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';
}
