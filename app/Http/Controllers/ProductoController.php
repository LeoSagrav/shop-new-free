<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $productos = $request->user()->empresa?->productos ?? [];
        return Inertia::render('productos', [
            'productos' => $productos
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
        ]);

        $request->user()->empresa->productos()->create($request->all());

        return back();
    }

    public function update(Request $request, Producto $producto)
    {
        Gate::authorize('update', $producto);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
        ]);

        $producto->update($request->all());

        return back();
    }

    public function destroy(Producto $producto)
    {
        Gate::authorize('delete', $producto);
        $producto->delete();
        return back();
    }
}
