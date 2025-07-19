import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";

interface FileObject {
    name: string;
    content: string;
    type: string;
    file: string;
    imageUrl: string;
}

interface QuestionImportProps {
    setFile: (file: FileObject) => void;
}

export default function QuestionImport({ setFile }: QuestionImportProps) {
    async function handleFileUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                const base64 = result.split(",")[1];
                setFile({
                    name: file.name,
                    content: base64,
                    type: file.type,
                    file: base64,
                    imageUrl: file.type.includes("pdf")
                        ? "/document-icon.png"
                        : URL.createObjectURL(file),
                });
            }
        };

        reader.readAsDataURL(file);
    }

    return (
        <div className={quizzcss.containerbox}>
            {/* Titre supprimé ici pour éviter le doublon */}
            <div className={quizzcss.containerimportpdf}>
                <h1
                    style={{
                        color: "#fff",
                        textShadow: "1px 2px 8px #1568ce80",
                    }}
                >
                    Glissez ici le fichier que vous voulez importer ...
                </h1>

                <label htmlFor="importf" className={quizzcss.importLabelButton}>
                    <FaCloudUploadAlt size={22} />
                    Choisir un fichier
                </label>
                <input
                    id="importf"
                    type="file"
                    accept=".pdf, .jpg, .jpeg, .png"
                    onChange={handleFileUpload}
                    className={quizzcss.importpdf}
                />

                <h2 style={{ color: "#1568ce", fontWeight: 600 }}>
                    Taille max : 100MB
                </h2>
            </div>
        </div>
    );
}
