<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\RecyclableTrait;
use App\Traits\Likeable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumThread extends Model
{
    use HasFactory, CommonScopes, RecyclableTrait, Likeable;
    
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
        'view_count',
    ];
    
    /**
     * Kolom-kolom yang harus di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_posting' => 'datetime',
        'average_rating' => 'float',
        'rating_count' => 'integer',
    ];
    
    /**
     * Konstanta untuk nilai status.
     */
    const STATUS_AKTIF = 'AKTIF';
    const STATUS_NONAKTIF = 'NONAKTIF';
    
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
        return $query->where('status', self::STATUS_AKTIF);
    }
    
    /**
     * Method tambahan untuk mendapatkan thread yang populer
     * berdasarkan gabungan dari jumlah komentar, views, likes, dan rating
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePopular($query, $limit = 5)
    {
        return $query->withCount(['comments', 'likes'])
            ->orderByRaw('(IFNULL(view_count, 0) * 1 + IFNULL(comments_count, 0) * 3 + IFNULL(likes_count, 0) * 5 + IFNULL(average_rating, 0) * 4) DESC')
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
    
    /**
     * Relasi ke model ForumRating (rating untuk thread).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(ForumRating::class, 'thread_id', 'thread_id');
    }
    
    /**
     * Mengupdate rating rata-rata thread
     *
     * @return void
     */
    public function updateAverageRating(): void
    {
        // Hitung rata-rata rating dengan validasi nilai
        $averageRating = $this->ratings()->avg('rating');
        
        // Pastikan nilai adalah numeric yang valid
        $this->average_rating = $averageRating !== null ? (float)$averageRating : 0.0;
        
        // Hitung jumlah rating
        $this->rating_count = $this->ratings()->count();
        
        // Debug info
        \Illuminate\Support\Facades\Log::info("Updating rating for thread {$this->thread_id}: avg={$this->average_rating}, count={$this->rating_count}");
        
        $this->save();
    }
    
    /**
     * Mendapatkan rating dari user tertentu
     *
     * @param int $userId
     * @return int|null
     */
    public function getRatingFromUser(int $userId): ?int
    {
        $rating = $this->ratings()->where('user_id', $userId)->first();
        return $rating ? $rating->rating : null;
    }
} 
