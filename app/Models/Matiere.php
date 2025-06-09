<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Matiere extends Model
{
    use HasFactory;
    protected $table = 'matieres';

    
    // Spécifie la clé primaire personnalisée
    protected $primaryKey = 'id_Matiere';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable=[ 
        'nom',
        'description',
        'id_Ue',
    ];

    public function documents()
    {
        return $this->hasMany(Document::class, 'id_Matiere', 'id_matiere');
    }
}
