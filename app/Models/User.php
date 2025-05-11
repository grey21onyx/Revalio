<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'user_id';

    /**
     * Timestamp diabaikan, karena tabel tidak memiliki kolom created_at dan updated_at
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_lengkap',
        'email',
        'password',
        'no_telepon',
        'alamat',
        'foto_profil',
        'tanggal_registrasi',
        'status_akun',
        'preferensi_sampah',
        'updated_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'tanggal_registrasi' => 'datetime',
    ];
    
    /**
     * Kolom tanggal otomatis yang akan di-manage.
     *
     * @var array<string>
     */
    protected $dates = [
        'tanggal_registrasi',
        'updated_at',
    ];
    
    /**
     * Relasi ke model UserWasteTracking.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function wasteTrackings(): HasMany
    {
        return $this->hasMany(UserWasteTracking::class, 'user_id', 'user_id');
    }
    
    /**
     * Relasi ke model Article (sebagai penulis).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'penulis_id', 'user_id');
    }
    
    /**
     * Relasi ke model ForumThread.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function forumThreads(): HasMany
    {
        return $this->hasMany(ForumThread::class, 'user_id', 'user_id');
    }
    
    /**
     * Relasi ke model ForumComment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function forumComments(): HasMany
    {
        return $this->hasMany(ForumComment::class, 'user_id', 'user_id');
    }
}
