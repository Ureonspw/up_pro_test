<?php

namespace App\Http\Controllers;

use App\Models\Examen;
use App\Models\Participation;
use App\Models\ReponseEtudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ParticipationController extends Controller
{
    /**
     * Commencer un examen
     */
    public function commencer(Request $request)
    {
        $request->validate([
            'code_examen' => 'required|string|size:6',
        ]);

        $examen = Examen::where('code_examen', strtoupper($request->code_examen))
            ->where('statut', 'actif')
            ->first();

        if (!$examen) {
            return response()->json([
                'error' => 'Code d\'examen invalide ou examen non actif'
            ], 404);
        }

        if ($examen->date_fin && now()->isAfter($examen->date_fin)) {
            return response()->json([
                'error' => 'Cet examen est terminé'
            ], 403);
        }

        // Utiliser les informations de l'utilisateur connecté
        $user = Auth::user();
        $nomEtudiant = $user ? $user->name : 'Étudiant anonyme';
        $emailEtudiant = $user ? $user->email : 'anonyme@example.com';

        // Créer une nouvelle participation
        $participation = Participation::create([
            'id_etudiant' => $user ? $user->id : null,
            'id_examen' => $examen->id,
            'nom_etudiant' => $nomEtudiant,
            'email_etudiant' => $emailEtudiant,
            'date_debut_examen' => now(),
            'score_total' => $examen->questions->sum('points'),
            'statut' => 'en_cours'
        ]);

        return response()->json([
            'participation' => $participation->load(['examen.questions.reponses']),
            'message' => 'Examen commencé avec succès !'
        ]);
    }

    /**
     * Soumettre les réponses d'un examen
     */
    public function soumettre(Request $request)
    {
        try {
            $request->validate([
                'reponses' => 'required|array|min:1',
                'reponses.*.id_question' => 'required|exists:questions,id',
                'reponses.*.id_reponse' => 'nullable|exists:reponses,id',
            ]);

            // Trouver la participation en cours pour l'utilisateur
            $participation = Participation::where('id_etudiant', Auth::id())
                ->where('statut', 'en_cours')
                ->latest()
                ->first();

            if (!$participation) {
                return back()->withErrors(['message' => 'Aucun examen en cours trouvé']);
            }

            DB::transaction(function () use ($request, $participation) {
                // Supprimer les anciennes réponses
                $participation->reponsesEtudiants()->delete();

                // Ne traiter que les réponses qui ont un id_reponse valide
                foreach ($request->reponses as $reponseData) {
                    if (!empty($reponseData['id_reponse']) && $reponseData['id_reponse'] !== null) {
                        ReponseEtudiant::create([
                            'id_participation' => $participation->id,
                            'id_question' => $reponseData['id_question'],
                            'id_reponse' => $reponseData['id_reponse'],
                        ]);
                    }
                }

                // Recharger la participation avec les relations
                $participation->load(['reponsesEtudiants.question.reponses']);

                // Évaluer toutes les réponses
                $scoreTotal = 0;
                foreach ($participation->reponsesEtudiants as $reponseEtudiant) {
                    $reponseEtudiant->evaluerReponse();
                    $scoreTotal += $reponseEtudiant->points_obtenus;
                }

                // Mettre à jour la participation
                $participation->update([
                    'score_obtenu' => $scoreTotal,
                    'date_fin_examen' => now(),
                    'statut' => 'termine'
                ]);
            });

            // Rediriger vers les résultats
            return redirect()->route('etudiant.evaluation.resultats', $participation);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la soumission de l\'examen: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return back()->withErrors(['message' => 'Erreur lors de la soumission de l\'examen: ' . $e->getMessage()]);
        }
    }

    /**
     * Obtenir le temps restant pour un examen
     */
    public function tempsRestant(Participation $participation)
    {
        $tempsRestant = $participation->getTempsRestant();

        if ($tempsRestant === null) {
            return response()->json(['error' => 'Impossible de calculer le temps restant'], 400);
        }

        if ($tempsRestant <= 0) {
            // L'examen a expiré, le soumettre automatiquement
            $participation->update([
                'statut' => 'expire',
                'date_fin_examen' => now()
            ]);

            return response()->json([
                'temps_restant' => 0,
                'expire' => true,
                'message' => 'Temps écoulé, examen soumis automatiquement'
            ]);
        }

        return response()->json([
            'temps_restant' => $tempsRestant,
            'expire' => false
        ]);
    }

    /**
     * Obtenir les résultats d'un étudiant
     */
    public function resultats(Participation $participation)
    {
        $participation->load(['examen', 'reponsesEtudiants.question.reponses']);

        return response()->json([
            'participation' => $participation,
            'score' => $participation->score_obtenu,
            'score_total' => $participation->score_total,
            'pourcentage' => $participation->getPourcentageScore()
        ]);
    }
}
