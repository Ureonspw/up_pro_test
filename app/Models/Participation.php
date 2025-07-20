<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participation extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_etudiant',
        'id_examen',
        'score_obtenu',
        'score_total',
        'date_debut_examen',
        'date_fin_examen',
        'statut',
        'nom_etudiant',
        'email_etudiant',
    ];

    protected $casts = [
        'date_debut_examen' => 'datetime',
        'date_fin_examen' => 'datetime',
    ];

    // Relations
    public function etudiant()
    {
        return $this->belongsTo(User::class, 'id_etudiant');
    }

    public function examen()
    {
        return $this->belongsTo(Examen::class, 'id_examen');
    }

    public function reponsesEtudiants()
    {
        return $this->hasMany(ReponseEtudiant::class, 'id_participation');
    }

    // Méthodes utilitaires
    public function calculerScore()
    {
        $score = $this->reponsesEtudiants->sum('points_obtenus');
        $this->update(['score_obtenu' => $score]);
        return $score;
    }

    public function getPourcentageScore()
    {
        if ($this->score_total == 0) return 0;
        return round(($this->score_obtenu / $this->score_total) * 100, 2);
    }

    public function estEnCours()
    {
        return $this->statut === 'en_cours';
    }

    public function estTermine()
    {
        return $this->statut === 'termine';
    }

    public function estExpire()
    {
        return $this->statut === 'expire';
    }

    public function getTempsRestant()
    {
        if (!$this->date_debut_examen || !$this->examen) {
            return null;
        }

        $dureeExamen = $this->examen->duree_minutes;
        $debutExamen = $this->date_debut_examen;
        $finExamen = $debutExamen->addMinutes($dureeExamen);
        $maintenant = now();

        if ($maintenant->gt($finExamen)) {
            return 0; // Temps écoulé
        }

        return $finExamen->diffInSeconds($maintenant);
    }
}
