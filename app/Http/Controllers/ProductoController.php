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
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('productos', 'public');
            $data['imagen'] = '/storage/' . $path;
        }

        $request->user()->empresa->productos()->create($data);

        return back();
    }

    public function update(Request $request, Producto $producto)
    {
        Gate::authorize('update', $producto);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('productos', 'public');
            $data['imagen'] = '/storage/' . $path;
        }

        $producto->update($data);

        return back();
    }

    public function destroy(Producto $producto)
    {
        Gate::authorize('delete', $producto);
        $producto->delete();
        return back();
    }
}
