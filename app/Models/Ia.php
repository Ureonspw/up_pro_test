<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Ia extends Model
{
    use HasFactory;

    protected $table = 'ias';
    protected $primaryKey = 'id_ia';

    protected $fillable = [
        'titre', 'contenue_ia', 'ID_type_IA', 'id_doc'
    ];

    public function document()
    {
        return $this->belongsTo(Document::class, 'id_doc', 'id_doc');
    }

    public function type_ia()
    {
        return $this->belongsTo(type_ia::class, 'ID_type_IA', 'id_type_IA');
    }
}
