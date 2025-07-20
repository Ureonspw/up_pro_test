<?php

namespace App\Http\Controllers;

use App\Models\Examen;
use App\Models\Participation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    /**
     * Afficher la page d'accueil des évaluations pour les étudiants
     */
    public function index()
    {
        $participations = Auth::user()->participations()
            ->with(['examen'])
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Evaluation/Index', [
            'participations' => $participations
        ]);
    }

    /**
     * Afficher la page pour entrer un code d'examen
     */
    public function entrerCode()
    {
        return inertia('Evaluation/EntrerCode');
    }

    /**
     * Vérifier le code d'examen et créer une participation
     */
    public function verifierCode(Request $request)
    {
        try {
            $request->validate([
                'code' => 'required|string|max:10'
            ]);

            $examen = Examen::where('code_examen', $request->code)
                ->where('statut', 'actif')
                ->first();

            if (!$examen) {
                return back()->withErrors(['code' => 'Code d\'examen invalide ou examen non disponible.']);
            }

            // Vérifier si l'étudiant a déjà participé à cet examen
            $participationExistante = Participation::where('id_examen', $examen->id)
                ->where('id_etudiant', Auth::id())
                ->first();

            if ($participationExistante) {
                if ($participationExistante->statut === 'en_cours') {
                    return redirect()->route('etudiant.evaluation.passer', $participationExistante);
                } else {
                    return redirect()->route('etudiant.evaluation.resultats', $participationExistante);
                }
            }

            // Créer une nouvelle participation
            $participation = Participation::create([
                'id_examen' => $examen->id,
                'id_etudiant' => Auth::id(),
                'nom' => Auth::user()->name,
                'email' => Auth::user()->email,
                'statut' => 'en_cours',
                'date_debut_examen' => now(),
            ]);

            return redirect()->route('etudiant.evaluation.passer', $participation);

        } catch (\Exception $e) {
            return back()->withErrors(['code' => 'Erreur lors de la vérification du code: ' . $e->getMessage()]);
        }
    }

    /**
     * Afficher l'examen en cours
     */
    public function passer(Participation $participation)
    {
        if ($participation->id_etudiant !== Auth::id()) {
            abort(403);
        }

        if (!$participation->estEnCours()) {
            return redirect()->route('etudiant.evaluation.resultats', $participation);
        }

        $participation->load(['examen.questions.reponses']);
        
        return inertia('Evaluation/Passer', [
            'participation' => $participation
        ]);
    }

    /**
     * Afficher les résultats d'un examen
     */
    public function resultats(Participation $participation)
    {
        if ($participation->id_etudiant !== Auth::id()) {
            abort(403);
        }

        $participation->load(['examen', 'reponsesEtudiants.question.reponses', 'reponsesEtudiants.reponse']);

        // S'assurer que les données sont au bon format pour React
        $reponsesEtudiants = $participation->reponsesEtudiants->map(function($reponseEtudiant) {
            return [
                'id' => $reponseEtudiant->id,
                'reponse_texte' => $reponseEtudiant->reponse ? $reponseEtudiant->reponse->reponse : '',
                'est_correcte' => $reponseEtudiant->est_correcte,
                'points_obtenus' => $reponseEtudiant->points_obtenus,
                'question' => [
                    'id' => $reponseEtudiant->question->id,
                    'question' => $reponseEtudiant->question->question,
                    'points' => $reponseEtudiant->question->points,
                    'type' => $reponseEtudiant->question->type,
                    'reponses' => $reponseEtudiant->question->reponses->map(function($reponse) {
                        return [
                            'id' => $reponse->id,
                            'reponse' => $reponse->reponse,
                            'est_correcte' => $reponse->est_correcte
                        ];
                    })
                ],
                'reponse' => $reponseEtudiant->reponse ? [
                    'id' => $reponseEtudiant->reponse->id,
                    'reponse' => $reponseEtudiant->reponse->reponse,
                    'est_correcte' => $reponseEtudiant->reponse->est_correcte
                ] : null
            ];
        });

        // Calculer le score total à partir des questions
        $scoreTotal = $reponsesEtudiants->sum(function($reponse) {
            return $reponse['question']['points'];
        });

        $participationData = [
            'id' => $participation->id,
            'score_obtenu' => $participation->score_obtenu,
            'score_total' => $scoreTotal,
            'statut' => $participation->statut,
            'date_debut_examen' => $participation->date_debut_examen,
            'date_fin_examen' => $participation->date_fin_examen,
            'examen' => [
                'id' => $participation->examen->id,
                'titre' => $participation->examen->titre,
                'description' => $participation->examen->description,
                'duree_minutes' => $participation->examen->duree_minutes,
                'niveau' => $participation->examen->niveau,
            ],
            'reponsesEtudiants' => $reponsesEtudiants,
            'nombre_questions' => $reponsesEtudiants->count(),
            'pourcentage' => $scoreTotal > 0 ? round(($participation->score_obtenu / $scoreTotal) * 100) : 0
        ];

        return inertia('Evaluation/Resultats', [
            'participation' => $participationData
        ]);
    }

    /**
     * Afficher l'historique des examens passés
     */
    public function historique()
    {
        $participations = Auth::user()->participations()
            ->with(['examen'])
            ->where('statut', '!=', 'en_cours')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Evaluation/Historique', [
            'participations' => $participations
        ]);
    }

    /**
     * Afficher les détails d'un examen terminé
     */
    public function details(Participation $participation)
    {
        if ($participation->id_etudiant !== Auth::id()) {
            abort(403);
        }

        $participation->load(['examen.questions.reponses', 'reponsesEtudiants.question.reponses']);

        return inertia('Evaluation/Details', [
            'participation' => $participation
        ]);
    }
}
