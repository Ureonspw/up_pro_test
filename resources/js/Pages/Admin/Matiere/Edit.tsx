import { useForm } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
interface Matiere {
    id_Matiere: number;
    nom: string;
    description: string;
    id_Ue: number;
}

interface Ue {
    id_Ue: number;
    nom: string;
}

export default function EditMatiere({ matiere, ues }: { matiere: Matiere; ues: Ue[] }) {
    const { data, setData, put, processing, errors } = useForm({
        nom: matiere.nom || '',
        description: matiere.description || '',
        id_Ue: matiere.id_Ue || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.matieres.update', matiere.id_Matiere));
    };

    return (
        <AdminLayout>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 text-center text-[#87b790]">Modifier la Matière</h2>

                <form onSubmit={submit} className="space-y-6 text-gray-700">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-semibold">Nom</label>
                        <input
                            type="text"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-[#87b790] focus:border-[#87b790] transition duration-200"
                        />
                        {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-[#87b790] focus:border-[#87b790] transition duration-200"
                            rows={4}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    {/* UE */}
                    <div>
                        <label className="block text-sm font-semibold">Unité d'enseignement</label>
                        <select
                            value={data.id_Ue}
                            onChange={(e) => setData('id_Ue', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-[#87b790] focus:border-[#87b790] transition duration-200"
                        >
                            <option value="">Sélectionner une UE</option>
                            {ues.map((Ue) => (
                                <option key={Ue.id_Ue} value={Ue.id_Ue}>
                                    {Ue.nom}
                                </option>
                            ))}
                        </select>
                        {errors.id_Ue && <p className="text-sm text-red-500 mt-1">{errors.id_Ue}</p>}
                    </div>

                    {/* Bouton */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#87b790] hover:bg-[#76a77f] text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-sm"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </AdminLayout>
    );
}
