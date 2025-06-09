import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Footer from '@/Components/Footer';
function handleDelete(ueId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette unité d\'enseignement ?')) {
        router.delete(route('admin.ues.destroy', ueId));
    }
}

type Ue = {
    id_Ue: number;
    nom: string;
    filiere: {
        id_filiere: number;
        nom: string;
    };
};

type Props = {
    ues: Ue[];
};

export default function UEIndex({ ues }: Props) {
    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <Head title="Unités d'enseignement" />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#87b790]">Liste des unités d'enseignement</h1>
                    <Link
                        href={route('admin.ues.create')}
                        className="bg-[#87b790] text-white px-4 py-2 rounded hover:bg-[#76a77f] transition duration-200"
                    >
                        Ajouter une UE
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Filière
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ues.map((ue) => (
                                <tr key={ue.id_Ue}>
                                    <td className="px-6 py-4 whitespace-nowrap">{ue.nom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{ue.filiere.nom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <Link
                                            href={route('admin.ues.edit', ue.id_Ue)}
                                            className="text-[#87b790] hover:text-[#76a77f] transition duration-200"
                                        >
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(ue.id_Ue)}
                                            className="text-[#e05f5f] hover:text-[#87b790] transition duration-200 font-medium"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Footer />
            </div>
        </AdminLayout>
    );
}
