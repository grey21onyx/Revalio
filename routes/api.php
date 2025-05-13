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
    
    // Rate limiting for all API endpoints
    Route::middleware('throttle:api')->group(function () {
        // Auth Routes
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        // Social Login Routes
        Route::get('/auth/{provider}', [AuthController::class, 'redirectToProvider']);
        Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

        // Protected Routes
        Route::middleware('auth:sanctum')->group(function () {
            // Auth
            Route::get('/user', [AuthController::class, 'user']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/update-profile', [AuthController::class, 'updateProfile']);
            Route::post('/change-password', [AuthController::class, 'changePassword']);

            // Users
            Route::apiResource('users', UserController::class);

            // Roles Management - Admin Only
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
            
            // Waste Values
            Route::apiResource('waste-values', WasteValueController::class);
            Route::get('/waste-values/history/{wasteTypeId}', [WasteValueController::class, 'getValueHistory']);
            
            // Tutorials
            Route::apiResource('tutorials', TutorialController::class);
            Route::get('/tutorials/waste-type/{wasteTypeId}', [TutorialController::class, 'getByWasteType']);
            
            // Articles
            Route::apiResource('articles', ArticleController::class);
            
            // Forum Threads
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
            Route::get('/user-waste-trackings/summary', [UserWasteTrackingController::class, 'getSummary']);
            
            // Waste Buyers
            Route::apiResource('waste-buyers', WasteBuyerController::class);
            Route::get('/waste-buyers/cities', [WasteBuyerController::class, 'getCities']);
            Route::get('/waste-buyers/provinces', [WasteBuyerController::class, 'getProvinces']);
            Route::post('/waste-buyers/{id}/rate', [WasteBuyerController::class, 'rate']);
            
            // Waste Buyer Types
            Route::apiResource('waste-buyer-types', WasteBuyerTypeController::class);
            
            // Business Opportunities
            Route::apiResource('business-opportunities', BusinessOpportunityController::class);
        });
        
        // Public Routes
        Route::get('/waste-types/public', [WasteTypeController::class, 'public']);
        Route::get('/waste-categories/public', [WasteCategoryController::class, 'public']);
        Route::get('/waste-values/public', [WasteValueController::class, 'public']);
        Route::get('/tutorials/public', [TutorialController::class, 'public']);
        Route::get('/articles/public', [ArticleController::class, 'public']);
        Route::get('/forum-threads/public', [ForumThreadController::class, 'public']);
        Route::get('/forum-threads/popular', [ForumThreadController::class, 'popular']);
        Route::get('/waste-buyers/public', [WasteBuyerController::class, 'public']);
        Route::get('/waste-buyer-types/public', [WasteBuyerTypeController::class, 'public']);
        Route::get('/business-opportunities/public', [BusinessOpportunityController::class, 'public']);
    });
});
