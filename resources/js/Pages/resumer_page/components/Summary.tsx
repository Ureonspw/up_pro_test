import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import styles from "../../../../css/resumer_page/component/Summary.module.css";

interface FileProps {
  file: string;
  type: string;
  imageUrl: string;
}

interface SummaryProps {
  file: FileProps;
}

function Summary({ file }: SummaryProps) {
  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
  const [summary, setSummary] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function getSummary() {
    setStatus("loading");

    try {
      const result = await model.generateContent([
        {
          inlineData: {
            data: file.file,
            mimeType: file.type,
          },
        },
        `
      Crée une fiche de révision basée sur le contenu du document.

      La fiche de révision doit être claire et structurée, avec des sections bien définies (par exemple : Définitions, Concepts clés, Méthodologie, Exemples, Astuces).

      Si le document contient du code, affiche-le correctement formaté, avec des retours à la ligne et une indentation propre.

      La fiche doit être synthétique, avec des phrases courtes et claires. Mets en évidence les points essentiels à retenir pour faciliter la mémorisation.

      Évite absolument d'utiliser des caractères spéciaux comme ** ou * ou tout autre symbole de mise en forme dans les titres ou les points.

      Sépare chaque section de manière lisible par un saut de ligne. Commence les titres de sections directement par le nom de la section (par exemple : Définitions, Concepts clés, Méthodologie, Exemples, Astuces).

      Présente le code dans des blocs clairement indentés avec retour à la ligne.

      N'ajoute aucune mise en forme particulière autre que des paragraphes clairs et un code lisible. Ne commence pas la fiche par "Bien sûr" ou d'autres expressions inutiles.

      Sois direct et précis.
      `
      ]);
      setStatus("success");
      setSummary(result.response.text());
    } catch (error) {
      setStatus("error");
    }
  }

  useEffect(() => {
    if (status === "idle") {
      getSummary();
    }
  }, [status]);

  return (
    <section className={styles.summary}>
      <img src={file.imageUrl} alt="Preview" />
      <h2>Résumé</h2>
      {status === "loading" ? (
        <Loader />
      ) : status === "success" ? (
        <pre className={styles.summaryContent}>{summary}</pre>
      ) : status === "error" ? (
        <p className={styles.error}>Error getting the summary</p>
      ) : null}
    </section>
  );
}

export default Summary;
