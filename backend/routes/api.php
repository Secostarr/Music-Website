<?php

use App\Http\Controllers\MusicSearchController;
use Illuminate\Support\Facades\Route;

Route::get('/music/search', MusicSearchController::class)->name('music.search');
