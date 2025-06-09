<?php 
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Filiere;
use App\Models\UE;
use App\Models\Matiere;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'etudiantsCount' => User::where('id_role', 1)->count(),
            'professeursCount' => User::where('id_role', 2)->count(),
            'filieresCount' => Filiere::count(),
            'uesCount' => UE::count(),
            'matieresCount' => Matiere::count(),
        ]);
    }
}

