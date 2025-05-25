import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Accueil from '@/Pages/acceuil_page/Accueil';
import Introduction from '@/Pages/acceuil_page/Introduction';
import Footer from '@/Components/Footer';

export default function Welcome({
  
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
   

    return (
        <>
            <Head title="Hello Apprenant " />
            <Accueil />
            <Introduction />
            <Footer />
        </>
    );
}
