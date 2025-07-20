import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Examen {
    id: number;
    titre: string;
    description: string;
    code_examen: string;
    duree_minutes: number;
    niveau: string;
    statut: string;
    created_at: string;
    questions_count: number;
    participations_count: number;
}

interface Props extends PageProps {
    examens: Examen[];
}

export default function Index({ examens }: Props) {
    const { post, delete: destroy, patch } = useForm();

    const genererQuestions = (examenId: number) => {
        post(route('professeur.examens.generer-questions', examenId));
    };

    const commencerEvaluation = (examenId: number) => {
        if (confirm('Êtes-vous sûr de vouloir lancer l\'évaluation ? Les étudiants pourront commencer à passer l\'examen.')) {
            patch(route('professeur.examens.commencer-evaluation', examenId));
        }
    };

    const arreterEvaluation = (examenId: number) => {
        if (confirm('Êtes-vous sûr de vouloir arrêter l\'évaluation ? Les étudiants ne pourront plus passer l\'examen.')) {
            patch(route('professeur.examens.arreter-evaluation', examenId));
        }
    };

    const reactiverEvaluation = (examenId: number) => {
        if (confirm('Êtes-vous sûr de vouloir réactiver l\'évaluation ?')) {
            patch(route('professeur.examens.commencer-evaluation', examenId));
        }
    };

    const toggleActivation = (examenId: number) => {
        post(route('professeur.examens.toggle-activation', examenId));
    };

    const getStatutBadge = (statut: string) => {
        const badges = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'questions_generees': 'bg-blue-100 text-blue-800',
            'actif': 'bg-green-100 text-green-800',
            'inactif': 'bg-red-100 text-red-800',
        };
        return badges[statut as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getStatutLabel = (statut: string) => {
        const labels = {
            'en_attente': 'En attente',
            'questions_generees': 'Questions générées',
            'actif': 'Actif',
            'inactif': 'Inactif',
        };
        return labels[statut as keyof typeof labels] || statut;
    };

    const getActions = (examen: Examen) => {
        switch (examen.statut) {
            case 'en_attente':
                return (
                    <div className="text-sm text-gray-500">
                        Questions générées automatiquement
                    </div>
                );
            case 'questions_generees':
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => commencerEvaluation(examen.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                            🚀 Lancer l'évaluation
                        </button>
                        <Link
                            href={route('professeur.examens.show', examen.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Gérer les questions
                        </Link>
                    </div>
                );
            case 'actif':
                return (
                    <div className="flex space-x-2">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                            ✅ EXAMEN EN COURS
                        </div>
                        <button
                            onClick={() => arreterEvaluation(examen.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                            ⏹️ Arrêter l'évaluation
                        </button>
                        <Link
                            href={route('professeur.examens.show', examen.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Voir les résultats
                        </Link>
                    </div>
                );
            case 'inactif':
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => reactiverEvaluation(examen.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                            🔄 Réactiver
                        </button>
                        <Link
                            href={route('professeur.examens.show', examen.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Voir les résultats
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestion des Examens" />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('professeur.dashboard')}
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                            ← Retour au Dashboard
                                        </Link>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Gestion des Examens
                                            </h2>
                                            <p className="text-gray-600 mt-2">
                                                Créez et gérez vos évaluations
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('professeur.examens.create')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Créer un Examen
                                    </Link>
                                </div>

                                {examens.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-gray-500 text-lg mb-4">
                                            Vous n'avez pas encore créé d'examens
                                        </div>
                                        <Link
                                            href={route('professeur.examens.create')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Créer votre premier examen
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {examens.map((examen) => (
                                            <div
                                                key={examen.id}
                                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {examen.titre}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            {examen.statut === 'actif' && (
                                                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium animate-pulse">
                                                                    🔴 EN COURS
                                                                </div>
                                                            )}
                                                            <span
                                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutBadge(examen.statut)}`}
                                                            >
                                                                {getStatutLabel(examen.statut)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4">
                                                        {examen.description || 'Aucune description'}
                                                    </p>

                                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-700">Code:</span>
                                                            <div className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                                {examen.code_examen}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Durée:</span>
                                                            <div>{examen.duree_minutes} min</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Niveau:</span>
                                                            <div className="capitalize">{examen.niveau}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Questions:</span>
                                                            <div>{examen.questions_count || 0}</div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mb-4">
                                                        {getActions(examen)}
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm text-gray-500">
                                                            {examen.participations_count || 0} participants
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('professeur.examens.edit', examen.id)}
                                                                className="text-green-600 hover:text-green-800 text-sm"
                                                            >
                                                                Modifier
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 