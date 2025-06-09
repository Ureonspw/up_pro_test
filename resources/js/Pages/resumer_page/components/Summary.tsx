import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import styles from "../../../../css/resumer_page/component/Summary.module.css";
import { PDFDocument, rgb,StandardFonts } from 'pdf-lib';

interface FileProps {
  file: string;
  type: string;
  imageUrl: string;
}

interface SummaryProps {
  file: FileProps;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}



async function generatePdf(text: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const { width, height } = page.getSize();
  const margin = 50;

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const footerFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Titre
  page.drawText('e~Learning', {
    x: margin,
    y: height - margin,
    size: 24,
    font: titleFont,
    color: rgb(0.1, 0.7, 0.3),
  });

  // Texte principal
  const fontSize = 12;
  let y = height - margin - 40; // Espace sous le titre

  const lines = text.split('\n');

  lines.forEach(line => {
    if (y < margin + 40) {
      // Stop drawing if not enough space
      return;
    }
    page.drawText(line, {
      x: margin,
      y: y,
      size: fontSize,
      font: contentFont,
      color: rgb(0, 0, 0),
    });
    y -= fontSize + 6;
  });

  // Pied de page
  page.drawText('Fiche de révision', {
    x: margin,
    y: margin - 10,
    size: 10,
    font: footerFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}



function Summary({ file }: SummaryProps) {
  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
  const [summary, setSummary] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const handleSave = async () => {
    if (!summary) return;
  
    const pdfBlob = await generatePdf(summary);
    const pdfBase64 = await blobToBase64(pdfBlob);
    localStorage.setItem('pdfBase64', pdfBase64);

    const pdfUrl = URL.createObjectURL(pdfBlob);
    localStorage.setItem('pdfUrl', pdfUrl);


  
    window.location.href = '/enregistrement_page';
  };
  
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
    <div className={styles.enregistrer} onClick={handleSave}> enregistrer</div>
</section>
  );
}

export default Summary;
