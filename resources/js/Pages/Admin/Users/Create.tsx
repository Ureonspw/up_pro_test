import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        prenom: '',
        sexe: '',
        tel: '',
        email: '',
        password: '',
        password_confirmation: '',
        id_role: '',
        statut: 'actif',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
                <h1 className="text-2xl font-bold mb-6 text-[#87b790] text-center">Créer un utilisateur</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Nom', name: 'name' },
                        { label: 'Prénom', name: 'prenom' },
                        { label: 'Téléphone', name: 'tel' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Mot de passe', name: 'password', type: 'password' },
                        { label: 'Confirmation mot de passe', name: 'password_confirmation', type: 'password' },
                    ].map(({ label, name, type = 'text' }) => (
                        <div key={name}>
                            <label className="block text-sm font-semibold text-gray-700">{label}</label>
                            <input
                                type={type}
                                value={data[name]}
                                onChange={e => setData(name, e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#87b790] focus:border-[#87b790]"
                            />
                            {errors[name] && <div className="text-red-500 text-sm mt-1">{errors[name]}</div>}
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Sexe</label>
                        <select
                            value={data.sexe}
                            onChange={e => setData('sexe', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#87b790] focus:border-[#87b790]"
                        >
                            <option value="">Sélectionner</option>
                            <option value="Masculin">Masculin</option>
                            <option value="Féminin">Féminin</option>
                            <option value="Autre">Autre</option>
                        </select>
                        {errors.sexe && <div className="text-red-500 text-sm mt-1">{errors.sexe}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Rôle</label>
                        <select
                            value={data.id_role}
                            onChange={e => setData('id_role', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#87b790] focus:border-[#87b790]"
                        >
                            <option value="">Sélectionner un rôle</option>
                            <option value="1">Etudiant</option>
                            <option value="2">Professeur</option>
                            <option value="3">Admin</option>
                        </select>
                        {errors.id_role && <div className="text-red-500 text-sm mt-1">{errors.id_role}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Statut</label>
                        <select
                            value={data.statut}
                            onChange={e => setData('statut', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-[#87b790] focus:border-[#87b790]"
                        >
                            <option value="actif">Actif</option>
                            <option value="inactif">Inactif</option>
                        </select>
                        {errors.statut && <div className="text-red-500 text-sm mt-1">{errors.statut}</div>}
                    </div>

                    <div className="text-center pt-4">
                    <button type="submit" disabled={processing} className="bg-[#358e54] hover:bg-[#2e7e4b] text-white font-semibold px-5 py-2 rounded-lg shadow-md transition">
                Ajouter l'utilisateur
            </button>
        
                    </div>
                </form>
            </div>
            <Footer />
        </AdminLayout>
    );
}
