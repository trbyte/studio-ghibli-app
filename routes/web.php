<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FilmActionController;
use App\Http\Controllers\GhibliController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
});

Route::middleware('auth')->get('/dashboard', function () {
    return redirect('/');
})->name('dashboard');

// Timeline route using GhibliController
Route::get('/timeline', [GhibliController::class, 'index'])->name('timeline');

// API endpoint for AJAX film loading
Route::get('/api/films', function () {
    return response()->json(GhibliController::getCachedFilms());
});

Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Film actions routes
    Route::post('/film-actions', [FilmActionController::class, 'store'])->name('film-actions.store');
    Route::patch('/film-actions/{id}', [FilmActionController::class, 'update'])->name('film-actions.update');
    Route::get('/film-actions/user-list', [FilmActionController::class, 'getUserList'])->name('film-actions.user-list');
});

require __DIR__ . '/auth.php';
