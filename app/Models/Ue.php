<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ue extends Model
{
    use HasFactory;
    
    protected $table = 'ues';
    protected $primaryKey = 'id_Ue';
    public $incrementing = true;
    protected $keyType = 'int';
    
    protected $fillable = [
        'nom',
        'id_filiere',
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere', 'id_filiere');
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'id_Ue', 'id_Ue');
    }
}
