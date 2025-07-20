import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface ReponseEtudiant {
    id: number;
    reponse_texte: string;
    est_correcte: boolean;
    points_obtenus: number;
    question: {
        id: number;
        question: string;
        points: number;
        type: string;
        reponses: Array<{
            id: number;
            reponse: string;
            est_correcte: boolean;
        }>;
    };
    reponse: {
        id: number;
        reponse: string;
        est_correcte: boolean;
    } | null;
}

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
    reponsesEtudiants: ReponseEtudiant[];
    nombre_questions: number;
    pourcentage: number;
}

interface Props extends PageProps {
    participation: Participation;
}

export default function Resultats({ participation }: Props) {
    const pourcentage = participation.pourcentage || (participation.score_total > 0 ? Math.round((participation.score_obtenu / participation.score_total) * 100) : 0);
    
    const getScoreColor = (pourcentage: number) => {
        if (pourcentage >= 80) return 'text-green-600';
        if (pourcentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreMessage = (pourcentage: number) => {
        if (pourcentage >= 80) return 'Excellent !';
        if (pourcentage >= 60) return 'Bon travail !';
        return 'À améliorer';
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Résultats - ${participation.examen.titre}`} />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        Résultats de l'examen
                                    </h2>
                                    <h3 className="text-xl text-gray-600">
                                        {participation.examen.titre}
                                    </h3>
                                </div>

                                {/* Résumé du score */}
                                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {participation.score_obtenu}/{participation.score_total}
                                            </div>
                                            <div className="text-sm text-gray-600">Points obtenus</div>
                                        </div>
                                        <div>
                                            <div className={`text-2xl font-bold ${getScoreColor(pourcentage)}`}>
                                                {pourcentage}%
                                            </div>
                                            <div className="text-sm text-gray-600">Pourcentage</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {participation.nombre_questions || participation.reponsesEtudiants?.length || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Questions répondues</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {getScoreMessage(pourcentage)}
                                            </div>
                                            <div className="text-sm text-gray-600">Performance</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Détails des questions */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        Détail des réponses
                                    </h4>
                                    
                                    {participation.reponsesEtudiants && participation.reponsesEtudiants.length > 0 ? (
                                        participation.reponsesEtudiants.map((reponseEtudiant, index) => (
                                        <div
                                            key={reponseEtudiant.id}
                                            className={`border rounded-lg p-4 ${
                                                reponseEtudiant.est_correcte
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-red-200 bg-red-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h5 className="font-medium text-gray-900">
                                                    Question {index + 1}
                                                </h5>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        reponseEtudiant.est_correcte
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {reponseEtudiant.est_correcte ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        {reponseEtudiant.points_obtenus}/{reponseEtudiant.question.points} pts
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-700 mb-3">
                                                {reponseEtudiant.question.question}
                                            </p>

                                            <div className="space-y-2">
                                                {reponseEtudiant.question.reponses.map((reponse) => (
                                                    <div
                                                        key={reponse.id}
                                                        className={`p-2 rounded border ${
                                                            reponse.est_correcte
                                                                ? 'bg-green-100 border-green-300'
                                                                : 'bg-gray-100 border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className={`w-4 h-4 rounded-full mr-2 ${
                                                                reponse.est_correcte
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-300'
                                                            }`}></span>
                                                            <span className={reponse.est_correcte ? 'font-medium' : ''}>
                                                                {reponse.reponse}
                                                            </span>
                                                            {reponse.est_correcte && (
                                                                <span className="ml-2 text-xs text-green-600 font-medium">
                                                                    (Correcte)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {reponseEtudiant.reponse && (
                                                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                                                    <div className="text-sm text-blue-800">
                                                        <span className="font-medium">Votre réponse :</span> {reponseEtudiant.reponse.reponse}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Aucune réponse trouvée pour cet examen.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-8 flex justify-center space-x-4">
                                    <Link
                                        href={route('etudiant.evaluation.index')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Retour aux évaluations
                                    </Link>
                                    <Link
                                        href={route('etudiant.evaluation.entrerCode')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Passer un autre examen
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 