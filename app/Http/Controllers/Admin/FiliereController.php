<?php

namespace App\Http\Controllers\Admin;
use App\Models\Filiere;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class FiliereController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Filieres/Index', [
            'filieres' => Filiere::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Filieres/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);
    
        Filiere::create($validated);
    
        return redirect()->route('admin.filieres.index')->with('success', 'Filière ajoutée avec succès.');
    }

    public function edit($id_filiere)
    {
        $filiere = Filiere::findOrFail($id_filiere);
        return Inertia::render('Admin/Filieres/Edit', [
            'filiere' => $filiere,
        ]);
    }

    public function update(Request $request, $id_filiere): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);
    
        $filiere = Filiere::findOrFail($id_filiere);
        $filiere->update($validated);
    
        return redirect()->route('admin.filieres.index')->with('success', 'Filière modifiée avec succès.');
    }

    public function destroy($id_filiere)
{
    $filiere = Filiere::findOrFail($id_filiere);
    $filiere->delete();

    return redirect()->back()->with('success', 'Filière supprimée avec succès.');
}
}



    


   
