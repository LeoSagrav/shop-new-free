<?php

namespace App\Http\Middleware;

use App\Models\Empresa;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $slug = $request->route('empresa');

        if (!$slug) {
            return $next($request);
        }

        $tenant = Empresa::where('slug', $slug)->first();

        if (!$tenant) {
            abort(404, 'Empresa no encontrada');
        }

        // Si el usuario está autenticado, verificar que coincida con su empresa
        if (Auth::check() && Auth::user()->empresa?->id !== $tenant->id) {
            // Esto previene que un usuario acceda al dashboard de otro
            // Redirigir a su propio dashboard
            return redirect()->route('dashboard', ['empresa' => Auth::user()->empresa->slug]);
        }

        app()->instance('tenant', $tenant);

        return $next($request);
    }
}
