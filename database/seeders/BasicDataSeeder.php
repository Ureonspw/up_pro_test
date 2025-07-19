<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BasicDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer une filière par défaut
        DB::table('filieres')->updateOrInsert(
            ['id_filiere' => 1],
            [
                'id_filiere' => 1,
                'nom' => 'Informatique',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Créer une UE par défaut
        DB::table('ues')->updateOrInsert(
            ['id_Ue' => 1],
            [
                'id_Ue' => 1,
                'nom' => 'UE Générale',
                'id_filiere' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Créer une matière par défaut
        DB::table('matieres')->updateOrInsert(
            ['id_Matiere' => 1],
            [
                'id_Matiere' => 1,
                'nom' => 'Matière générale',
                'description' => 'Matière par défaut pour les documents IA',
                'id_Ue' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Créer un document par défaut
        DB::table('documents')->updateOrInsert(
            ['id_doc' => 1],
            [
                'id_doc' => 1,
                'nom' => 'Document par défaut',
                'description' => 'Document créé automatiquement pour les fiches IA',
                'chemin' => 'documents/default.pdf',
                'id_type_doc' => 1,
                'user_id' => 1,
                'id_Matiere' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
