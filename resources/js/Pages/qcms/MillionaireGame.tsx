import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FaTrophy, FaGlobeAfrica, FaLightbulb } from "react-icons/fa";
import "../../../css/qcms/qcm.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Spinner() {
    return (
        <span
            style={{
                marginLeft: 10,
                display: "inline-block",
                verticalAlign: "middle",
            }}
        >
            <svg width="22" height="22" viewBox="0 0 50 50">
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#247a3b"
                    strokeWidth="5"
                    strokeDasharray="31.4 31.4"
                    strokeLinecap="round"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="0.8s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </span>
    );
}

interface MillionaireQuestion {
    question: string;
    answers: string[];
    correctAnswer: string;
}

const PALIER_AMOUNTS = [
    100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000,
];

// Supprimer la déclaration et l'initialisation de heartbeatAudio
// Supprimer le useEffect qui gérait le son de battement de cœur

export default function MillionaireGame() {
    const [mode, setMode] = useState<"general" | "theme" | null>(null);
    const [theme, setTheme] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [loading, setLoading] = useState<"general" | "theme" | null>(null);
    const [questions, setQuestions] = useState<MillionaireQuestion[] | null>(
        null
    );
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState<string | null>(null);

    // --- LOGIQUE DU JEU (états déplacés en haut) ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showNext, setShowNext] = useState(false);
    const [timer, setTimer] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [amountWon, setAmountWon] = useState(0);
    const [palierSecured, setPalierSecured] = useState(0);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

    // Shuffle answers on question change
    useEffect(() => {
        if (questions && questions.length > 0) {
            const currentAnswers = questions[currentQuestionIndex].answers;
            setShuffledAnswers(
                [...currentAnswers].sort(() => Math.random() - 0.5)
            );
        }
    }, [currentQuestionIndex, questions]);

    // Empêcher le scroll quand le jeu est actif
    useEffect(() => {
        if (questions && !gameOver && !won) {
            document.body.classList.add("millionaire-game-active");
        } else {
            document.body.classList.remove("millionaire-game-active");
        }

        return () => {
            document.body.classList.remove("millionaire-game-active");
        };
    }, [questions, gameOver, won]);

    // Palier sécurisé (après 5 et 10 questions)
    useEffect(() => {
        if (currentQuestionIndex === 4) setPalierSecured(PALIER_AMOUNTS[4]);
        if (currentQuestionIndex === 9) setPalierSecured(PALIER_AMOUNTS[9]);
    }, [currentQuestionIndex]);

    // Timer décrémenté chaque seconde
    useEffect(() => {
        if (
            (mode === "general" || (mode === "theme" && gameStarted)) &&
            questions &&
            timer > 0 &&
            selectedAnswer === null &&
            !gameOver &&
            !won
        ) {
            const interval = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && selectedAnswer === null && questions) {
            handleAnswer(null); // Temps écoulé
        }
    }, [timer, selectedAnswer, gameOver, won, mode, gameStarted, questions]);

    function handleAnswer(answer: string | null) {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answer);
        setShowNext(true);
        if (!questions) return;
        const isCorrect =
            answer === questions[currentQuestionIndex].correctAnswer;
        if (isCorrect) {
            setAmountWon(PALIER_AMOUNTS[currentQuestionIndex]);
            if (currentQuestionIndex === questions.length - 1) {
                setWon(true);
            }
        } else {
            setGameOver(true);
        }
    }

    function handleNext() {
        if (questions && currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((i) => i + 1);
            setSelectedAnswer(null);
            setShowNext(false);
            setTimer(30);
        }
    }

    function handleRestart() {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowNext(false);
        setTimer(30);
        setGameOver(false);
        setWon(false);
        setAmountWon(0);
        setPalierSecured(0);
        setQuestions(null);
        setQuestionsLoading(false);
        setQuestionsError(null);
        setGameStarted(false);
        setMode(null);
        setLoading(null); // Ajouté pour corriger le bug du spinner bloqué
    }

    // Ajout d'une fonction de retour au menu
    function handleBackToMenu() {
        if (window.confirm("Voulez-vous vraiment quitter la partie ?")) {
            handleRestart();
        }
    }

    // Génération des questions via Gemini
    useEffect(() => {
        if (
            (mode === "general" || (mode === "theme" && gameStarted)) &&
            !questions &&
            !questionsLoading
        ) {
            setQuestionsLoading(true);
            setQuestionsError(null);
            const genAI = new GoogleGenerativeAI(
                "AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U"
            );
            const model = genAI.getGenerativeModel({
                model: "models/gemini-2.0-flash",
            });
            let prompt = "";
            if (mode === "general") {
                prompt = `Génère 10 questions QCM de culture générale façon "Qui veut gagner des millions". Pour chaque question, donne :\n- Le texte de la question.\n- Quatre réponses au choix (y compris la bonne réponse).\n- Indique la réponse correcte.\nDonne uniquement le tableau JSON brut, sans balises Markdown, ni texte supplémentaire. Format : [ { "question": "...", "answers": ["...", ...], "correctAnswer": "..." }, ... ]`;
            } else if (mode === "theme") {
                prompt = `Génère 10 questions QCM sur le thème suivant : "${theme}" façon "Qui veut gagner des millions". Pour chaque question, donne :\n- Le texte de la question.\n- Quatre réponses au choix (y compris la bonne réponse).\n- Indique la réponse correcte.\nDonne uniquement le tableau JSON brut, sans balises Markdown, ni texte supplémentaire. Format : [ { "question": "...", "answers": ["...", ...], "correctAnswer": "..." }, ... ]`;
            }
            (async () => {
                try {
                    // Timeout de 30 secondes
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout")), 30000)
                    );

                    const result = (await Promise.race([
                        model.generateContent([prompt]),
                        timeoutPromise,
                    ])) as any;

                    let jsonText = result.response.text().trim();
                    jsonText = jsonText
                        .replace(/```json/, "")
                        .replace(/```/, "")
                        .trim();
                    console.log("Réponse Gemini brute :", jsonText);
                    try {
                        const parsedQuestions = JSON.parse(
                            jsonText
                        ) as MillionaireQuestion[];
                        console.log("Questions parsées :", parsedQuestions);

                        // Validation des questions
                        if (
                            !Array.isArray(parsedQuestions) ||
                            parsedQuestions.length === 0
                        ) {
                            throw new Error("Aucune question générée");
                        }

                        // Vérifier que chaque question a les bonnes propriétés
                        const validQuestions = parsedQuestions.filter(
                            (q) =>
                                q.question &&
                                Array.isArray(q.answers) &&
                                q.answers.length === 4 &&
                                q.correctAnswer &&
                                q.answers.includes(q.correctAnswer)
                        );

                        if (validQuestions.length < 10) {
                            throw new Error(
                                `Seulement ${validQuestions.length} questions valides générées`
                            );
                        }

                        setQuestions(validQuestions.slice(0, 10));
                    } catch (err) {
                        console.error("Erreur de parsing JSON :", err);
                        setQuestionsError(
                            "Erreur lors du parsing des questions. Veuillez réessayer."
                        );
                    }
                } catch (err) {
                    console.error("Erreur API Gemini:", err);
                    setQuestionsError(
                        "Erreur lors de la génération des questions. Veuillez réessayer. Si le problème persiste, contactez l'administrateur."
                    );
                } finally {
                    setQuestionsLoading(false);
                }
            })();
        }
    }, [mode, gameStarted, theme, questions, questionsLoading]);

    // Menu principal
    if (!mode) {
        return (
            <AuthenticatedLayout>
                <div className="millionaire-bg">
                    <div className="millionaire-fade-in millionaire-menu-panel">
                        <div className="millionaire-title-glow">
                            <FaTrophy
                                style={{
                                    marginRight: 16,
                                    color: "#FFD700",
                                    filter: "drop-shadow(0 0 8px #FFD700)",
                                }}
                            />
                            Qui veut gagner des millions ?
                        </div>
                        <div className="millionaire-menu-btns">
                            <button
                                className={
                                    "millionaire-btn-glow" +
                                    (loading === "general"
                                        ? " millionaire-choice-btn-loading"
                                        : "")
                                }
                                onClick={() => {
                                    setLoading("general");
                                    setTimeout(() => setMode("general"), 350);
                                }}
                                tabIndex={0}
                                disabled={!!loading}
                            >
                                <FaGlobeAfrica style={{ color: "#FFD700" }} />{" "}
                                Culture générale
                                {loading === "general" && <Spinner />}
                            </button>
                            <button
                                className={
                                    "millionaire-btn-glow" +
                                    (loading === "theme"
                                        ? " millionaire-choice-btn-loading"
                                        : "")
                                }
                                onClick={() => {
                                    setLoading("theme");
                                    setTimeout(() => setMode("theme"), 350);
                                }}
                                tabIndex={0}
                                disabled={!!loading}
                            >
                                <FaLightbulb style={{ color: "#FFD700" }} />{" "}
                                Thème spécifique
                                {loading === "theme" && <Spinner />}
                            </button>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Saisie du thème si mode 'theme'
    if (mode === "theme" && !gameStarted) {
        return (
            <AuthenticatedLayout>
                <div className="millionaire-bg">
                    <div className="millionaire-fade-in millionaire-menu-panel">
                        <div className="millionaire-title-glow">
                            <FaLightbulb
                                style={{
                                    marginRight: 12,
                                    color: "#FFD700",
                                    filter: "drop-shadow(0 0 8px #FFD700)",
                                }}
                            />
                            Choisis ton thème !
                        </div>
                        <input
                            type="text"
                            placeholder="Ex : Histoire de l'Afrique, Mathématiques, etc."
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="millionaire-theme-input"
                            autoFocus
                        />
                        <button
                            className={
                                "millionaire-btn-glow" +
                                (theme.trim()
                                    ? " millionaire-choice-btn-selected"
                                    : "")
                            }
                            disabled={!theme.trim()}
                            onClick={() => setGameStarted(true)}
                            style={{ marginTop: 12 }}
                        >
                            Lancer le jeu
                        </button>
                        <button
                            className="millionaire-back-btn"
                            onClick={handleRestart}
                            style={{ marginTop: 8 }}
                        >
                            Retour au menu
                        </button>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Loader de génération des questions
    if (
        (mode === "general" || (mode === "theme" && gameStarted)) &&
        questionsLoading
    ) {
        return (
            <AuthenticatedLayout>
                <div className="millionaire-bg">
                    <div className="millionaire-fade-in millionaire-menu-panel">
                        <Spinner />
                        <div className="millionaire-loader-text">
                            Génération des questions en cours...
                        </div>
                        <button
                            className="millionaire-back-btn"
                            onClick={handleRestart}
                            style={{ marginTop: 18 }}
                        >
                            Retour au menu
                        </button>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Erreur de génération
    if (questionsError) {
        return (
            <AuthenticatedLayout>
                <div className="millionaire-bg">
                    <div className="millionaire-fade-in millionaire-menu-panel">
                        <div className="millionaire-error-text">
                            {questionsError}
                        </div>
                        <button
                            className="millionaire-btn-glow"
                            onClick={() => {
                                setQuestions(null);
                                setQuestionsError(null);
                                setQuestionsLoading(false);
                            }}
                        >
                            Réessayer
                        </button>
                        <button
                            className="millionaire-back-btn"
                            onClick={handleRestart}
                            style={{ marginTop: 8 }}
                        >
                            Retour au menu
                        </button>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Lancer le jeu (affichage principal)
    if (
        (mode === "general" || (mode === "theme" && gameStarted)) &&
        questions
    ) {
        const currentQ = questions[currentQuestionIndex];
        return (
            <AuthenticatedLayout>
                <div className="millionaire-bg">
                    <div className="millionaire-game-panel">
                        {/* Branche de gain à droite */}
                        <div className="millionaire-paliers-panel">
                            <ul className="millionaire-paliers-list">
                                {PALIER_AMOUNTS.slice()
                                    .reverse()
                                    .map((amount, idx) => {
                                        const originalIdx =
                                            PALIER_AMOUNTS.length - 1 - idx;
                                        return (
                                            <li
                                                key={amount}
                                                className={
                                                    "millionaire-palier-item" +
                                                    (originalIdx ===
                                                        currentQuestionIndex &&
                                                    !gameOver &&
                                                    !won
                                                        ? " millionaire-palier-active"
                                                        : "") +
                                                    ([4, 9].includes(
                                                        originalIdx
                                                    )
                                                        ? " millionaire-palier-secured"
                                                        : "") +
                                                    (originalIdx <
                                                    currentQuestionIndex
                                                        ? " millionaire-palier-passed"
                                                        : "")
                                                }
                                            >
                                                {amount
                                                    .toLocaleString("fr-FR", {
                                                        maximumFractionDigits: 0,
                                                    })
                                                    .replace(/\s/g, " ")}{" "}
                                                FCFA
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                        {/* Zone principale façon quiz PDF */}
                        <div className="containerboxgeneral">
                            <div className="question">{currentQ.question}</div>
                            <div className="timercontainer">
                                <div className="timercount">{timer}</div>
                                <div className="points">
                                    Gain :{" "}
                                    {amountWon
                                        .toLocaleString("fr-FR", {
                                            maximumFractionDigits: 0,
                                        })
                                        .replace(/\s/g, " ")}{" "}
                                    FCFA
                                </div>
                            </div>
                            <div className="reponsesbox">
                                {shuffledAnswers.map((answer, idx) => (
                                    <div
                                        key={idx}
                                        className={
                                            (idx === 0
                                                ? "reponsesbox1"
                                                : idx === 1
                                                ? "reponsesbox2"
                                                : idx === 2
                                                ? "reponsesbox3"
                                                : "reponsesbox4") +
                                            (selectedAnswer !== null
                                                ? answer ===
                                                  currentQ.correctAnswer
                                                    ? " correct"
                                                    : answer === selectedAnswer
                                                    ? " incorrect"
                                                    : ""
                                                : "")
                                        }
                                        onClick={() =>
                                            selectedAnswer === null &&
                                            !gameOver &&
                                            !won &&
                                            handleAnswer(answer)
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                if (
                                                    selectedAnswer === null &&
                                                    !gameOver &&
                                                    !won
                                                ) {
                                                    handleAnswer(answer);
                                                }
                                            }
                                        }}
                                        tabIndex={
                                            selectedAnswer === null &&
                                            !gameOver &&
                                            !won
                                                ? 0
                                                : -1
                                        }
                                        role="button"
                                        aria-label={`Réponse ${
                                            idx + 1
                                        }: ${answer}`}
                                    >
                                        {answer}
                                    </div>
                                ))}
                            </div>
                            {/* Navigation / Fin de partie */}
                            {gameOver && (
                                <div className="millionaire-end-panel millionaire-end-lose">
                                    Mauvaise réponse !<br />
                                    Tu perds tout.
                                    <br />
                                    <div style={{ marginTop: 18 }}>
                                        <button
                                            className="millionaire-replay-btn"
                                            onClick={handleRestart}
                                        >
                                            Rejouer
                                        </button>
                                        <button
                                            className="millionaire-back-btn"
                                            onClick={handleRestart}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Retour au menu
                                        </button>
                                    </div>
                                </div>
                            )}
                            {won && (
                                <div className="millionaire-end-panel millionaire-end-win">
                                    Félicitations !<br />
                                    Tu as gagné{" "}
                                    <b>{amountWon.toLocaleString()} €</b>
                                    <div style={{ marginTop: 18 }}>
                                        <button
                                            className="millionaire-replay-btn"
                                            onClick={handleRestart}
                                        >
                                            Rejouer
                                        </button>
                                        <button
                                            className="millionaire-back-btn"
                                            onClick={handleRestart}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Retour au menu
                                        </button>
                                    </div>
                                </div>
                            )}
                            {!gameOver &&
                                !won &&
                                showNext &&
                                currentQuestionIndex < questions.length - 1 && (
                                    <div style={{ marginTop: 18 }}>
                                        <button
                                            className="millionaire-next-btn"
                                            onClick={handleNext}
                                        >
                                            Question suivante
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return null;
}
