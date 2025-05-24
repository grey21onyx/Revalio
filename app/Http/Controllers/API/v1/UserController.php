<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

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

    /**
     * Get current user profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $user->load('wasteTrackings', 'roles.permissions');

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
            ]
        ]);
    }

    /**
     * Update user profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'sometimes|required|string|max:100',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:100',
                Rule::unique('users')->ignore($user->user_id, 'user_id'),
            ],
            'no_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'preferensi_sampah' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui',
            'data' => [
                'user' => $user
            ]
        ]);
    }

    /**
     * Update user password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password saat ini salah'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diperbarui'
        ]);
    }

    /**
     * Upload user profile photo.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadPhoto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'foto' => 'required|image|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Hapus foto lama jika bukan default
        if ($user->foto_profil && $user->foto_profil != 'profiles/default.jpg') {
            Storage::disk('public')->delete($user->foto_profil);
        }

        // Simpan foto baru
        $path = $request->file('foto')->store('profiles', 'public');

        $user->update([
            'foto_profil' => $path
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Foto profil berhasil diperbarui',
            'data' => [
                'foto_profil' => $path,
                'foto_url' => asset('storage/' . $path)
            ]
        ]);
    }

    /**
     * Get user waste tracking history.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function wasteHistory(Request $request)
    {
        $user = $request->user();
        $wasteTrackings = $user->wasteTrackings()
                            ->with('wasteType')
                            ->orderBy('tanggal_pencatatan', 'desc')
                            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $wasteTrackings
        ]);
    }

    /**
     * Get user statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics(Request $request)
    {
        $user = $request->user();
        
        // Total sampah yang terlacak
        $totalWaste = $user->wasteTrackings()->sum('jumlah');
        
        // Total nilai estimasi
        $totalValue = $user->wasteTrackings()->sum('nilai_estimasi');
        
        // Jumlah jenis sampah yang pernah dilacak
        $uniqueWasteTypes = $user->wasteTrackings()
            ->distinct('waste_id')
            ->count('waste_id');
            
        // Top 3 jenis sampah yang paling banyak dikoleksi
        $topWastes = $user->wasteTrackings()
            ->selectRaw('waste_id, SUM(jumlah) as total_amount')
            ->with('wasteType')
            ->groupBy('waste_id')
            ->orderByDesc('total_amount')
            ->limit(3)
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_waste' => $totalWaste,
                'total_value' => $totalValue,
                'unique_waste_types' => $uniqueWasteTypes,
                'top_wastes' => $topWastes,
            ]
        ]);
    }
} 