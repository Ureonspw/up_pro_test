<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Filiere extends Model
{
    use HasFactory;
    
    protected $table = 'filieres';
    protected $primaryKey = 'id_filiere';
    public $incrementing = true;
    protected $keyType = 'int';
    
    protected $fillable = [
        'nom',
    ];

    public function ues()
    {
        return $this->hasMany(Ue::class, 'id_filiere', 'id_filiere');
    }
}
