import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";

export default function ImportationQuizz() {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [matiereId, setMatiereId] = useState("");
    const [matieres, setMatieres] = useState([]);
    const [typeDocId, setTypeDocId] = useState("1");

    useEffect(() => {
        fetch("/import_doc/matieres")
            .then((res) => res.json())
            .then((data) => setMatieres(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !matiereId || !nom) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        const formData = new FormData();
        formData.append("nom", nom);
        formData.append("description", description);
        formData.append("fichier", file);
        formData.append("id_type_doc", typeDocId);
        formData.append("id_Matiere", matiereId);

        try {
            const response = await fetch("/import_doc", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                alert("Document importé avec succès !");
                // Réinitialiser le formulaire
                setNom("");
                setDescription("");
                setFile(null);
                setMatiereId("");
            } else {
                alert("Erreur : " + (result.message || "Erreur inconnue."));
            }
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de l'importation.");
        }
    };

    return (
        <AuthenticatedLayout>
            <div className={quizzcss.containerbox}>
                <div className={quizzcss.title}>Importation de cours</div>
                <div className={quizzcss.containerimportpdf}>
                    <h1>Glissez ici le fichier que vous voulez importer ...</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Nom du fichier *</label>
                        <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />

                        <label>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <label htmlFor="importf">
                            Fichier <FaLink />
                        </label>
                        <input
                            id="importf"
                            type="file"
                            className={quizzcss.importpdf}
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />

                        <label>Matière *</label>
                        <select
                            value={matiereId}
                            onChange={(e) => setMatiereId(e.target.value)}
                        >
                            <option value="">-- Sélectionner une matière --</option>
                            {matieres.map((matiere: any) => (
                                <option key={matiere.id} value={matiere.id}>
                                    {matiere.libelle}
                                </option>
                            ))}
                        </select>

                        <button type="submit">Importer</button>
                    </form>
                    <h2>Taille max : 100MB</h2>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
