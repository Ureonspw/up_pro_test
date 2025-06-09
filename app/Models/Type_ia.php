<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Type_ia extends Model
{
    use HasFactory;
    protected $fillable=[ 
        'libelle',
    ];
}
