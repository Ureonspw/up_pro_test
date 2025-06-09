import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type Role = {
    id_role: number;
    libelle: string;
};

type RegisterProps = {
    roles: Role[];
};

export default function Register({roles}: RegisterProps){
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        prenom:'',
        id_role:'',
        sexe:'',
        tel:'',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>


{/* Champ Prénom */}
<div>
    <InputLabel htmlFor="prenom" value="prenom" />
    <TextInput
        id="prenom"
        name="prenom"
        value={data.prenom}
        className="mt-1 block w-full"
        onChange={(e) => setData('prenom', e.target.value)}
        required
    />
    <InputError message={errors.prenom} className="mt-2" />
</div>

{/* Champ Sexe */}
<div className="mt-4">
    <InputLabel htmlFor="sexe" value="sexe" />
    <select
        id="sexe"
        name="sexe"
        value={data.sexe}
        onChange={(e) => setData('sexe', e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        required
    >
        <option value="">Sélectionner</option>
        <option value="Masculin">Homme</option>
        <option value="Féminin">Femme</option>

    </select>
    <InputError message={errors.sexe} className="mt-2" />
</div>

{/* Champ Téléphone */}
<div className="mt-4">
    <InputLabel htmlFor="tel" value="téléphone" />
    <TextInput
        id="tel"
        name="tel"
        value={data.tel}
        className="mt-1 block w-full"
        onChange={(e) => setData('tel', e.target.value)}
        required
    />
    <InputError message={errors.tel} className="mt-2" />
</div>

<div>
    <InputLabel htmlFor="id_role" value="Rôle" />

    <select
        id="id_role"
        name="id_role"
        value={data.id_role}
        onChange={e => setData('id_role', e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        required
    >
        <option value="">-- Choisissez un rôle --</option>
        {roles.map((role) => (
            <option key={role.id_role} value={role.id_role}>
                {role.libelle}
            </option>
        ))}
    </select>

    <InputError message={errors.id_role} className="mt-2" />
</div>



                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
