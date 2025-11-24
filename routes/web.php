<?php

use App\Http\Controllers\ProfileController;
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

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
