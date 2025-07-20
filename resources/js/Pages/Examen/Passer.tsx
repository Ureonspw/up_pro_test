import React, { useState, useEffect } from 'react';
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

interface Props extends PageProps {
    examen: Examen;
}

export default function PasserExamen({ examen }: Props) {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [reponses, setReponses] = useState<{[key: number]: number[]}>({});
    const [nom, setNom] = useState<string>('');
    const [prenom, setPrenom] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);

    useEffect(() => {
        // Calculer le temps restant
        const calculateTimeLeft = () => {
            if (!examen.date_fin) return;
            const endTime = new Date(examen.date_fin).getTime();
            const now = new Date().getTime();
            const difference = endTime - now;
            
            if (difference > 0) {
                setTimeLeft(Math.floor(difference / 1000));
            } else {
                setTimeLeft(0);
                // Auto-soumettre quand le temps est écoulé
                handleSubmit();
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [examen.date_fin]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleReponseChange = (questionId: number, reponseId: number, isChecked: boolean) => {
        const currentReponses = reponses[questionId] || [];
        
        if (isChecked) {
            setReponses({
                ...reponses,
                [questionId]: [...currentReponses, reponseId]
            });
        } else {
            setReponses({
                ...reponses,
                [questionId]: currentReponses.filter(id => id !== reponseId)
            });
        }
    };

    const handleSubmit = () => {
        if (!nom || !prenom || !email) {
            alert('Veuillez remplir vos informations personnelles');
            return;
        }

        // Commencer la participation via l'API
        fetch('/api/participation/commencer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({
                code_examen: examen.code_examen,
                nom: nom,
                prenom: prenom,
                email: email
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.participation) {
                // Maintenant soumettre les réponses
                const reponsesFormatted = Object.keys(reponses).map(questionId => ({
                    id_question: parseInt(questionId),
                    id_reponse: reponses[questionId]
                }));

                return fetch(`/api/participation/${data.participation.id}/soumettre`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        reponses: reponsesFormatted
                    })
                });
            } else {
                throw new Error(data.error || 'Erreur lors du début de l\'examen');
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Rediriger vers la page de résultats
                window.location.href = `/examen/${examen.code_examen}/resultats`;
            } else {
                throw new Error(data.error || 'Erreur lors de la soumission');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la soumission de l\'examen: ' + error.message);
        });
    };

    const question = examen.questions[currentQuestion];

    return (
        <>
            <Head title={`Examen - ${examen.titre}`} />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-8">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {examen.titre}
                                        </h1>
                                        <p className="text-gray-600 mt-2">
                                            {examen.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-red-600 mb-2">
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Question {currentQuestion + 1} / {examen.questions.length}
                                        </div>
                                    </div>
                                </div>

                                {/* Informations personnelles */}
                                {!showForm && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                            Informations personnelles
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Prénom *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={prenom}
                                                    onChange={(e) => setPrenom(e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nom *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={nom}
                                                    onChange={(e) => setNom(e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                                        >
                                            Commencer l'examen
                                        </button>
                                    </div>
                                )}

                                {/* Question */}
                                {showForm && question && (
                                    <div className="space-y-6">
                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Question {currentQuestion + 1}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {question.points} point(s)
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-6">{question.question}</p>

                                            <div className="space-y-3">
                                                {question.reponses.map((reponse) => (
                                                    <label key={reponse.id} className="flex items-center space-x-3 cursor-pointer">
                                                        <input
                                                            type={question.type === 'choix_multiple' ? 'checkbox' : 'radio'}
                                                            name={`question_${question.id}`}
                                                            value={reponse.id}
                                                            checked={reponses[question.id]?.includes(reponse.id) || false}
                                                            onChange={(e) => handleReponseChange(question.id, reponse.id, e.target.checked)}
                                                            className="text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-gray-700">{reponse.reponse}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                                disabled={currentQuestion === 0}
                                                className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 px-4 py-2 rounded"
                                            >
                                                Précédent
                                            </button>
                                            
                                            {currentQuestion < examen.questions.length - 1 ? (
                                                <button
                                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                >
                                                    Suivant
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmit}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                                                >
                                                    Terminer l'examen
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 