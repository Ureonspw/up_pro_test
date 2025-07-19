import React from 'react';
import { usePage } from '@inertiajs/react';
import EnregistrementPage from './enregistrer_fichierprof';
import QuestionImport from './enregistrementPro_import';
import { FileObject } from '@/types';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    [key: string]: any;
}

export default function EnregistrementProPageMain() {
    const { auth } = usePage<PageProps>().props;
    const [uploadedFile, setUploadedFile] = React.useState<FileObject | null>(null);

    const handleFileUpload = (file: FileObject) => {
        setUploadedFile(file);
    };

    return (
        <div>
            {uploadedFile ? (
                <EnregistrementPage uploadedFile={uploadedFile} auth={auth} />
            ) : (
                <QuestionImport setFile={handleFileUpload} />
            )}
        </div>
    );
}
