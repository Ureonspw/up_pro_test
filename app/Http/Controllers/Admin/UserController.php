<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\Role; // ajoute ceci en haut
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'sexe' => 'required|in:Masculin,Féminin,Autre',
            'tel' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'string', Rules\Password::defaults()],
            'id_role' => 'required|exists:roles,id_role',
            'statut' => 'required|in:actif,inactif',
        ]);
    
        User::create([
            'name' => $validated['name'],
            'prenom' => $validated['prenom'],
            'sexe' => $validated['sexe'],
            'tel' => $validated['tel'],
            'email' => $validated['email'],
            'password' => !empty($validated['password']) ? Hash::make($validated['password']) : $user->getOriginal('password'),
            'id_role' => $validated['id_role'],
            'statut' => $validated['statut'],
        ]);
    
        return redirect()->route('admin.users.index')->with('success', 'Utilisateur ajouté avec succès.');
    }

    public function show($id)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => User::findOrFail($id),
        ]);
    }

    // public function updateStatus(Request $request, $id)
    // {
    //     $request->validate([
    //         'statut' => 'required|in:actif,inactif',
    //     ]);

    //     $user = User::findOrFail($id);
    //     $user->statut = $request->statut;
    //     $user->save();

    //     return back()->with('success', 'Statut mis à jour.');
    // }


    public function update(Request $request, User $user): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'sexe' => 'required|in:Masculin,Féminin,Autre',
            'tel' => 'required|string|max:20',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'id_role' => 'required|exists:roles,id_role',
            'statut' => 'required|in:actif,inactif',
            'password' => ['nullable', 'string', Rules\Password::defaults()],
        ]);
    
        // On prépare les données à injecter
        $user->fill([
            'name' => $validated['name'],
            'prenom' => $validated['prenom'],
            'sexe' => $validated['sexe'],
            'tel' => $validated['tel'],
            'email' => $validated['email'],
            'id_role' => $validated['id_role'],
            'statut' => $validated['statut'],
        ]);
    
        // Vérifie si l'email a été modifié
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
    
        // Si mot de passe fourni, on le met à jour
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
    
        $user->save();
    
        return redirect()->route('admin.users.index')->with('success', 'Utilisateur modifié avec succès.');
    }
    
public function edit($id): \Inertia\Response
{
    $user = User::findOrFail($id);
    $roles = Role::all(); // récupère tous les rôles

    return Inertia::render('Admin/Users/Edit', [
        'user' => $user,
        'roles' => $roles,
    ]);
}

public function destroy($id)
{
    $user = User::findOrFail($id);
    $user->delete();

    return redirect()->back()->with('success', 'Utilisateur supprimé avec succès.');
}
}
