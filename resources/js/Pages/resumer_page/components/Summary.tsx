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
        Résume le document.
        Rédige un résumé du document en un seul paragraphe, en moins de 200 mots.
        Utilise uniquement du texte brut, sans balises HTML ni markdowns.
        Si le document contient du code, affiche-le correctement formaté, avec des retours à la ligne et une indentation propre.
        `,
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
      <h2>Resumer</h2>
      {status === "loading" ? (
        <Loader />
      ) : status === "success" ? (
        <p>{summary}</p>
      ) : status === "error" ? (
        <p className={styles.error}>Error getting the summary</p>
      ) : null}
    </section>
  );
}

export default Summary;
