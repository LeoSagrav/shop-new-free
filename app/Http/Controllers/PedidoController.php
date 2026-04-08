<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PedidoController extends Controller
{
    /**
     * Display a listing of the orders for the authenticated user's company.
     */
   public function index(Request $request)
{
    $pedidos = $request->user()->empresa->pedidos()
        ->with('productos')
        ->latest()
        ->get();

    // ✅ Verificar si es usuario recién registrado (consumir el flag de sesión)
    $isNewUser = $request->session()->pull('just_registered', false);
$tempPassword = $request->session()->pull('temp_plain_password', null); // ✅ Consumir y eliminar

$userData = $isNewUser ? [
    'name' => $request->user()->name,
    'email' => $request->user()->email,
    'nombre_empresa' => $request->user()->empresa->nombre_empresa,
    'celular' => $request->user()->empresa->celular,
    'tipo' => $request->user()->empresa->tipo,
    'password' => $tempPassword, // ⚠️ Solo para demo/dev
] : null;

return Inertia::render('dashboard', [
    'pedidos' => $pedidos,
    'isNewUser' => $isNewUser,
    'userData' => $userData,
]);
}

    /**
     * Store a newly created order (Public Checkout).
     */
    public function store(Request $request)
    {
        $request->validate([
            'cliente' => 'required|string|max:255',
            'celular' => 'required|string|max:20',
            'departamento' => 'required|string|max:100',
            'pais' => 'required|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
        ]);

        // Group items by company to create separate orders if necessary
        $itemsByEmpresa = [];
        foreach ($request->items as $item) {
            $producto = Producto::find($item['id']);
            $itemsByEmpresa[$producto->empresa_id][] = [
                'producto' => $producto,
                'cantidad' => $item['cantidad']
            ];
        }

        // Check order limits for each company
        foreach ($itemsByEmpresa as $empresa_id => $group) {
            $pedidoCount = Pedido::where('empresa_id', $empresa_id)->count();
            if ($pedidoCount >= 50) {
                return back()->withErrors(['error' => 'Se ha alcanzado el límite máximo de 3 pedidos para esta empresa.']);
            }
        }

        DB::beginTransaction();
        try {
            foreach ($itemsByEmpresa as $empresa_id => $group) {
                $total = 0;
                foreach ($group as $entry) {
                    $total += $entry['producto']->precio * $entry['cantidad'];
                }

                $pedido = Pedido::create([
                    'empresa_id' => $empresa_id,
                    'cliente' => $request->cliente,
                    'celular' => $request->celular,
                    'departamento' => $request->departamento,
                    'pais' => $request->pais,
                    'total' => $total,
                ]);

                foreach ($group as $entry) {
                    $pedido->productos()->attach($entry['producto']->id, [
                        'cantidad' => $entry['cantidad']
                    ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'No se pudo procesar el pedido.']);
        }

        return back()->with('success', 'Pedido realizado con éxito.');
    }
}
