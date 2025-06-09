<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
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
     * Affiche la vue d'inscription.
     */
    public function create(): Response
    {
        $roles = Role::all(['id_role', 'libelle']); // Récupère tous les rôles

        return Inertia::render('Auth/Register', [
            'roles' => $roles,
        ]);
    }

    /**
     * Gère la requête d'inscription.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'sexe' => 'required|in:Masculin,Féminin,Autre',
            'tel' => 'required|string|max:20',
            'id_role' => 'required|exists:roles,id_role',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'prenom' => $request->prenom,
            'sexe' => $request->sexe,
            'tel' => $request->tel,
            'id_role' => $request->id_role,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'statut'=>'actif',
        ]);

        event(new Registered($user));

        Auth::login($user);

        

        return redirect(route('dashboard', absolute: false));
    }
}
