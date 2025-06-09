import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Footer from '@/Components/Footer';
export default function CreateFiliere() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.filieres.store'));
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-3xl mx-auto">
                <Head title="Ajouter une filière" />
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Ajouter une filière</h1>
                    <p className="text-sm text-gray-500">Complétez le formulaire ci-dessous pour ajouter une nouvelle filière.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom de la filière
                            </label>
                            <input
                                type="text"
                                value={data.nom}
                                onChange={e => setData('nom', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg shadow-sm border-gray-300 focus:ring-[#87b790] focus:border-[#87b790] transition"
                                placeholder="Ex: Informatique"
                            />
                            {errors.nom && (
                                <div className="mt-2 text-sm text-red-600">{errors.nom}</div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#87b790] hover:bg-[#76a77f] text-white font-semibold px-6 py-2 rounded-lg transition shadow disabled:opacity-60"
                            >
                                {processing ? 'Ajout en cours...' : 'Ajouter la filière'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </AdminLayout>
    );
}
