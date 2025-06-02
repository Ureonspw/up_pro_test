// Questionnaire.tsx
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
