<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\IAController;

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

Route::middleware(['auth:sanctum'])->group(function () {
    // IA routes
    Route::get('/ias', [IAController::class, 'index']);
    Route::get('/ias/adminP', [IAController::class, 'getAdminP']);
    Route::get('/ias/user/{username}', [IAController::class, 'getByUser']);
    Route::get('/ias/title/{title}', [IAController::class, 'getByTitle']);
    Route::post('/ia/store', [IAController::class, 'store']);

    // Document routes
    Route::get('/matieres', [DocumentController::class, 'getMatieres']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
}); 