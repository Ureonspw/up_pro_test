import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";
import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
export default function QuestionImport({ setFile }) {
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      const fileObj = {
        type: file.type,
        file: base64,
        imageUrl: file.type.includes("pdf")
          ? "/document-icon.png"
          : URL.createObjectURL(file),
      };
      console.log(fileObj);
      setFile(fileObj);
    };

    reader.readAsDataURL(file);
  }

  return (
    <AuthenticatedLayout>
      <div className={quizzcss.containerbox}>
        <div className={quizzcss.title}>Importation de cours pour le qcm</div>

        <div className={quizzcss.containerimportpdf}>
          <h1>Glissez ici le fichier que vous voulez importer ...</h1>

          <label htmlFor="importf">
            Nom du fichier <FaLink />
          </label>
          <input
            id="importf"
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={handleFileUpload}
            className={quizzcss.importpdf}
          />

          <h2>Taille max : 100MB</h2>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
