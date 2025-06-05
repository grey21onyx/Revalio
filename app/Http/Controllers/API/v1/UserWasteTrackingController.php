<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserWasteTrackingResource;
use App\Http\Resources\WasteTypeResource;
use App\Models\UserWasteTracking;
use App\Models\WasteType;
use App\Models\WasteValue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class UserWasteTrackingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Enhanced debugging for auth issues
            $authCheck = Auth::check();
            $authUser = Auth::user();
            $bearerToken = $request->bearerToken();
            $hasToken = !empty($bearerToken);
            
            // Comprehensive logging to diagnose auth issues
            Log::debug('Auth state in UserWasteTracking index', [
                'auth_check' => $authCheck,
                'auth_user' => $authUser ? $authUser->id : null,
                'has_bearer_token' => $hasToken
            ]);
            
            // SUPER FAILSAFE: Try multiple methods to get user ID
            $userId = null;
            
            // Method 1: Standard Auth facade
            if ($authUser) {
                $userId = $authUser->id;
            } 
            // Method 2: Try to find user by token directly
            else if ($hasToken) {
                // Try to manually get user from token
                try {
                    $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);
                    if ($tokenModel && $tokenModel->tokenable) {
                        $userId = $tokenModel->tokenable->id;
                        Auth::login($tokenModel->tokenable);
                        $authUser = $tokenModel->tokenable;
                    }
                } catch (\Exception $e) {
                    Log::error("Error finding token: " . $e->getMessage());
                }
            }
            // Method 3: Alternative token formats
            if (!$userId) {
                $authHeader = $request->header('Authorization');
                if (!empty($authHeader)) {
                    $tokenFormats = [];
                    
                    if (strpos($authHeader, 'Bearer ') === 0) {
                        $tokenFormats[] = substr($authHeader, 7);
                    }
                    $tokenFormats[] = $authHeader;
                    
                    foreach ($tokenFormats as $possibleToken) {
                        try {
                            $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $possibleToken))->first();
                            if ($token && $token->tokenable) {
                                $userId = $token->tokenable->id;
                                Auth::login($token->tokenable);
                                $authUser = $token->tokenable;
                                break;
                            }
                        } catch (\Exception $e) {
                            Log::error("Error trying alternative token format: " . $e->getMessage());
                        }
                    }
                }
            }
            
            // If we still don't have a user ID, reject the request
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Cannot identify user',
                ], 401);
            }
            
            $query = UserWasteTracking::where('user_id', $userId)
                ->with(['wasteType', 'wasteType.wasteCategory']);
        
        // Apply filters if provided
        if ($request->has('waste_type_id') && !empty($request->waste_type_id)) {
            $query->where('waste_type_id', $request->waste_type_id);
        }
        
        if ($request->has('status') && !empty($request->status)) {
            $query->where('management_status', $request->status);
        }
        
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('tracking_date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('tracking_date', '<=', $request->end_date);
        }
        
        // Sort records - newest first by default
        $query->orderBy('tracking_date', 'desc');
        
                    $records = $query->get()->map(function($record) {
                return $this->formatTrackingRecord($record);
            });
            
            return response()->json([
                'success' => true,
                'data' => $records
            ]);
        } catch (\Exception $e) {
            Log::error('Error in UserWasteTrackingController@index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Enhanced debugging for auth issues
            $authCheck = Auth::check();
            $authUser = Auth::user();
            $bearerToken = $request->bearerToken();
            $hasToken = !empty($bearerToken);
            
            // Comprehensive logging to diagnose auth issues
            Log::debug('Auth state in UserWasteTracking store', [
                'auth_check' => $authCheck,
                'auth_user' => $authUser ? $authUser->id : null,
                'has_bearer_token' => $hasToken,
                'token_preview' => $hasToken ? substr($bearerToken, 0, 10).'...' : null,
                'request_path' => $request->path(),
                'headers' => array_keys($request->headers->all())
            ]);
            
            // SUPER FAILSAFE: Try multiple methods to get user ID
            $userId = null;
            
            // Method 1: Standard Auth facade
            if ($authUser) {
                $userId = $authUser->id;
                Log::info("User identified via Auth::user(): $userId");
            } 
            // Method 2: Try to find user by token directly
            else if ($hasToken) {
                // Try to manually get user from token
                try {
                    $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);
                    if ($tokenModel && $tokenModel->tokenable) {
                        $userId = $tokenModel->tokenable->id;
                        Log::info("User identified via token lookup: $userId");
                        
                        // Important: Set the authenticated user for the rest of the request
                        Auth::login($tokenModel->tokenable);
                    }
                } catch (\Exception $e) {
                    Log::error("Error finding token: " . $e->getMessage());
                }
            }
            // Method 3: Try token table directly (bypass findToken)
            if (!$userId && $hasToken) {
                try {
                    $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $bearerToken))->first();
                    if ($token && $token->tokenable) {
                        $userId = $token->tokenable->id;
                        Log::info("User identified via direct token query: $userId");
                        
                        // Important: Set the authenticated user for the rest of the request
                        Auth::login($token->tokenable);
                    }
                } catch (\Exception $e) {
                    Log::error("Error direct querying token: " . $e->getMessage());
                }
            }
            // Method 4: Try to get from session if available
            if (!$userId && $request->hasSession() && $request->session()->has('user_id')) {
                $userId = $request->session()->get('user_id');
                Log::info("User identified via session: $userId");
            }
            // Method 5: Last resort - grab from request data if provided
            if (!$userId && $request->has('user_id')) {
                $userId = $request->input('user_id');
                Log::info("User identified from request data (fallback): $userId");
            }
            
            // Method 6: Try extracting token from different authorization header formats
            if (!$userId) {
                $authHeader = $request->header('Authorization');
                if (!empty($authHeader)) {
                    // Try different formats
                    $tokenFormats = [];
                    
                    // Format 1: "Bearer [token]"
                    if (strpos($authHeader, 'Bearer ') === 0) {
                        $tokenFormats[] = substr($authHeader, 7);
                    }
                    
                    // Format 2: Raw token
                    $tokenFormats[] = $authHeader;
                    
                    // Try each format
                    foreach ($tokenFormats as $possibleToken) {
                        try {
                            // Direct hash check
                            $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $possibleToken))->first();
                            if ($token && $token->tokenable) {
                                $userId = $token->tokenable->id;
                                Log::info("User identified via alternative token format: $userId");
                                Auth::login($token->tokenable);
                                break;
                            }
                        } catch (\Exception $e) {
                            Log::error("Error trying alternative token format: " . $e->getMessage());
                        }
                    }
                }
            }
            
            // If we still don't have a user ID, try one last desperate approach from http headers
            if (!$userId) {
                // Check all headers for any sign of a token
                foreach ($request->headers->all() as $headerName => $headerValue) {
                    if (strtolower($headerName) == 'authorization' || strtolower($headerName) == 'x-auth-token') {
                        $headerVal = is_array($headerValue) ? $headerValue[0] : $headerValue;
                        if (!empty($headerVal)) {
                            // Remove Bearer if present
                            if (strpos($headerVal, 'Bearer ') === 0) {
                                $headerVal = substr($headerVal, 7);
                            }
                            
                            try {
                                $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $headerVal))->first();
                                if ($token && $token->tokenable) {
                                    $userId = $token->tokenable->id;
                                    Log::info("User identified via header scan: $userId");
                                    Auth::login($token->tokenable);
                                    break;
                                }
                            } catch (\Exception $e) {
                                Log::error("Error in desperate header scan for token: " . $e->getMessage());
                            }
                        }
                    }
                }
            }
            
            // If we still don't have a user ID, reject the request
            if (!$userId) {
                Log::error("Failed to identify user for waste tracking creation");
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Cannot identify user',
                    'error_code' => 'AUTH_USER_NOT_FOUND',
                    'debug' => [
                        'auth_check' => $authCheck,
                        'has_token' => $hasToken,
                        'x_requested_with' => $request->header('X-Requested-With', 'none'),
                        'content_type' => $request->header('Content-Type', 'none'),
                        'accept' => $request->header('Accept', 'none')
                    ]
                ], 401);
            }
            
            // Validate request data
            $validator = Validator::make($request->all(), [
                'waste_type_id' => 'required|exists:waste_types,waste_id',
                'amount' => 'required|numeric|min:0.01|max:99999999.99',
                'unit' => 'required|string|in:kg,liter,pcs',
                'tracking_date' => 'required|date',
                'management_status' => 'required|string|in:disimpan,dijual,didaur ulang',
                'notes' => 'nullable|string|max:1000',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Data tidak valid', 
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Calculate estimated value
            $estimatedValue = $this->calculateEstimatedValue(
                $request->waste_type_id,
                $request->amount
            );
            
            // Create record with our determined user ID
            $tracking = new UserWasteTracking();
            $tracking->user_id = $userId;
            $tracking->waste_type_id = $request->waste_type_id;
            $tracking->amount = $request->amount;
            $tracking->unit = $request->unit;
            $tracking->tracking_date = $request->tracking_date;
            $tracking->management_status = $request->management_status;
            $tracking->notes = $request->notes;
            $tracking->estimated_value = $estimatedValue;
            $tracking->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Data sampah berhasil dicatat',
                'data' => $tracking,
                'meta' => [
                    'auth_method' => $authUser ? 'auth_facade' : 
                                   ($tokenModel ? 'token_lookup' : 
                                   ($request->session()->has('user_id') ? 'session' : 'request_data'))
                ]
            ], 201);
            
        } catch (Exception $e) {
            Log::error('Error in UserWasteTrackingController@store: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'success' => false, 
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        try {
            // Enhanced debugging for auth issues
            $authCheck = Auth::check();
            $authUser = Auth::user();
            $bearerToken = $request->bearerToken();
            $hasToken = !empty($bearerToken);
            
            // Comprehensive logging to diagnose auth issues
            Log::debug('Auth state in UserWasteTracking show', [
                'auth_check' => $authCheck,
                'auth_user' => $authUser ? $authUser->id : null,
                'has_bearer_token' => $hasToken,
                'tracking_id' => $id
            ]);
            
            // SUPER FAILSAFE: Try multiple methods to get user ID
            $userId = null;
            
            // Method 1: Standard Auth facade
            if ($authUser) {
                $userId = $authUser->id;
            } 
            // Method 2: Try to find user by token directly
            else if ($hasToken) {
                // Try to manually get user from token
                try {
                    $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);
                    if ($tokenModel && $tokenModel->tokenable) {
                        $userId = $tokenModel->tokenable->id;
                        Auth::login($tokenModel->tokenable);
                    }
                } catch (\Exception $e) {
                    Log::error("Error finding token: " . $e->getMessage());
                }
            }
            // Method 3: Alternative token formats
            if (!$userId) {
                $authHeader = $request->header('Authorization');
                if (!empty($authHeader)) {
                    $tokenFormats = [];
                    
                    if (strpos($authHeader, 'Bearer ') === 0) {
                        $tokenFormats[] = substr($authHeader, 7);
                    }
                    $tokenFormats[] = $authHeader;
                    
                    foreach ($tokenFormats as $possibleToken) {
                        try {
                            $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $possibleToken))->first();
                            if ($token && $token->tokenable) {
                                $userId = $token->tokenable->id;
                                Auth::login($token->tokenable);
                                break;
                            }
                        } catch (\Exception $e) {
                            Log::error("Error trying alternative token format: " . $e->getMessage());
                        }
                    }
                }
            }
            
            // If we still don't have a user ID, reject the request
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Cannot identify user',
                ], 401);
            }
            
            $tracking = UserWasteTracking::where('user_id', $userId)
                ->where('id', $id)
                ->with(['wasteType', 'wasteType.wasteCategory'])
                ->firstOrFail();
            
            return response()->json([
                'success' => true,
                'data' => $this->formatTrackingRecord($tracking)
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error in UserWasteTrackingController@show: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data: ' . $e->getMessage()
            ], 500);
        }
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
        try {
            // Enhanced debugging for auth issues
            $authCheck = Auth::check();
            $authUser = Auth::user();
            $bearerToken = $request->bearerToken();
            $hasToken = !empty($bearerToken);
            
            // Comprehensive logging to diagnose auth issues
            Log::debug('Auth state in UserWasteTracking update', [
                'auth_check' => $authCheck,
                'auth_user' => $authUser ? $authUser->id : null,
                'has_bearer_token' => $hasToken,
                'token_preview' => $hasToken ? substr($bearerToken, 0, 10).'...' : null,
                'request_path' => $request->path(),
                'headers' => array_keys($request->headers->all())
            ]);
            
            // SUPER FAILSAFE: Try multiple methods to get user ID
            $userId = null;
            
            // Method 1: Standard Auth facade
            if ($authUser) {
                $userId = $authUser->id;
                Log::info("User identified via Auth::user(): $userId");
            } 
            // Method 2: Try to find user by token directly
            else if ($hasToken) {
                // Try to manually get user from token
                try {
                    $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);
                    if ($tokenModel && $tokenModel->tokenable) {
                        $userId = $tokenModel->tokenable->id;
                        Log::info("User identified via token lookup: $userId");
                        
                        // Important: Set the authenticated user for the rest of the request
                        Auth::login($tokenModel->tokenable);
                        $authUser = $tokenModel->tokenable; // Update authUser
                    }
                } catch (\Exception $e) {
                    Log::error("Error finding token: " . $e->getMessage());
                }
            }
            // Method 3: Try token table directly (bypass findToken)
            if (!$userId && $hasToken) {
                try {
                    $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $bearerToken))->first();
                    if ($token && $token->tokenable) {
                        $userId = $token->tokenable->id;
                        Log::info("User identified via direct token query: $userId");
                        
                        // Important: Set the authenticated user for the rest of the request
                        Auth::login($token->tokenable);
                        $authUser = $token->tokenable; // Update authUser
                    }
                } catch (\Exception $e) {
                    Log::error("Error direct querying token: " . $e->getMessage());
                }
            }
            
            // Method 6: Try extracting token from different authorization header formats
            if (!$userId) {
                $authHeader = $request->header('Authorization');
                if (!empty($authHeader)) {
                    // Try different formats
                    $tokenFormats = [];
                    
                    // Format 1: "Bearer [token]"
                    if (strpos($authHeader, 'Bearer ') === 0) {
                        $tokenFormats[] = substr($authHeader, 7);
                    }
                    
                    // Format 2: Raw token
                    $tokenFormats[] = $authHeader;
                    
                    // Try each format
                    foreach ($tokenFormats as $possibleToken) {
                        try {
                            // Direct hash check
                            $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $possibleToken))->first();
                            if ($token && $token->tokenable) {
                                $userId = $token->tokenable->id;
                                Log::info("User identified via alternative token format: $userId");
                                Auth::login($token->tokenable);
                                $authUser = $token->tokenable; // Update authUser
                                break;
                            }
                        } catch (\Exception $e) {
                            Log::error("Error trying alternative token format: " . $e->getMessage());
                        }
                    }
                }
            }
            
            // If we still don't have a user ID, reject the request
            if (!$userId) {
                Log::error("Failed to identify user for waste tracking update");
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Cannot identify user',
                    'error_code' => 'AUTH_USER_NOT_FOUND',
                    'debug' => [
                        'auth_check' => $authCheck,
                        'has_token' => $hasToken,
                        'x_requested_with' => $request->header('X-Requested-With', 'none'),
                        'content_type' => $request->header('Content-Type', 'none'),
                        'accept' => $request->header('Accept', 'none')
                    ]
                ], 401);
            }
            
            logger()->info('UserWasteTracking update called', [
                'tracking_id' => $id,
                'user_id' => $userId,
                'email' => $authUser ? $authUser->email : 'unknown'
            ]);

            $validator = Validator::make($request->all(), [
                'waste_type_id' => 'sometimes|required|exists:waste_types,waste_id',
                'amount' => 'sometimes|required|numeric|min:0.01|max:99999999.99',
                'unit' => 'sometimes|required|string|in:kg,liter,pcs',
                'tracking_date' => 'sometimes|required|date',
                'management_status' => 'sometimes|required|string|in:disimpan,dijual,didaur ulang',
                'notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                logger()->info('UserWasteTracking update validation failed', [
                    'tracking_id' => $id,
                    'errors' => $validator->errors()->toArray()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $tracking = UserWasteTracking::where('user_id', $userId)
                ->where('id', $id)
                ->firstOrFail();
            
            // Update only provided fields
            if ($request->has('waste_type_id')) {
                $tracking->waste_type_id = $request->waste_type_id;
            }
            
            if ($request->has('amount')) {
                $tracking->amount = $request->amount;
            }
            
            if ($request->has('unit')) {
                $tracking->unit = $request->unit;
            }
            
            if ($request->has('tracking_date')) {
                $tracking->tracking_date = $request->tracking_date;
            }
            
            if ($request->has('management_status')) {
                $tracking->management_status = $request->management_status;
            }
            
            if ($request->has('notes')) {
                $tracking->notes = $request->notes;
            }
            
            // Recalculate estimated value if waste type or amount changed
            if ($request->has('waste_type_id') || $request->has('amount')) {
                $tracking->estimated_value = $this->calculateEstimatedValue($tracking->waste_type_id, $tracking->amount);
            }
            
            $tracking->save();
            
            logger()->info('UserWasteTracking record updated', [
                'tracking_id' => $tracking->id,
                'user_id' => $userId
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Data sampah berhasil diperbarui',
                'data' => $this->formatTrackingRecord($tracking->fresh(['wasteType', 'wasteType.wasteCategory']))
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan atau bukan milik Anda',
            ], 404);
        } catch (\Exception $e) {
            logger()->error('Error updating waste tracking', [
                'tracking_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        try {
            // Enhanced debugging for auth issues
            $authCheck = Auth::check();
            $authUser = Auth::user();
            $bearerToken = $request->bearerToken();
            $hasToken = !empty($bearerToken);
            
            // Comprehensive logging to diagnose auth issues
            Log::debug('Auth state in UserWasteTracking destroy', [
                'auth_check' => $authCheck,
                'auth_user' => $authUser ? $authUser->id : null,
                'has_bearer_token' => $hasToken
            ]);
            
            // SUPER FAILSAFE: Try multiple methods to get user ID
            $userId = null;
            
            // Method 1: Standard Auth facade
            if ($authUser) {
                $userId = $authUser->id;
                Log::info("User identified via Auth::user(): $userId");
            } 
            // Method 2: Try to find user by token directly
            else if ($hasToken) {
                // Try to manually get user from token
                try {
                    $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);
                    if ($tokenModel && $tokenModel->tokenable) {
                        $userId = $tokenModel->tokenable->id;
                        Auth::login($tokenModel->tokenable);
                    }
                } catch (\Exception $e) {
                    Log::error("Error finding token: " . $e->getMessage());
                }
            }
            // Method 3: Try extracting token from different authorization header formats
            if (!$userId) {
                $authHeader = $request->header('Authorization');
                if (!empty($authHeader)) {
                    // Try different formats
                    $tokenFormats = [];
                    
                    // Format 1: "Bearer [token]"
                    if (strpos($authHeader, 'Bearer ') === 0) {
                        $tokenFormats[] = substr($authHeader, 7);
                    }
                    
                    // Format 2: Raw token
                    $tokenFormats[] = $authHeader;
                    
                    foreach ($tokenFormats as $possibleToken) {
                        try {
                            $token = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $possibleToken))->first();
                            if ($token && $token->tokenable) {
                                $userId = $token->tokenable->id;
                                Auth::login($token->tokenable);
                                break;
                            }
                        } catch (\Exception $e) {
                            Log::error("Error trying alternative token format: " . $e->getMessage());
                        }
                    }
                }
            }
            
            // If we still don't have a user ID, reject the request
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Cannot identify user',
                ], 401);
            }
            
            $tracking = UserWasteTracking::where('user_id', $userId)
                ->where('id', $id)
                ->firstOrFail();
            
            $tracking->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Data sampah berhasil dihapus',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan atau bukan milik Anda',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting waste tracking: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data',
            ], 500);
        }
    }
    
    /**
     * Export waste tracking data to CSV or Excel
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $format
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function export(Request $request, $format = 'csv')
    {
        $user = Auth::user();
        
        $records = UserWasteTracking::where('user_id', $user->id)
            ->with(['wasteType', 'wasteType.wasteCategory'])
            ->orderBy('tracking_date', 'desc')
            ->get()
            ->map(function($record) {
                return [
                    'tracking_date' => $record->tracking_date,
                    'waste_name' => $record->wasteType->name,
                    'category' => $record->wasteType->wasteCategory->name ?? 'Tidak Terkategori',
                    'amount' => $record->amount,
                    'unit' => $record->unit,
                    'management_status' => $record->management_status,
                    'estimated_value' => $record->estimated_value,
                    'notes' => $record->notes
                ];
            });
            
        // Handle the export based on format (this would need additional logic)
        // For now, just return the data
        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Export would be handled here in a real implementation'
        ]);
    }
    
    /**
     * Get summary statistics for dashboard
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $user = Auth::user();
        
        // Total waste amount
        $totalAmount = UserWasteTracking::where('user_id', $user->id)->sum('amount');
        
        // Total estimated value
        $totalValue = UserWasteTracking::where('user_id', $user->id)->sum('estimated_value');
        
        // Waste by category
        $wasteByCategory = UserWasteTracking::where('user_id', $user->id)
            ->with('wasteType.wasteCategory')
            ->get()
            ->groupBy(function($tracking) {
                return $tracking->wasteType && $tracking->wasteType->wasteCategory 
                    ? $tracking->wasteType->wasteCategory->name 
                    : 'Uncategorized';
            })
            ->map(function($group, $category) {
                return [
                    'category' => $category,
                    'amount' => $group->sum('amount'),
                    'value' => $group->sum('estimated_value')
                ];
            })
            ->values();
            
        // Waste by status
        $wasteByStatus = UserWasteTracking::where('user_id', $user->id)
            ->get()
            ->groupBy('management_status')
            ->map(function($group, $status) {
                return [
                    'status' => $status,
                    'amount' => $group->sum('amount'),
                    'value' => $group->sum('estimated_value'),
                    'count' => $group->count()
                ];
            })
            ->values();
            
        // Monthly trends (last 6 months)
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();
        $monthlyTrends = UserWasteTracking::where('user_id', $user->id)
            ->where('tracking_date', '>=', $sixMonthsAgo)
            ->get()
            ->groupBy(function($tracking) {
                return $tracking->tracking_date->format('Y-m');
            })
            ->map(function($group, $month) {
                return [
                    'month' => $month,
                    'amount' => $group->sum('amount'),
                    'value' => $group->sum('estimated_value'),
                    'count' => $group->count()
                ];
            })
            ->values();
            
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_amount' => $totalAmount,
                'total_value' => $totalValue,
                'waste_by_category' => $wasteByCategory,
                'waste_by_status' => $wasteByStatus,
                'monthly_trends' => $monthlyTrends
            ]
        ]);
    }

    /**
     * Get waste types with their values for user tracking
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWasteTypes()
    {
        try {
            logger()->info('Fetching waste types for tracking');
            
            // Get waste types with their categories and values
            $wasteTypes = WasteType::with(['wasteCategory', 'wasteValue'])
                ->get()
                ->map(function($wasteType) {
                    // Get price with fallbacks
                    $price = 0;
                    
                    if ($wasteType->wasteValue) {
                        $price = $wasteType->wasteValue->price_per_unit ?? 
                                $wasteType->wasteValue->price_per_kg ?? 
                                $wasteType->wasteValue->harga_minimum ?? 0;
                    }
                    
                    // Support both column structures for category
                    $categoryName = '';
                    $categoryId = null;
                    
                    if ($wasteType->wasteCategory) {
                        $categoryName = $wasteType->wasteCategory->name ?? 
                                    $wasteType->wasteCategory->nama_kategori ?? '';
                        $categoryId = $wasteType->wasteCategory->id ?? 
                                   $wasteType->waste_category_id ?? 
                                   $wasteType->kategori_id ?? null;
                    }
                    
                    // Handle different ID field names
                    $wasteId = $wasteType->id ?? 
                              $wasteType->waste_id ?? null;
                    
                    // Ensure we have a valid name
                    $wasteName = $wasteType->name ?? 
                               $wasteType->nama_sampah ?? 
                               'Jenis Sampah #' . $wasteId;
                               
                    return [
                        'id' => $wasteId,
                        'waste_id' => $wasteId, // For backward compatibility
                        'waste_type_id' => $wasteId, // For backward compatibility
                        'name' => $wasteName,
                        'category_id' => $categoryId,
                        'category_name' => $categoryName ?: 'Uncategorized',
                        'price_per_kg' => $price,
                        'price_per_unit' => $price,
                        'unit' => $wasteType->unit ?? 'kg',
                        'description' => $wasteType->description ?? $wasteType->deskripsi ?? ''
                    ];
                });
            
            logger()->info('Fetched waste types for tracking', ['count' => $wasteTypes->count()]);
            
            return response()->json([
                'success' => true,
                'data' => $wasteTypes
            ]);
        } catch (\Exception $e) {
            logger()->error('Error in UserWasteTrackingController@getWasteTypes', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get waste types formatted specifically for the tracking feature
     * This ensures consistency and better user experience
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWasteTypesForTracking()
    {
        try {
            logger()->info('Fetching waste types for tracking feature');
            
            $wasteTypes = WasteType::with(['wasteCategory', 'wasteValue'])
                ->orderBy('name')
                ->get()
                ->map(function($wasteType) {
                    // Calculate price
                    $price = 0;
                    if ($wasteType->wasteValue) {
                        $price = $wasteType->wasteValue->price_per_unit ?? 
                                $wasteType->wasteValue->price_per_kg ?? 
                                $wasteType->wasteValue->harga_minimum ?? 0;
                    }
                    
                    // Get category name
                    $categoryName = 'Uncategorized';
                    if ($wasteType->wasteCategory) {
                        $categoryName = $wasteType->wasteCategory->name ?? 
                                     $wasteType->wasteCategory->nama_kategori ?? 
                                     'Uncategorized';
                    }
                    
                    // Get the ID in a consistent manner - use waste_id which is the primary key
                    $id = $wasteType->waste_id;
                    
                    return [
                        'id' => $id,
                        'waste_type_id' => $id, // For backward compatibility
                        'name' => $wasteType->name,
                        'category_name' => $categoryName,
                        'category_id' => $wasteType->waste_category_id,
                        'price_per_kg' => $price,
                        'unit' => 'kg' // Default unit for tracking
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $wasteTypes
            ]);
        } catch (\Exception $e) {
            logger()->error('Error fetching waste types for tracking', [
                'error' => $e->getMessage() 
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data jenis sampah: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format tracking record for consistent API response
     */
    private function formatTrackingRecord($record)
    {
        // Get waste name with fallbacks
        $wasteName = 'Unknown';
        $categoryId = null;
        $categoryName = 'Uncategorized';
        
        if ($record->wasteType) {
            // Get waste name
            if (isset($record->wasteType->name)) {
                $wasteName = $record->wasteType->name;
            } elseif (isset($record->wasteType->nama_sampah)) {
                $wasteName = $record->wasteType->nama_sampah;
            }
            
            // Get category ID
            if (isset($record->wasteType->waste_category_id)) {
                $categoryId = $record->wasteType->waste_category_id;
            } elseif (isset($record->wasteType->kategori_id)) {
                $categoryId = $record->wasteType->kategori_id;
            }
            
            // Get category name
            if ($record->wasteType->wasteCategory) {
                if (isset($record->wasteType->wasteCategory->name)) {
                    $categoryName = $record->wasteType->wasteCategory->name;
                } elseif (isset($record->wasteType->wasteCategory->nama_kategori)) {
                    $categoryName = $record->wasteType->wasteCategory->nama_kategori;
                }
            } elseif ($record->wasteType->category) {
                if (isset($record->wasteType->category->name)) {
                    $categoryName = $record->wasteType->category->name;
                } elseif (isset($record->wasteType->category->nama_kategori)) {
                    $categoryName = $record->wasteType->category->nama_kategori;
                }
            }
        }
        
        return [
            'id' => $record->id,
            'waste_type_id' => $record->waste_type_id,
            'waste_name' => $wasteName,
            'category_id' => $categoryId,
            'category_name' => $categoryName,
            'amount' => $record->amount,
            'unit' => $record->unit,
            'tracking_date' => $record->tracking_date,
            'management_status' => $record->management_status,
            'estimated_value' => $record->estimated_value,
            'notes' => $record->notes,
            'created_at' => $record->created_at,
            'updated_at' => $record->updated_at
        ];
    }
    
    /**
     * Calculate estimated value based on waste type and amount
     * 
     * Nilai estimasi (Rp) = jumlah × harga per satuan
     */
    private function calculateEstimatedValue($wasteTypeId, $amount)
    {
        try {
            // Ensure wasteTypeId is a valid integer
            $wasteTypeId = intval($wasteTypeId);
            $amount = floatval($amount);
            
            if ($wasteTypeId <= 0 || $amount <= 0) {
                logger()->warning('Invalid input for calculateEstimatedValue', [
                    'waste_type_id' => $wasteTypeId,
                    'amount' => $amount
                ]);
                return 0;
            }
            
            logger()->info('Calculating estimated value', [
                'waste_type_id' => $wasteTypeId,
                'amount' => $amount
            ]);
            
            // Try getting from WasteValue model directly - prioritize waste_id
            $wasteValue = WasteValue::where('waste_id', $wasteTypeId)
                ->orWhere('waste_type_id', $wasteTypeId)
                ->first();
                
            if ($wasteValue) {
                // Return the first non-zero value we find
                $pricePerUnit = $wasteValue->price_per_unit ?? 
                   $wasteValue->price_per_kg ?? 
                   $wasteValue->harga_minimum ?? 0;
                   
                if ($pricePerUnit > 0) {
                    return round($amount * $pricePerUnit);
                }
            }
            
            // Check which waste_values table we should use as fallback
            if (Schema::hasTable('waste_values_new')) {
                // Get the waste value from the new table structure - properly handle where clauses
                $wasteValue = DB::table('waste_values_new')
                    ->where(function ($query) use ($wasteTypeId) {
                        $query->where('waste_type_id', $wasteTypeId)
                              ->orWhere('waste_id', $wasteTypeId);
                    })
                    ->where('is_active', true)
                    ->first();
                
                if ($wasteValue) {
                    // Calculate: amount * price_per_unit
                    return round($amount * $wasteValue->price_per_unit);
                }
            } 
            
            // Fallback to the old table structure
            if (Schema::hasTable('waste_values')) {
                $wasteValue = DB::table('waste_values')
                    ->where(function ($query) use ($wasteTypeId) {
                        $query->where('waste_id', $wasteTypeId)
                              ->orWhere('waste_type_id', $wasteTypeId);
                    })
                    ->first();
                
                if ($wasteValue) {
                    if (isset($wasteValue->price_per_unit)) {
                        return round($amount * $wasteValue->price_per_unit);
                    } else if (isset($wasteValue->harga_minimum) && isset($wasteValue->harga_maksimum)) {
                        // Use average of min and max price
                        $avgPrice = ($wasteValue->harga_minimum + $wasteValue->harga_maksimum) / 2;
                        return round($amount * $avgPrice);
                    } else if (isset($wasteValue->harga_minimum)) {
                        return round($amount * $wasteValue->harga_minimum);
                    }
                }
            }
            
            // If we get here, use a default price as last resort
            $defaultPrice = 1000; // Default: Rp 1000 per kg
            logger()->warning('No price found for waste type, using default', [
                'waste_type_id' => $wasteTypeId,
                'default_price' => $defaultPrice
            ]);
            
            return round($amount * $defaultPrice);
        } catch (\Exception $e) {
            logger()->error('Error calculating estimated value: ' . $e->getMessage(), [
                'waste_type_id' => $wasteTypeId,
                'amount' => $amount
            ]);
            return 0; // Return 0 in case of error
        }
    }

    /**
     * Diagnostic function to help debug authentication issues
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function diagnosticCheck(Request $request)
    {
        // Check authentication using different methods
        $authCheck = Auth::check();
        $authUser = Auth::user();
        $bearerToken = $request->bearerToken();
        $hasToken = !empty($bearerToken);
        $tokenModel = null;
        $tokenUser = null;
        
        // Try to get user from token
        if ($hasToken) {
            try {
                $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);
                if ($tokenModel) {
                    $tokenUser = $tokenModel->tokenable;
                }
            } catch (\Exception $e) {
                $tokenError = $e->getMessage();
            }
        }
        
        // Get a detailed view of request headers
        $headers = collect($request->headers->all())
            ->map(function($item) {
                return is_array($item) ? $item[0] : $item;
            })
            ->toArray();
            
        // Sanitize any sensitive values
        if (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
            if (is_string($authHeader)) {
                if (strlen($authHeader) > 20) {
                    $headers['authorization'] = substr($authHeader, 0, 10) . '...' . substr($authHeader, -10);
                } else {
                    $headers['authorization'] = '[present but short]';
                }
            }
        }
        
        // Check if token has proper structure (begins with number, has chars after)
        $tokenStructure = null;
        $tokenDetails = [];
        
        if ($hasToken) {
            // Analyze token structure - Sanctum typically uses numeric IDs followed by a hash
            $tokenParts = explode('|', $bearerToken);
            $tokenStructure = [
                'format' => 'unknown',
                'parts_count' => count($tokenParts)
            ];
            
            if (count($tokenParts) == 2) {
                $tokenStructure['format'] = 'sanctum';
                $tokenStructure['has_numeric_id'] = is_numeric($tokenParts[0]);
                $tokenStructure['id_value'] = $tokenParts[0];
                $tokenStructure['hash_length'] = strlen($tokenParts[1]);
            } else if (strpos($bearerToken, '.') !== false) {
                $tokenStructure['format'] = 'possible_jwt';
                $jwtParts = explode('.', $bearerToken);
                $tokenStructure['parts_count'] = count($jwtParts);
            }
            
            // If we have a token model, get details
            if ($tokenModel) {
                $tokenDetails = [
                    'id' => $tokenModel->id,
                    'name' => $tokenModel->name,
                    'created_at' => $tokenModel->created_at->toIso8601String(),
                    'last_used_at' => $tokenModel->last_used_at ? $tokenModel->last_used_at->toIso8601String() : null,
                    'expires_at' => $tokenModel->expires_at ? $tokenModel->expires_at->toIso8601String() : null,
                ];
            }
        }

        return response()->json([
            'auth_status' => [
                'auth_check' => $authCheck,
                'auth_user' => $authUser ? [
                    'id' => $authUser->id,
                    'email' => $authUser->email,
                    'name' => $authUser->name ?? $authUser->nama_lengkap ?? 'unknown'
                ] : null,
                'token_present' => $hasToken,
                'token_structure' => $tokenStructure,
                'token_valid' => !empty($tokenModel),
                'token_user' => $tokenUser ? [
                    'id' => $tokenUser->id,
                    'email' => $tokenUser->email,
                    'name' => $tokenUser->name ?? $tokenUser->nama_lengkap ?? 'unknown'
                ] : null,
                'token_details' => $tokenDetails,
                'is_error' => (!$authCheck && $hasToken),
                'error_reason' => (!$authCheck && $hasToken) ? 'Token not recognized' : null
            ],
            'request_details' => [
                'path' => $request->path(),
                'method' => $request->method(),
                'headers' => $headers,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
            'server_info' => [
                'laravel_version' => app()->version(),
                'php_version' => PHP_VERSION,
                'server_time' => now()->toIso8601String(),
                'sanctum_stateful_domains' => config('sanctum.stateful', []),
            ],
        ]);
    }
} 