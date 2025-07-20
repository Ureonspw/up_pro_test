import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Participation {
    id: number;
    score_obtenu: number;
    score_total: number;
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
}

interface Props extends PageProps {
    examen: Examen;
    participations: Participation[];
}

export default function ResultatsExamen({ examen, participations }: Props) {
    const stats = {
        total: participations.length,
        termine: participations.filter(p => p.score_obtenu > 0).length,
        moyenne: participations.length > 0 
            ? Math.round(participations.reduce((sum, p) => sum + (p.score_obtenu / p.score_total * 100), 0) / participations.length)
            : 0,
        meilleur: participations.length > 0 
            ? Math.max(...participations.map(p => (p.score_obtenu / p.score_total * 100)))
            : 0,
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Résultats - ${examen.titre}`} />
            
            <div className="min-h-screen bg-gray-100">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Résultats de l'examen
                                        </h2>
                                        <h3 className="text-lg text-gray-600 mt-1">
                                            {examen.titre}
                                        </h3>
                                    </div>
                                    <Link
                                        href={route('professeur.examens.show', examen.id)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Retour à l'examen
                                    </Link>
                                </div>

                                {/* Statistiques */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {stats.total}
                                        </div>
                                        <div className="text-sm text-blue-600">Participants</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {stats.termine}
                                        </div>
                                        <div className="text-sm text-green-600">Terminés</div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {stats.moyenne}%
                                        </div>
                                        <div className="text-sm text-yellow-600">Moyenne</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {Math.round(stats.meilleur)}%
                                        </div>
                                        <div className="text-sm text-purple-600">Meilleur score</div>
                                    </div>
                                </div>

                                {/* Informations de l'examen */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Code:</span>
                                            <div className="font-mono bg-white px-2 py-1 rounded border">
                                                {examen.code_examen}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Durée:</span>
                                            <div>{examen.duree_minutes} minutes</div>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Niveau:</span>
                                            <div className="capitalize">{examen.niveau}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Liste des participants */}
                                {participations.length === 0 ? (
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
                                                        Pourcentage
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Durée
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {participations
                                                    .sort((a, b) => (b.score_obtenu / b.score_total) - (a.score_obtenu / a.score_total))
                                                    .map((participation) => {
                                                        const pourcentage = Math.round((participation.score_obtenu / participation.score_total) * 100);
                                                        const duree = new Date(participation.date_fin_examen).getTime() - new Date(participation.date_debut_examen).getTime();
                                                        const minutes = Math.floor(duree / (1000 * 60));
                                                        
                                                        return (
                                                            <tr key={participation.id} className="hover:bg-gray-50">
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
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                        pourcentage >= 80 ? 'bg-green-100 text-green-800' :
                                                                        pourcentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {pourcentage}%
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {minutes} min
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {new Date(participation.date_debut_examen).toLocaleDateString()}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
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