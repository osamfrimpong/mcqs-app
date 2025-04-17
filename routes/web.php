<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ScoreController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::middleware(['auth'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::resource('questions', QuestionController::class);
    Route::get('assessments', [ScoreController::class, 'index'])->name('assessments');
    Route::post('assessments', [ScoreController::class, 'store'])->name('assessments.store');
    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
