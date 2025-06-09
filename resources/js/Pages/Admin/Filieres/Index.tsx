import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Footer from '@/Components/Footer';
function handleDelete(filiereId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
        router.delete(route('admin.filieres.destroy', filiereId));
    }
}

type Filiere = {
    id_filiere: number;
    nom: string;
};

type Props = {
    filieres: Filiere[];
};

export default function FilieresIndex({ filieres }: Props) {
    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <Head title="Filières" />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Liste des filières</h1>
                    <Link
                        href={route('admin.filieres.create')}
                        className="bg-[#87b790] hover:bg-[#76a77f] text-white px-5 py-2 rounded-lg shadow-md transition font-semibold"
                    >
                        + Ajouter une filière
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-gray-700">
                        <thead className="bg-[#87b790] text-white text-sm">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium">Nom</th>
                                <th className="px-6 py-4 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filieres.map((filiere) => (
                                <tr key={filiere.id_filiere} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium">{filiere.nom}</td>
                                    <td className="px-6 py-4 space-x-4">
                                        <Link
                                            href={route('admin.filieres.edit', filiere.id_filiere)}
                                            className="text-[#87b790] hover:underline font-medium"
                                        >
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(filiere.id_filiere)}
                                            className="text-red-600 hover:underline font-medium"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </AdminLayout>
    );
}
