import "../../../css/qcms/qcm.css";
import { FaCircleNotch } from "react-icons/fa";
import { BiShapeTriangle } from "react-icons/bi";
import { FaVectorSquare } from "react-icons/fa";
import { LuDiamond } from "react-icons/lu";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaSmileWink, FaGlobe } from "react-icons/fa";
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

// Traductions
const translations = {
  fr: {
    questionsReady: "Les questions sont prêtes !",
    startQuiz: "Commencer le quiz",
    generating: "Patiente... Génération des questions en cours !",
    noQuestions: "Aucune question générée. Vérifie le document ou réessaie.",
    points: "Points",
    nextQuestion: "Question Suivante",
    quizFinished: "Quiz terminé ! Score :",
    selectLanguage: "Choisir la langue :",
    french: "Français",
    yoruba: "Yorùbá"
  },
  yo: {
    questionsReady: "Àwọn ìbéèrè ti ṣetan !",
    startQuiz: "Bẹ̀rẹ̀ ìdánwò",
    generating: "Dúró díẹ̀... Àwọn ìbéèrè ń ṣẹ̀dá !",
    noQuestions: "Kò sí ìbéèrè tí a ṣẹ̀dá. Wo ìwé náà tàbí gbìyànjú lẹ́ẹ̀kan sí i.",
    points: "Àwọn Àmì",
    nextQuestion: "Ìbéèrè Tókàn",
    quizFinished: "Ìdánwò ti parí ! Àmì:",
    selectLanguage: "Yan èdè:",
    french: "Faransé",
    yoruba: "Yorùbá"
  }
};

function Questions({ file }: QuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [showNextButton, setShowNextButton] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'yo'>('fr'); // État pour la langue
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [timer, setTimer] = useState(10);
    const [showNextButton, setShowNextButton] = useState(false);
    const [score, setScore] = useState(0);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [quizStarted, setQuizStarted] = useState(false); // ✅ État du quiz (commencé ou pas)

    const genAI = new GoogleGenerativeAI(
        "AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U"
    );
    const model = genAI.getGenerativeModel({
        model: "models/gemini-2.0-flash",
    });

<<<<<<< HEAD
  const t = translations[selectedLanguage]; // Fonction de traduction

  useEffect(() => {
    async function generateQuestions() {
      try {
        setLoading(true);
        
        // Prompt selon la langue choisie
        const prompts = {
          fr: `
=======
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
>>>>>>> d7a3bba68f5705f99682f6574e16f8714fe84a73
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
`,
<<<<<<< HEAD
          yo: `
Ṣẹ̀dá ìbéèrè ìdánwò mẹ́wàá tí ó dá lórí ìwé tí a pèsè. Fún ìbéèrè kọ̀ọ̀kan, pèsè:
- Ọ̀rọ̀ ìbéèrè náà.
- Ìdáhùn mẹ́rin láti yan lára (pẹ̀lú ìdáhùn tí ó tọ́).
- Tọ́ka sí ìdáhùn tí ó tọ́.
Fun mi ni àkójọ JSON lásán, láì sí \`\`\`json, láì sí àmì Markdown, tàbí ọ̀rọ̀ míràn. Ìtòlẹ́sẹẹsẹ náà gbọdọ̀ jẹ́ gẹ́gẹ́ bí èyí tí ó wà nísàlẹ̀:
[
  {
    "question": "Kí ni èdè ìṣètò tí wọ́n ń lò jùlọ ?",
    "answers": ["Python", "JavaScript", "Java", "C#"],
    "correctAnswer": "JavaScript"
  },
  ...
]
`
        };

        const result = await model.generateContent([
          {
            inlineData: {
              data: file.file,
              mimeType: file.type,
            },
          },
          prompts[selectedLanguage]
        ]);
=======
                ]);
>>>>>>> d7a3bba68f5705f99682f6574e16f8714fe84a73

                let jsonText = result.response.text().trim();
                jsonText = jsonText
                    .replace(/```json/, "")
                    .replace(/```/, "")
                    .trim();

                const parsedQuestions = JSON.parse(jsonText) as Question[];
                setQuestions(parsedQuestions);
                setLoading(false);
            } catch (error) {
                console.error(
                    "Erreur lors de la génération des questions :",
                    error
                );
                setLoading(false);
            }
        }

<<<<<<< HEAD
    generateQuestions();
  }, [file, selectedLanguage]); // Dépendance sur selectedLanguage
=======
        generateQuestions();
    }, [file]);
