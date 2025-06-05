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
    protected $table = 'user_waste_trackings';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'id';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'waste_type_id',
        'amount',
        'unit',
        'tracking_date',
        'management_status',
        'estimated_value',
        'notes',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'float',
        'estimated_value' => 'float',
        'tracking_date' => 'datetime',
    ];
    
    /**
     * Menentukan bahwa model menggunakan timestamps created_at dan updated_at
     *
     * @var bool
     */
    public $timestamps = true;
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['notes', 'management_status'];
    
    /**
     * Kolom tanggal untuk pengurutan data terbaru
     *
     * @var string
     */
    protected $dateColumn = 'tracking_date';
    
    /**
     * Total nilai estimasi tracking sampah
     */
    public static function getTotalNilai($userId = null)
    {
        $query = self::query();
        
        if ($userId) {
            $query->where('user_id', $userId);
        }
        
        return $query->sum('estimated_value');
    }
    
    /**
     * Total jumlah sampah yang dikelola
     */
    public static function getTotalJumlah($userId = null)
    {
        $query = self::query();
        
        if ($userId) {
            $query->where('user_id', $userId);
        }
        
        return $query->sum('amount');
    }
    
    /**
     * Filter berdasarkan status pengelolaan
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('management_status', $status);
    }
    
    /**
     * Filter berdasarkan rentang tanggal
     */
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('tracking_date', [$startDate, $endDate]);
    }
    
    /**
     * Relasi ke model User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    /**
     * Get the waste type of this tracking record.
     */
    public function wasteType()
    {
        return $this->belongsTo(WasteType::class, 'waste_type_id');
    }
} 