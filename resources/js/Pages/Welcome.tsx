import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Accueil from '@/Pages/acceuil_page/Accueil';
import Introduction from '@/Pages/acceuil_page/Introduction';
import Footer from '@/Components/Footer';

interface Props extends PageProps {
    laravelVersion: string;
    phpVersion: string;
}

export default function Welcome({ laravelVersion, phpVersion }: Props) {
    return (
        <>
            <Head title="Welcome" />
            <Accueil />
            <Introduction />
            <Footer />
        </>
    );
}
