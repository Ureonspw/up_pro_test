import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import HomePage from './menu_principal/HomePage';
import Footer from '@/Components/Footer';
export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    menu
                </h2>
            }
        >
            <Head title="menu principal" />
            <HomePage />
            <Footer />

        </AuthenticatedLayout>
    );
}
