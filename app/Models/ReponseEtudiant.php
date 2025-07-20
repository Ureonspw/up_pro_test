<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReponseEtudiant extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_participation',
        'id_question',
        'id_reponse',
        'est_correcte',
        'points_obtenus',
    ];

    protected $casts = [
        'est_correcte' => 'boolean',
    ];

    // Relations
    public function participation()
    {
        return $this->belongsTo(Participation::class, 'id_participation');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question');
    }

    public function reponse()
    {
        return $this->belongsTo(Reponse::class, 'id_reponse');
    }

    // Méthodes utilitaires
    public function evaluerReponse()
    {
        if ($this->question->estChoixUnique() || $this->question->estVraiFaux()) {
            // Pour les questions à choix unique ou vrai/faux
            if ($this->reponse && $this->reponse->est_correcte) {
                $this->est_correcte = true;
                $this->points_obtenus = $this->question->points;
            } else {
                $this->est_correcte = false;
                $this->points_obtenus = 0;
            }
        } elseif ($this->question->estChoixMultiple()) {
            // Pour les questions à choix multiples
            $reponsesCorrectes = $this->question->reponsesCorrectes()->pluck('id')->toArray();
            $reponsesEtudiant = $this->participation->reponsesEtudiants()
                ->where('id_question', $this->id_question)
                ->pluck('id_reponse')
                ->toArray();

            // Vérifier si toutes les bonnes réponses sont sélectionnées et aucune mauvaise
            $bonnesReponsesSelectionnees = array_intersect($reponsesCorrectes, $reponsesEtudiant);
            $mauvaisesReponsesSelectionnees = array_diff($reponsesEtudiant, $reponsesCorrectes);

            if (count($bonnesReponsesSelectionnees) === count($reponsesCorrectes) && 
                count($mauvaisesReponsesSelectionnees) === 0) {
                $this->est_correcte = true;
                $this->points_obtenus = $this->question->points;
            } else {
                $this->est_correcte = false;
                $this->points_obtenus = 0;
            }
        }

        $this->save();
        return $this;
    }
}
