<?php

namespace App\Http\Controllers;

use App\Models\Examen;
use App\Models\Question;
use App\Models\Reponse;
use App\Models\Document;
use App\Models\Participation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExamenController extends Controller
{
    /**
     * Afficher la liste des examens
     */
    public function index()
    {
        $examens = Examen::where('id_professeur', Auth::id())
            ->withCount(['questions', 'participations'])
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Examens/Index', [
            'examens' => $examens
        ]);
    }

    /**
     * Afficher le formulaire de création d'examen
     */
    public function create()
    {
        return inertia('Examens/Create');
    }

    /**
     * Stocker un nouvel examen
     */
    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duree_minutes' => 'required|integer|min:1|max:480',
            'niveau' => 'required|in:facile,moyen,difficile',
            'instructions_speciales' => 'nullable|string',
            'nombre_questions' => 'required|integer|min:1|max:20',
            'document' => 'required|file|mimes:pdf,doc,docx,txt,jpg,jpeg,png,gif,bmp,webp|max:10240', // 10MB max
        ]);

        $documentId = null;
        
        // Gérer l'upload du document
        $file = $request->file('document');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('documents', $fileName, 'public');
        
        // Créer l'entrée dans la table documents
        $document = Document::create([
            'nom' => $file->getClientOriginalName(),
            'description' => 'Document de référence pour examen',
            'chemin' => $filePath,
            'user_id' => Auth::id(),
            'id_type_doc' => 5, // "Document de référence"
            'id_Matiere' => 2, // "Informatique"
        ]);
        
        $documentId = $document->id_doc;

        $examen = Examen::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'code_examen' => $this->genererCodeExamen(),
            'duree_minutes' => $request->duree_minutes,
            'niveau' => $request->niveau,
            'instructions_speciales' => $request->instructions_speciales,
            'id_professeur' => Auth::id(),
            'id_document' => $documentId,
            'statut' => 'questions_generees', // Statut correct après génération des questions
        ]);

        // Générer automatiquement les questions à partir du document
        $this->genererQuestionsDepuisDocument($examen, $request->nombre_questions, $request->instructions_speciales);

        return redirect()->route('professeur.examens.index')->with('success', 'Examen créé avec succès ! Les questions ont été générées automatiquement.');
    }

    /**
     * Afficher un examen avec ses questions
     */
    public function show(Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        $examen->load([
            'questions.reponses' => function ($query) {
                $query->orderBy('ordre');
            },
            'participations.etudiant'
        ]);

        return Inertia::render('Examens/Show', [
            'examen' => $examen
        ]);
    }

    /**
     * Afficher le formulaire d'édition d'examen
     */
    public function edit(Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }
        
        $examen->load(['questions.reponses', 'document']);
        
        return inertia('Examens/Edit', [
            'examen' => $examen
        ]);
    }

    /**
     * Mettre à jour un examen
     */
    public function update(Request $request, Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }
        
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duree_minutes' => 'required|integer|min:1|max:480',
            'niveau' => 'required|in:facile,moyen,difficile',
            'instructions_speciales' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,doc,docx,txt,jpg,jpeg,png,gif,bmp,webp|max:10240', // 10MB max
        ]);

        $updateData = $request->only([
            'titre', 'description', 'duree_minutes', 'niveau', 'instructions_speciales'
        ]);

        // Gérer l'upload du nouveau document si fourni
        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('documents', $fileName, 'public');
            
            // Créer l'entrée dans la table documents
            $document = Document::create([
                'nom' => $file->getClientOriginalName(),
                'description' => 'Document de référence pour examen',
                'chemin' => $filePath,
                'user_id' => Auth::id(),
                'id_type_doc' => 5, // "Document de référence"
                'id_Matiere' => 2, // "Informatique"
            ]);
            
            $updateData['id_document'] = $document->id_doc;
        }

        $examen->update($updateData);

        return redirect()->route('professeur.examens.index')->with('success', 'Examen mis à jour avec succès !');
    }

    /**
     * Supprimer un examen
     */
    public function destroy(Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }
        
        $examen->delete();
        return redirect()->route('professeur.examens.index')->with('success', 'Examen supprimé avec succès !');
    }

    /**
     * Générer les questions pour un examen
     */
    public function genererQuestions(Examen $examen)
    {
        Log::info('Méthode genererQuestions appelée pour l\'examen: ' . $examen->id);
        
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        if ($examen->statut !== 'en_attente') {
            return back()->with('error', 'Cet examen ne peut plus être modifié.');
        }

        // Simuler la génération de questions (ici on crée des questions de test)
        $questions = [
            [
                'texte' => 'Quelle est la capitale de la France ?',
                'type' => 'qcm',
                'reponses' => [
                    ['texte' => 'Paris', 'correcte' => true],
                    ['texte' => 'Lyon', 'correcte' => false],
                    ['texte' => 'Marseille', 'correcte' => false],
                    ['texte' => 'Toulouse', 'correcte' => false],
                ]
            ],
            [
                'texte' => 'Quel est le langage de programmation le plus utilisé ?',
                'type' => 'qcm',
                'reponses' => [
                    ['texte' => 'JavaScript', 'correcte' => true],
                    ['texte' => 'Python', 'correcte' => false],
                    ['texte' => 'Java', 'correcte' => false],
                    ['texte' => 'C++', 'correcte' => false],
                ]
            ],
            [
                'texte' => 'Qu\'est-ce que HTML ?',
                'type' => 'qcm',
                'reponses' => [
                    ['texte' => 'Un langage de programmation', 'correcte' => false],
                    ['texte' => 'Un langage de balisage', 'correcte' => true],
                    ['texte' => 'Un système d\'exploitation', 'correcte' => false],
                    ['texte' => 'Un protocole réseau', 'correcte' => false],
                ]
            ],
        ];

        foreach ($questions as $questionData) {
            $question = Question::create([
                'question' => $questionData['texte'],
                'type' => 'choix_unique', // Correspond au type dans la migration
                'id_examen' => $examen->id,
                'points' => 1,
                'ordre' => 0,
            ]);

            foreach ($questionData['reponses'] as $reponseData) {
                Reponse::create([
                    'reponse' => $reponseData['texte'],
                    'est_correcte' => $reponseData['correcte'],
                    'id_question' => $question->id,
                    'ordre' => 0,
                ]);
            }
        }

        // Mettre à jour le statut
        $examen->update(['statut' => 'questions_generees']);

        Log::info('Questions générées avec succès pour l\'examen: ' . $examen->id);

        return back()->with('success', 'Questions générées avec succès ! Vous pouvez maintenant commencer l\'évaluation.');
    }

    /**
     * Sauvegarder les questions générées
     */
    public function sauvegarderQuestions(Request $request, Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }
        
        $request->validate([
            'questions' => 'required|array',
            'questions.*.question' => 'required|string',
            'questions.*.type' => 'required|in:choix_multiple,choix_unique,vrai_faux',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.reponses' => 'required|array|min:2',
            'questions.*.reponses.*.reponse' => 'required|string',
            'questions.*.reponses.*.est_correcte' => 'required|boolean',
        ]);

        DB::transaction(function () use ($request, $examen) {
            // Supprimer les anciennes questions
            $examen->questions()->delete();
            
            foreach ($request->questions as $index => $questionData) {
                $question = Question::create([
                    'question' => $questionData['question'],
                    'type' => $questionData['type'],
                    'points' => $questionData['points'],
                    'id_examen' => $examen->id,
                    'ordre' => $index + 1,
                ]);

                foreach ($questionData['reponses'] as $reponseIndex => $reponseData) {
                    Reponse::create([
                        'reponse' => $reponseData['reponse'],
                        'est_correcte' => $reponseData['est_correcte'],
                        'id_question' => $question->id,
                        'ordre' => $reponseIndex + 1,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Questions sauvegardées avec succès !',
            'examen' => $examen->load(['questions.reponses'])
        ]);
    }

    /**
     * Commencer l'évaluation
     */
    public function commencerEvaluation(Examen $examen)
    {
        Log::info('Tentative de lancement de l\'évaluation pour l\'examen: ' . $examen->id);
        
        if ($examen->id_professeur !== Auth::id()) {
            Log::warning('Tentative d\'accès non autorisé à l\'examen: ' . $examen->id);
            abort(403);
        }

        if ($examen->statut !== 'questions_generees') {
            Log::warning('Tentative de lancement d\'un examen avec statut incorrect: ' . $examen->statut);
            return back()->with('error', 'L\'examen doit avoir des questions générées pour être lancé.');
        }

        try {
            $examen->update([
                'statut' => 'actif',
                'date_debut' => now(),
                'date_fin' => now()->addMinutes($examen->duree_minutes),
            ]);
            
            Log::info('Évaluation lancée avec succès pour l\'examen: ' . $examen->id . ' - Statut: ' . $examen->fresh()->statut);
            
            return back()->with('success', 'L\'évaluation a été lancée ! Les étudiants peuvent maintenant passer l\'examen.');
        } catch (\Exception $e) {
            Log::error('Erreur lors du lancement de l\'évaluation: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors du lancement de l\'évaluation: ' . $e->getMessage());
        }
    }

    /**
     * Arrêter l'évaluation
     */
    public function arreterEvaluation(Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        if ($examen->statut !== 'actif') {
            return back()->with('error', 'L\'examen n\'est pas actif.');
        }

        $examen->update([
            'statut' => 'inactif',
            'date_fin' => now(),
        ]);

        return back()->with('success', 'L\'évaluation a été arrêtée ! Les étudiants ne peuvent plus passer l\'examen.');
    }

    /**
     * Basculer l'activation d'un examen
     */
    public function toggleActivation(Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        $nouveauStatut = $examen->statut === 'actif' ? 'inactif' : 'actif';
        $examen->update(['statut' => $nouveauStatut]);

        $message = $nouveauStatut === 'actif' 
            ? 'Examen activé avec succès !' 
            : 'Examen désactivé avec succès !';

        return back()->with('success', $message);
    }

    /**
     * Afficher les résultats d'un examen (côté étudiant)
     */
    public function resultats($code)
    {
        $examen = Examen::where('code_examen', $code)->first();
        
        if (!$examen) {
            abort(404, 'Examen non trouvé');
        }

        // Récupérer la dernière participation de l'utilisateur connecté
        $participation = Participation::where('id_examen', $examen->id)
            ->where('id_etudiant', Auth::id())
            ->latest()
            ->first();

        if (!$participation) {
            abort(404, 'Aucune participation trouvée');
        }

        $participation->load(['reponsesEtudiants.question.reponses']);

        return Inertia::render('Examen/Resultats', [
            'examen' => $examen,
            'participation' => $participation
        ]);
    }

    /**
     * Afficher les résultats d'un examen (côté professeur)
     */
    public function resultatsProfesseur(Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        $participations = Participation::where('id_examen', $examen->id)
            ->with(['etudiant', 'reponsesEtudiants.question.reponses'])
            ->orderBy('created_at', 'desc')
            ->get();

        $statistiques = [
            'total_participants' => $participations->count(),
            'participants_termines' => $participations->where('statut', 'termine')->count(),
            'participants_en_cours' => $participations->where('statut', 'en_cours')->count(),
            'moyenne_score' => $participations->where('statut', 'termine')->avg('score') ?? 0,
        ];

        return inertia('Examens/Resultats', [
            'examen' => $examen,
            'participations' => $participations,
            'statistiques' => $statistiques
        ]);
    }

    /**
     * Générer un code d'examen unique
     */
    private function genererCodeExamen()
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (Examen::where('code_examen', $code)->exists());
        
        return $code;
    }

    /**
     * Créer des questions d'exemple (à remplacer par l'IA)
     */
    private function creerQuestionsExemple(Examen $examen, $nombre)
    {
        $questions = [];
        
        for ($i = 1; $i <= $nombre; $i++) {
            $questions[] = [
                'question' => "Question d'exemple $i pour l'examen {$examen->titre}",
                'type' => ['choix_unique', 'choix_multiple', 'vrai_faux'][array_rand([0, 1, 2])],
                'points' => rand(1, 5),
                'reponses' => [
                    ['reponse' => 'Réponse A', 'est_correcte' => true],
                    ['reponse' => 'Réponse B', 'est_correcte' => false],
                    ['reponse' => 'Réponse C', 'est_correcte' => false],
                    ['reponse' => 'Réponse D', 'est_correcte' => false],
                ]
            ];
        }
        
        return $questions;
    }

    /**
     * Générer les questions à partir du document
     */
    private function genererQuestionsDepuisDocument(Examen $examen, $nombreQuestions, $instructions = null)
    {
        $document = Document::find($examen->id_document);
        if (!$document) {
            return;
        }

        // Lire le contenu du document
        $contenu = $this->extraireContenuDocument($document->chemin);
        
        // Générer des questions basées sur le contenu
        $questions = $this->genererQuestionsIA($contenu, $nombreQuestions, $instructions);
        
        foreach ($questions as $index => $questionData) {
            $question = Question::create([
                'question' => $questionData['question'],
                'type' => 'choix_unique',
                'id_examen' => $examen->id,
                'points' => 1,
                'ordre' => $index + 1,
            ]);

            foreach ($questionData['reponses'] as $reponseIndex => $reponseData) {
                Reponse::create([
                    'reponse' => $reponseData['reponse'],
                    'est_correcte' => $reponseData['correcte'],
                    'id_question' => $question->id,
                    'ordre' => $reponseIndex + 1,
                ]);
            }
        }
    }

    /**
     * Extraire le contenu d'un document
     */
    private function extraireContenuDocument($chemin)
    {
        $cheminComplet = storage_path('app/public/' . $chemin);
        
        if (!file_exists($cheminComplet)) {
            return '';
        }

        $extension = pathinfo($cheminComplet, PATHINFO_EXTENSION);
        
        switch (strtolower($extension)) {
            case 'txt':
                return file_get_contents($cheminComplet);
            
            case 'pdf':
                return $this->extraireContenuPDF($cheminComplet);
            
            case 'doc':
            case 'docx':
                return $this->extraireContenuWord($cheminComplet);
            
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'webp':
                return $this->analyserImage($cheminComplet);
            
            default:
                return '';
        }
    }

    /**
     * Analyser une image avec l'IA pour en extraire le contenu
     */
    private function analyserImage($chemin)
    {
        try {
            // Encoder l'image en base64
            $imageData = base64_encode(file_get_contents($chemin));
            $mimeType = mime_content_type($chemin);
            
            // Utiliser Google Generative AI pour analyser l'image
            $apiKey = "AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U";
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
            
            $prompt = "Analyse cette image et décris son contenu de manière détaillée. 
            Décris les éléments visuels, les textes présents, les concepts abordés, 
            et tout autre information pertinente qui pourrait servir à créer des questions d'évaluation.";
            
            $data = [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $prompt],
                            [
                                "inline_data" => [
                                    "mime_type" => $mimeType,
                                    "data" => $imageData
                                ]
                            ]
                        ]
                    ]
                ]
            ];
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url . "?key=" . $apiKey);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode !== 200) {
                Log::error('Erreur API Google AI pour analyse d\'image: ' . $response);
                return "Contenu d'image analysé. Cette image contient des éléments visuels qui peuvent servir à créer des questions d'évaluation.";
            }
            
            $responseData = json_decode($response, true);
            $text = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            return $text ?: "Contenu d'image analysé. Cette image contient des éléments visuels qui peuvent servir à créer des questions d'évaluation.";
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'analyse d\'image: ' . $e->getMessage());
            return "Contenu d'image analysé. Cette image contient des éléments visuels qui peuvent servir à créer des questions d'évaluation.";
        }
    }

    /**
     * Extraire le contenu d'un PDF
     */
    private function extraireContenuPDF($chemin)
    {
        try {
            $parser = new \Smalot\PdfParser\Parser();
            $pdf = $parser->parseFile($chemin);
            $contenu = $pdf->getText();
            
            // Nettoyer le contenu
            $contenu = preg_replace('/\s+/', ' ', $contenu); // Remplacer les espaces multiples
            $contenu = trim($contenu);
            
            return $contenu;
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'extraction PDF: ' . $e->getMessage());
            return "Contenu PDF non accessible. Erreur: " . $e->getMessage();
        }
    }

    /**
     * Extraire le contenu d'un document Word
     */
    private function extraireContenuWord($chemin)
    {
        // Pour l'instant, on simule l'extraction
        // En production, vous pourriez utiliser une bibliothèque comme phpword
        return "Contenu extrait du document Word. Ceci est un exemple de contenu pour générer des questions.";
    }

    /**
     * Générer des questions avec IA basées sur le contenu
     */
    private function genererQuestionsIA($contenu, $nombreQuestions, $instructions = null)
    {
        try {
            // Utiliser Google Generative AI comme dans votre système existant
            $apiKey = "AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U"; // Votre clé API
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
            
            $prompt = "Génère {$nombreQuestions} questions de type QCM basées sur le contenu suivant. ";
            if ($instructions) {
                $prompt .= "Instructions spéciales: {$instructions}. ";
            }
            $prompt .= "Pour chaque question, donne la structure JSON suivante sans texte supplémentaire:
            [
                {
                    \"question\": \"Écris ici la question\",
                    \"reponses\": [
                        {\"reponse\": \"Réponse A\", \"correcte\": true},
                        {\"reponse\": \"Réponse B\", \"correcte\": false},
                        {\"reponse\": \"Réponse C\", \"correcte\": false},
                        {\"reponse\": \"Réponse D\", \"correcte\": false}
                    ]
                }
            ]
            
            Contenu du document:
            " . substr($contenu, 0, 4000); // Limiter la taille du contenu
            
            $data = [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $prompt]
                        ]
                    ]
                ]
            ];
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url . "?key=" . $apiKey);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode !== 200) {
                Log::error('Erreur API Google AI: ' . $response);
                return $this->questionsFallback($nombreQuestions);
            }
            
            $responseData = json_decode($response, true);
            $text = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            // Nettoyer la réponse JSON
            $text = preg_replace('/```json|```/s', '', $text);
            $text = trim($text);
            
            $questions = json_decode($text, true);
            
            if (!is_array($questions)) {
                Log::error('Réponse JSON invalide: ' . $text);
                return $this->questionsFallback($nombreQuestions);
            }
            
            return array_slice($questions, 0, $nombreQuestions);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la génération IA: ' . $e->getMessage());
            return $this->questionsFallback($nombreQuestions);
        }
    }

    /**
     * Questions de fallback si l'IA échoue
     */
    private function questionsFallback($nombreQuestions)
    {
        $questions = [
            [
                'question' => 'Quel est le sujet principal abordé dans ce document ?',
                'reponses' => [
                    ['reponse' => 'Informatique et programmation', 'correcte' => true],
                    ['reponse' => 'Mathématiques avancées', 'correcte' => false],
                    ['reponse' => 'Histoire de l\'art', 'correcte' => false],
                    ['reponse' => 'Biologie moléculaire', 'correcte' => false],
                ]
            ],
            [
                'question' => 'Quelle technologie est mentionnée dans le document ?',
                'reponses' => [
                    ['reponse' => 'JavaScript', 'correcte' => true],
                    ['reponse' => 'Photoshop', 'correcte' => false],
                    ['reponse' => 'Microsoft Word', 'correcte' => false],
                    ['reponse' => 'Adobe Illustrator', 'correcte' => false],
                ]
            ],
            [
                'question' => 'Quel est le niveau de difficulté suggéré par le contenu ?',
                'reponses' => [
                    ['reponse' => 'Intermédiaire', 'correcte' => true],
                    ['reponse' => 'Débutant', 'correcte' => false],
                    ['reponse' => 'Expert', 'correcte' => false],
                    ['reponse' => 'Avancé', 'correcte' => false],
                ]
            ],
        ];
        
        return array_slice($questions, 0, $nombreQuestions);
    }

    /**
     * Créer une nouvelle question
     */
    public function storeQuestion(Request $request, Examen $examen)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'question' => 'required|string',
            'type' => 'required|in:choix_unique,choix_multiple,vrai_faux',
            'points' => 'required|integer|min:1|max:10',
            'reponses' => 'required|array|min:2',
            'reponses.*.reponse' => 'required|string',
            'reponses.*.est_correcte' => 'required|boolean',
            'reponses.*.ordre' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $examen) {
            $question = Question::create([
                'question' => $request->question,
                'type' => $request->type,
                'points' => $request->points,
                'id_examen' => $examen->id,
                'ordre' => $examen->questions()->count() + 1,
            ]);

            foreach ($request->reponses as $reponseData) {
                Reponse::create([
                    'reponse' => $reponseData['reponse'],
                    'est_correcte' => $reponseData['est_correcte'],
                    'id_question' => $question->id,
                    'ordre' => $reponseData['ordre'],
                ]);
            }
        });

        return back()->with('success', 'Question ajoutée avec succès !');
    }

    /**
     * Mettre à jour une question
     */
    public function updateQuestion(Request $request, Examen $examen, Question $question)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        if ($question->id_examen !== $examen->id) {
            abort(404);
        }

        $request->validate([
            'question' => 'required|string',
            'type' => 'required|in:choix_unique,choix_multiple,vrai_faux',
            'points' => 'required|integer|min:1|max:10',
            'reponses' => 'required|array|min:2',
            'reponses.*.reponse' => 'required|string',
            'reponses.*.est_correcte' => 'required|boolean',
            'reponses.*.ordre' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $question) {
            $question->update([
                'question' => $request->question,
                'type' => $request->type,
                'points' => $request->points,
            ]);

            // Supprimer les anciennes réponses
            $question->reponses()->delete();

            // Créer les nouvelles réponses
            foreach ($request->reponses as $reponseData) {
                Reponse::create([
                    'reponse' => $reponseData['reponse'],
                    'est_correcte' => $reponseData['est_correcte'],
                    'id_question' => $question->id,
                    'ordre' => $reponseData['ordre'],
                ]);
            }
        });

        return back()->with('success', 'Question mise à jour avec succès !');
    }

    /**
     * Supprimer une question
     */
    public function destroyQuestion(Examen $examen, Question $question)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        if ($question->id_examen !== $examen->id) {
            abort(404);
        }

        $question->delete();

        return back()->with('success', 'Question supprimée avec succès !');
    }

    /**
     * Supprimer une réponse
     */
    public function destroyReponse(Examen $examen, Question $question, Reponse $reponse)
    {
        if ($examen->id_professeur !== Auth::id()) {
            abort(403);
        }

        if ($question->id_examen !== $examen->id || $reponse->id_question !== $question->id) {
            abort(404);
        }

        if ($question->reponses()->count() <= 2) {
            return back()->with('error', 'Une question doit avoir au moins 2 réponses.');
        }

        $reponse->delete();

        return back()->with('success', 'Réponse supprimée avec succès !');
    }

    /**
     * Page pour passer l'examen (étudiants)
     */
    public function passerExamen($code)
    {
        $examen = Examen::where('code_examen', $code)->first();
        
        if (!$examen) {
            abort(404, 'Examen non trouvé');
        }

        if ($examen->statut !== 'actif') {
            abort(403, 'Cet examen n\'est pas actif');
        }

        if ($examen->date_fin && now()->isAfter($examen->date_fin)) {
            abort(403, 'L\'examen est terminé');
        }

        $examen->load(['questions.reponses' => function ($query) {
            $query->orderBy('ordre');
        }]);

        return Inertia::render('Examen/Passer', [
            'examen' => $examen
        ]);
    }

    /**
     * Soumettre les réponses de l'examen
     */
    public function soumettreExamen(Request $request, $code)
    {
        $examen = Examen::where('code_examen', $code)->first();
        
        if (!$examen) {
            abort(404, 'Examen non trouvé');
        }

        if ($examen->statut !== 'actif') {
            abort(403, 'Cet examen n\'est pas actif');
        }

        if ($examen->date_fin && now()->isAfter($examen->date_fin)) {
            abort(403, 'L\'examen est terminé');
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'reponses' => 'required|array',
            'reponses.*' => 'required|array',
        ]);

        // Calculer le score
        $scoreTotal = 0;
        $scoreObtenu = 0;
        $detailsReponses = [];

        foreach ($examen->questions as $question) {
            $scoreTotal += $question->points;
            
            $reponseEtudiant = $request->reponses[$question->id] ?? null;
            $bonnesReponses = $question->reponses()->where('est_correcte', true)->pluck('id')->toArray();
            
            $detailsReponses[$question->id] = [
                'question' => $question->question,
                'reponses_etudiant' => $reponseEtudiant,
                'bonnes_reponses' => $bonnesReponses,
                'points_question' => $question->points,
                'correct' => false
            ];
            
            if ($reponseEtudiant) {
                $reponsesCorrectes = array_intersect($reponseEtudiant, $bonnesReponses);
                
                if (count($reponsesCorrectes) === count($bonnesReponses) && count($reponsesCorrectes) === count($reponseEtudiant)) {
                    $scoreObtenu += $question->points;
                    $detailsReponses[$question->id]['correct'] = true;
                }
            }
        }

        // Créer la participation
        $participation = Participation::create([
            'id_examen' => $examen->id,
            'id_etudiant' => null, // Pas d'étudiant connecté pour l'instant
            'score_obtenu' => $scoreObtenu,
            'score_total' => $scoreTotal,
            'statut' => 'termine',
            'date_debut_examen' => now(),
            'date_fin_examen' => now(),
            'nom_etudiant' => $request->nom . ' ' . $request->prenom,
            'email_etudiant' => $request->email,
        ]);

        // Rediriger vers une page de résultats
        return Inertia::render('Examen/Resultats', [
            'examen' => $examen,
            'participation' => $participation,
            'detailsReponses' => $detailsReponses,
            'scoreObtenu' => $scoreObtenu,
            'scoreTotal' => $scoreTotal,
            'pourcentage' => $scoreTotal > 0 ? round(($scoreObtenu / $scoreTotal) * 100, 2) : 0
        ]);
    }
}
