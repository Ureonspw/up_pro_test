import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GrValidate } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { FaLayerGroup } from "react-icons/fa6";
import { MdDone } from "react-icons/md";
import { FaSmileWink } from "react-icons/fa";
import Classes from "../../../css/flashcard/flashcard.module.css";

interface FlashcardData {
  question: string;
  answer: string;
  correct: boolean;
}

interface FileProps {
  file: string; // Contenu du document encodé en base64
  type: string; // Type MIME du document
}

interface FlashcardProps {
  file: FileProps;
}

function Flashcard({ file }: FlashcardProps) {
  const [questions, setQuestions] = useState<FlashcardData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flashcardsReady, setFlashcardsReady] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  useEffect(() => {
    async function generateFlashcards() {
      try {
        setLoading(true);
        const result = await model.generateContent([
          {
            inlineData: {
              data: file.file,
              mimeType: file.type,
            },
          },
          `
Génère 10 flashcards basées sur le document fourni. Pour chaque flashcard, donne :
- Une question.
- Une réponse.
- Indique si la réponse est correcte (true ou false).
Donne uniquement le tableau JSON brut, sans \`\`\`json, sans balises Markdown, ni aucun texte supplémentaire. Le format doit être exactement comme ci-dessous :
[
  {
    "question": "Qu'est-ce que l'IA ?",
    "answer": "L'intelligence artificielle est la simulation de l'intelligence humaine par des machines.",
    "correct": true
  },
  ...
]
`
        ]);

        let jsonText = result.response.text().trim();
        jsonText = jsonText.replace(/```json/, '').replace(/```/, '').trim();

        const parsedQuestions = JSON.parse(jsonText) as FlashcardData[];
        setQuestions(parsedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la génération des flashcards :", error);
        setLoading(false);
      }
    }

    generateFlashcards();
  }, [file]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }

    if (correctCount + incorrectCount + 1 === questions.length) {
      // Fin du quiz, on affiche le résumé
      setShowSummary(true);
      return;
    }

    setIsTransitioning(true);
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setCurrentQuestionIndex(
          (prevIndex) => (prevIndex + 1) % questions.length
        );
        setFlipped(false);
        setIsTransitioning(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const startFlashcards = () => {
    setFlashcardsReady(true);
  };

  const replay = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFlipped(false);
    setIsTransitioning(false);
    setShowSummary(false);
    setFlashcardsReady(true);
  };

  if (loading) {
    return (
      <div className={Classes.loaderContainer}>
        <div className={Classes.loaderSpinner}></div>
        <p className={Classes.loaderText}>Patiente... Génération des flashcards en cours !</p>
      </div>
    );
  }

  if (!flashcardsReady) {
    return (
      <div className={Classes.startContainer}>
        <h2>Les flashcards sont prêtes ! <FaSmileWink size={32} /></h2>
        <button className={Classes.startButton} onClick={startFlashcards}>
          Commencer les flashcards
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className={Classes.error}>Aucune flashcard générée. Vérifie le document ou réessaie.</div>;
  }

  // PAGE DE RESUME (FIN)
// PAGE DE RESUME (FIN)
if (showSummary) {
  const total = questions.length;
  let message = "";

  if (correctCount === total) {
    message = "Excellent travail ! Tu as tout bon ";
  } else if (correctCount >= total * 0.7) {
    message = "Bien joué, continue comme ça ! ";
  } else if (correctCount >= total * 0.4) {
    message = "Pas mal, un peu plus d'effort et tu vas y arriver ! ";
  } else {
    message = "Ne lâche rien, ça va venir avec un peu d'entraînement ! ";
  }

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={Classes.summaryContainer}>
      <h2>D'apres ce que tu a renseigner: </h2>
      <p>tu as vus juste sur : <span className={Classes.correctCount}>{correctCount} flashcards</span></p>
      <p>et tu t'es trompé sur : <span className={Classes.incorrectCount}>{incorrectCount} flashcards</span></p>
      <p className={Classes.motivatingMessage}>{message}</p>
      <button className={Classes.replayButton} onClick={replay}>
        Rejouer
      </button>
      <button className={Classes.replayButton} style={{ marginLeft: "10px" }} onClick={reloadPage}>
        Nouveau document
      </button>
    </div>
  );
}

  // AFFICHAGE FLASHCARDS
  const { question, answer } = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <>
      <div className={Classes.containerboxg}>
        <div className={Classes.containerboxson1}>
          <div className={Classes.sizebox1}></div>
          <div className={Classes.containerboxson1title}>
            <FaLayerGroup /> <span>Flashcard</span>
          </div>
          <div className={Classes.closebnt}>
            <RxCross2 />
          </div>
        </div>

        <div
          className={`${Classes.boxflashcard} ${
            flipped ? Classes.flipped : ""
          } ${isTransitioning ? Classes["card-transition"] : ""}`}
          onClick={handleFlip}
        >
          <div className={Classes.boxflashcardcontainer}>
            {flipped ? (
              <div className={Classes.answer}>
                <div className={Classes.questionLabel}>{question}</div>
                <samp>{answer}</samp>
              </div>
            ) : (
              <div className={Classes.question}>{question}</div>
            )}
          </div>
        </div>
        <div className={Classes.validationrepbox}>
          <div className={Classes.false} onClick={() => handleAnswer(false)}>
            <RxCross2 />
          </div>
          <div className={Classes.true} onClick={() => handleAnswer(true)}>
            <MdDone />
          </div>
        </div>
      </div>
      <div className={Classes.containerboxinfo}>
        <div className={Classes.repbox}>
          <RxCross2 /> <span>{incorrectCount}</span>
        </div>
        <div className={Classes.containerprogress}>
          <div className={Classes.counter}>
            Question {currentQuestionIndex + 1} sur {totalQuestions}
          </div>

          <div className={Classes.progressContainer}>
            <div
              className={Classes.progressBar}
              style={{
                width: `${progressPercentage}%`,
                backgroundColor:
                  progressPercentage < 50
                    ? "#f44336"
                    : progressPercentage < 80
                    ? "#ff9800"
                    : "#4caf50",
              }}
            ></div>
          </div>
        </div>

        <div className={Classes.repbox}>
          <GrValidate /> <span>{correctCount}</span>
        </div>
      </div>
      <div className={Classes.flasharriere1}></div>
      <div className={Classes.flasharriere2}></div>
    </>
  );
}

export default Flashcard;
