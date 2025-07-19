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

    // Restaurer le fichier depuis localStorage au chargement de la page
    useEffect(() => {
        const savedFileData = localStorage.getItem('uploadedFileData');
        console.log('🔄 Vérification localStorage...', savedFileData ? 'Données trouvées' : 'Pas de données');
        
        if (savedFileData) {
            try {
                const fileData = JSON.parse(savedFileData);
                console.log('✅ Fichier restauré:', fileData.name);
                setUploadedFile(fileData);
            } catch (error) {
                console.error('❌ Erreur lors de la restauration du fichier:', error);
                localStorage.removeItem('uploadedFileData');
            }
        }
    }, []);

    const handleFileUpload = (file: FileObject) => {
        console.log('📥 Réception du fichier:', file.name);
        setUploadedFile(file);
        // La sauvegarde est déjà faite dans resumer_import.tsx
    };

    const handleNewDocument = () => {
        console.log('🗑️ Suppression des données...');
        setUploadedFile(null);
        // Effacer les données sauvegardées
        localStorage.removeItem('uploadedFileData');
        localStorage.removeItem('pdfBase64');
        localStorage.removeItem('pdfUrl');
    };

    const checkLocalStorage = () => {
        const data = localStorage.getItem('uploadedFileData');
        console.log('💾 Données localStorage:', data ? 'Présentes' : 'Absentes');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                console.log('📄 Fichier sauvé:', parsed.name);
            } catch (e) {
                console.log('❌ Données corrompues');
            }
        }
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
                            <button 
                                onClick={checkLocalStorage}
                                style={{
                                    position: 'fixed',
                                    top: '80px',
                                    right: '20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    zIndex: 1000,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}
                                title="Vérifier localStorage (Debug)"
                            >
                                🔍 Debug
                            </button>
                            <Summary file={uploadedFile} />
                            <Chat file={uploadedFile} />
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
