import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
type Matiere = {
    nom: string;
    description: string;
};

type Ue = {
    id_Ue: number;
    nom: string;
};

type Props = {
    matiere: Matiere;
    ues: Ue[];
};

export default function CreateMatiere({ ues, matiere }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        description: '',
        id_Ue: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.matieres.store'));
    };

    return (
        <AdminLayout>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#87b790]">Ajouter une Matière</h2>

                <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-semibold">Nom</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-[#87b790] focus:border-[#87b790] transition duration-200"
                            value={data.nom}
                            onChange={e => setData('nom', e.target.value)}
                        />
                        {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold">Description</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-[#87b790] focus:border-[#87b790] transition duration-200"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    {/* UE */}
                    <div>
                        <label className="block text-sm font-semibold">UE</label>
                        <select
                            value={data.id_Ue}
                            onChange={e => setData('id_Ue', e.target.value)}
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
                            Ajouter la Matière
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </AdminLayout>
    );
}
