<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory, CommonScopes, HasSlug;

    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'role_id';

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
     * Relasi ke tabel users melalui tabel perantara role_user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user', 'role_id', 'user_id');
    }

    /**
     * Relasi ke tabel permissions melalui tabel perantara permission_role
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role', 'role_id', 'permission_id');
    }

    /**
     * Check apakah role memiliki permission tertentu
     *
     * @param string|array $permissions
     * @return bool
     */
    public function hasPermission($permissions): bool
    {
        if (is_string($permissions)) {
            return $this->permissions->contains('slug', $permissions);
        }

        foreach ($permissions as $permission) {
            if ($this->permissions->contains('slug', $permission)) {
                return true;
            }
        }

        return false;
    }
}
