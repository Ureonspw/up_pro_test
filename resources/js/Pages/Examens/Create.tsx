import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props extends PageProps {}

export default function CreateExamen({}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        titre: '',
        description: '',
        duree_minutes: 30,
        niveau: 'moyen',
        instructions_speciales: '',
        nombre_questions: 5,
        document: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('professeur.examens.store'), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('document', e.target.files[0]);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Créer un Examen" />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-12">
                    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Créer un Nouvel Examen
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        Configurez les paramètres de base de votre examen
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                                    <div>
                                        <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
                                            Titre de l'examen *
                                        </label>
                                        <input
                                            type="text"
                                            id="titre"
                                            value={data.titre}
                                            onChange={(e) => setData('titre', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.titre && (
                                            <p className="mt-1 text-sm text-red-600">{errors.titre}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label htmlFor="duree_minutes" className="block text-sm font-medium text-gray-700">
                                                Durée (minutes) *
                                            </label>
                                            <input
                                                type="number"
                                                id="duree_minutes"
                                                min="1"
                                                max="480"
                                                value={data.duree_minutes}
                                                onChange={(e) => setData('duree_minutes', parseInt(e.target.value))}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            {errors.duree_minutes && (
                                                <p className="mt-1 text-sm text-red-600">{errors.duree_minutes}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">
                                                Niveau *
                                            </label>
                                            <select
                                                id="niveau"
                                                value={data.niveau}
                                                onChange={(e) => setData('niveau', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                <option value="facile">Facile</option>
                                                <option value="moyen">Moyen</option>
                                                <option value="difficile">Difficile</option>
                                            </select>
                                            {errors.niveau && (
                                                <p className="mt-1 text-sm text-red-600">{errors.niveau}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="nombre_questions" className="block text-sm font-medium text-gray-700">
                                                Nombre de questions *
                                            </label>
                                            <input
                                                type="number"
                                                id="nombre_questions"
                                                min="1"
                                                max="20"
                                                value={data.nombre_questions}
                                                onChange={(e) => setData('nombre_questions', parseInt(e.target.value))}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            {errors.nombre_questions && (
                                                <p className="mt-1 text-sm text-red-600">{errors.nombre_questions}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                                            Document de référence *
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="file"
                                                id="document"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Formats acceptés : PDF, DOC, DOCX, TXT, JPG, PNG, GIF, BMP, WEBP (max 10MB)
                                        </p>
                                        {errors.document && (
                                            <p className="mt-1 text-sm text-red-600">{errors.document}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="instructions_speciales" className="block text-sm font-medium text-gray-700">
                                            Instructions spéciales
                                        </label>
                                        <textarea
                                            id="instructions_speciales"
                                            rows={3}
                                            value={data.instructions_speciales}
                                            onChange={(e) => setData('instructions_speciales', e.target.value)}
                                            placeholder="Instructions spécifiques pour la génération de questions..."
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.instructions_speciales && (
                                            <p className="mt-1 text-sm text-red-600">{errors.instructions_speciales}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Link
                                            href={route('professeur.examens.index')}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                        >
                                            Annuler
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
                                        >
                                            {processing ? 'Création...' : 'Créer l\'examen'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 