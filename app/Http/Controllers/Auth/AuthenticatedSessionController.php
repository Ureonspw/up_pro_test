<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate(); // Authentifie avec les credentials
        $request->session()->regenerate();
    
        $user = Auth::user();
    
        if ($user->statut !== 'actif') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
    
            return redirect()->route('login')->withErrors([
                'email' => 'Votre compte est résilié.',
            ]);
        }
    
        switch ($user->id_role) {
            case 1: // etudiant
                return redirect()->route('etudiant.dashboard');
            case 2: // Professeur
                return redirect()->route('professeur.dashboard');
            case 3: // Admin
                return redirect()->route('admin.dashboard');
            default:
                return redirect('/');
        }
    }
    

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
