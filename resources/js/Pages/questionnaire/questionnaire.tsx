// Questionnaire.tsx
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Classes from "../../../css/questionnaire/questionnaire.module.css";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function generateQuestionnairePdf(questions: QuestionData[], userAnswers: string[], score: number): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const { width, height } = page.getSize();
  const margin = 50;

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Titre
  page.drawText('Questionnaire', {
    x: margin,
    y: height - margin,
    size: 24,
    font: titleFont,
    color: rgb(0.1, 0.7, 0.3),
  });

  // Questions et réponses
  let y = height - margin - 40;
  const fontSize = 12;

  questions.forEach((q, index) => {
    if (y < margin + 40) return;
    
    // Question
    page.drawText(`Question ${index + 1}: ${q.question}`, {
      x: margin,
      y: y,
      size: fontSize,
      font: contentFont,
      color: rgb(0, 0, 0),
    });
    y -= fontSize + 6;

    // Réponse utilisateur
    page.drawText(`Votre réponse: ${userAnswers[index]}`, {
      x: margin + 20,
      y: y,
      size: fontSize,
      font: contentFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= fontSize + 6;

    // Bonne réponse
    page.drawText(`Bonne réponse: ${q.answer}`, {
      x: margin + 20,
      y: y,
      size: fontSize,
      font: contentFont,
      color: rgb(0, 0.5, 0),
    });
    y -= fontSize + 12;
  });

  // Score
  page.drawText(`Score final: ${score}/20`, {
    x: margin,
    y: y,
    size: fontSize + 2,
    font: titleFont,
    color: rgb(0.1, 0.7, 0.3),
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

function Questionnaire({ file }: QuestionnaireProps) {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);

  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

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
        setUserAnswers(Array(parsed.length).fill("")); // tableau des réponses utilisateur
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

  const handleSubmit = async () => {
    let points = 0;
    questions.forEach((q, i) => {
      if (q.answer.trim().toLowerCase() === userAnswers[i].trim().toLowerCase()) {
        points += 2; // 2 points par bonne réponse
      }
    });
    setScore(points);
    setShowSummary(true);

    // Générer et sauvegarder le PDF
    const pdfBlob = await generateQuestionnairePdf(questions, userAnswers, points);
    const pdfBase64 = await blobToBase64(pdfBlob);
    localStorage.setItem('pdfBase64', pdfBase64);

    const pdfUrl = URL.createObjectURL(pdfBlob);
    localStorage.setItem('pdfUrl', pdfUrl);
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
        <button onClick={() => window.location.href = "/resumer_page"}>Retour</button>
        <button onClick={() => window.location.href = "/enregistrement_page"}>Enregistrer</button>
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
