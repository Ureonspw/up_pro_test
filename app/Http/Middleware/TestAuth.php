<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TestAuth
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('TestAuth Middleware - Début');
        Log::info('URL: ' . $request->url());
        Log::info('Méthode: ' . $request->method());
        
        if (Auth::check()) {
            $user = Auth::user();
            Log::info('Utilisateur connecté: ' . $user->name . ' (ID: ' . $user->id . ', Rôle: ' . $user->id_role . ')');
        } else {
            Log::info('Aucun utilisateur connecté');
        }
        
        Log::info('TestAuth Middleware - Fin');
        
        return $next($request);
    }
} 