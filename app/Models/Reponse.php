<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'reponse',
        'est_correcte',
        'id_question',
        'ordre',
    ];

    protected $casts = [
        'est_correcte' => 'boolean',
    ];

    // Relations
    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question');
    }

    public function reponsesEtudiants()
    {
        return $this->hasMany(ReponseEtudiant::class, 'id_reponse');
    }
}
