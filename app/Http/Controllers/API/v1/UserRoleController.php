<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\RoleResource;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserRoleController extends Controller
{
    /**
     * Display users with their roles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::with('roles')->get();

        return response()->json([
            'status' => 'success',
            'data' => UserResource::collection($users)
        ]);
    }

    /**
     * Get roles for a specific user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserRoles($id)
    {
        $user = User::with('roles')->find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => RoleResource::collection($user->roles)
        ]);
    }

    /**
     * Assign roles to a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function assignRoles(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,role_id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->roles()->sync($request->roles);

        return response()->json([
            'status' => 'success',
            'message' => 'Roles berhasil ditambahkan ke user',
            'data' => new UserResource($user->load('roles'))
        ]);
    }

    /**
     * Remove a specific role from a user.
     *
     * @param  int  $userId
     * @param  int  $roleId
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeRole($userId, $roleId)
    {
        $user = User::find($userId);
        $role = Role::find($roleId);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if (!$role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role tidak ditemukan'
            ], 404);
        }

        if (!$user->roles->contains($role->role_id)) {
            return response()->json([
                'status' => 'error',
                'message' => 'User tidak memiliki role tersebut'
            ], 400);
        }

        $user->roles()->detach($role->role_id);

        return response()->json([
            'status' => 'success',
            'message' => 'Role berhasil dihapus dari user',
            'data' => new UserResource($user->load('roles'))
        ]);
    }

    /**
     * Get users with a specific role.
     *
     * @param  int  $roleId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsersByRole($roleId)
    {
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role tidak ditemukan'
            ], 404);
        }

        $users = $role->users;

        return response()->json([
            'status' => 'success',
            'data' => UserResource::collection($users)
        ]);
    }

    /**
     * Check if user has a specific role.
     *
     * @param  int  $userId
     * @param  string  $roleSlug
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkRole($userId, $roleSlug)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $hasRole = $user->hasRole($roleSlug);

        return response()->json([
            'status' => 'success',
            'has_role' => $hasRole
        ]);
    }
}
