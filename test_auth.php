<?php

require_once 'vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Simuler une requête POST
$request = new Request();
$request->setMethod('POST');
$request->merge(['code' => 'SAHDAB']);

echo "Test d'authentification pour la route verifierCode\n";
echo "================================================\n\n";

// Vérifier si l'utilisateur est connecté
if (Auth::check()) {
    $user = Auth::user();
    echo "✅ Utilisateur connecté: {$user->name} (ID: {$user->id}, Rôle: {$user->id_role})\n";
    
    // Vérifier le rôle
    if ($user->id_role == 1) {
        echo "✅ Rôle étudiant confirmé\n";
    } else {
        echo "❌ Rôle incorrect: {$user->id_role} (attendu: 1)\n";
    }
} else {
    echo "❌ Aucun utilisateur connecté\n";
}

echo "\nPour résoudre le problème 403:\n";
echo "1. Assurez-vous d'être connecté avec un étudiant (rôle = 1)\n";
echo "2. Utilisez les identifiants: etudiant@test.com / password\n";
echo "3. Vérifiez que la session est active\n"; 