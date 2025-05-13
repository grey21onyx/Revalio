<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\v1\OpenAPIController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('react-main');
});

// API Documentation
Route::get('/api-docs', [OpenAPIController::class, 'swaggerUI']);

// Route untuk menangani semua URL lainnya
Route::get('/{any}', function () {
    return view('react-main');
})->where('any', '.*');

