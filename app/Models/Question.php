<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
        'type',
        'points',
        'id_examen',
        'ordre',
        'est_modifiee_manuellement',
    ];

    protected $casts = [
        'est_modifiee_manuellement' => 'boolean',
    ];

    // Relations
    public function examen()
    {
        return $this->belongsTo(Examen::class, 'id_examen');
    }

    public function reponses()
    {
        return $this->hasMany(Reponse::class, 'id_question')->orderBy('ordre');
    }

    public function reponsesCorrectes()
    {
        return $this->hasMany(Reponse::class, 'id_question')->where('est_correcte', true);
    }

    public function reponsesEtudiants()
    {
        return $this->hasMany(ReponseEtudiant::class, 'id_question');
    }

    // Méthodes utilitaires
    public function estChoixMultiple()
    {
        return $this->type === 'choix_multiple';
    }

    public function estChoixUnique()
    {
        return $this->type === 'choix_unique';
    }

    public function estVraiFaux()
    {
        return $this->type === 'vrai_faux';
    }
}
