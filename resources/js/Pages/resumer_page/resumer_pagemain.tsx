import React, { useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import ResumerImport from "./resumer_import";
import Summary from './components/Summary'
import Chat from './components/Chat'
import { FileObject } from '@/types';

export default function ResumerPage() {
    const [uploadedFile, setUploadedFile] = useState<FileObject | null>(null);

    const handleFileUpload = (file: FileObject) => {
        setUploadedFile(file);
    };

    return (
        <>
            {
                uploadedFile ? (
                    <AuthenticatedLayout>
                        <Summary file={uploadedFile} />
                        <Chat file={uploadedFile} />
                    </AuthenticatedLayout>
                ) : (
                    <>
                        <ResumerImport setFile={handleFileUpload} />
                    </>
                )
            }
        </>
    );
}
