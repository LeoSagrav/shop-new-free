<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validación con reglas personalizadas para mensajes más claros
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nombre_empresa' => 'required|string|max:255|unique:empresas,nombre_empresa',
            'celular' => 'required|string|max:20|unique:empresas,celular',
            'tipo' => 'required|string|max:255',
        ], [
            // Mensajes personalizados para validaciones únicas
            'email.unique' => 'Este correo electrónico ya está registrado. Por favor usa otro o :link.',
            'nombre_empresa.unique' => 'Este nombre de empresa ya está registrado. Por favor elige otro nombre.',
            'celular.unique' => 'Este número de celular ya está registrado con otra cuenta.',
        ]);

        $plainPassword = $request->password; // Guardar temporalmente

$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    'password' => Hash::make($request->password), // ✅ Se hashea para la BD
]);

        $empresa = $user->empresa()->create([
            'nombre_empresa' => $request->nombre_empresa,
            'celular' => $request->celular,
            'tipo' => $request->tipo,
        ]);

        event(new Registered($user));

       Auth::login($user);

// ✅ Guardar contraseña en claro SOLO en sesión (se autodestruye)
$request->session()->put('temp_plain_password', $plainPassword);
$request->session()->put('just_registered', true);

return to_route('dashboard', ['empresa' => $empresa->slug]);
    }
}