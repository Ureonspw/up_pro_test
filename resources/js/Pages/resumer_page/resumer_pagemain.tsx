import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import ResumerImport from "./resumer_import";
import Summary from './components/Summary'
import Chat from './components/Chat'
import { FileObject } from '@/types';

export default function ResumerPage() {
    const [uploadedFile, setUploadedFile] = useState<FileObject | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<'français' | 'yoruba'>('français');
    const [shouldRestoreState, setShouldRestoreState] = useState<boolean>(false);

    // Restaurer le fichier et la langue depuis localStorage au chargement de la page
    useEffect(() => {
        const savedFileData = localStorage.getItem('uploadedFileData');
        const savedLanguage = localStorage.getItem('selectedLanguage') as 'français' | 'yoruba';
        
        if (savedLanguage && (savedLanguage === 'français' || savedLanguage === 'yoruba')) {
            setSelectedLanguage(savedLanguage);
        }
        
        if (savedFileData) {
            try {
                const fileData = JSON.parse(savedFileData);
                setUploadedFile(fileData);
            } catch (error) {
                console.error('Erreur lors de la restauration du fichier:', error);
                localStorage.removeItem('uploadedFileData');
            }
        }
    }, []);

    // Sauvegarder la langue sélectionnée dans localStorage
    useEffect(() => {
        localStorage.setItem('selectedLanguage', selectedLanguage);
    }, [selectedLanguage]);

    const handleFileUpload = (file: FileObject) => {
        setUploadedFile(file);
        // La sauvegarde est déjà faite dans resumer_import.tsx
    };

    const handleNewDocument = () => {
        setUploadedFile(null);
        setSelectedLanguage('français'); // Remettre par défaut
        // Effacer les données sauvegardées
        localStorage.removeItem('uploadedFileData');
        localStorage.removeItem('pdfBase64');
        localStorage.removeItem('pdfUrl');
        localStorage.removeItem('selectedLanguage');
    };



    return (
        <>
            {
                uploadedFile ? (
                    <AuthenticatedLayout>
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={handleNewDocument}
                                style={{
                                    position: 'fixed',
                                    top: '20px',
                                    right: '20px',
                                    backgroundColor: '#89B790',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    zIndex: 1000,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#5a7c60';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#89B790';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                title="Importer un nouveau document"
                            >
                                📄 Nouveau document
                            </button>
                            <Summary 
                                file={uploadedFile} 
                                selectedLanguage={selectedLanguage}
                                onLanguageChange={setSelectedLanguage}
                            />
                            <Chat 
                                file={uploadedFile} 
                                selectedLanguage={selectedLanguage}
                            />
                        </div>
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
