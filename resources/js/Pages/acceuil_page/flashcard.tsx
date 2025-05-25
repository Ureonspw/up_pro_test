import Classes from "../styles/flashcard.module.css";
import { GrValidate } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { FaLayerGroup } from "react-icons/fa6";
import { MdDone } from "react-icons/md";
import { useState, useEffect } from "react";

const questions = [
  {
    question: "Qu'est-ce qu'un algorithme ?",
    answer:
      "Un algorithme est une série d'instructions pour résoudre un problème.",
    correct: true,
  },
  {
    question: "Qu'est-ce que le HTML ?",
    answer: "HTML est un langage de balisage utilisé pour créer des pages web.",
    correct: true,
  },
  {
    question: "Qu'est-ce qu'une variable en programmation ?",
    answer:
      "Une variable est un espace de stockage pour des données qui peuvent changer.",
    correct: true,
  },
  {
    question: "Qu'est-ce que le CSS ?",
    answer:
      "CSS est un langage utilisé pour décrire la présentation d'un document HTML.",
    correct: true,
  },
  {
    question: "Qu'est-ce qu'un système d'exploitation ?",
    answer:
      "Un système d'exploitation est un logiciel qui gère le matériel et les logiciels d'un ordinateur.",
    correct: true,
  },
  {
    question: "Qu'est-ce que le cloud computing ?",
    answer:
      "Le cloud computing permet d'accéder à des ressources informatiques via Internet.",
    correct: true,
  },
  {
    question: "Qu'est-ce qu'une base de données ?",
    answer:
      "Une base de données est un système organisé pour stocker, gérer et récupérer des données.",
    correct: true,
  },
  {
    question: "Qu'est-ce que le langage de programmation Python ?",
    answer:
      "Python est un langage de programmation interprété, connu pour sa simplicité et sa lisibilité.",
    correct: true,
  },
  {
    question: "Qu'est-ce qu'un réseau informatique ?",
    answer:
      "Un réseau informatique est un ensemble d'ordinateurs interconnectés qui partagent des ressources.",
    correct: true,
  },
  {
    question: "Qu'est-ce que l'intelligence artificielle ?",
    answer:
      "L'intelligence artificielle est la simulation de l'intelligence humaine par des machines.",
    correct: true,
  },
];

function Flashcard() {
  const [flipped, setFlipped] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalQuestions = questions.length;
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }

    if (correctCount + incorrectCount + 1 === 10) {
      alert("Félicitations, vous avez terminé !");
      setCurrentQuestionIndex(0);
      setCorrectCount(0);
      setIncorrectCount(0);
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

  const { question, answer } = questions[currentQuestionIndex];

  return (
    <>
      <div className={Classes.containerboxg}>
        <div className={Classes.containerboxson1}>
          <div className={Classes.sizebox1}></div>
          <div className={Classes.containerboxson1title}>
            {" "}
            <FaLayerGroup /> <span>Flashcard</span>
          </div>
          <div className={Classes.closebnt}>
            <RxCross2 />{" "}
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
            {" "}
            <RxCross2 />
          </div>
          <div className={Classes.true} onClick={() => handleAnswer(true)}>
            {" "}
            <MdDone />
          </div>
        </div>
      </div>
      <div className={Classes.containerboxinfo}>
        <div className={Classes.repbox}>
          {" "}
          <RxCross2 /> <span>{incorrectCount}</span>
        </div>
        <div className={Classes.containerprogress}>
          <div className={Classes.counter}>
            Question {currentQuestionIndex + 1} sur {totalQuestions}
          </div>

          <div className={Classes.progressContainer}>
            <div
              className={Classes.progressBar}
              style={{ width: `${progressPercentage}%`, backgroundColor: progressPercentage < 50 ? '#f44336' : progressPercentage < 80 ? '#ff9800' : '#4caf50' }}
            >
            </div>
          </div>
        </div>

        <div className={Classes.repbox}>
          {" "}
          <GrValidate /> <span>{correctCount}</span>
        </div>
      </div>
      <div className={Classes.flasharriere1}></div>
      <div className={Classes.flasharriere2}></div>
    </>
  );
}
export default Flashcard;
