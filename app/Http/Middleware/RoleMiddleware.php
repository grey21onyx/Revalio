<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Memeriksa apakah user memiliki role yang diperlukan.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|array  $roles  Role atau array roles yang dibutuhkan
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Login required'
            ], 401);
        }

        $user = Auth::user();
        
        // Special handling for 'admin' role
        if (in_array('admin', $roles)) {
            // Check using both methods - custom role method and direct property
            if ($user->role === 'admin' || $user->isadminByRole() || $user->is_admin) {
                return $next($request);
            }
        } else {
            // For non-admin roles, use the regular role check
            foreach ($roles as $role) {
                if ($user->hasRole($role)) {
                    return $next($request);
                }
            }
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Forbidden: Insufficient role privileges'
        ], 403);
    }
}
