<?php

namespace App\Policies;

use App\Models\Examen;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExamenPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->estProfesseur();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Examen $examen): bool
    {
        return $user->id === $examen->id_professeur;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->estProfesseur();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Examen $examen): bool
    {
        return $user->id === $examen->id_professeur;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Examen $examen): bool
    {
        return $user->id === $examen->id_professeur;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Examen $examen): bool
    {
        return $user->id === $examen->id_professeur;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Examen $examen): bool
    {
        return $user->id === $examen->id_professeur;
    }
}
