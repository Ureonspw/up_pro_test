import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Footer from '@/Components/Footer';
function handleDelete(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        router.delete(route('admin.users.destroy', userId));
    }
}

type User = {
    id: number;
    name: string;
    email: string;
    id_role: number;
    statut: string;
};

type UsersIndexProps = {
    users: User[];
};

export default function UsersIndex({ users }: UsersIndexProps) {
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    function roleName(id_role: number) {
        if (id_role === 1) return 'Étudiant';
        if (id_role === 2) return 'Professeur';
        return 'Admin';
    }

    // Filtrer d'abord par rôle, puis par nom (searchTerm)
    const filteredUsers = users
        .filter((user) =>
            roleFilter === 'all'
                ? true
                : roleName(user.id_role).toLowerCase() === roleFilter
        )
        .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <Head title="Utilisateurs" />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[#333]">Utilisateurs</h1>
                    <Link
                        href={route('admin.users.create')}
                        className="bg-[#87b790] hover:bg-[#76a77f] text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
                    >
                        + Ajouter un utilisateur
                    </Link>
                </div>

                {/* Barre de filtre par rôle */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                    <div>
                        <label htmlFor="roleFilter" className="mr-3 font-semibold text-gray-700">
                            Filtrer par rôle :
                        </label>
                        <select
                            id="roleFilter"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1"
                        >
                            <option value="all">Tous</option>
                            <option value="étudiant">Étudiants</option>
                            <option value="professeur">Professeurs</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>

                    {/* Barre de recherche par nom */}
                    <div>
                        <label htmlFor="search" className="mr-3 font-semibold text-gray-700">
                            Rechercher par nom :
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Tapez un nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-[#87b790] text-white">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 transition border-b border-gray-100"
                                    >
                                        <td className="px-6 py-4 font-medium">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{roleName(user.id_role)}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    user.statut === 'actif'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {user.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 space-x-4">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="text-[#87b790] hover:underline font-medium"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:underline font-medium"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </AdminLayout>
    );
}
