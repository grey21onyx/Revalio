<?php

namespace App\Models;

use App\Traits\CommonScopes;
use App\Traits\HasUuid;
use App\Traits\RecyclableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, CommonScopes, RecyclableTrait;

    /**
     * Primary key yang digunakan oleh tabel.
     *
     * @var string
     */
    protected $primaryKey = 'user_id';

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
        'role',
        'preferensi_sampah',
    ];

    /**
     * The attributes that should be guarded from mass assignment.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'role'
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
        'role' => 'string',
    ];
    
    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'role' => 'USER',
    ];
    
    /**
     * Field yang dapat dicari
     *
     * @var array<string>
     */
    protected $searchableFields = ['nama_lengkap', 'email', 'alamat'];
    
    /**
     * Kolom status untuk menentukan status aktif
     *
     * @var string
     */
    protected $statusColumn = 'status_akun';
    
    /**
     * Nilai yang menunjukkan status aktif
     *
     * @var string
     */
    protected $activeStatusValue = 'AKTIF';
    
    /**
     * Kolom tanggal otomatis yang akan di-manage.
     *
     * @var array<string>
     */
    protected $dates = [
        'tanggal_registrasi',
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

    /**
     * Relasi ke model Role melalui tabel pivot role_user
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }

    /**
     * Memeriksa apakah user memiliki role tertentu
     *
     * @param string|array $roles
     * @return bool
     */
    public function hasRole($roles): bool
    {
        if (is_string($roles)) {
            return $this->roles->contains('slug', $roles);
        }

        foreach ($roles as $role) {
            if ($this->roles->contains('slug', $role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Memeriksa apakah user memiliki permission tertentu
     * 
     * @param string|array $permissions
     * @return bool
     */
    public function hasPermission($permissions): bool
    {
        $userPermissions = $this->getAllPermissions();
        
        if (is_string($permissions)) {
            return $userPermissions->contains('slug', $permissions);
        }
        
        foreach ($permissions as $permission) {
            if ($userPermissions->contains('slug', $permission)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Memeriksa apakah user memiliki role admin
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Assign role ke user
     *
     * @param string|Role $role
     * @return void
     */
    public function assignRole($role): void
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }

        $this->roles()->syncWithoutDetaching([$role->role_id]);
    }

    /**
     * Hapus role dari user
     *
     * @param string|Role $role
     * @return void
     */
    public function removeRole($role): void
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }

        $this->roles()->detach($role->role_id);
    }

    /**
     * Mendapatkan semua permissions yang dimiliki user dari semua roles.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAllPermissions()
    {
        return $this->roles->flatMap(function ($role) {
            return $role->permissions;
        })->unique('permission_id');
    }
    
    /**
     * Relasi ke model SocialIdentity.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function socialIdentities(): HasMany
    {
        return $this->hasMany(SocialIdentity::class, 'user_id', 'user_id');
    }

    /**
     * Memeriksa apakah user memiliki role admin berdasarkan kolom role
     * 
     * @return bool
     */
    public function isAdminByRole(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Memeriksa apakah user memiliki role moderator berdasarkan kolom role
     * 
     * @return bool
     */
    public function isModeratorByRole(): bool
    {
        return $this->role === 'moderator';
    }

    /**
     * Memeriksa apakah user memiliki peran tertentu berdasarkan kolom role
     * 
     * @param string|array $roles
     * @return bool
     */
    public function hasRoleByAttribute($roles): bool
    {
        if (is_string($roles)) {
            return $this->role === $roles;
        }

        return in_array($this->role, (array) $roles);
    }

    /**
     * Get the deleted records associated with the user.
     */
    public function deletedRecords()
    {
        return $this->hasMany(DeletedRecord::class, 'user_id', 'user_id');
    }
    
    /**
     * Relasi ke model WasteType untuk favorit
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function favoriteWasteTypes(): BelongsToMany
    {
        return $this->belongsToMany(WasteType::class, 'user_favorite_waste_types', 'user_id', 'waste_id')
                    ->withTimestamps();
    }
}
