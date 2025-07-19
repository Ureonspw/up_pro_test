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
                                    style={{
                                        color: "#fff",
                                        background:
                                            "linear-gradient(90deg, #ff9800, #ff5722)",
                                        padding: "0.2em 0.7em",
                                        borderRadius: "1em",
                                        fontWeight: "bold",
                                        boxShadow:
                                            "0 0 8px 2px #ff9800cc, 0 2px 8px #1568ce80",
                                        border: "2px solid #fff",
                                        letterSpacing: "0.05em",
                                    }}
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
                            >
                                <button
                                    className={
                                        "start-button millionaire-btn-glow millionaire-btn-animated"
                                    }
                                    style={{
                                        marginLeft: 64,
                                        padding: "0.12em 0.35em",
                                        fontSize: "0.75em",
                                        minWidth: "unset",
                                        minHeight: "unset",
                                    }}
                                >
                                    <FaTrophy
                                        style={{
                                            marginRight: 3,
                                            marginBottom: -2,
                                            fontSize: "0.75em",
                                        }}
                                    />
                                    Qui veut gagner des millions ?
                                </button>
                            </Link>
                        </div>
                        <QuestionImport setFile={handleFileUpload} />
                    </div>
                </AuthenticatedLayout>
            )}
        </>
    );
}
