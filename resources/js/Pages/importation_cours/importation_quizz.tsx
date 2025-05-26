import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaLink } from "react-icons/fa6";

import quizzcss from "../../../css/importation_cours/importation_quizz.module.css";
export default function ImportationQuizz() {
    return (
        <AuthenticatedLayout>
            <div className={quizzcss.containerbox}>
                <div className={quizzcss.title}>Importation de cours</div>

                <div className={quizzcss.containerimportpdf}>
                    {" "}
                    <h1>Glissez ici le fichier que vous voulez importer ...</h1>

                    <form action="/import_doc">

                        <label htmlFor="importf"> non du fichier <FaLink /></label>
                        <input
                            id="importf"
                            type="file"
                            className={quizzcss.importpdf}
                        />
                    </form>{" "}
                    <h2>Taille max : 100MB</h2>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
