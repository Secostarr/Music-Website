<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\AdminTrackController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CatalogController::class, 'index'])->name('catalog.index');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AdminAuthController::class, 'create'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'store'])->middleware('throttle:5,1')->name('login.store');
});

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', [AdminTrackController::class, 'index'])->name('dashboard');
    Route::post('/tracks', [AdminTrackController::class, 'store'])->middleware('throttle:10,1')->name('tracks.store');
    Route::delete('/tracks/{track}', [AdminTrackController::class, 'destroy'])->name('tracks.destroy');
});

Route::post('/logout', [AdminAuthController::class, 'destroy'])->middleware('auth')->name('logout');
