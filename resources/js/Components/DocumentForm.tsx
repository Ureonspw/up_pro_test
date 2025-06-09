import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Matiere {
    id: number;
    libelle: string;
}

interface Document {
    id: number;
    nom: string;
    description: string;
    chemin: string;
    id_type_doc: number;
    id_Matiere: number;
    user_id: number;
}

const DocumentForm: React.FC = () => {
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        fichier: null as File | null,
        id_type_doc: '',
        id_Matiere: ''
    });
    const [message, setMessage] = useState('');

    // Charger les matières au montage du composant
    useEffect(() => {
        fetchMatieres();
        fetchDocuments();
    }, []);

    const fetchMatieres = async () => {
        try {
            const response = await axios.get('/api/matieres');
            setMatieres(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des matières:', error);
            setMessage('Erreur lors de la récupération des matières');
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/api/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des documents:', error);
            setMessage('Erreur lors de la récupération des documents');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                fichier: e.target.files![0]
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('nom', formData.nom);
        data.append('description', formData.description);
        if (formData.fichier) {
            data.append('fichier', formData.fichier);
        }
        data.append('id_type_doc', formData.id_type_doc);
        data.append('id_Matiere', formData.id_Matiere);

        try {
            const response = await axios.post('/api/documents', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Document enregistré avec succès');
            setFormData({
                nom: '',
                description: '',
                fichier: null,
                id_type_doc: '',
                id_Matiere: ''
            });
            fetchDocuments(); // Rafraîchir la liste des documents
        } catch (error) {
            console.error('Erreur lors de l\'envoi du document:', error);
            setMessage('Erreur lors de l\'envoi du document');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Documents</h2>
            
            {/* Formulaire d'envoi */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <label className="block mb-2">Nom du document</label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Fichier</label>
                    <input
                        type="file"
                        name="fichier"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Type de document</label>
                    <input
                        type="number"
                        name="id_type_doc"
                        value={formData.id_type_doc}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Matière</label>
                    <select
                        name="id_Matiere"
                        value={formData.id_Matiere}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Sélectionner une matière</option>
                        {matieres.map(matiere => (
                            <option key={matiere.id} value={matiere.id}>
                                {matiere.libelle}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Envoyer
                </button>
            </form>

            {/* Message de statut */}
            {message && (
                <div className="mb-4 p-4 bg-gray-100 rounded">
                    {message}
                </div>
            )}

            {/* Liste des documents */}
            <div>
                <h3 className="text-xl font-bold mb-4">Documents existants</h3>
                <div className="grid gap-4">
                    {documents.map(doc => (
                        <div key={doc.id} className="border p-4 rounded">
                            <h4 className="font-bold">{doc.nom}</h4>
                            <p>{doc.description}</p>
                            <p>Matière: {matieres.find(m => m.id === doc.id_Matiere)?.libelle}</p>
                            <a
                                href={`/storage/${doc.chemin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Voir le document
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentForm; 