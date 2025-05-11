<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteBuyerType extends Model
{
    use HasFactory;
    
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
     * Menentukan bahwa model ini tidak menggunakan timestamp.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'harga_beli' => 'decimal:2',
    ];
    
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