<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\Matiere;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{

public function store(Request $request)
{
    try {
        \Log::info('Début de l\'upload de document', $request->all());

        $request->validate([
            'file' => 'required|file|max:102400',
            'nom' => 'required|string|max:50',
            'description' => 'required|string|max:100',
            'id_type_doc' => 'required|integer',
            'user_id' => 'required|integer',
            'id_Matiere' => 'required|integer|exists:matieres,id_Matiere',
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        \Log::info('Fichier stocké avec succès', ['path' => $path]);

        $document = Document::create([
            'nom' => $request->nom,
            'description' => $request->description,
            'chemin' => $path,
            'id_type_doc' => $request->id_type_doc,
            'user_id' => $request->user_id,
            'id_Matiere' => $request->id_Matiere,
        ]);

        \Log::info('Document créé avec succès', ['document' => $document]);

        return response()->json([
            'success' => true,
            'message' => 'Document enregistré avec succès',
            'document' => $document
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('Erreur de validation', ['errors' => $e->errors()]);
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Erreur lors de l\'enregistrement du document', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Une erreur est survenue lors de l\'enregistrement du document',
            'error' => $e->getMessage()
        ], 500);
    }
}

    }

