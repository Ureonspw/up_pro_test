<?php
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\FiliereController;
use App\Http\Controllers\Admin\UEController;
use App\Http\Controllers\Admin\MatiereController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\IAController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\ExamenController;
use App\Http\Controllers\ParticipationController;
use App\Http\Controllers\EvaluationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Page d'accueil
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Redirection vers le dashboard en fonction du rôle
Route::get('/dashboard', function () {
    $user = Auth::user();

    switch ($user->id_role) {
        case 1:
            return redirect()->route('etudiant.dashboard');
        case 2:
            return redirect()->route('professeur.dashboard');
        case 3:
            return redirect()->route('admin.dashboard');
        default:
            abort(403);
    }
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // Routes pour les utilisateurs
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');



    // Routes pour les filières
    Route::get('/filieres', [FiliereController::class, 'index'])->name('filieres.index');
    Route::get('/filieres/create', [FiliereController::class, 'create'])->name('filieres.create');
    Route::post('/filieres', [FiliereController::class, 'store'])->name('filieres.store');
    Route::get('/filieres/{id_filiere}/edit', [FiliereController::class, 'edit'])->name('filieres.edit');
    Route::put('/filieres/{id_filiere}', [FiliereController::class, 'update'])->name('filieres.update');
    Route::delete('/filieres/{id_filiere}', [FiliereController::class, 'destroy'])->name('filieres.destroy');

    // Routes pour les UE
    Route::get('/ues', [UEController::class, 'index'])->name('ues.index');
    Route::get('/ues/create', [UEController::class, 'create'])->name('ues.create');
    Route::post('/ues', [UEController::class, 'store'])->name('ues.store');
    Route::get('/ues/{id_Ue}/edit', [UEController::class, 'edit'])->name('ues.edit');
    Route::put('/ues/{id_Ue}', [UEController::class, 'update'])->name('ues.update');
    Route::delete('/ues/{id_Ue}', [UEController::class, 'destroy'])->name('ues.destroy');

    // Routes pour les matières
Route::get('/matieres', [MatiereController::class, 'index'])->name('matieres.index');
Route::get('/matieres/create', [MatiereController::class, 'create'])->name('matieres.create');
Route::post('/matieres', [MatiereController::class, 'store'])->name('matieres.store');
Route::get('/matieres/{id_Matiere}/edit', [MatiereController::class, 'edit'])->name('matieres.edit');
Route::put('/matieres/{id_Matiere}', [MatiereController::class, 'update'])->name('matieres.update');
Route::delete('/matieres/{id_Matiere}', [MatiereController::class, 'destroy'])->name('matieres.destroy');
});

// ======================== PROFESSEUR ========================
Route::middleware(['auth'])->prefix('professeur')->name('professeur.')->group(function () {
    Route::get('/dashboard', function () {                                               
        return Inertia::render('Professeur/Dashboard');
    })->name('dashboard');

    // Routes pour les examens (côté professeur)
    Route::get('/examens', [ExamenController::class, 'index'])->name('examens.index');
    Route::get('/examens/create', [ExamenController::class, 'create'])->name('examens.create');
    Route::post('/examens', [ExamenController::class, 'store'])->name('examens.store');
    Route::get('/examens/{examen}', [ExamenController::class, 'show'])->name('examens.show');
    Route::get('/examens/{examen}/edit', [ExamenController::class, 'edit'])->name('examens.edit');
    Route::put('/examens/{examen}', [ExamenController::class, 'update'])->name('examens.update');
    Route::delete('/examens/{examen}', [ExamenController::class, 'destroy'])->name('examens.destroy');
    Route::get('/examens/{examen}/resultats', [ExamenController::class, 'resultatsProfesseur'])->name('examens.resultats');
    Route::patch('/examens/{examen}/commencer-evaluation', [ExamenController::class, 'commencerEvaluation'])->name('examens.commencer-evaluation');
    Route::patch('/examens/{examen}/arreter-evaluation', [ExamenController::class, 'arreterEvaluation'])->name('examens.arreter-evaluation');
    
    // Routes pour les questions
    Route::post('/examens/{examen}/questions', [ExamenController::class, 'storeQuestion'])->name('examens.questions.store');
    Route::put('/examens/{examen}/questions/{question}', [ExamenController::class, 'updateQuestion'])->name('examens.questions.update');
    Route::delete('/examens/{examen}/questions/{question}', [ExamenController::class, 'destroyQuestion'])->name('examens.questions.destroy');
    
    // Routes pour les réponses
    Route::delete('/examens/{examen}/questions/{question}/reponses/{reponse}', [ExamenController::class, 'destroyReponse'])->name('examens.questions.reponses.destroy');
});

