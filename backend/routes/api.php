<?php

use App\Http\Controllers\MusicSearchController;
use App\Http\Controllers\SavedTrackController;
use App\Http\Controllers\UserAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/music/search', MusicSearchController::class)->name('music.search');

Route::prefix('auth')->middleware('throttle:10,1')->group(function (): void {
    Route::post('/register', [UserAuthController::class, 'register']);
    Route::post('/login', [UserAuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/auth/logout', [UserAuthController::class, 'logout']);
    Route::get('/auth/me', [UserAuthController::class, 'me']);
    Route::get('/saved-tracks', [SavedTrackController::class, 'index']);
    Route::post('/saved-tracks', [SavedTrackController::class, 'store']);
    Route::delete('/saved-tracks/{trackId}', [SavedTrackController::class, 'destroy']);
});
