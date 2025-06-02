import { useState, ChangeEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import QuestionImport from "./enregistrementPro_import"

import EnregistrementPage from "@/Pages/professeur/enregistrer_fichierprof"
// import Questions from "./Questions";
// Définis le type du fichier (ajuste si tu as un type plus spécifique)
type FileData = {
  type: string;
  file: string;
  imageUrl: string;
}; 

export default function ResumerPage() {
    const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);

  return (
    <>
      {
        uploadedFile ? (
          <AuthenticatedLayout>
              <EnregistrementPage uploadedFile={uploadedFile} />
          </AuthenticatedLayout>

        ) : (
          <>
          <QuestionImport setFile={setUploadedFile} />
          </>
        )
      }</>
  );
}
