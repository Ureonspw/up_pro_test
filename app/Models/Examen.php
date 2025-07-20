<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examen extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'code_examen',
        'duree_minutes',
        'niveau',
        'instructions_speciales',
        'id_professeur',
        'id_document',
        'est_actif',
        'statut',
        'date_debut',
        'date_fin',
    ];

    protected $casts = [
        'est_actif' => 'boolean',
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
    ];

    // Relations
    public function professeur()
    {
        return $this->belongsTo(User::class, 'id_professeur');
    }

    public function document()
    {
        return $this->belongsTo(Document::class, 'id_document', 'id_doc');
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'id_examen')->orderBy('ordre');
    }

    public function participations()
    {
        return $this->hasMany(Participation::class, 'id_examen');
    }

    // Méthodes utilitaires
    public function estEnCours()
    {
        $now = now();
        return $this->est_actif && 
               (!$this->date_debut || $now->gte($this->date_debut)) &&
               (!$this->date_fin || $now->lte($this->date_fin));
    }

    public function estTermine()
    {
        return $this->date_fin && now()->gt($this->date_fin);
    }

    public function getScoreTotal()
    {
        return $this->questions->sum('points');
    }
}
