import { useForm } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
interface User {
    id: string;
    name: string;
    prenom: string;
    email: string;
    tel: string;
    sexe: string;
    id_role: string;
    statut: string;
}

export default function EditUser({ user, roles }: { user: User, roles: any[] }) {

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        prenom: user.prenom || '',
        email: user.email || '',
        tel: user.tel || '',
        sexe: user.sexe || '',
        id_role: user.id_role || '',
        statut: user.statut || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AdminLayout>
            <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Modifier l'utilisateur</h2>

                <form onSubmit={submit} className="space-y-5">

                    {/* Nom */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Nom</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#87b790] focus:border-[#87b790]"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Prénom */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Prénom</label>
                        <input
                            type="text"
                            value={data.prenom}
                            onChange={(e) => setData('prenom', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#87b790] focus:border-[#87b790]"
                        />
                        {errors.prenom && <p className="text-sm text-red-500 mt-1">{errors.prenom}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#87b790] focus:border-[#87b790]"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                            type="tel"
                            value={data.tel}
                            onChange={(e) => setData('tel', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#87b790] focus:border-[#87b790]"
                        />
                        {errors.tel && <p className="text-sm text-red-500 mt-1">{errors.tel}</p>}
                    </div>

                    {/* Sexe */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Sexe</label>
                        <select
                            value={data.sexe}
                            onChange={(e) => setData('sexe', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#87b790] focus:border-[#87b790]"
                        >
                            <option value="">Sélectionner</option>
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                        </select>
                        {errors.sexe && <p className="text-sm text-red-500 mt-1">{errors.sexe}</p>}
                    </div>

                    {/* Rôle */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Rôle</label>
                        <select
                            value={data.id_role}
                            onChange={e => setData('id_role', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#87b790] focus:border-[#87b790]"
                        >
                            <option value="">Sélectionner un rôle</option>
                            <option value="1">Étudiant</option>
                            <option value="2">Professeur</option>
                            <option value="3">Admin</option>
                        </select>
                        {errors.id_role && <p className="text-sm text-red-500 mt-1">{errors.id_role}</p>}
                    </div>

                    {/* Statut */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            value={data.statut}
                            onChange={(e) => setData('statut', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#87b790] focus:border-[#87b790]"
                        >
                            <option value="">Sélectionner un statut</option>
                            <option value="actif">Actif</option>
                            <option value="inactif">Inactif</option>
                        </select>
                        {errors.statut && <p className="text-sm text-red-500 mt-1">{errors.statut}</p>}
                    </div>

                    {/* Bouton de soumission */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#87b790] hover:bg-[#76a77f] text-white font-semibold px-6 py-2 rounded-lg transition duration-200 disabled:opacity-60"
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </AdminLayout>
    );
}
