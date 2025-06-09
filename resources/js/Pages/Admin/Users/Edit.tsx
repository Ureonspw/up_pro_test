import { useForm } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
type User ={
    id: number;
    name: string;
    prenom: string;
    email: string;
    tel: string;
    sexe: string;
    id_role: number;
    statut: string;
};
type Role={
    id_role:number ;
    libelle:string ;

};
type Props ={
    user:User;
    roles:Role[];
}

export default function EditUser({ user, roles }: Props) {
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
        put(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier l'utilisateur</h2>

            <form onSubmit={submit} className="space-y-6">
                {/* Nom */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#358e54] focus:border-[#358e54]"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Prénom */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
                    <input
                        type="text"
                        value={data.prenom}
                        onChange={(e) => setData('prenom', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#358e54] focus:border-[#358e54]"
                    />
                    {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#358e54] focus:border-[#358e54]"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Téléphone */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                    <input
                        type="tel"
                        value={data.tel}
                        onChange={(e) => setData('tel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#358e54] focus:border-[#358e54]"
                    />
                    {errors.tel && <p className="text-red-500 text-sm mt-1">{errors.tel}</p>}
                </div>

                {/* Sexe */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sexe</label>
                    <select
                        value={data.sexe}
                        onChange={(e) => setData('sexe', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#358e54] focus:border-[#358e54]"
                    >
                        <option value="">Sélectionner</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Féminin">Féminin</option>
                        <option value="Autre">Autre</option>
                    </select>
                    {errors.sexe && <p className="text-red-500 text-sm mt-1">{errors.sexe}</p>}
                </div>

                {/* Rôle */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rôle</label>
                    <select
                        value={data.id_role}
                        onChange={(e) => setData('id_role', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#358e54] focus:border-[#358e54]"
                    >
                        <option value="">Sélectionner un rôle</option>
                        {roles.map((role) => (
                            <option key={role.id_role} value={role.id_role}>
                                {role.libelle}
                            </option>
                        ))}
                    </select>
                    {errors.id_role && <p className="text-red-500 text-sm mt-1">{errors.id_role}</p>}
                </div>

                {/* Statut */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
                    <select
                        value={data.statut}
                        onChange={(e) => setData('statut', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#358e54] focus:border-[#358e54]"
                    >
                        <option value="">Sélectionner un statut</option>
                        <option value="actif">Actif</option>
                        <option value="inactif">Inactif</option>
                    </select>
                    {errors.statut && <p className="text-red-500 text-sm mt-1">{errors.statut}</p>}
                </div>

                {/* Bouton */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#358e54] hover:bg-[#2e7e4b] text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
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


