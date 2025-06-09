import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
function handleDelete(matiereId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
        router.delete(route('admin.matieres.destroy', matiereId));
    }
}

type Matiere = {
    id_Matiere: number;
    nom: string;
    description: string;
    id_Ue: number;
};

type Ue = {
    id_Ue: number;
    nom: string;
};

export default function MatieresIndex({ matieres, ues }: { matieres: Matiere[]; ues: Ue[] }) {
    return (
        <AdminLayout>
            <Head title="Matières" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold text-[#87b790]">Liste des matières</h1>
                    <Link
                        href={route('admin.matieres.create')}
                        className="bg-[#87b790] text-white px-4 py-2 rounded-lg shadow hover:bg-[#76a77f] transition duration-200"
                    >
                        + Ajouter une matière
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#f3f8f5]">
                            <tr>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Nom</th>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Description</th>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">UE associée</th>
                                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {matieres.map((matiere) => {
                                const ue = ues.find((u) => u.id_Ue === matiere.id_Ue);
                                return (
                                    <tr key={matiere.id_Matiere} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{matiere.nom}</td>
                                        <td className="px-6 py-4">{matiere.description}</td>
                                        <td className="px-6 py-4">{ue ? ue.nom : 'Non trouvé'}</td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <Link
                                                href={route('admin.matieres.edit', matiere.id_Matiere)}
                                                className="text-[#4a7a66] font-medium hover:underline"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(matiere.id_Matiere)}
                                                className="text-red-600 font-medium hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </AdminLayout>
    );
}
