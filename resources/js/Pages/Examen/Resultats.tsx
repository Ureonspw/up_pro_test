import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

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

interface Examen {
    id: number;
    titre: string;
    description: string;
    code_examen: string;
    duree_minutes: number;
    niveau: string;
    date_fin: string;
    questions: Question[];
}

interface Participation {
    id: number;
    score_obtenu: number;
    score_total: number;
    statut: string;
    date_debut_examen: string;
    date_fin_examen: string;
    nom_etudiant: string;
    email_etudiant: string;
}

interface DetailReponse {
    question: string;
    reponses_etudiant: number[];
    bonnes_reponses: number[];
    points_question: number;
    correct: boolean;
}

interface Props extends PageProps {
    examen: Examen;
    participation: Participation;
    detailsReponses: {[key: number]: DetailReponse};
    scoreObtenu: number;
    scoreTotal: number;
    pourcentage: number;
}

export default function ResultatsExamen({ 
    examen, 
    participation, 
    detailsReponses, 
    scoreObtenu, 
    scoreTotal, 
    pourcentage 
}: Props) {
    const getReponseText = (questionId: number, reponseId: number) => {
        const question = examen.questions.find(q => q.id === questionId);
        const reponse = question?.reponses.find(r => r.id === reponseId);
        return reponse?.reponse || '';
    };

    const getStatusColor = (pourcentage: number) => {
        if (pourcentage >= 80) return 'text-green-600';
        if (pourcentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStatusText = (pourcentage: number) => {
        if (pourcentage >= 80) return 'Excellent';
        if (pourcentage >= 60) return 'Bien';
        return 'À améliorer';
    };

    return (
        <>
            <Head title={`Résultats - ${examen.titre}`} />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-8">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Résultats de l'examen
                                    </h1>
                                    <h2 className="text-xl text-gray-600 mb-4">
                                        {examen.titre}
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        Participant: {participation.nom_etudiant}
                                    </div>
                                </div>

                                {/* Score principal */}
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center mb-8">
                                    <div className="text-6xl font-bold mb-2">
                                        {scoreObtenu}/{scoreTotal}
                                    </div>
                                    <div className="text-2xl mb-2">
                                        {pourcentage}%
                                    </div>
                                    <div className={`text-xl font-semibold ${getStatusColor(pourcentage)}`}>
                                        {getStatusText(pourcentage)}
                                    </div>
                                </div>

                                {/* Détails des réponses */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Détails des réponses
                                    </h3>
                                    
                                    {examen.questions.map((question, index) => {
                                        const detail = detailsReponses[question.id];
                                        return (
                                            <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="text-lg font-medium text-gray-900">
                                                        Question {index + 1}
                                                    </h4>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            detail.correct 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {detail.correct ? '✓ Correct' : '✗ Incorrect'}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {detail.points_question} point(s)
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-700 mb-4">{question.question}</p>
                                                
                                                <div className="space-y-2">
                                                    {question.reponses.map((reponse) => {
                                                        const isSelected = detail.reponses_etudiant?.includes(reponse.id);
                                                        const isCorrect = reponse.est_correcte;
                                                        const isCorrectAnswer = detail.bonnes_reponses?.includes(reponse.id);
                                                        
                                                        let bgColor = 'bg-gray-50';
                                                        let textColor = 'text-gray-700';
                                                        let borderColor = 'border-gray-200';
                                                        
                                                        if (isCorrectAnswer) {
                                                            bgColor = 'bg-green-50';
                                                            textColor = 'text-green-700';
                                                            borderColor = 'border-green-200';
                                                        }
                                                        
                                                        if (isSelected && !isCorrect) {
                                                            bgColor = 'bg-red-50';
                                                            textColor = 'text-red-700';
                                                            borderColor = 'border-red-200';
                                                        }
                                                        
                                                        return (
                                                            <div key={reponse.id} className={`p-3 rounded-lg border ${bgColor} ${textColor} ${borderColor}`}>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                                                        isCorrectAnswer 
                                                                            ? 'bg-green-500 text-white' 
                                                                            : isSelected && !isCorrect
                                                                                ? 'bg-red-500 text-white'
                                                                                : 'bg-gray-300'
                                                                    }`}>
                                                                        {isCorrectAnswer ? '✓' : isSelected && !isCorrect ? '✗' : ''}
                                                                    </span>
                                                                    <span>{reponse.reponse}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Actions */}
                                <div className="mt-8 text-center">
                                    <a
                                        href="/"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                                    >
                                        Retour à l'accueil
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 