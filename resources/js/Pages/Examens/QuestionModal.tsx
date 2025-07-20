import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    examenId: number;
    question?: any;
}

export default function QuestionModal({ isOpen, onClose, examenId, question }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        question: '',
        type: 'choix_unique',
        points: 1,
        reponses: [
            { reponse: '', est_correcte: true, ordre: 1 },
            { reponse: '', est_correcte: false, ordre: 2 }
        ]
    });

    useEffect(() => {
        if (question) {
            setData({
                question: question.question,
                type: question.type,
                points: question.points,
                reponses: question.reponses.map((r: any) => ({
                    id: r.id,
                    reponse: r.reponse,
                    est_correcte: r.est_correcte,
                    ordre: r.ordre
                }))
            });
        } else {
            reset();
        }
    }, [question]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (question) {
            put(route('professeur.examens.questions.update', { examen: examenId, question: question.id }), {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        } else {
            post(route('professeur.examens.questions.store', examenId), {
                onSuccess: () => {
                    onClose();
                    reset();
                }
            });
        }
    };

    const addReponse = () => {
        const newReponses = [...(data.reponses as any[])];
        newReponses.push({
            reponse: '',
            est_correcte: false,
            ordre: newReponses.length + 1
        });
        setData('reponses', newReponses);
    };

    const updateReponse = (index: number, field: string, value: any) => {
        const newReponses = (data.reponses as any[]).map((reponse: any, i: number) => ({
            ...reponse,
            [field]: i === index ? value : reponse[field]
        }));
        setData('reponses', newReponses);
    };

    const removeReponse = (index: number) => {
        if ((data.reponses as any[]).length > 2) {
            const newReponses = (data.reponses as any[]).filter((_: any, i: number) => i !== index);
            newReponses.forEach((reponse: any, i: number) => {
                reponse.ordre = i + 1;
            });
            setData('reponses', newReponses);
        }
    };

    const handleCorrectAnswerChange = (index: number) => {
        const newReponses = (data.reponses as any[]).map((reponse: any, i: number) => ({
            ...reponse,
            est_correcte: i === index
        }));
        setData('reponses', newReponses);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                        {question ? 'Modifier la question' : 'Ajouter une question'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Question */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question *
                        </label>
                        <textarea
                            value={data.question}
                            onChange={(e) => setData('question', e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            required
                        />
                        {(errors as any).question && (
                            <p className="text-red-600 text-sm mt-1">{(errors as any).question}</p>
                        )}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de question *
                        </label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="choix_unique">Choix unique</option>
                            <option value="choix_multiple">Choix multiple</option>
                            <option value="vrai_faux">Vrai/Faux</option>
                        </select>
                        {(errors as any).type && (
                            <p className="text-red-600 text-sm mt-1">{(errors as any).type}</p>
                        )}
                    </div>

                    {/* Points */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points *
                        </label>
                        <input
                            type="number"
                            value={data.points}
                            onChange={(e) => setData('points', parseInt(e.target.value))}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max="10"
                            required
                        />
                        {(errors as any).points && (
                            <p className="text-red-600 text-sm mt-1">{(errors as any).points}</p>
                        )}
                    </div>

                    {/* Réponses */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Réponses *
                            </label>
                            <button
                                type="button"
                                onClick={addReponse}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                + Ajouter une réponse
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(data.reponses as any[]).map((reponse: any, index: number) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <input
                                        type={data.type === 'choix_multiple' ? 'checkbox' : 'radio'}
                                        checked={reponse.est_correcte}
                                        onChange={() => handleCorrectAnswerChange(index)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={reponse.reponse}
                                        onChange={(e) => updateReponse(index, 'reponse', e.target.value)}
                                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Entrez la réponse"
                                        required
                                    />
                                    {(data.reponses as any[]).length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeReponse(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {(errors as any).reponses && (
                            <p className="text-red-600 text-sm mt-1">{(errors as any).reponses}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded"
                        >
                            {processing ? 'Enregistrement...' : (question ? 'Modifier' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 