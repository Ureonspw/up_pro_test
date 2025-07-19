<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // S'assurer qu'il existe un document par défaut avec ID 1
        DB::table('documents')->updateOrInsert(
            ['id_doc' => 1],
            [
                'id_doc' => 1,
                'nom' => 'Document par défaut',
                'description' => 'Document créé automatiquement pour les fiches IA',
                'chemin' => 'documents/default.pdf',
                'id_type_doc' => 1, // Vous devrez peut-être ajuster selon vos types de documents
                'user_id' => 1, // L'utilisateur par défaut (Test User)
                'id_Matiere' => 1, // La première matière disponible
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
