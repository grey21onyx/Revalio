<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = User::query();
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama_lengkap', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('alamat', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status_akun', $request->status);
        }
        
        // Pagination
        $perPage = $request->input('per_page', 15);
        $users = $query->paginate($perPage);
        
        return response()->json(new UserCollection($users));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'no_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'status_akun' => 'nullable|string|in:AKTIF,TIDAK_AKTIF,SUSPENDED',
            'preferensi_sampah' => 'nullable|string',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except('foto_profil');
        $data['password'] = Hash::make($request->password);
        $data['tanggal_registrasi'] = now();
        $data['updated_at'] = now();
        
        if (!isset($data['status_akun'])) {
            $data['status_akun'] = 'AKTIF';
        }

        // Handle file upload
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $filename = 'profile_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/profiles', $filename);
            $data['foto_profil'] = 'profiles/' . $filename;
        }

        $user = User::create($data);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'user' => new UserResource($user)
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(new UserResource($user));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'nama_lengkap' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($id, 'user_id'),
            ],
            'no_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'status_akun' => 'nullable|string|in:AKTIF,TIDAK_AKTIF,SUSPENDED',
            'preferensi_sampah' => 'nullable|string',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->except(['password', 'foto_profil', '_method']);
        $data['updated_at'] = now();
        
        // Handle file upload
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $filename = 'profile_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/profiles', $filename);
            $data['foto_profil'] = 'profiles/' . $filename;
        }

        $user->update($data);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Check if user has RecyclableTrait
        if (method_exists($user, 'recycle')) {
            $user->recycle();
            $message = 'User berhasil dipindahkan ke recycle bin';
        } else {
            $user->delete();
            $message = 'User berhasil dihapus';
        }

        return response()->json([
            'message' => $message
        ]);
    }
} 