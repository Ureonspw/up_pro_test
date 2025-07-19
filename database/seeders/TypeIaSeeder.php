<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeIaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['ID_type_IA' => 1, 'libelle' => 'Questionnaire', 'created_at' => now(), 'updated_at' => now()],
            ['ID_type_IA' => 2, 'libelle' => 'Résumé', 'created_at' => now(), 'updated_at' => now()],
            ['ID_type_IA' => 3, 'libelle' => 'Document Prof', 'created_at' => now(), 'updated_at' => now()],
            ['ID_type_IA' => 4, 'libelle' => 'Autre Document', 'created_at' => now(), 'updated_at' => now()],
            ['ID_type_IA' => 5, 'libelle' => 'QCM', 'created_at' => now(), 'updated_at' => now()],
            ['ID_type_IA' => 6, 'libelle' => 'Flashcard', 'created_at' => now(), 'updated_at' => now()],
        ];

        // Insérer les types d'IA s'ils n'existent pas déjà
        foreach ($types as $type) {
            DB::table('type_ias')->updateOrInsert(
                ['ID_type_IA' => $type['ID_type_IA']],
                $type
            );
        }
    }
}
