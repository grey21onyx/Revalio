<?php

namespace App\Models;

use App\Traits\CommonScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeletedRecord extends Model
{
    use HasFactory, CommonScopes;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'deleted_records';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'deletion_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'table_name',
        'record_id',
        'record_data',
        'deletion_date',
        'user_id',
        'restoration_status',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'record_data' => 'json',
        'deletion_date' => 'datetime',
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
    protected $searchableFields = ['table_name'];
    
    /**
     * Kolom tanggal untuk pengurutan data terbaru
     *
     * @var string
     */
    protected $dateColumn = 'deletion_date';
    
    /**
     * Kolom status untuk menentukan status aktif
     *
     * @var string
     */
    protected $statusColumn = 'restoration_status';
    
    /**
     * Nilai yang menunjukkan status aktif
     *
     * @var string
     */
    protected $activeStatusValue = 'NOT_RESTORED';
    
    /**
     * Method tambahan untuk memfilter berdasarkan nama tabel
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $tableName
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFromTable($query, $tableName)
    {
        return $query->where('table_name', $tableName);
    }
    
    /**
     * Relasi ke model User (penghapus record).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
} 