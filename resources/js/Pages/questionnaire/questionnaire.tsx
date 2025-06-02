// Questionnaire.tsx
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Classes from "../../../css/questionnaire/questionnaire.module.css";

interface QuestionData {
  question: string;
  answer: string;
}

interface FileProps {
  file: string; // document base64
  type: string; // MIME type
}

interface QuestionnaireProps {
  file: FileProps;
}

// Convertit un Blob en base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
// Génère le PDF des questions/réponses avec gestion du retour à la ligne
async function generatePdf(questions: QuestionData[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // Format A4

  const { width, height } = page.getSize();
  const margin = 40;
  const lineHeight = 18;
  let y = height - margin;

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const footerFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const maxWidth = width - 2 * margin;

  // Fonction utilitaire : découpe une ligne trop longue
  function splitText(text: string, font: any, fontSize: number): string[] {
    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    words.forEach(word => {
      const testLine = currentLine + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine.trim());
    return lines;
  }

  // Titre du document
  page.drawText("e~Learning - Questionnaire", {
    x: margin,
    y: y - 10,
    size: 20,
    font: titleFont,
    color: rgb(0.1, 0.7, 0.3),
  });

  y -= 40;

  const fontSize = 12;

  questions.forEach((q, index) => {
    const questionLines = splitText(`Question ${index + 1}: ${q.question}`, contentFont, fontSize);
    const answerLines = splitText(`Réponse: ${q.answer}`, contentFont, fontSize);

    const totalLines = questionLines.length + answerLines.length + 1;

    if (y < margin + totalLines * lineHeight) {
      page = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }

    questionLines.forEach(line => {
      page.drawText(line, { x: margin, y, size: fontSize, font: contentFont, color: rgb(0, 0, 0) });
      y -= lineHeight;
    });

    answerLines.forEach(line => {
      page.drawText(line, { x: margin + 20, y, size: fontSize, font: contentFont, color: rgb(0.3, 0.3, 0.3) });
      y -= lineHeight;
    });

    y -= lineHeight / 2; // Petit espace entre les questions
  });

  // Pied de page
  page.drawText("Fiche Questionnaire", {
    x: margin,
    y: margin - 10,
    size: 10,
    font: footerFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}


function Questionnaire({ file }: QuestionnaireProps) {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);

  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const result = await model.generateContent([
          {
            inlineData: { data: file.file, mimeType: file.type },
          },
          `
Génère 10 questions de type QCM basées sur le document fourni.
Pour chaque question, donne la structure suivante sans Markdown ni texte supplémentaire :
[
  {
    "question": "Écris ici la question",
    "answer": "Écris ici la bonne réponse"
  },
  ...
]
          `,
        ]);

        let text = result.response.text().trim();
        text = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text) as QuestionData[];
        setQuestions(parsed);
        setUserAnswers(Array(parsed.length).fill(""));
      } catch (err) {
        console.error("Erreur lors de la génération :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [file]);

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...userAnswers];
    updated[index] = value;
    setUserAnswers(updated);
  };

  const handleSubmit = () => {
    let points = 0;
    questions.forEach((q, i) => {
      if (q.answer.trim().toLowerCase() === userAnswers[i].trim().toLowerCase()) {
        points += 2; // 2 points par bonne réponse
      }
    });
    setScore(points);
    setShowSummary(true);
  };

  const handleSave = async () => {
    if (!questions.length) return;

    const pdfBlob = await generatePdf(questions);
    const pdfBase64 = await blobToBase64(pdfBlob);
    localStorage.setItem("pdfBase64", pdfBase64);

    const pdfUrl = URL.createObjectURL(pdfBlob);
    localStorage.setItem("pdfUrl", pdfUrl);

    window.location.href = "/enregistrement_page"; 
  };

  if (loading) {
    return <div className={Classes.loader}>Génération des questions en cours...</div>;
  }

  if (showSummary) {
    return (
      <div className={Classes.summary}>
        <h2>Résumé</h2>
        <p>Note : {score} / 20</p>
        {score >= 14 ? (
          <p>Bravo ! Tu as bien compris le contenu du document. Continue ainsi 💪</p>
        ) : (
          <p>Tu peux encore progresser ! N'hésite pas à relire le document 📖</p>
        )}
        <button onClick={() => window.location.reload()}>Refaire</button>
        <button onClick={handleSave}>Enregistrer</button>
      </div>
    );
  }

  return (
    <div className={Classes.containerquestionnaire}>
      <div className={Classes.containerTitle}>
        <h2>Questionnaire généré par l'IA</h2>
        <button className={Classes.soummission} onClick={handleSubmit}>
          Soumettre
        </button>
      </div>

      <div className={Classes.Questioncontainer}>
        {questions.map((q, index) => (
          <div key={index} className={Classes.QuestionsPoserbloc}>
            <div className={Classes.questioncontainernum}>
              <div className={Classes.questionnum}>Question {index + 1}.</div>
              <div className={Classes.enoncerQuestion}>{q.question}</div>
              <div className={Classes.propreponse}>
                <input
                  type="text"
                  placeholder="Entre ta réponse ici"
                  value={userAnswers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questionnaire;
