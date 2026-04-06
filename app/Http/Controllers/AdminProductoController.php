<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Producto;

class AdminProductoController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->hasRole('admin'), 403);
        
        $query = Producto::with('empresa')->latest();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhereHas('empresa', function($q2) use ($search) {
                      $q2->where('nombre_empresa', 'like', "%{$search}%");
                  });
            });
        }

        $productos = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/productos/index', [
            'productos' => $productos,
            'filters' => $request->only(['search'])
        ]);
    }
}
