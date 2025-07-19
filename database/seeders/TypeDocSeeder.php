<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeDocSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['id_type_doc' => 1, 'libelle' => 'PDF', 'created_at' => now(), 'updated_at' => now()],
            ['id_type_doc' => 2, 'libelle' => 'Image', 'created_at' => now(), 'updated_at' => now()],
            ['id_type_doc' => 3, 'libelle' => 'Texte', 'created_at' => now(), 'updated_at' => now()],
            ['id_type_doc' => 4, 'libelle' => 'Vidéo', 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($types as $type) {
            DB::table('type_docs')->updateOrInsert(
                ['id_type_doc' => $type['id_type_doc']],
                $type
            );
        }
    }
}
