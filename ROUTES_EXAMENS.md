# Routes pour les Examens

## Routes Côté Professeur

### Gestion des Examens
- `GET /professeur/examens` - Liste des examens créés par le professeur
- `GET /professeur/examens/create` - Formulaire de création d'examen
- `POST /professeur/examens` - Créer un nouvel examen
- `GET /professeur/examens/{examen}` - Afficher un examen avec ses questions
- `GET /professeur/examens/{examen}/edit` - Formulaire d'édition d'examen
- `PUT /professeur/examens/{examen}` - Mettre à jour un examen
- `DELETE /professeur/examens/{examen}` - Supprimer un examen
- `GET /professeur/examens/{examen}/resultats` - Afficher les résultats d'un examen

### Route Alias (Compatibilité)
- `GET /exam_code` - Redirection vers `/professeur/examens` (pour compatibilité avec l'ancien dashboard)

## Routes Côté Étudiant

### Participation aux Examens
- `GET /etudiant/evaluation` - Page d'accueil des évaluations
- `GET /etudiant/evaluation/entrer-code` - Page pour entrer un code d'examen
- `POST /etudiant/evaluation/verifier-code` - Vérifier un code d'examen et créer une participation
- `GET /etudiant/evaluation/passer/{examen}` - Passer un examen
- `POST /etudiant/evaluation/soumettre` - Soumettre les réponses d'un examen
- `GET /etudiant/evaluation/resultats/{participation}` - Afficher les résultats d'un examen

## Contrôleurs Utilisés

### ExamenController
- Gestion complète des examens côté professeur
- Création, édition, suppression d'examens
- Génération automatique de questions avec IA
- Affichage des résultats

### EvaluationController
- Interface étudiant pour les examens
- Vérification des codes d'examen
- Gestion des participations

### ParticipationController
- Soumission des réponses d'examen
- Calcul des scores
- Gestion du temps restant

## Modèles Associés

### Examen
- `id_professeur` - Professeur créateur
- `code_examen` - Code unique pour accéder à l'examen
- `duree_minutes` - Durée en minutes
- `statut` - actif, inactif, etc.

### Participation
- `id_etudiant` - Étudiant participant
- `id_examen` - Examen concerné
- `statut` - en_cours, termine, expire
- `score_obtenu` - Score final

### Question & Reponse
- Questions générées automatiquement
- Réponses multiples avec une seule correcte
- Points attribués par question

## Fonctionnalités Clés

1. **Génération automatique de questions** avec Google Generative AI
2. **Support des images** pour la génération de questions
3. **Timer intégré** avec expiration automatique
4. **Calcul automatique des scores**
5. **Interface responsive** pour mobile et desktop
6. **Sécurité** - Vérification des permissions utilisateur

## Corrections Apportées

### Problème résolu : Redirection du dashboard professeur
- **Problème** : Le lien "ExamCode" dans le dashboard professeur pointait vers `/exam_code` qui n'existait pas
- **Solution** : 
  - Ajout de la route `/exam_code` qui redirige vers `/professeur/examens`
  - Correction de tous les liens dans les composants React
  - Mise à jour des redirections dans les contrôleurs

### Fichiers modifiés :
- `routes/web.php` - Ajout de la route alias
- `resources/js/Pages/Professeur/Mileu.tsx` - Correction du lien
- `app/Http/Controllers/ExamenController.php` - Correction des redirections
- `resources/js/Pages/Examens/Create.tsx` - Correction du lien "Annuler"
- `resources/js/Pages/Examens/Edit.tsx` - Correction du lien "Annuler"
- `resources/js/Pages/Examens/Show.tsx` - Correction du lien "Retour" 