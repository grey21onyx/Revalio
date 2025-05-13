<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserWasteTracking extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'user_waste_tracking';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'tracking_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'waste_id',
        'jumlah',
        'satuan',
        'tanggal_pencatatan',
        'status_pengelolaan',
        'nilai_estimasi',
        'catatan',
        'foto',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'jumlah' => 'decimal:2',
        'nilai_estimasi' => 'decimal:2',
        'tanggal_pencatatan' => 'datetime',
    ];
    
    /**
     * Menentukan bahwa model hanya menggunakan timestamp updated_at.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['catatan', 'status_pengelolaan'];
    
    /**
     * Kolom tanggal untuk pengurutan data terbaru
     *
     * @var string
     */
    protected $dateColumn = 'tanggal_pencatatan';
    
    /**
     * Method tambahan untuk memfilter berdasarkan status pengelolaan
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status_pengelolaan', $status);
    }
    
    /**
     * Relasi ke model User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
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