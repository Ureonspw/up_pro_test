import { useState, ChangeEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import QuestionImport from "./questionnaire_import"
import Questionnaire from "./questionnaire";
import axios from "axios";
import { usePage } from "@inertiajs/react";

// Définis le type du fichier
type FileData = {
  type: string;
  file: string;
  imageUrl: string;
  name: string;
}; 

export default function ResumerPage() {
    const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { auth } = usePage().props;

    const saveToDatabase = async (fileData: FileData) => {
        try {
            setError(null);
            
            // Validation des données requises
            if (!fileData.name) {
                throw new Error('Le nom du fichier est requis');
            }
            if (!auth.user?.id) {
                throw new Error('Utilisateur non authentifié');
            }

            const formData = new FormData();
            // Convertir la chaîne base64 en Blob
            const byteCharacters = atob(fileData.file);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: fileData.type });
            
            // Préparation des données avec des valeurs par défaut si nécessaire
            const fileName = fileData.name;
            const description = 'Document importé via questionnaire';
            const idTypeDoc = '1';
            const userId = auth.user.id.toString();
            const idMatiere = '1';
            
            // Ajout des données au FormData
            formData.append('file', blob, fileName);
            formData.append('nom', fileName);
            formData.append('description', description);
            formData.append('id_type_doc', idTypeDoc);
            formData.append('user_id', userId);
            formData.append('id_Matiere', idMatiere);

            // Log des données envoyées pour le débogage
            console.log('Données envoyées:', {
                nom: fileName,
                description: description,
                id_type_doc: idTypeDoc,
                user_id: userId,
                id_Matiere: idMatiere
            });

            const response = await axios.post('/upload-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                console.log('Document sauvegardé avec succès:', response.data);
            } else {
                throw new Error(response.data.message || 'Erreur lors de la sauvegarde du document');
            }
        } catch (error: any) {
            console.error('Erreur lors de la sauvegarde:', error);
            setError(error.message || 'Une erreur est survenue lors de la sauvegarde du document');
        }
    };

    const handleFileUpload = (fileData: FileData) => {
        setUploadedFile(fileData);
        saveToDatabase(fileData);
    };

    return (
        <>
            {error && (
                <div className="error-message" style={{ color: 'red', padding: '10px', margin: '10px' }}>
                    {error}
                </div>
            )}
            {uploadedFile ? (
                <AuthenticatedLayout>
                    <Questionnaire file={uploadedFile} />
                </AuthenticatedLayout>
            ) : (
                <QuestionImport setFile={handleFileUpload} />
            )}
        </>
    );
}
