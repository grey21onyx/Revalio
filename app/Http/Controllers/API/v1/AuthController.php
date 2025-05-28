<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\SocialIdentity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
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

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'no_telepon' => $request->no_telepon,
            'alamat' => $request->alamat,
            'tanggal_registrasi' => now(),
            'status_akun' => 'AKTIF',
            'role' => 'user',
            'preferensi_sampah' => $request->preferensi_sampah,
        ]);

        event(new Registered($user));

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi berhasil',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 201);
    }

    /**
     * Login user and create token
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        if ($user->status_akun !== 'AKTIF') {
            Auth::logout();
            return response()->json([
                'status' => 'error',
                'message' => 'Akun anda tidak aktif'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * Get authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        $user = $request->user();
        $user->load('roles.permissions');

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
            ]
        ]);
    }

    /**
     * Logout user (revoke the token)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil'
        ]);
    }
    
    /**
     * Update user profile
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'nama_lengkap' => 'sometimes|string|max:255',
            'no_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'preferensi_sampah' => 'nullable|string',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
        
        $data = $request->only(['nama_lengkap', 'no_telepon', 'alamat', 'preferensi_sampah']);
        
        // Handle file upload
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $filename = 'profile_' . time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/profiles', $filename);
            $data['foto_profil'] = 'profiles/' . $filename;
        }
        
        $data['updated_at'] = now();
        $user->update($data);
        
        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => new UserResource($user),
        ]);
    }
    
    /**
     * Change user password
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $user = $request->user();
        
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak sesuai'],
            ]);
        }
        
        $user->update([
            'password' => Hash::make($request->password),
            'updated_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Password berhasil diubah',
        ]);
    }

    /**
     * Send password reset link
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $token = Str::random(60);
        
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token,
                'created_at' => now()
            ]
        );
        
        // Disini seharusnya mengirim email dengan token, tapi untuk API kita return saja
        // Pada implementasi nyata, gunakan: 
        // \Illuminate\Support\Facades\Password::sendResetLink($request->only('email'))
        
        return response()->json([
            'message' => 'Link reset password telah dikirim ke email anda',
            'token' => $token // Pada implementasi nyata, token seharusnya tidak di-return
        ]);
    }
    
    /**
     * Reset password
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();
            
        if (!$tokenData) {
            return response()->json([
                'message' => 'Token tidak valid atau telah kedaluwarsa'
            ], 422);
        }
        
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->updated_at = now();
        $user->save();
        
        // Hapus token setelah digunakan
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();
            
        return response()->json([
            'message' => 'Password berhasil diubah'
        ]);
    }

    /**
     * Redirect user to the specified provider for social login
     *
     * @param string $provider
     * @return \Illuminate\Http\JsonResponse
     */
    public function redirectToProvider($provider)
    {
        $validProviders = ['google', 'facebook'];

        if (!in_array($provider, $validProviders)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Provider tidak valid'
            ], 400);
        }

        $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();

        return response()->json([
            'status' => 'success',
            'redirect_url' => $url
        ]);
    }
    
    /**
     * Handle callback dari provider social
     *
     * @param string $provider
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleProviderCallback($provider, Request $request)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Autentikasi sosial gagal',
                'error' => $e->getMessage()
            ], 422);
        }

        $socialId = SocialIdentity::where('provider_name', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($socialId) {
            $user = $socialId->user;
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ]);
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'nama_lengkap' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(str_random(24)),
                'tanggal_registrasi' => now(),
                'status_akun' => 'AKTIF',
                'role' => 'user',
                'foto_profil' => $socialUser->getAvatar(),
            ]);

            event(new Registered($user));
        }

        $user->socialIdentities()->create([
            'provider_name' => $provider,
            'provider_id' => $socialUser->getId(),
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }
}