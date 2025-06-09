import Classes from "../../../css/qcms/qcm.module.css";
import { FaCircleNotch } from "react-icons/fa";
import { BiShapeTriangle } from "react-icons/bi";
import { FaVectorSquare } from "react-icons/fa";
import { LuDiamond } from "react-icons/lu";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaSmileWink } from "react-icons/fa";



interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

interface FileProps {
  file: string; // Contenu du document encodé en base64
  type: string; // Type MIME du document
}

interface QuestionsProps {
  file: FileProps;
}

function Questions({ file }: QuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timer, setTimer] = useState(10);
  const [showNextButton, setShowNextButton] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false); // ✅ État du quiz (commencé ou pas)

  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

  useEffect(() => {
    async function generateQuestions() {
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
Génère 10 questions QCM basées sur le document fourni. Pour chaque question, donne :
- Le texte de la question.
- Quatre réponses au choix (y compris la bonne réponse).
- Indique la réponse correcte.
Donne uniquement le tableau JSON brut, sans \`\`\`json, sans balises Markdown, ni aucun texte supplémentaire. Le format doit être exactement comme ci-dessous :
[
  {
    "question": "Quel est le langage de programmation le plus utilisé ?",
    "answers": ["Python", "JavaScript", "Java", "C#"],
    "correctAnswer": "JavaScript"
  },
  ...
]
`
        ]);

        let jsonText = result.response.text().trim();
        jsonText = jsonText.replace(/```json/, '').replace(/```/, '').trim();

        const parsedQuestions = JSON.parse(jsonText) as Question[];
        setQuestions(parsedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la génération des questions :", error);
        setLoading(false);
      }
    }

    generateQuestions();
  }, [file]);

  // Timer (uniquement si le quiz a commencé)
  useEffect(() => {
    if (quizStarted && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (quizStarted && timer === 0) {
      setSelectedAnswer(questions[currentQuestionIndex]?.correctAnswer || "");
      setShowNextButton(true);
    }
  }, [timer, quizStarted, currentQuestionIndex, questions]);

  // Mélanger les réponses
  useEffect(() => {
    if (questions.length > 0) {
      setShuffledAnswers([...questions[currentQuestionIndex].answers].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answer);
      setTimer(0);
      setShowNextButton(true);

      if (answer === questions[currentQuestionIndex].correctAnswer) {
        setScore((prevScore) => prevScore + 20);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimer(10);
      setShowNextButton(false);
    } else {
      alert(`Quiz terminé ! Score : ${score}`);
      setScore(0);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTimer(10);
      setShowNextButton(false);
      setQuizStarted(false); // ✅ Remettre le quiz à l'état initial
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  if (loading) {
    return (
      <div className={Classes.loaderContainer}>
        <div className={Classes.loaderSpinner}></div>
        <p className={Classes.loaderText}>Patiente... Génération des questions en cours !</p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className={Classes.startContainer}>
        <h2>Les questions sont prêtes ! <FaSmileWink size={32} /></h2>
        <button className={Classes.startButton} onClick={startQuiz}>
          Commencer le quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className={Classes.error}>Aucune question générée. Vérifie le document ou réessaie.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className={Classes.containerboxgeneral}>
        <div className={Classes.question}>{currentQuestion.question}</div>
        <div className={Classes.timercontainer}>
          <div className={Classes.timercount}>{timer}</div>
          <div className={Classes.points}>Points : {score}</div>
        </div>
        <div className={Classes.reponsesbox}>
          {shuffledAnswers.map((answer, index) => (
            <div
              key={index}
              className={`${Classes[`reponsesbox${index + 1}`]} ${
                selectedAnswer !== null
                  ? (selectedAnswer === answer
                    ? answer === currentQuestion.correctAnswer
                      ? Classes.correct
                      : Classes.incorrect
                    : answer !== currentQuestion.correctAnswer
                    ? Classes.incorrect
                    : "")
                  : ""
              }`}
              onClick={() => handleAnswerClick(answer)}
            >
              <samp>
                {index === 0 ? <BiShapeTriangle /> : index === 1 ? <LuDiamond /> : index === 2 ? <FaCircleNotch /> : <FaVectorSquare />}
              </samp>{" "}
              {answer}
            </div>
          ))}
        </div>
        {showNextButton && (
          <button className={Classes.nextButton} onClick={handleNextQuestion}>
            Question Suivante
          </button>
        )}
      </div>
    </>
  );
}

export default Questions;
