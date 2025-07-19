<?php

namespace App\Http\Controllers;
use App\Models\Ia;
use App\Models\Document;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class IAController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'titre' => 'required|string',
                'contenu_ia' => 'required|string',
                'id_type_IA' => 'required|integer',
                'id_doc' => 'required|integer'
            ]);

            // Vérifier si le document existe, sinon créer un document par défaut
            $document = Document::find($request->id_doc);
            if (!$document) {
                // Créer un document par défaut si nécessaire
                $document = Document::create([
                    'nom' => 'Document généré pour IA',
                    'description' => 'Document créé automatiquement pour les fiches IA',
                    'chemin' => 'documents/generated.pdf',
                    'id_type_doc' => 1, // PDF par défaut
                    'user_id' => Auth::id() ?? 1, // Utilisateur connecté ou par défaut
                    'id_Matiere' => 1, // Matière par défaut
                ]);
                Log::info('Document par défaut créé avec ID: ' . $document->id_doc);
            }

            $ia = Ia::create([
                'titre' => $request->titre,
                'contenue_ia' => $request->contenu_ia, // contenu_ia du frontend → contenue_ia en base
                'ID_type_IA' => $request->id_type_IA,
                'id_doc' => $document->id_doc
            ]);

            if ($request->wantsJson()) {
                return response()->json(['message' => 'IA généré et enregistré', 'ia' => $ia], 201);
            }

            return back()->with('success', 'Document enregistré avec succès');
        } catch (\Exception $e) {
            Log::error('Error in IAController@store: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de l\'enregistrement: ' . $e->getMessage()], 500);
        }
    }

    public function index()
    {
        try {
            // Récupérer l'utilisateur connecté
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Utilisateur non connecté'], 401);
            }

            $ia = Ia::with(['document' => function($query) {
                $query->with('user');
            }])
            ->where('titre', 'like', $user->name . '_%')
            ->get();
            
            // Log détaillé pour déboguer
            Log::info('Données IA récupérées:', [
                'count' => $ia->count(),
                'data' => $ia->map(function($item) {
                    $document = $item->document;
                    $chemin = $document ? $document->chemin : null;
                    
                    // Log du chemin brut
                    Log::info('Chemin brut du document:', [
                        'id' => $item->id_ia,
                        'titre' => $item->titre,
                        'chemin' => $chemin ? substr($chemin, 0, 100) . '...' : null,
                        'chemin_type' => gettype($chemin),
                        'chemin_length' => $chemin ? strlen($chemin) : 0,
                        'is_base64' => $chemin ? str_starts_with($chemin, 'data:') : false,
                        'is_image' => $chemin ? preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $chemin) : false,
                        'is_pdf' => $chemin ? preg_match('/\.pdf$/i', $chemin) : false,
                        'mime_type' => $chemin ? (str_starts_with($chemin, 'data:') ? explode(';', explode(':', $chemin)[1])[0] : null) : null
                    ]);
                    
                    // Si le chemin n'est pas en base64, essayer de construire l'URL
                    if ($chemin && !str_starts_with($chemin, 'data:')) {
                        try {
                            // Si le chemin commence par 'documents/', le retirer
                            $filename = $chemin;
                            if (str_starts_with($filename, 'documents/')) {
                                $filename = substr($filename, 10); // Retirer 'documents/'
                            }
                            
                            // Vérifier si le fichier existe
                            $publicPath = 'public/documents/' . $filename;
                            if (Storage::exists($publicPath)) {
                                // Construire l'URL publique
                                $chemin = '/storage/documents/' . $filename;
                                Log::info('URL publique construite:', [
                                    'id' => $item->id_ia,
                                    'titre' => $item->titre,
                                    'original_path' => $document->chemin,
                                    'filename' => $filename,
                                    'new_url' => $chemin,
                                    'file_exists' => true,
                                    'mime_type' => Storage::mimeType($publicPath)
                                ]);
                            } else {
                                Log::warning('Fichier non trouvé:', [
                                    'id' => $item->id_ia,
                                    'titre' => $item->titre,
                                    'path' => $publicPath
                                ]);
                            }
                        } catch (\Exception $e) {
                            Log::error('Erreur lors du traitement du fichier: ' . $e->getMessage(), [
                                'id' => $item->id_ia,
                                'titre' => $item->titre,
                                'path' => $chemin
                            ]);
                        }
                    }
                    
                    // Modifier le document pour inclure le type MIME
                    if ($document) {
                        $document->mime_type = $chemin ? (str_starts_with($chemin, 'data:') ? explode(';', explode(':', $chemin)[1])[0] : Storage::mimeType('public/documents/' . basename($chemin))) : null;
                    }
                    
                    return [
                        'id' => $item->id_ia,
                        'titre' => $item->titre,
                        'has_document' => $document ? true : false,
                        'has_user' => $document && $document->user ? true : false,
                        'document' => $document ? [
                            'id' => $document->id_doc,
                            'chemin' => $chemin,
                            'mime_type' => $document->mime_type,
                            'user' => $document->user ? [
                                'name' => $document->user->name
                            ] : null
                        ] : null
                    ];
                })->toArray()
            ]);
            
            return response()->json([
                'ias' => $ia
            ]);
        } catch (\Exception $e) {
            Log::error('Error in IAController@index: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de la récupération des IAs: ' . $e->getMessage()], 500);
        }
    }

    public function getByUser($username)
    {
        try {
            $ia = Ia::whereHas('document.user', function($query) use ($username) {
                $query->where('name', 'like', '%' . $username . '%');
            })->with(['document' => function($query) {
                $query->with('user');
            }])->get();
            
            // Log détaillé pour déboguer
            Log::info('Recherche par utilisateur:', [
                'username' => $username,
                'count' => $ia->count(),
                'data' => $ia->map(function($item) {
                    $document = $item->document;
                    $chemin = $document ? $document->chemin : null;
                    $cheminLength = $chemin ? strlen($chemin) : 0;
                    $isBase64 = $chemin ? (substr($chemin, 0, 22) === 'data:application/pdf;base64,') : false;
                    
                    // Si le chemin n'est pas en base64, essayer de le convertir
                    if ($chemin && !$isBase64) {
                        try {
                            $chemin = 'data:application/pdf;base64,' . base64_encode($chemin);
                            $isBase64 = true;
                        } catch (\Exception $e) {
                            Log::error('Erreur lors de la conversion en base64: ' . $e->getMessage());
                        }
                    }
                    
                    return [
                        'id' => $item->id_ia,
                        'titre' => $item->titre,
                        'user' => $document && $document->user ? $document->user->name : null,
                        'document_chemin_length' => $cheminLength,
                        'is_base64' => $isBase64,
                        'chemin_preview' => $chemin ? substr($chemin, 0, 50) . '...' : null
                    ];
                })->toArray()
            ]);
            
            return response()->json([
                'ias' => $ia
            ]);
        } catch (\Exception $e) {
            Log::error('Error in IAController@getByUser: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de la recherche par utilisateur: ' . $e->getMessage()], 500);
        }
    }

    public function getByTitle($title)
    {
        try {
            $ia = Ia::where('titre', 'like', '%' . $title . '%')
                ->with(['document' => function($query) {
                    $query->with('user');
                }])
                ->get();
            
            // Log détaillé pour déboguer
            Log::info('Recherche par titre:', [
                'title' => $title,
                'count' => $ia->count(),
                'data' => $ia->map(function($item) {
                    $document = $item->document;
                    $chemin = $document ? $document->chemin : null;
                    $cheminLength = $chemin ? strlen($chemin) : 0;
                    $isBase64 = $chemin ? (substr($chemin, 0, 22) === 'data:application/pdf;base64,') : false;
                    
                    // Si le chemin n'est pas en base64, essayer de le convertir
                    if ($chemin && !$isBase64) {
                        try {
                            $chemin = 'data:application/pdf;base64,' . base64_encode($chemin);
                            $isBase64 = true;
                        } catch (\Exception $e) {
                            Log::error('Erreur lors de la conversion en base64: ' . $e->getMessage());
                        }
                    }
                    
                    return [
                        'id' => $item->id_ia,
                        'titre' => $item->titre,
                        'user' => $document && $document->user ? $document->user->name : null,
                        'document_chemin_length' => $cheminLength,
                        'is_base64' => $isBase64,
                        'chemin_preview' => $chemin ? substr($chemin, 0, 50) . '...' : null
                    ];
                })->toArray()
            ]);
            
            return response()->json([
                'ias' => $ia
            ]);
        } catch (\Exception $e) {
            Log::error('Error in IAController@getByTitle: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de la recherche par titre: ' . $e->getMessage()], 500);
        }
    }

    public function getAdminP()
    {
        try {
            $ia = Ia::where('titre', 'like', 'adminP%')
                ->with(['document' => function($query) {
                    $query->with('user');
                }])
                ->get();
            
            // Log détaillé pour déboguer
            Log::info('Récupération des documents adminP:', [
                'count' => $ia->count(),
                'data' => $ia->map(function($item) {
                    $document = $item->document;
                    $chemin = $document ? $document->chemin : null;
                    
                    // Log du chemin brut
                    Log::info('Chemin brut du document:', [
                        'id' => $item->id_ia,
                        'titre' => $item->titre,
                        'chemin' => $chemin ? substr($chemin, 0, 100) . '...' : null,
                        'chemin_type' => gettype($chemin),
                        'chemin_length' => $chemin ? strlen($chemin) : 0,
                        'is_base64' => $chemin ? str_starts_with($chemin, 'data:') : false,
                        'is_image' => $chemin ? preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $chemin) : false,
                        'is_pdf' => $chemin ? preg_match('/\.pdf$/i', $chemin) : false,
                        'mime_type' => $chemin ? (str_starts_with($chemin, 'data:') ? explode(';', explode(':', $chemin)[1])[0] : null) : null
                    ]);
                    
                    // Si le chemin n'est pas en base64, essayer de construire l'URL
                    if ($chemin && !str_starts_with($chemin, 'data:')) {
                        try {
                            // Si le chemin commence par 'documents/', le retirer
                            $filename = $chemin;
                            if (str_starts_with($filename, 'documents/')) {
                                $filename = substr($filename, 10); // Retirer 'documents/'
                            }
                            
                            // Vérifier si le fichier existe
                            $publicPath = 'public/documents/' . $filename;
                            if (Storage::exists($publicPath)) {
                                // Construire l'URL publique
                                $chemin = '/storage/documents/' . $filename;
                                Log::info('URL publique construite:', [
                                    'id' => $item->id_ia,
                                    'titre' => $item->titre,
                                    'original_path' => $document->chemin,
                                    'filename' => $filename,
                                    'new_url' => $chemin,
                                    'file_exists' => true,
                                    'mime_type' => Storage::mimeType($publicPath)
                                ]);
                            } else {
                                Log::warning('Fichier non trouvé:', [
                                    'id' => $item->id_ia,
                                    'titre' => $item->titre,
                                    'path' => $publicPath
                                ]);
                            }
                        } catch (\Exception $e) {
                            Log::error('Erreur lors du traitement du fichier: ' . $e->getMessage(), [
                                'id' => $item->id_ia,
                                'titre' => $item->titre,
                                'path' => $chemin
                            ]);
                        }
                    }
                    
                    return [
                        'id' => $item->id_ia,
                        'titre' => $item->titre,
                        'has_document' => $document ? true : false,
                        'has_user' => $document && $document->user ? true : false,
                        'document' => $document ? [
                            'id' => $document->id_doc,
                            'chemin' => $chemin,
                            'mime_type' => $document->mime_type,
                            'user' => $document->user ? [
                                'name' => $document->user->name
                            ] : null
                        ] : null
                    ];
                })->toArray()
            ]);
            
            return response()->json([
                'ias' => $ia
            ]);
        } catch (\Exception $e) {
            Log::error('Error in IAController@getAdminP: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Une erreur est survenue lors de la récupération des documents adminP: ' . $e->getMessage()], 500);
        }
    }
}
