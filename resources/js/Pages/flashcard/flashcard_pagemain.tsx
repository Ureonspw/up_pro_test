import { useState, ChangeEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import QuestionImport from "./flashcard_import"
import Flashcard from "./flashcard";
// Définis le type du fichier (ajuste si tu as un type plus spécifique)
type FileData = File; 

export default function ResumerPage() {
    const [uploadedFile, setUploadedFile] = useState(null);


  return (
    <>
      {
        uploadedFile ? (
          <AuthenticatedLayout>
              <Flashcard file={uploadedFile}/>
              {/* file={uploadedFile} */}
          </AuthenticatedLayout>

        ) : (
          <>
          <QuestionImport setFile={setUploadedFile} />
          </>
        )
      }</>
  );
}
