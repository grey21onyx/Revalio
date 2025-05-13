<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumThread extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait;
    
    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'forum_threads';
    
    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'thread_id';
    
    /**
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'judul',
        'konten',
        'tanggal_posting',
        'status',
        'tags',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_posting' => 'datetime',
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
    protected $searchableFields = ['judul', 'konten', 'tags'];
    
    /**
     * Kolom tanggal untuk pengurutan data terbaru
     *
     * @var string
     */
    protected $dateColumn = 'tanggal_posting';
    
    /**
     * Method tambahan untuk memfilter thread berdasarkan tag
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $tag
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithTag($query, $tag)
    {
        return $query->where('tags', 'LIKE', "%{$tag}%");
    }
    
    /**
     * Method tambahan untuk memfilter thread yang aktif
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAktif($query)
    {
        return $query->where('status', 'AKTIF');
    }
    
    /**
     * Method tambahan untuk mendapatkan thread yang populer
     * berdasarkan jumlah komentar
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePopular($query, $limit = 5)
    {
        return $query->withCount('comments')
            ->orderBy('comments_count', 'desc')
            ->limit($limit);
    }
    
    /**
     * Relasi ke model User (pembuat thread).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    
    /**
     * Relasi ke model ForumComment (komentar dalam thread).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments(): HasMany
    {
        return $this->hasMany(ForumComment::class, 'thread_id', 'thread_id');
    }
} 