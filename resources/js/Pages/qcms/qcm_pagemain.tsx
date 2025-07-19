import React, { useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import QuestionImport from "./question_import";
import Questions from "./Questions";
import { FileObject } from '@/types';

export default function QCMPageMain() {
    const [uploadedFile, setUploadedFile] = useState<FileObject | null>(null);

    const handleFileUpload = (file: FileObject) => {
        setUploadedFile(file);
    };

    return (
        <>
            {uploadedFile ? (
                <AuthenticatedLayout>
                    <Questions file={uploadedFile}/>
                </AuthenticatedLayout>
            ) : (
                <>
                    <QuestionImport setFile={handleFileUpload} />
                </>
            )}
        </>
    );
}
