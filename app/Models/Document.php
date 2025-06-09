<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
    use HasFactory;

    protected $table = 'documents';
    protected $primaryKey = 'id_doc';

    protected $fillable = [
        'nom',
        'description',
        'chemin',
        'id_type_doc',
        'user_id',
        'id_Matiere'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'id_matiere', 'id_Matiere');
    }

    public function ia()
    {
        return $this->hasMany(Ia::class, 'id_doc', 'id_doc');
    }
}
