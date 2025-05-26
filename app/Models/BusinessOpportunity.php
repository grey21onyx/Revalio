<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BusinessOpportunity extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'business_opportunities';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'peluang_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'judul',
        'deskripsi',
        'jenis_sampah_terkait',
        'investasi_minimal',
        'investasi_maksimal',
        'potensi_keuntungan',
        'gambar',
        'sumber_informasi',
        'tanggal_publikasi',
        'status',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'investasi_minimal' => 'decimal:2',
        'investasi_maksimal' => 'decimal:2',
        'tanggal_publikasi' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['judul', 'deskripsi', 'jenis_sampah_terkait', 'potensi_keuntungan'];
    
    /**
     * Relasi many-to-many dengan WasteType.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function wasteTypes(): BelongsToMany
    {
        return $this->belongsToMany(
            WasteType::class,
            'business_opportunity_waste_types',
            'peluang_id',
            'waste_id'
        )->withTimestamps();
    }
} 