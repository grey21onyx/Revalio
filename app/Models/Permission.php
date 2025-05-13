<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    use HasFactory, CommonScopes, HasSlug;

    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'permission_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'slug',
        'deskripsi'
    ];

    /**
     * Field yang digunakan untuk generate slug
     *
     * @var string
     */
    protected $slugField = 'nama';

    /**
     * Field yang digunakan untuk tujuan slug
     *
     * @var string
     */
    protected $slugDestination = 'slug';

    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['nama', 'deskripsi'];

    /**
     * Relasi ke tabel roles melalui tabel perantara permission_role
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'permission_role', 'permission_id', 'role_id');
    }
}
