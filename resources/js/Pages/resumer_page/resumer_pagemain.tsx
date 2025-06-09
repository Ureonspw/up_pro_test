import { useState, ChangeEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
import ResumerImport from "./resumer_import";
import Summary from './components/Summary'
import Chat from './components/Chat'

// Définis le type du fichier (ajuste si tu as un type plus spécifique)
type FileData = File; 

export default function ResumerPage() {
    const [uploadedFile, setUploadedFile] = useState(null);


  return (
    <>
      {
        uploadedFile ? (
          <AuthenticatedLayout>
          <Summary file={uploadedFile}/>
          <Chat file={uploadedFile}/>
          </AuthenticatedLayout>

        ) : (
          <>
          <ResumerImport setFile={setUploadedFile} />
          </>
        )
      }</>
  );
}
