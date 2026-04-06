<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Empresa;

class AdminUserController extends Controller
{
    public function index()
    {
        abort_unless(auth()->user()->hasRole('admin'), 403);
        $users = User::with('empresa')->get();
        
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'total_empresas' => Empresa::count(),
            'total_productos' => \App\Models\Producto::count(),
            'total_pedidos' => \App\Models\Pedido::count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'stats' => $stats
        ]);
    }

    public function destroy(User $user)
    {
        abort_unless(auth()->user()->hasRole('admin'), 403);
        $user->delete();
        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }

    public function toggleActive(User $user)
    {
        abort_unless(auth()->user()->hasRole('admin'), 403);
        $user->update(['is_active' => !$user->is_active]);
        return redirect()->back()->with('success', 'Estado del usuario actualizado.');
    }
}
