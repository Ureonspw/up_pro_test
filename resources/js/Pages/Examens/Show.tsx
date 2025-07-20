import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import QuestionModal from './QuestionModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Reponse {
    id: number;
    reponse: string;
    est_correcte: boolean;
    ordre: number;
}

interface Question {
    id: number;
    question: string;
    type: string;
    points: number;
    ordre: number;
    reponses: Reponse[];
}

interface Participation {
    id: number;
    score_obtenu: number;
    score_total: number;
    statut: string;
    date_debut_examen: string;
    date_fin_examen: string;
    etudiant: {
        id: number;
        name: string;
        prenom: string;
        email: string;
    };
}

interface Examen {
    id: number;
    titre: string;
    description: string;
    code_examen: string;
    duree_minutes: number;
    niveau: string;
    statut: string;
    questions: Question[];
    participations: Participation[];
    date_fin?: string; // Added for the new indicator
}

interface Props extends PageProps {
    examen: Examen;
}

export default function ShowExamen({ examen }: Props) {
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'questions' | 'participations'>('questions');
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const { delete: destroy, patch } = useForm();

    // Timer en temps réel
    useEffect(() => {
        if (examen.statut === 'actif' && examen.date_fin) {
            const calculateTimeLeft = () => {
                if (!examen.date_fin) return;
                const endTime = new Date(examen.date_fin).getTime();
                const now = new Date().getTime();
                const difference = endTime - now;
                
                if (difference > 0) {
                    setTimeLeft(Math.floor(difference / 1000));
                } else {
                    setTimeLeft(0);
                    // Auto-arrêter l'examen quand le temps expire
                    arreterEvaluation(examen.id);
                }
            };

            calculateTimeLeft();
            const timer = setInterval(calculateTimeLeft, 1000);

            return () => clearInterval(timer);
        }
    }, [examen.date_fin, examen.statut]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDeleteQuestion = (questionId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
            destroy(route('professeur.examens.questions.destroy', [examen.id, questionId]));
        }
    };

    const handleDeleteReponse = (questionId: number, reponseId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
            destroy(route('professeur.examens.questions.reponses.destroy', [examen.id, questionId, reponseId]));
        }
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

    return (
        <AuthenticatedLayout>
            <Head title={`Examen - ${examen.titre}`} />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-4">
                                        <Link
                                                href={route('professeur.examens.index')}
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                                ← Retour à la gestion
                                        </Link>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {examen.titre}
                                            </h2>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm font-medium text-gray-500">Code d'examen</div>
                                                <div className="text-lg font-mono text-gray-900">{examen.code_examen}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm font-medium text-gray-500">Durée</div>
                                                <div className="text-lg text-gray-900">{examen.duree_minutes} minutes</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm font-medium text-gray-500">Niveau</div>
                                                <div className="text-lg text-gray-900 capitalize">{examen.niveau}</div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="text-sm font-medium text-gray-500">Statut</div>
                                                <div className="text-lg text-gray-900">{getStatutLabel(examen.statut)}</div>
                                            </div>
                                        </div>

                                        {examen.description && (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                                <p className="text-gray-700">{examen.description}</p>
                                    </div>
                                        )}

                                        {/* Indicateur de temps restant si l'examen est actif */}
                                        {examen.statut === 'actif' && examen.date_fin && (
                                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-blue-800 font-medium">
                                                            ⏰ Temps restant : {formatTime(timeLeft)}
                                        </span>
                                                </div>
                                                    <button
                                                        onClick={() => arreterEvaluation(examen.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                                                    >
                                                        ⏹️ Arrêter l'examen
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions selon le statut */}
                                        {examen.statut === 'questions_generees' && (
                                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-green-800 font-medium">
                                                            ✅ Questions générées - Prêt à lancer
                                                        </span>
                                                    </div>
                                            <button
                                                onClick={() => commencerEvaluation(examen.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                                            >
                                                        🚀 Lancer l'examen
                                            </button>
                                                </div>
                                            </div>
                                        )}

                                        {examen.statut === 'inactif' && (
                                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-yellow-800 font-medium">
                                                            ⏸️ Examen terminé
                                                        </span>
                                                    </div>
                                            <button
                                                        onClick={() => commencerEvaluation(examen.id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                                            >
                                                        🔄 Réactiver
                                            </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Onglets */}
                                <div className="border-b border-gray-200 mb-6">
                                    <nav className="-mb-px flex space-x-8">
                                        <button
                                            onClick={() => setActiveTab('questions')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'questions'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Questions ({examen.questions.length})
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('participations')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'participations'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Participations ({examen.participations.length})
                                        </button>
                                    </nav>
                                </div>

                                {activeTab === 'questions' && (
                                    <>
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Questions ({examen.questions.length})
                                            </h3>
                                            {examen.statut !== 'actif' && (
                                                <button
                                                    onClick={() => setShowAddForm(true)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                                                >
                                                    + Ajouter une question
                                                </button>
                                            )}
                                        </div>

                                        {examen.statut === 'actif' && (
                                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-yellow-800 font-medium">
                                                        ⚠️ Les modifications sont désactivées pendant l'examen
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {examen.questions.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-gray-500 text-lg">
                                                    Aucune question créée pour cet examen.
                                                </p>
                                                {examen.statut !== 'actif' && (
                                                    <button
                                                        onClick={() => setShowAddForm(true)}
                                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                                                    >
                                                        Ajouter la première question
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {examen.questions.map((question, index) => (
                                                    <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex-1">
                                                                <h4 className="text-lg font-semibold text-gray-900">
                                                                    Question {index + 1}
                                                                </h4>
                                                                <p className="text-gray-700 mt-2">{question.question}</p>
                                                            </div>
                                                            {examen.statut !== 'actif' && (
                                                                <div className="flex space-x-2 ml-4">
                                                                    <button
                                                                        onClick={() => setEditingQuestion(question)}
                                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                                    >
                                                                        Modifier
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                                    >
                                                                        Supprimer
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2">
                                                            {question.reponses.map((reponse, reponseIndex) => (
                                                                <div key={reponse.id} className="flex items-center space-x-3">
                                                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                                                        reponse.est_correcte 
                                                                            ? 'bg-green-500 border-green-500' 
                                                                            : 'border-gray-300'
                                                                    }`}>
                                                                        {reponse.est_correcte && (
                                                                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                        )}
                                                                    </div>
                                                                    <span className={`flex-1 ${
                                                                        reponse.est_correcte ? 'text-green-700 font-medium' : 'text-gray-700'
                                                                    }`}>
                                                                        {reponse.reponse}
                                                                    </span>
                                                                    {examen.statut !== 'actif' && (
                                                                        <button
                                                                            onClick={() => handleDeleteReponse(question.id, reponse.id)}
                                                                            className="text-red-500 hover:text-red-700 text-xs"
                                                                        >
                                                                            Supprimer
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'participations' && (
                                    <div className="space-y-4">
                                        {examen.participations.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">Aucun participant pour cet examen</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Étudiant
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Score
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Statut
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Date
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {examen.participations.map((participation) => (
                                                            <tr key={participation.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {participation.etudiant.prenom} {participation.etudiant.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {participation.etudiant.email}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900">
                                                                        {participation.score_obtenu}/{participation.score_total}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {Math.round((participation.score_obtenu / participation.score_total) * 100)}%
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutBadge(participation.statut)}`}>
                                                                        {participation.statut}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {new Date(participation.date_debut_examen).toLocaleDateString()}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QuestionModal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                examenId={examen.id}
                question={editingQuestion || undefined}
            />
        </AuthenticatedLayout>
    );
} 