<?php

use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'productos' => \App\Models\Producto::with('empresa')->get()
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('productos', [ProductoController::class, 'index'])->name('productos.index');
    Route::post('productos', [ProductoController::class, 'store'])->name('productos.store');
    Route::patch('productos/{producto}', [ProductoController::class, 'update'])->name('productos.update');
    Route::delete('productos/{producto}', [ProductoController::class, 'destroy'])->name('productos.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
