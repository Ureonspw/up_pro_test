import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props extends PageProps {}

export default function EntrerCode({}: Props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Utiliser Inertia.js pour la requête POST
            router.post(route('etudiant.evaluation.verifierCode'), {
                code: code.toUpperCase()
            }, {
                onError: (errors) => {
                    console.error('Erreurs:', errors);
                    setError(errors.code?.[0] || 'Code d\'examen invalide ou examen non disponible.');
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error('Erreur de connexion:', err);
            setError('Erreur de connexion. Vérifiez votre connexion internet.');
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Entrer le code d'examen" />
            
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Passer un Examen
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Entrez le code d'examen fourni par votre professeur
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                    Code d'examen
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-widest"
                                    placeholder="ABCDEF"
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading || code.length !== 6}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Vérification...' : 'Commencer l\'examen'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Ou</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href={route('etudiant.evaluation.index')}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Voir mes examens
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 