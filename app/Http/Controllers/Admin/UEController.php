<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UE;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class UEController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/UE/Index', [
            'ues' => UE::with('filiere')->get(),
            'filieres' => Filiere::select('id_filiere', 'nom')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/UE/Create', [
            'filieres' => Filiere::select('id_filiere', 'nom')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'id_filiere' => 'required|exists:filieres,id_filiere',
            
        ]);
    
        UE::create($validated);
    
        return redirect()->route('admin.ues.index')->with('success', 'UE ajoutée avec succès.');
    }

    public function edit($id_Ue)
    {
        $ue = UE::findOrFail($id_Ue);
        $filieres = Filiere::select('id_filiere', 'nom')->get();
    
        return Inertia::render('Admin/UE/Edit', [
            'ue' => $ue,
            'filieres' => $filieres,
        ]);
    }
    
    public function update(Request $request, $id_Ue): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'id_filiere' => 'required|exists:filieres,id_filiere',
        ]);
    
        $ue = UE::findOrFail($id_Ue);
        $ue->update($validated);
    
        return redirect()->route('admin.ues.index')->with('success', 'UE modifiée avec succès.');
    }

    public function destroy($id_Ue)
{
    $ue = UE::findOrFail($id_Ue);
    $ue->delete();

    return redirect()->back()->with('success', 'UE supprimée avec succès.');
}
}