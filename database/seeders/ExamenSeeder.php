<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Examen;
use App\Models\Question;
use App\Models\Reponse;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Str;

class ExamenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des rôles s'ils n'existent pas
        $roleProfesseur = Role::firstOrCreate(['libelle' => 'professeur']);
        $roleEtudiant = Role::firstOrCreate(['libelle' => 'etudiant']);

        // Créer un professeur de test
        $professeur = User::firstOrCreate(
            ['email' => 'professeur@test.com'],
            [
                'name' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'professeur@test.com',
                'password' => bcrypt('password'),
                'id_role' => $roleProfesseur->id_role,
                'statut' => 'actif',
                'tel' => '0123456789',
                'sexe' => 'M',
            ]
        );

        // Créer des étudiants de test
        $etudiants = [];
        for ($i = 1; $i <= 5; $i++) {
            $etudiants[] = User::firstOrCreate(
                ['email' => "etudiant{$i}@test.com"],
                [
                    'name' => "Étudiant{$i}",
                    'prenom' => "Prénom{$i}",
                    'email' => "etudiant{$i}@test.com",
                    'password' => bcrypt('password'),
                    'id_role' => $roleEtudiant->id_role,
                    'statut' => 'actif',
                    'tel' => "012345678{$i}",
                    'sexe' => $i % 2 === 0 ? 'M' : 'F',
                ]
            );
        }

        // Créer des examens de test
        $examens = [
            [
                'titre' => 'Examen de Mathématiques - Niveau Facile',
                'description' => 'Examen sur les bases des mathématiques',
                'duree_minutes' => 30,
                'niveau' => 'facile',
                'instructions_speciales' => 'Questions simples sur les opérations de base',
            ],
            [
                'titre' => 'Examen de Physique - Niveau Moyen',
                'description' => 'Examen sur la mécanique classique',
                'duree_minutes' => 45,
                'niveau' => 'moyen',
                'instructions_speciales' => 'Questions sur les lois de Newton',
            ],
            [
                'titre' => 'Examen de Programmation - Niveau Difficile',
                'description' => 'Examen sur les algorithmes avancés',
                'duree_minutes' => 60,
                'niveau' => 'difficile',
                'instructions_speciales' => 'Questions sur la complexité algorithmique',
            ],
        ];

        foreach ($examens as $examenData) {
            $examen = Examen::create([
                'titre' => $examenData['titre'],
                'description' => $examenData['description'],
                'code_examen' => strtoupper(Str::random(6)),
                'duree_minutes' => $examenData['duree_minutes'],
                'niveau' => $examenData['niveau'],
                'instructions_speciales' => $examenData['instructions_speciales'],
                'id_professeur' => $professeur->id,
                'est_actif' => true,
            ]);

            // Créer des questions pour chaque examen
            $questions = $this->getQuestionsForExamen($examenData['niveau']);
            
            foreach ($questions as $index => $questionData) {
                $question = Question::create([
                    'question' => $questionData['question'],
                    'type' => $questionData['type'],
                    'points' => $questionData['points'],
                    'id_examen' => $examen->id,
                    'ordre' => $index + 1,
                ]);

                // Créer les réponses pour chaque question
                foreach ($questionData['reponses'] as $reponseIndex => $reponseData) {
                    Reponse::create([
                        'reponse' => $reponseData['reponse'],
                        'est_correcte' => $reponseData['est_correcte'],
                        'id_question' => $question->id,
                        'ordre' => $reponseIndex + 1,
                    ]);
                }
            }
        }
    }

    private function getQuestionsForExamen($niveau)
    {
        $questions = [
            'facile' => [
                [
                    'question' => 'Quel est le résultat de 2 + 2 ?',
                    'type' => 'choix_unique',
                    'points' => 1,
                    'reponses' => [
                        ['reponse' => '3', 'est_correcte' => false],
                        ['reponse' => '4', 'est_correcte' => true],
                        ['reponse' => '5', 'est_correcte' => false],
                        ['reponse' => '6', 'est_correcte' => false],
                    ]
                ],
                [
                    'question' => 'Quelle est la capitale de la France ?',
                    'type' => 'choix_unique',
                    'points' => 1,
                    'reponses' => [
                        ['reponse' => 'Lyon', 'est_correcte' => false],
                        ['reponse' => 'Marseille', 'est_correcte' => false],
                        ['reponse' => 'Paris', 'est_correcte' => true],
                        ['reponse' => 'Toulouse', 'est_correcte' => false],
                    ]
                ],
                [
                    'question' => 'Le soleil est une étoile.',
                    'type' => 'vrai_faux',
                    'points' => 1,
                    'reponses' => [
                        ['reponse' => 'Vrai', 'est_correcte' => true],
                        ['reponse' => 'Faux', 'est_correcte' => false],
                    ]
                ],
            ],
            'moyen' => [
                [
                    'question' => 'Quelle est la formule de l\'énergie cinétique ?',
                    'type' => 'choix_unique',
                    'points' => 2,
                    'reponses' => [
                        ['reponse' => 'E = mgh', 'est_correcte' => false],
                        ['reponse' => 'E = 1/2 mv²', 'est_correcte' => true],
                        ['reponse' => 'E = mc²', 'est_correcte' => false],
                        ['reponse' => 'E = Fd', 'est_correcte' => false],
                    ]
                ],
                [
                    'question' => 'Quels sont les principes de la thermodynamique ?',
                    'type' => 'choix_multiple',
                    'points' => 3,
                    'reponses' => [
                        ['reponse' => 'Conservation de l\'énergie', 'est_correcte' => true],
                        ['reponse' => 'Augmentation de l\'entropie', 'est_correcte' => true],
                        ['reponse' => 'Conservation de la masse', 'est_correcte' => false],
                        ['reponse' => 'Impossibilité du mouvement perpétuel', 'est_correcte' => true],
                    ]
                ],
            ],
            'difficile' => [
                [
                    'question' => 'Quelle est la complexité temporelle de l\'algorithme de tri fusion ?',
                    'type' => 'choix_unique',
                    'points' => 3,
                    'reponses' => [
                        ['reponse' => 'O(n)', 'est_correcte' => false],
                        ['reponse' => 'O(n log n)', 'est_correcte' => true],
                        ['reponse' => 'O(n²)', 'est_correcte' => false],
                        ['reponse' => 'O(log n)', 'est_correcte' => false],
                    ]
                ],
                [
                    'question' => 'Quels algorithmes utilisent la programmation dynamique ?',
                    'type' => 'choix_multiple',
                    'points' => 4,
                    'reponses' => [
                        ['reponse' => 'Algorithme de Dijkstra', 'est_correcte' => false],
                        ['reponse' => 'Problème du sac à dos', 'est_correcte' => true],
                        ['reponse' => 'Plus longue sous-séquence commune', 'est_correcte' => true],
                        ['reponse' => 'Tri rapide', 'est_correcte' => false],
                    ]
                ],
            ],
        ];

        return $questions[$niveau] ?? $questions['facile'];
    }
}
