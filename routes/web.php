<?php

use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest auth routes remain global and must be defined BEFORE the {empresa} catch-all
require __DIR__.'/auth-guest.php'; 

Route::get('/', function () {
    if (\Illuminate\Support\Facades\Auth::check()) {
        $user = \Illuminate\Support\Facades\Auth::user();
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.users.index');
        }
        if ($user->empresa) {
            return redirect()->route('dashboard', ['empresa' => $user->empresa->slug]);
        }
    }
    return redirect('/login');
})->name('home');

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('users', [\App\Http\Controllers\AdminUserController::class, 'index'])->name('admin.users.index');
    Route::delete('users/{user}', [\App\Http\Controllers\AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    Route::post('users/{user}/toggle', [\App\Http\Controllers\AdminUserController::class, 'toggleActive'])->name('admin.users.toggle');
    
    Route::get('productos', [\App\Http\Controllers\AdminProductoController::class, 'index'])->name('admin.productos.index');
    Route::get('pedidos', [\App\Http\Controllers\AdminPedidoController::class, 'index'])->name('admin.pedidos.index');
});

Route::middleware(['auth'])->group(function () {
    Route::post('logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

Route::prefix('{empresa}')->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome', [
            'productos' => \App\Models\Producto::all(),
            'empresa' => app('tenant')
        ]);
    })->name('catalog.show');

    Route::post('/pedidos', [PedidoController::class, 'store'])->name('pedidos.store');

    Route::middleware(['auth'])->group(function () {
        Route::get('dashboard', [PedidoController::class, 'index'])->name('dashboard');

        Route::get('productos', [ProductoController::class, 'index'])->name('productos.index');
        Route::post('productos', [ProductoController::class, 'store'])->name('productos.store');
        Route::patch('productos/{producto}', [ProductoController::class, 'update'])->name('productos.update');
        Route::delete('productos/{producto}', [ProductoController::class, 'destroy'])->name('productos.destroy');

        // Move settings inside
        require __DIR__.'/settings.php';
        
        // Authenticated auth routes
        Route::get('verify-email', \App\Http\Controllers\Auth\EmailVerificationPromptController::class)
            ->name('verification.notice');

        Route::get('verify-email/{id}/{hash}', \App\Http\Controllers\Auth\VerifyEmailController::class)
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');

        Route::post('email/verification-notification', [\App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        Route::get('confirm-password', [\App\Http\Controllers\Auth\ConfirmablePasswordController::class, 'show'])
            ->name('password.confirm');

        Route::post('confirm-password', [\App\Http\Controllers\Auth\ConfirmablePasswordController::class, 'store']);
    });
});

