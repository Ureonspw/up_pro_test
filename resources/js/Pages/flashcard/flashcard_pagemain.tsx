import React, { useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import QuestionImport from "./flashcard_import"
import Flashcard from "./flashcard";
import { FileObject } from '@/types';

export default function FlashcardPageMain() {
    const [uploadedFile, setUploadedFile] = useState<FileObject | null>(null);

    const handleFileUpload = (file: FileObject) => {
        setUploadedFile(file);
    };

    return (
        <>
            {
                uploadedFile ? (
                    <AuthenticatedLayout>
                        <Flashcard file={uploadedFile} />
                    </AuthenticatedLayout>
                ) : (
                    <>
                        <QuestionImport setFile={handleFileUpload} />
                    </>
                )
            }
        </>
    );
}