>>>>>>> d7a3bba68f5705f99682f6574e16f8714fe84a73

    // Timer (uniquement si le quiz a commencé)
    useEffect(() => {
        if (quizStarted && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (quizStarted && timer === 0) {
            setSelectedAnswer(
                questions[currentQuestionIndex]?.correctAnswer || ""
            );
            setShowNextButton(true);
        }
    }, [timer, quizStarted, currentQuestionIndex, questions]);

    // Mélanger les réponses
    useEffect(() => {
        if (questions.length > 0) {
            setShuffledAnswers(
                [...questions[currentQuestionIndex].answers].sort(
                    () => Math.random() - 0.5
                )
            );
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

<<<<<<< HEAD
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimer(30);
      setShowNextButton(false);
    } else {
      alert(`${t.quizFinished} ${score}`);
      setScore(0);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTimer(30);
      setShowNextButton(false);
      setQuizStarted(false);
    }
  };
=======
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
>>>>>>> d7a3bba68f5705f99682f6574e16f8714fe84a73

    const startQuiz = () => {
        setQuizStarted(true);
    };

<<<<<<< HEAD
  const handleLanguageChange = (language: 'fr' | 'yo') => {
    setSelectedLanguage(language);
    setQuestions([]); // Reset questions pour régénérer dans la nouvelle langue
    setLoading(true);
  };

  if (loading) {
    return (
      <div className={Classes.loaderContainer}>
        <div className={Classes.loaderSpinner}></div>
        <p className={Classes.loaderText}>{t.generating}</p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className={Classes.startContainer}>
        <h2>{t.questionsReady} <FaSmileWink size={32} /></h2>
        
        {/* Sélecteur de langue */}
        <div className={Classes.languageSelector}>
          <FaGlobe size={20} style={{ marginRight: '10px' }} />
          <span>{t.selectLanguage}</span>
          <select 
            value={selectedLanguage} 
            onChange={(e) => handleLanguageChange(e.target.value as 'fr' | 'yo')}
            className={Classes.languageSelect}
          >
            <option value="fr">{translations.fr.french}</option>
            <option value="yo">{translations.fr.yoruba}</option>
          </select>
        </div>

        <button className={Classes.startButton} onClick={startQuiz}>
          {t.startQuiz}
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className={Classes.error}>{t.noQuestions}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className={Classes.containerboxgeneral}>
        <div className={Classes.question}>{currentQuestion.question}</div>
        <div className={Classes.timercontainer}>
          <div className={Classes.timercount}>{timer}</div>
          <div className={Classes.points}>{t.points} : {score}</div>
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
            {t.nextQuestion}
          </button>
        )}
      </div>
    </>
  );
=======
    if (loading) {
        return (
            <div className="loaderContainer">
                <div className="loaderSpinner"></div>
                <p className="loaderText">
                    Patiente... Génération des questions en cours !
                </p>
            </div>
        );
    }

    if (!quizStarted) {
        return (
            <div className="startContainer">
                <h2>
                    Les questions sont prêtes ! <FaSmileWink size={32} />
                </h2>
                <button className="startButton" onClick={startQuiz}>
                    Commencer le quiz
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="error">
                Aucune question générée. Vérifie le document ou réessaie.
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <>
            <div className="containerboxgeneral">
                <div className="question">{currentQuestion.question}</div>
                <div className="timercontainer">
                    <div className="timercount">{timer}</div>
                    <div className="points">Points : {score}</div>
                </div>
                <div className="reponsesbox">
                    {shuffledAnswers.map((answer, index) => (
                        <div
                            key={index}
                            className={`${
                                index === 0
                                    ? "reponsesbox1"
                                    : index === 1
                                    ? "reponsesbox2"
                                    : index === 2
                                    ? "reponsesbox3"
                                    : "reponsesbox4"
                            } ${
                                selectedAnswer !== null
                                    ? selectedAnswer === answer
                                        ? answer ===
                                          currentQuestion.correctAnswer
                                            ? "correct"
                                            : "incorrect"
                                        : answer !==
                                          currentQuestion.correctAnswer
                                        ? "incorrect"
                                        : ""
                                    : ""
                            }`}
                            onClick={() => handleAnswerClick(answer)}
                        >
                            <samp>
                                {index === 0 ? (
                                    <BiShapeTriangle />
                                ) : index === 1 ? (
                                    <LuDiamond />
                                ) : index === 2 ? (
                                    <FaCircleNotch />
                                ) : (
                                    <FaVectorSquare />
                                )}
                            </samp>{" "}
                            {answer}
                        </div>
                    ))}
                </div>
                {showNextButton && (
                    <button className="nextButton" onClick={handleNextQuestion}>
                        Question Suivante
                    </button>
                )}
            </div>
        </>
    );
>>>>>>> d7a3bba68f5705f99682f6574e16f8714fe84a73
}

export default Questions;
