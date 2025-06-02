<?php

use App\Http\Controllers\API\v1\AuthController;
use App\Http\Controllers\API\v1\UserController;
use App\Http\Controllers\API\v1\WasteTypeController;
use App\Http\Controllers\API\v1\WasteCategoryController;
use App\Http\Controllers\API\v1\WasteValueController;
use App\Http\Controllers\API\v1\TutorialController;
use App\Http\Controllers\API\v1\ArticleController;
use App\Http\Controllers\API\v1\ForumThreadController;
use App\Http\Controllers\API\v1\ForumCommentController;
use App\Http\Controllers\API\v1\UserWasteTrackingController;
use App\Http\Controllers\API\v1\WasteBuyerController;
use App\Http\Controllers\API\v1\WasteBuyerTypeController;
use App\Http\Controllers\API\v1\BusinessOpportunityController;
use App\Http\Controllers\API\v1\RoleController;
use App\Http\Controllers\API\v1\PermissionController;
use App\Http\Controllers\API\v1\UserRoleController;
use App\Http\Controllers\API\v1\OpenAPIController;
use App\Http\Controllers\API\v1\HomeController;
use App\Http\Controllers\API\v1\MonetizationController;
use App\Http\Controllers\API\v1\HealthController;
use App\Http\Controllers\API\v1\GISController;
use App\Http\Controllers\API\v1\ForumRatingController;
use App\Http\Controllers\API\v1\ForumViewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API v1 Routes
Route::prefix('v1')->group(function () {
    // API Documentation
    Route::get('/docs', [OpenAPIController::class, 'documentation']);
    
    // Public Routes (No Auth Required)
    // Public data endpoints
    Route::get('/waste-types', [WasteTypeController::class, 'index']);
    Route::get('/waste-types/{id}', [WasteTypeController::class, 'show']);
    Route::get('/public/waste-types/clear-cache', [WasteTypeController::class, 'clearCache']);
    Route::get('/public/waste-types', [WasteTypeController::class, 'public']);
    Route::get('/public/waste-categories', [WasteCategoryController::class, 'public']);
    Route::get('/public/waste-values', [WasteValueController::class, 'public']);
    Route::get('/public/tutorials', [TutorialController::class, 'public']);
    Route::get('/public/articles', [ArticleController::class, 'public']);
    Route::get('/public/forum-threads', [ForumThreadController::class, 'public']);
    Route::get('/public/forum-threads/popular', [ForumThreadController::class, 'popular']);
    Route::get('/public/forum-threads/{id}', [ForumThreadController::class, 'show']);
    Route::get('/public/forum-threads/{threadId}/comments', [ForumCommentController::class, 'index']);
    Route::get('/public/waste-buyers', [WasteBuyerController::class, 'public']);
    Route::get('/public/waste-buyer-types', [WasteBuyerTypeController::class, 'public']);
    Route::get('/public/monetization/tips', [MonetizationController::class, 'getMonetizationTips']);
    Route::get('/public/monetization/summary', [MonetizationController::class, 'getMonetizationSummary']);
    Route::get('/public/monetization/recommended-buyers', [MonetizationController::class, 'getRecommendedBuyers']);
    Route::get('/public/home-data', [HomeController::class, 'index']);
    Route::get('/public/waste-types/{id}/detail', [WasteTypeController::class, 'showDetail']);
    Route::get('/public/waste-types/{id}/tutorials', [WasteTypeController::class, 'getRelatedTutorials']);
    Route::get('/public/waste-types/{id}/buyers', [WasteTypeController::class, 'getPotentialBuyers']);
    
    // Health check
    Route::get('/health', [HealthController::class, 'check']);
    
    // Route to check if the user is authenticated
    Route::get('/auth/check', [AuthController::class, 'check']);
    
    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/auth/refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
    Route::post('/auth/social/{provider}', [AuthController::class, 'socialLogin']);
    Route::post('/auth/social/{provider}/callback', [AuthController::class, 'socialLoginCallback']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    
    // Routes that require authentication
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::get('/user', [AuthController::class, 'user']);

        // User Profile
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::post('/change-password', [UserController::class, 'updatePassword']);
        Route::post('/upload-photo', [UserController::class, 'uploadPhoto']);
        Route::get('/waste-history', [UserController::class, 'wasteHistory']);
        Route::get('/user-statistics', [UserController::class, 'statistics']);
        Route::get('/dashboard-stats', [UserController::class, 'getUserStats']);

        // Users
        Route::apiResource('users', UserController::class);

        // Roles Management - admin Only
        Route::middleware('role:admin')->group(function () {
            // Roles
            Route::apiResource('roles', RoleController::class);
            Route::post('/roles/{id}/permissions', [RoleController::class, 'assignPermissions']);
            
            // Permissions
            Route::apiResource('permissions', PermissionController::class);
            Route::get('/permissions/{id}/roles', [PermissionController::class, 'getRoles']);
            
            // User Roles
            Route::get('/user-roles', [UserRoleController::class, 'index']);
            Route::get('/users/{id}/roles', [UserRoleController::class, 'getUserRoles']);
            Route::post('/users/{id}/roles', [UserRoleController::class, 'assignRoles']);
            Route::delete('/users/{userId}/roles/{roleId}', [UserRoleController::class, 'removeRole']);
            Route::get('/roles/{roleId}/users', [UserRoleController::class, 'getUsersByRole']);
            Route::get('/users/{userId}/has-role/{roleSlug}', [UserRoleController::class, 'checkRole']);
        });

        // Waste Types
        Route::apiResource('waste-types', WasteTypeController::class);
        
        // Waste Categories
        Route::apiResource('waste-categories', WasteCategoryController::class);
        
        // Favorit Feature
        Route::get('/favorites/waste-types', [WasteTypeController::class, 'getUserFavorites']);
        Route::post('/favorites/waste-types/{id}', [WasteTypeController::class, 'toggleFavorite']);
        
        // Waste Values
        Route::apiResource('waste-values', WasteValueController::class);
        Route::get('/waste-values/history/{wasteTypeId}', [WasteValueController::class, 'getValueHistory']);
        
        // Tutorials
        Route::get('tutorials', [TutorialController::class, 'index']);
        Route::post('tutorials', [TutorialController::class, 'store']);
        Route::get('tutorials/{id}', [TutorialController::class, 'show']);
        Route::get('tutorials/{id}/comments', [TutorialController::class, 'getComments']);
        
        // Articles
        Route::apiResource('articles', ArticleController::class);
        
        // Forum Threads
        Route::get('/forum-threads/my-threads', [ForumThreadController::class, 'myThreads']);
        Route::get('/forum-threads/my-comments', [ForumThreadController::class, 'myComments']);
        Route::apiResource('forum-threads', ForumThreadController::class);
        Route::post('/forum-threads/{id}/like', [ForumThreadController::class, 'toggleLike']);
        
        // Forum Comments
        Route::get('/forum-threads/{threadId}/comments', [ForumCommentController::class, 'index']);
        Route::post('/forum-threads/{threadId}/comments', [ForumCommentController::class, 'store']);
        Route::get('/forum-threads/{threadId}/comments/{id}', [ForumCommentController::class, 'show']);
        Route::put('/forum-threads/{threadId}/comments/{id}', [ForumCommentController::class, 'update']);
        Route::delete('/forum-threads/{threadId}/comments/{id}', [ForumCommentController::class, 'destroy']);
        Route::post('/forum-threads/{threadId}/comments/{id}/like', [ForumCommentController::class, 'toggleLike']);
        Route::get('/forum-threads/{threadId}/comments/{commentId}/replies', [ForumCommentController::class, 'getReplies']);
        
        // User Waste Tracking
        Route::apiResource('user-waste-trackings', UserWasteTrackingController::class);
        Route::get('/user-waste-trackings/export/{format}', [UserWasteTrackingController::class, 'export']);
        Route::get('/user-waste-trackings/summary', [UserWasteTrackingController::class, 'getSummary']);
        
        // Waste Buyers
        Route::apiResource('waste-buyers', WasteBuyerController::class);
        Route::get('/waste-buyers/cities', [WasteBuyerController::class, 'getCities']);
        Route::get('/waste-buyers/provinces', [WasteBuyerController::class, 'getProvinces']);
        Route::post('/waste-buyers/{id}/rate', [WasteBuyerController::class, 'rate']);
        
        // Waste Buyer Types
        Route::apiResource('waste-buyer-types', WasteBuyerTypeController::class);
        
        // User tutorial interactions
        Route::put('tutorials/{id}/complete', [TutorialController::class, 'toggleCompleted']);
        Route::put('tutorials/{id}/save', [TutorialController::class, 'toggleSaved']);
        Route::post('tutorials/{id}/rate', [TutorialController::class, 'rate']);
        Route::post('tutorials/{id}/comments', [TutorialController::class, 'addComment']);

        // Waste tracking
        Route::get('waste-tracking', [UserWasteTrackingController::class, 'index']);
        Route::get('waste-tracking/waste-types', [UserWasteTrackingController::class, 'getWasteTypes']);
        Route::post('waste-tracking', [UserWasteTrackingController::class, 'store']);
        Route::get('waste-tracking/stats', [UserWasteTrackingController::class, 'stats']);
        Route::get('waste-tracking/{id}', [UserWasteTrackingController::class, 'show']);
        Route::put('waste-tracking/{id}', [UserWasteTrackingController::class, 'update']);
        Route::delete('waste-tracking/{id}', [UserWasteTrackingController::class, 'destroy']);

        // Forum thread rating
        Route::post('/forum-threads/{threadId}/rating', [ForumRatingController::class, 'rateThread']);
        Route::get('/forum-threads/{threadId}/rating', [ForumRatingController::class, 'getUserRating']);

        // Forum thread view count
        Route::post('/forum-threads/{threadId}/view', [ForumViewController::class, 'incrementView']);
    });

    // Forum thread view count - public route
    Route::post('/public/forum-threads/{threadId}/view', [\App\Http\Controllers\API\v1\ForumViewController::class, 'incrementView']);
});

// GIS Routes untuk peta pengepul sampah
Route::prefix('v1/gis')->group(function () {
    Route::get('/locations', [GISController::class, 'getAllLocations']);
    Route::get('/nearby', [GISController::class, 'getNearbyLocations']);
    Route::get('/waste-types', [GISController::class, 'getWasteTypes']);
    
    // admin routes untuk update lokasi
    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::put('/location/{id}', [GISController::class, 'updateLocation']);
    });
});