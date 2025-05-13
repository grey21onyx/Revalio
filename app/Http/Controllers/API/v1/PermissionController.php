<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $permissions = Permission::all();

        return response()->json([
            'status' => 'success',
            'data' => PermissionResource::collection($permissions)
        ]);
    }

    /**
     * Store a newly created permission in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:50|unique:permissions,nama',
            'deskripsi' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $permission = Permission::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Permission berhasil dibuat',
            'data' => new PermissionResource($permission)
        ], 201);
    }

    /**
     * Display the specified permission.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => new PermissionResource($permission)
        ]);
    }

    /**
     * Update the specified permission in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|required|string|max:50|unique:permissions,nama,' . $id . ',permission_id',
            'deskripsi' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $permission->update($request->only(['nama', 'deskripsi']));

        return response()->json([
            'status' => 'success',
            'message' => 'Permission berhasil diperbarui',
            'data' => new PermissionResource($permission)
        ]);
    }

    /**
     * Remove the specified permission from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $permission = Permission::find($id);

        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission tidak ditemukan'
            ], 404);
        }

        // Cek apakah permission sedang digunakan oleh role
        if ($permission->roles()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission sedang digunakan oleh role, tidak dapat dihapus'
            ], 400);
        }

        $permission->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Permission berhasil dihapus'
        ]);
    }

    /**
     * Get roles that have this permission.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRoles($id)
    {
        $permission = Permission::with('roles')->find($id);

        if (!$permission) {
            return response()->json([
                'status' => 'error',
                'message' => 'Permission tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => RoleResource::collection($permission->roles)
        ]);
    }
}
