<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Schema;

class WasteType extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
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
        'name',
        'waste_category_id',
        'unit',
        'description'
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
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = [
        'nama_sampah', 'deskripsi', 'cara_sortir', 'cara_penyimpanan',
        'name', 'description'
    ];
    
    /**
     * Kolom status untuk menentukan status aktif
     *
     * @var string
     */
    protected $statusColumn = 'status_aktif';
    
    /**
     * Nilai yang menunjukkan status aktif
     *
     * @var mixed
     */
    protected $activeStatusValue = true;
    
    /**
     * Accessor to always return a name regardless of schema
     *
     * @return string
     */
    public function getNameAttribute($value)
    {
        // If the name column exists and has a value, return it
        if (Schema::hasColumn('waste_types', 'name') && !empty($value)) {
            return $value;
        }
        
        // Otherwise fallback to the old column name
        return $this->attributes['nama_sampah'] ?? '';
    }
    
    /**
     * Accessor to always return a description regardless of schema
     *
     * @return string
     */
    public function getDescriptionAttribute($value)
    {
        // If the description column exists and has a value, return it
        if (Schema::hasColumn('waste_types', 'description') && !empty($value)) {
            return $value;
        }
        
        // Otherwise fallback to the old column name
        return $this->attributes['deskripsi'] ?? '';
    }
    
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
     * Relasi ke model WasteValue (nilai ekonomis sampah).
     * Mendapatkan semua nilai ekonomis yang tercatat untuk jenis sampah ini
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function wasteValues(): HasMany
    {
        return $this->hasMany(WasteValue::class, 'waste_id', 'waste_id');
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
    
    /**
     * Relasi ke model User untuk favorit
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function favoriteByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_favorite_waste_types', 'waste_id', 'user_id')
                    ->withTimestamps();
    }

    /**
     * Get the waste value for this waste type.
     */
    public function wasteValue()
    {
        return $this->hasOne(WasteValue::class, 'waste_type_id', 'waste_id');
    }

    /**
     * Get the waste category that this waste type belongs to.
     */
    public function wasteCategory()
    {
        return $this->belongsTo(WasteCategory::class, 'waste_category_id', 'kategori_id');
    }
}
