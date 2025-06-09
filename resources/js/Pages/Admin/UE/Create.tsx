import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
type Filiere = {
    id_filiere: number;
    nom: string;
};

type Props = {
    filieres: Filiere[];
};

export default function CreateUE({ filieres }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        id_filiere: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.ues.store'));
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-3xl mx-auto">
                <Head title="Ajouter une UE" />
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-[#87b790]">Ajouter une unité d'enseignement</h1>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nom
                            </label>
                            <input
                                type="text"
                                value={data.nom}
                                onChange={e => setData('nom', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#87b790] focus:ring-[#87b790]"
                            />
                            {errors.nom && (
                                <div className="mt-1 text-sm text-red-600">{errors.nom}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Filière
                            </label>
                            <select
                                value={data.id_filiere}
                                onChange={e => setData('id_filiere', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#87b790] focus:ring-[#87b790]"
                            >
                                <option value="">Sélectionner une filière</option>
                                {filieres.map((filiere) => (
                                    <option key={filiere.id_filiere} value={filiere.id_filiere}>
                                        {filiere.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.id_filiere && (
                                <div className="mt-1 text-sm text-red-600">{errors.id_filiere}</div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#87b790] text-white px-4 py-2 rounded-md shadow hover:bg-[#76a77f] transition duration-200 disabled:opacity-50"
                            >
                                Ajouter l'UE
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </AdminLayout>
    );
}
