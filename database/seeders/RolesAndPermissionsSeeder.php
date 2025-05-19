<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Illuminate\Cache\CacheManager::class]->forget('roles');
        app()[\Illuminate\Cache\CacheManager::class]->forget('permissions');

        // Create permissions
        $permissions = [
            // User Management
            ['nama' => 'View Users', 'deskripsi' => 'Dapat melihat daftar pengguna'],
            ['nama' => 'Create Users', 'deskripsi' => 'Dapat membuat pengguna baru'],
            ['nama' => 'Edit Users', 'deskripsi' => 'Dapat mengedit pengguna yang ada'],
            ['nama' => 'Delete Users', 'deskripsi' => 'Dapat menghapus pengguna'],
            
            // Role Management
            ['nama' => 'View Roles', 'deskripsi' => 'Dapat melihat daftar role'],
            ['nama' => 'Create Roles', 'deskripsi' => 'Dapat membuat role baru'],
            ['nama' => 'Edit Roles', 'deskripsi' => 'Dapat mengedit role yang ada'],
            ['nama' => 'Delete Roles', 'deskripsi' => 'Dapat menghapus role'],
            
            // Permission Management
            ['nama' => 'View Permissions', 'deskripsi' => 'Dapat melihat daftar permission'],
            ['nama' => 'Create Permissions', 'deskripsi' => 'Dapat membuat permission baru'],
            ['nama' => 'Edit Permissions', 'deskripsi' => 'Dapat mengedit permission yang ada'],
            ['nama' => 'Delete Permissions', 'deskripsi' => 'Dapat menghapus permission'],
            
            // Content Management
            ['nama' => 'Manage Content', 'deskripsi' => 'Dapat mengelola konten pada platform'],
            
            // Waste Management
            ['nama' => 'Manage Waste Types', 'deskripsi' => 'Dapat mengelola tipe sampah'],
            ['nama' => 'Manage Waste Categories', 'deskripsi' => 'Dapat mengelola kategori sampah'],
            ['nama' => 'Manage Waste Values', 'deskripsi' => 'Dapat mengelola nilai sampah'],
            
            // Forum Management
            ['nama' => 'Moderate Forums', 'deskripsi' => 'Dapat memoderasi forum diskusi'],
            
            // User Actions
            ['nama' => 'Track Waste', 'deskripsi' => 'Dapat melacak sampah yang dikumpulkan'],
            ['nama' => 'Create Forum Posts', 'deskripsi' => 'Dapat membuat postingan di forum'],
            ['nama' => 'Comment Forum', 'deskripsi' => 'Dapat berkomentar di forum'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['nama' => $permission['nama']],
                ['deskripsi' => $permission['deskripsi']]
            );
        }

        // Create roles
        $roles = [
            [
                'nama' => 'Admin',
                'deskripsi' => 'Administrator dengan semua hak akses',
                'permissions' => Permission::whereIn('nama', [
                    // User Management
                    'View Users', 'Create Users', 'Edit Users', 'Delete Users',
                    // Role Management
                    'View Roles', 'Create Roles', 'Edit Roles', 'Delete Roles',
                    // Permission Management
                    'View Permissions', 'Create Permissions', 'Edit Permissions', 'Delete Permissions',
                    // Content Management
                    'Manage Content',
                    // Waste Management
                    'Manage Waste Types', 'Manage Waste Categories', 'Manage Waste Values',
                    // Forum Management
                    'Moderate Forums',
                    // User Actions (mungkin tidak semua relevan untuk admin, tapi untuk kelengkapan)
                    'Track Waste', 'Create Forum Posts', 'Comment Forum'
                ])->pluck('permission_id')->toArray()
            ],
            [
                'nama' => 'User',
                'deskripsi' => 'Pengguna regular',
                'permissions' => Permission::whereIn('nama', [
                    'Track Waste', 'Create Forum Posts', 'Comment Forum'
                ])->pluck('permission_id')->toArray()
            ],
        ];

        foreach ($roles as $role) {
            $permissions = $role['permissions'];
            unset($role['permissions']);
            
            $roleModel = Role::updateOrCreate(
                ['nama' => $role['nama']],
                ['deskripsi' => $role['deskripsi']]
            );
            
            // Sync daripada attach untuk menghindari duplikasi
            $roleModel->permissions()->sync($permissions);
        }

        // Assign admin role to a user (optional)
        // Cek langsung dengan query untuk menghindari soft delete issue
        $admin = Role::where('nama', 'Admin')->first();
        $adminUser = DB::table('users')->where('email', 'admin@revalio.com')->first();

        if ($adminUser && $admin) {
            // Cek dulu apakah sudah ada role_user
            $exists = DB::table('role_user')
                ->where('user_id', $adminUser->user_id)
                ->where('role_id', $admin->role_id)
                ->exists();

            if (!$exists) {
                DB::table('role_user')->insert([
                    'user_id' => $adminUser->user_id,
                    'role_id' => $admin->role_id
                ]);
            }
        }
    }
}
