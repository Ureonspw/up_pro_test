<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/resumer_page', function () {
    return Inertia::render('resumer_page/resumer_pagemain');
})->middleware(['auth', 'verified'])->name('resumer_pagemain');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/qcms', function () {
    return Inertia::render('qcms/qcm_pagemain');
})->middleware(['auth', 'verified'])->name('qcmMain');


Route::get('/flashcard', function () {
    return Inertia::render('flashcard/flashcard_pagemain');
})->middleware(['auth', 'verified'])->name('Flashcard');



Route::get('/questionnaire', function () {
    return Inertia::render('questionnaire/questionnaire');
})->middleware(['auth', 'verified'])->name('Questionnaire');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
