import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import QuestionImport from "./question_import";
import Questions from "./Questions";
import { FileObject } from "@/types";
import { Link } from "@inertiajs/react";
import { FaTrophy } from "react-icons/fa";
import "../../../css/qcms/qcm.css";

export default function QCMPageMain() {
    const [uploadedFile, setUploadedFile] = useState<FileObject | null>(null);

    const handleFileUpload = (file: FileObject) => {
        setUploadedFile(file);
    };

    return (
        <>
            {uploadedFile ? (
                <AuthenticatedLayout>
                    <Questions file={uploadedFile} />
                </AuthenticatedLayout>
            ) : (
                <AuthenticatedLayout>
                    <div className={quizzcss.containerbox}>
                        <div className={quizzcss.title}>
                            <span
                                style={{ textShadow: "1px 2px 8px #1568ce80" }}
                            >
                                Importation de cours pour le{" "}
                                <span
                                  
                                >
                                    QCM
                                </span>
                            </span>
                            <Link
                                href={
                                    route
                                        ? route("millionaire")
                                        : "/millionaire"
                                }
                                className="millionaire-icon-link"
                            >
                                <div className="millionaire-icon-container">
                                    <FaTrophy className="millionaire-icon" />
                                    <span className="millionaire-tooltip">
                                        Qui veut gagner des millions ?
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <QuestionImport setFile={handleFileUpload} />
                    </div>
                </AuthenticatedLayout>
            )}
        </>
    );
}
