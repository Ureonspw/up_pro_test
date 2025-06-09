<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Matiere;
use Illuminate\Http\RedirectResponse;
use App\Models\Ue;


class MatiereController extends Controller
{
    public function index()
    {$matieres = Matiere::all();
        $ues = Ue::select('id_Ue', 'nom')->get();
    
        return Inertia::render('Admin/Matiere/Index', [
            'matieres' => $matieres,
            'ues' => $ues,
        ]);
    }
    



    
    public function create()
    {
        return Inertia::render('Admin/Matiere/Create',[
            'ues' => Ue::select('id_Ue', 'nom')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'id_Ue' => 'required|exists:ues,id_Ue',
            
        ]);
    
        Matiere::create($validated);
            
    
        return redirect()->route('admin.matieres.index')->with('success', 'matiere ajouté avec succès.');
    }

    public function show($id_Matiere)
    {
        return Inertia::render('Admin/Matiere/Show', [
            'matieres' => Matiere::findOrFail($id_Matiere),
        ]);
    }


    public function edit($id_Matiere)
    {
        $matiere = Matiere::findOrFail($id_Matiere);
        $ues = Ue::select('id_Ue', 'nom')->get();
    
        return Inertia::render('Admin/Matiere/Edit', [
            'matiere' => $matiere,
            'ues' => $ues,
        ]);
    }
    
    public function update(Request $request, $id_Matiere): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'id_Ue' => 'required|exists:ues,id_Ue',
        ]);
    
        $matiere = Matiere::findOrFail($id_Matiere);
        $matiere->update($validated);
    
        return redirect()->route('admin.matieres.index')->with('success', 'Matière modifiée avec succès.');
    }

    public function destroy($id_Matiere)
{
    $matiere = Matiere::findOrFail($id_Matiere);
    $matiere->delete();

    return redirect()->back()->with('success', 'Matière supprimée avec succès.');
}

    public function getAllMatieres()
    {
        $matieres = Matiere::select('id_Matiere', 'nom', 'description', 'id_Ue')->get();
        return response()->json($matieres);
    }
}

 




