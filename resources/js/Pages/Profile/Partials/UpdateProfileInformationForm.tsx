import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User } from '@/types';

interface ExtendedUser extends User {
    prenom: string;
    sexe: string;
    tel: string;
}

interface Props {
    user: ExtendedUser;
}

export default function UpdateProfileInformationForm({ user }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        prenom: user.prenom || '',
        email: user.email,
        sexe: user.sexe || '',
        tel: user.tel || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('profile.update'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Informations du profil</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Mettez à jour les informations de votre profil et votre adresse e-mail.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                </div>

                <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                        Prénom
                    </label>
                    <input
                        id="prenom"
                        type="text"
                        value={data.prenom}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('prenom', e.target.value)}
                        required
                    />
                    {errors.prenom && <div className="text-red-500 text-sm mt-1">{errors.prenom}</div>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                </div>

                <div>
                    <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
                        Sexe
                    </label>
                    <select
                        id="sexe"
                        value={data.sexe}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('sexe', e.target.value)}
                        required
                    >
                        <option value="">Sélectionner</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Féminin">Féminin</option>
                        <option value="Autre">Autre</option>
                    </select>
                    {errors.sexe && <div className="text-red-500 text-sm mt-1">{errors.sexe}</div>}
                </div>

                <div>
                    <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                        Téléphone
                    </label>
                    <input
                        id="tel"
                        type="tel"
                        value={data.tel}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('tel', e.target.value)}
                        required
                    />
                    {errors.tel && <div className="text-red-500 text-sm mt-1">{errors.tel}</div>}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        disabled={processing}
                    >
                        Sauvegarder
                    </button>
                </div>
            </form>
        </section>
    );
}
