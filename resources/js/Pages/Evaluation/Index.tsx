import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Participation {
    id: number;
    score_obtenu: number;
    score_total: number;
    statut: string;
    date_debut_examen: string;
    date_fin_examen: string;
    examen: {
        id: number;
        titre: string;
        description: string;
        duree_minutes: number;
        niveau: string;
    };
}

interface Props extends PageProps {
    participations: Participation[];
}

export default function EvaluationIndex({ participations }: Props) {
    const getStatutBadge = (statut: string) => {
        const styles = {
            en_cours: 'bg-yellow-100 text-yellow-800',
            termine: 'bg-green-100 text-green-800',
            expire: 'bg-red-100 text-red-800',
        };
        return styles[statut as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    const getStatutText = (statut: string) => {
        const texts = {
            en_cours: 'En cours',
            termine: 'Terminé',
            expire: 'Expiré',
        };
        return texts[statut as keyof typeof texts] || statut;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mes Évaluations" />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Mes Évaluations
                                    </h2>
                                    <Link
                                        href={route('etudiant.evaluation.entrerCode')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Passer un Examen
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {participations.length === 0 ? (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-gray-500 text-lg mb-4">
                                                Vous n'avez pas encore participé à d'examens
                                            </div>
                                            <Link
                                                href={route('etudiant.evaluation.entrerCode')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Passer votre premier examen
                                            </Link>
                                        </div>
                                    ) : (
                                        participations.map((participation) => (
                                            <div
                                                key={participation.id}
                                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {participation.examen.titre}
                                                        </h3>
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutBadge(participation.statut)}`}
                                                        >
                                                            {getStatutText(participation.statut)}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4">
                                                        {participation.examen.description}
                                                    </p>

                                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-700">Niveau:</span>
                                                            <div className="capitalize">{participation.examen.niveau}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Durée:</span>
                                                            <div>{participation.examen.duree_minutes} min</div>
                                                        </div>
                                                        {participation.statut === 'termine' && (
                                                            <>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Score:</span>
                                                                    <div>{participation.score_obtenu}/{participation.score_total}</div>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Pourcentage:</span>
                                                                    <div>{Math.round((participation.score_obtenu / participation.score_total) * 100)}%</div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(participation.date_debut_examen).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            {participation.statut === 'en_cours' ? (
                                                                <Link
                                                                    href={route('etudiant.evaluation.passer', participation.id)}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                                >
                                                                    Continuer
                                                                </Link>
                                                            ) : (
                                                                <Link
                                                                    href={route('etudiant.evaluation.resultats', participation.id)}
                                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                                >
                                                                    Voir résultats
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 