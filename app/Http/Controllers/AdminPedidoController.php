<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pedido;

class AdminPedidoController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->hasRole('admin'), 403);
        
        $query = Pedido::with(['empresa', 'productos'])->latest();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('cliente', 'like', "%{$search}%")
                  ->orWhere('celular', 'like', "%{$search}%")
                  ->orWhereHas('empresa', function($q2) use ($search) {
                      $q2->where('nombre_empresa', 'like', "%{$search}%");
                  });
            });
        }

        $pedidos = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/pedidos/index', [
            'pedidos' => $pedidos,
            'filters' => $request->only(['search'])
        ]);
    }
}
