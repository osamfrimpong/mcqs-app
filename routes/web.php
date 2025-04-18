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



Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('questions/search', [QuestionController::class, 'search'])->name('dashboard.questions.search');
    Route::resource('questions', QuestionController::class)->names('dashboard.questions');
    Route::get('assessments', [ScoreController::class, 'index'])->name('dashboard.assessments');
    Route::post('assessments', [ScoreController::class, 'store'])->name('dashboard.assessments.store');
    Route::get('assessments/take-test/{question}', [QuestionController::class, 'takeTest'])->name('dashboard.assessments.take-test');
    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('dashboard.logout');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
