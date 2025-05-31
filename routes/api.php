<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\v1\AuthController;
use App\Http\Controllers\API\v1\ArticleController;
use App\Http\Controllers\API\v1\WasteTypeController;
use App\Http\Controllers\API\v1\TutorialController;
use App\Http\Controllers\API\v1\RecyclingGuideController;
use App\Http\Controllers\API\v1\UserController;
use App\Http\Controllers\API\v1\WasteTrackingController;
use App\Http\Controllers\API\v1\ForumThreadController;
use App\Http\Controllers\API\v1\ForumCommentController;
use App\Http\Controllers\API\v1\WasteBuyerController;
use App\Http\Controllers\API\v1\WasteCategoryController;

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

Route::prefix('v1')->group(function () {
    // Public routes (no auth required)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    
    // Public data endpoints
    Route::get('/waste-types', [WasteTypeController::class, 'index']);
    Route::get('/waste-types/{id}', [WasteTypeController::class, 'show']);
    Route::get('/public/waste-types', [WasteTypeController::class, 'public']);
    Route::get('/public/waste-types/{id}/detail', [WasteTypeController::class, 'showDetail']);
    Route::get('/public/waste-types/{id}/tutorials', [WasteTypeController::class, 'getRelatedTutorials']);
    Route::get('/public/waste-types/{id}/buyers', [WasteTypeController::class, 'getPotentialBuyers']);
    
    Route::get('/public/waste-categories', [WasteCategoryController::class, 'public']);
    
    Route::get('/recycling-guides', [RecyclingGuideController::class, 'index']);
    Route::get('/recycling-guides/{id}', [RecyclingGuideController::class, 'show']);
    
    // Tutorial routes - public
    Route::get('/tutorials', [TutorialController::class, 'index']);
    Route::get('/tutorials/{id}', [TutorialController::class, 'show']);
    Route::get('/tutorials/{id}/comments', [TutorialController::class, 'getComments']);
    Route::get('/public/tutorials', [TutorialController::class, 'public']);
    Route::get('/waste-types/{wasteTypeId}/tutorials', [TutorialController::class, 'getByWasteType']);
    
    Route::get('/public/articles', [ArticleController::class, 'publicIndex']);
    Route::get('/public/articles/{id}', [ArticleController::class, 'publicShow']);
    
    Route::get('/public/forum-threads', [ForumThreadController::class, 'public']);
    Route::get('/public/forum-threads/popular', [ForumThreadController::class, 'popular']);
    Route::get('/public/forum-threads/{id}', [ForumThreadController::class, 'show']);
    Route::get('/public/forum-threads/{threadId}/comments', [ForumCommentController::class, 'publicIndex']);
    
    Route::get('/public/waste-buyers', [WasteBuyerController::class, 'publicIndex']);
    Route::get('/public/waste-buyers/{id}', [WasteBuyerController::class, 'publicShow']);
    
    // Auth required routes
    Route::middleware('auth:sanctum')->group(function () {
        // User profile
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        
        // Waste types
        Route::post('/waste-types', [WasteTypeController::class, 'store']);
        Route::put('/waste-types/{id}', [WasteTypeController::class, 'update']);
        Route::delete('/waste-types/{id}', [WasteTypeController::class, 'destroy']);
        
        // Tutorial routes - auth required
        Route::post('/tutorials', [TutorialController::class, 'store']);
        Route::put('/tutorials/{id}', [TutorialController::class, 'update']);
        Route::delete('/tutorials/{id}', [TutorialController::class, 'destroy']);
        Route::post('/tutorials/{id}/rate', [TutorialController::class, 'rate']);
        Route::post('/tutorials/{id}/toggle-completed', [TutorialController::class, 'toggleCompleted']);
        Route::post('/tutorials/{id}/toggle-saved', [TutorialController::class, 'toggleSaved']);
        Route::post('/tutorials/{id}/comments', [TutorialController::class, 'addComment']);
        
        // Recycling guides
        Route::post('/recycling-guides', [RecyclingGuideController::class, 'store']);
        Route::put('/recycling-guides/{id}', [RecyclingGuideController::class, 'update']);
        Route::delete('/recycling-guides/{id}', [RecyclingGuideController::class, 'destroy']);
        
        // Articles
        Route::apiResource('articles', ArticleController::class);
        
        // Waste tracking
        Route::apiResource('waste-tracking', WasteTrackingController::class);
        Route::get('/waste-tracking/stats/weekly', [WasteTrackingController::class, 'weeklyStats']);
        Route::get('/waste-tracking/stats/monthly', [WasteTrackingController::class, 'monthlyStats']);
        Route::get('/waste-tracking/stats/yearly', [WasteTrackingController::class, 'yearlyStats']);
        
        // Forum routes menggunakan ForumThreadController dan ForumCommentController
        Route::get('/forum-threads/my-threads', [ForumThreadController::class, 'myThreads']);
        Route::get('/forum-threads/my-comments', [ForumThreadController::class, 'myComments']);
        Route::post('/forum-threads', [ForumThreadController::class, 'store']);
        Route::get('/forum-threads/{id}', [ForumThreadController::class, 'show']);
        Route::put('/forum-threads/{id}', [ForumThreadController::class, 'update']);
        Route::delete('/forum-threads/{id}', [ForumThreadController::class, 'destroy']);
        Route::post('/forum-threads/{id}/like', [ForumThreadController::class, 'toggleLike']);
        
        // Rute untuk Komentar (menggunakan ForumCommentController)
        Route::get('/forum-threads/{threadId}/comments', [ForumCommentController::class, 'index'])->name('forum-threads.comments.index');
        Route::post('/forum-threads/{threadId}/comments', [ForumCommentController::class, 'store'])->name('forum-threads.comments.store');
        Route::get('/forum-comments/{commentId}', [ForumCommentController::class, 'show'])->name('forum-comments.show');
        Route::put('/forum-comments/{commentId}', [ForumCommentController::class, 'update'])->name('forum-comments.update');
        Route::delete('/forum-comments/{commentId}', [ForumCommentController::class, 'destroy'])->name('forum-comments.destroy');
        Route::post('/forum-comments/{commentId}/like', [ForumCommentController::class, 'toggleLike'])->name('forum-comments.like');
        
        // Waste buyers
        Route::apiResource('waste-buyers', WasteBuyerController::class);
        Route::post('/waste-buyers/{id}/bookmark', [WasteBuyerController::class, 'toggleBookmark']);
        Route::get('/waste-buyers/{id}/rating', [WasteBuyerController::class, 'getRating']);
        Route::post('/waste-buyers/{id}/rating', [WasteBuyerController::class, 'rateWasteBuyer']);
        
        // Admin routes
        Route::middleware('admin')->group(function () {
            // Admin specific endpoints
            Route::post('/admin/batch-delete-users', [UserController::class, 'batchDelete']);
            
            // More admin routes as needed
        });
    });
});
