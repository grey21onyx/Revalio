<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WasteBuyer extends Model
{
    use HasFactory;
    
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
     * Menentukan bahwa model ini tidak menggunakan timestamp.
     *
     * @var bool
     */
    public $timestamps = false;
    
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