// Route pour la page principale des examens (alias pour exam_code)
Route::get('/exam_code', function () {
    return redirect()->route('professeur.examens.index');
})->name('exam_code');



// ======================== ETUDIANT ========================
Route::middleware(['auth'])->prefix('etudiant')->name('etudiant.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Etudiant/Dashboard');
    })->name('dashboard');

    // Routes pour la participation aux examens (côté étudiant)
    Route::get('/evaluation', [EvaluationController::class, 'index'])->name('evaluation.index');
    Route::get('/evaluation/entrer-code', [EvaluationController::class, 'entrerCode'])->name('evaluation.entrerCode');
    Route::post('/evaluation/verifier-code', [EvaluationController::class, 'verifierCode'])->middleware('test.auth')->name('evaluation.verifierCode');
    Route::get('/evaluation/passer/{participation}', [EvaluationController::class, 'passer'])->name('evaluation.passer');
    Route::post('/evaluation/soumettre', [ParticipationController::class, 'soumettre'])->name('evaluation.soumettre');
    Route::get('/evaluation/resultats/{participation}', [EvaluationController::class, 'resultats'])->name('evaluation.resultats');
});



// ======================== IMPORTATION QUIZZ ========================
Route::middleware(['auth', 'verified'])->get('/importation_quizz', function () {
    return Inertia::render('importation_cours/importation_quizz');
})->name('importation_quizz');



// ======================== PROFIL UTILISATEUR ========================
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});






Route::middleware(['auth', 'verified'])->group(function () {
    // Routes pour les vidéos
    Route::get('/videos', [VideoController::class, 'index'])->name('videos');
    Route::get('/prof_video', [VideoController::class, 'create'])->name('prof_video');
    Route::post('/videos', [VideoController::class, 'store'])->name('videos.store');

    // Autres routes existantes
    Route::get('/resumer_page', function () {
        return Inertia::render('resumer_page/resumer_pagemain');
    })->name('resumer_pagemain');

    Route::get('/qcms', function () {
        return Inertia::render('qcms/qcm_pagemain');
    })->name('qcmMain');

    Route::get('/flashcard', function () {
        return Inertia::render('flashcard/flashcard_pagemain');
    })->name('Flashcard');

    Route::get('/questionnaire', function () {
        return Inertia::render('questionnaire/questionnaire_pagemain');
    })->name('Questionnaire');

    Route::get('/discussion_ia', function () {
        return Inertia::render('discussion_ia/Chatglobal');
    })->name('discussion_ia');

    Route::get('/enregistrement_page', function () {
        return Inertia::render('enregistrement_page/enregistrer_fichier');
    })->name('enregistrement_page');
});

Route::post('/upload-document', [DocumentController::class, 'store']);
Route::post('/generate-ia/{document}', [IAController::class, 'store']);
Route::get('/historique_pages', function () {
    return Inertia::render('historique_pages/historique_pages');
})->middleware(['auth', 'verified'])->name('historique_pages');

Route::get('/pages_publiques', function () {
    return Inertia::render('pages_publiques/pages_publique');
})->middleware(['auth', 'verified'])->name('pages_publiques');

// Route::get('/import_doc/matieres', [DocumentController::class, 'getMatieres']);
// Route::post('/import_doc', [DocumentController::class, 'store']);

Route::get('/import_prof', function () {
    return Inertia::render('Professeur/enregistrementPro_pagemain');
})->middleware(['auth', 'verified'])->name('import_prof');

Route::get('/millionaire', function () {
    return Inertia::render('qcms/MillionaireGame');
})->name('millionaire');

Route::get('/api/matieres', [MatiereController::class, 'getAllMatieres']);

// ======================== AUTH ========================
require __DIR__.'/auth.php';

// Route pour servir les fichiers PDF
Route::middleware(['auth:sanctum'])->get('/storage/documents/{filename}', function ($filename) {
    $path = storage_path('app/public/documents/' . $filename);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()->file($path, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $filename . '"'
    ]);
})->where('filename', '.*');





