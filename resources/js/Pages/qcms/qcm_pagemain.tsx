import { useState, ChangeEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import QuestionImport from "./question_import"
import Questions from "./Questions";
// Définis le type du fichier (ajuste si tu as un type plus spécifique)
type FileData = File; 

export default function ResumerPage() {
    const [uploadedFile, setUploadedFile] = useState(null);


  return (
    <>
      {
        uploadedFile ? (
          <AuthenticatedLayout>
              <Questions file={uploadedFile}/>
          </AuthenticatedLayout>

        ) : (
          <>
          <QuestionImport setFile={setUploadedFile} />
          </>
        )
      }</>
  );
}
