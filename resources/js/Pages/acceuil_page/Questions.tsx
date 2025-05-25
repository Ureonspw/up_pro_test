import Classes from "../styles/qcm.module.css";
import { FaCircleNotch } from "react-icons/fa";
import { BiShapeTriangle } from "react-icons/bi";
import { FaVectorSquare } from "react-icons/fa";
import { LuDiamond } from "react-icons/lu";
import { useState, useEffect } from "react";

const questions = [
  {
    question: "Quel est le langage de programmation le plus utilisé pour le développement web?",
    answers: ["Python", "JavaScript", "Java", "C#"],
    correctAnswer: "JavaScript",
  },
  {
    question: "Quel est le système d'exploitation le plus utilisé sur les ordinateurs de bureau?",
    answers: ["Linux", "Windows", "macOS", "Unix"],
    correctAnswer: "Windows",
  },
  {
    question: "Quel est le protocole utilisé pour envoyer des e-mails?",
    answers: ["HTTP", "FTP", "SMTP", "IMAP"],
    correctAnswer: "SMTP",
  },
  {
    question: "Quel est le nom de l'algorithme utilisé pour le tri rapide?",
    answers: ["Tri à bulles", "Tri par insertion", "QuickSort", "Tri fusion"],
    correctAnswer: "QuickSort",
  },
  {
    question: "Quel est le terme pour désigner une erreur dans un programme?",
    answers: ["Bug", "Virus", "Malware", "Trojan"],
    correctAnswer: "Bug",
  },
  {
    question: "Quel est le nom de la technologie de virtualisation développée par VMware?",
    answers: ["Hyper-V", "KVM", "vSphere", "Xen"],
    correctAnswer: "vSphere",
  },
  {
    question: "Quel est le langage de balisage utilisé pour créer des pages web?",
    answers: ["HTML", "CSS", "JavaScript", "XML"],
    correctAnswer: "HTML",
  },
  {
    question: "Quel est le nom du modèle de développement logiciel basé sur des itérations?",
    answers: ["Agile", "Waterfall", "V-Model", "Spiral"],
    correctAnswer: "Agile",
  },
  {
    question: "Quel est le nom de l'outil de gestion de versions le plus populaire?",
    answers: ["Subversion", "Git", "Mercurial", "CVS"],
    correctAnswer: "Git",
  },
  {
    question: "Quel est le terme pour désigner un réseau de machines interconnectées?",
    answers: ["Intranet", "Internet", "Extranet", "LAN"],
    correctAnswer: "Internet",
  },
];

function Questions() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [timer, setTimer] = useState(10);
  const [showNextButton, setShowNextButton] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // Afficher la réponse correcte lorsque le timer atteint 0
      setSelectedAnswer(questions[currentQuestionIndex].correctAnswer);
      setShowNextButton(true); // Afficher le bouton pour passer à la question suivante
    }
  }, [timer, currentQuestionIndex]);

  useEffect(() => {
    // Mélanger les réponses lorsque la question actuelle change
    setShuffledAnswers([...questions[currentQuestionIndex].answers].sort(() => Math.random() - 0.5));
  }, [currentQuestionIndex]);

  const handleAnswerClick = (answer: number | string) => {
    // Vérifier si la réponse correcte est déjà affichée
    if (selectedAnswer === null) {
        setSelectedAnswer(answer);
        setTimer(0); // Arrêter le timer si une réponse est sélectionnée
        setShowNextButton(true); // Afficher le bouton pour passer à la question suivante

        // Mettre à jour le score si la réponse est correcte
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore((prevScore) => prevScore + 20); // Ajouter 20 points pour une réponse correcte
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
      // Logique pour terminer le quiz
      alert("Quiz terminé ! Score : " + score);
      // Réinitialiser pour recommencer le quiz
      setScore(0);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTimer(10);
      setShowNextButton(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className={Classes.containerboxgeneral}>
        <div className={Classes.question}>
          {currentQuestion.question}
        </div>
        <div className={Classes.timercontainer}>
          <div className={Classes.timercount}>{timer}</div>
          <div className={Classes.points}> Points : {score}</div>
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
