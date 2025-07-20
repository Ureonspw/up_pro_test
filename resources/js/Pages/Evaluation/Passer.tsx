import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BiShapeTriangle } from "react-icons/bi";
import { LuDiamond } from "react-icons/lu";
import { FaCircleNotch, FaVectorSquare } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import styles from '../../../css/evaluation/examen.module.css';

interface Reponse {
    id: number;
    reponse: string;
    est_correcte: boolean;
    ordre: number;
}

interface Question {
    id: number;
    question: string;
    type: string;
    points: number;
    ordre: number;
    reponses: Reponse[];
}

interface Examen {
    id: number;
    titre: string;
    description: string;
    duree_minutes: number;
    niveau: string;
}

interface Participation {
    id: number;
    score_total: number;
    date_debut_examen: string;
    examen: Examen;
}

interface Props extends PageProps {
    participation: Participation & {
        examen: Examen & {
            questions: Question[];
        };
    };
}

export default function PasserExamen({ participation }: Props) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [reponses, setReponses] = useState<{[key: number]: number[]}>({});
    const [tempsRestant, setTempsRestant] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const questions = participation.examen.questions;

    useEffect(() => {
        // Initialiser les réponses
        const initialReponses: {[key: number]: number[]} = {};
        questions.forEach(q => {
            initialReponses[q.id] = [];
        });
        setReponses(initialReponses);

        // Démarrer le timer
        const startTime = new Date(participation.date_debut_examen).getTime();
        const endTime = startTime + (participation.examen.duree_minutes * 60 * 1000);
        
        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTempsRestant(remaining);
            
            if (remaining <= 0) {
                soumettreExamen();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTemps = (secondes: number) => {
        const minutes = Math.floor(secondes / 60);
        const secs = secondes % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleReponseChange = (questionId: number, reponseId: number, checked: boolean) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return;

        setReponses(prev => {
            const currentReponses = prev[questionId] || [];
            
            if (question.type === 'choix_unique' || question.type === 'vrai_faux') {
                return { ...prev, [questionId]: checked ? [reponseId] : [] };
            } else if (question.type === 'choix_multiple') {
                if (checked) {
                    return { ...prev, [questionId]: [...currentReponses, reponseId] };
                } else {
                    return { ...prev, [questionId]: currentReponses.filter(id => id !== reponseId) };
                }
            }
            
            return prev;
        });
    };

    const soumettreExamen = async () => {
        setLoading(true);
        
        try {
            const reponsesArray = [];
            
            // Pour chaque question, créer les entrées de réponses appropriées
            questions.forEach(question => {
                const reponseIds = reponses[question.id] || [];
                
                if (reponseIds.length > 0) {
                    // Pour les questions à choix multiples, créer une entrée pour chaque réponse
                    reponseIds.forEach(reponseId => {
                        if (reponseId && reponseId > 0) {
                            reponsesArray.push({
                                id_question: question.id,
                                id_reponse: reponseId
                            });
                        }
                    });
                } else {
                    // Si aucune réponse n'est sélectionnée, ajouter une réponse vide
                    reponsesArray.push({
                        id_question: question.id,
                        id_reponse: null
                    });
                }
            });

            console.log('Réponses à soumettre:', reponsesArray);
            console.log('Nombre de réponses:', reponsesArray.length);

            // Utiliser Inertia.js pour la soumission
            router.post(route('etudiant.evaluation.soumettre'), {
                reponses: reponsesArray
            }, {
                onSuccess: () => {
                    // La redirection sera gérée par le contrôleur
                    console.log('Examen soumis avec succès');
                },
                onError: (errors) => {
                    console.error('Erreurs de soumission:', errors);
                    alert('Erreur lors de la soumission de l\'examen: ' + (errors.message || 'Erreur inconnue'));
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    const question = questions[currentQuestion];
    const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
    const totalTime = participation.examen.duree_minutes * 60;
    const timeProgress = tempsRestant ? ((totalTime - tempsRestant) / totalTime) * 100 : 0;

    return (
        <>
            <Head title={`Examen: ${participation.examen.titre}`} />
            
            <div className={styles.containerboxgeneral}>
                {/* Header avec titre et progression */}
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.examTitle}>{participation.examen.titre}</h1>
                        <div className={styles.progressInfo}>
                            Question {currentQuestion + 1} sur {questions.length}
                        </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    
                    {/* Bouton de retour */}
                    <button
                        onClick={() => router.visit('/')}
                        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                        title="Retour au menu principal"
                    >
                        <IoArrowBackOutline size={24} color="#2e7d32" />
                    </button>
                </div>

                {/* Timer visuel avec barre qui se raccourcit */}
                <div className={styles.timerSection}>
                    <div className={styles.timerContainer}>
                        <div className={styles.timerCircle}>
                            <div className={styles.timerText}>
                                {tempsRestant !== null ? formatTemps(tempsRestant) : '--:--'}
                            </div>
                            <div className={styles.timerProgress}>
                                <div 
                                    className={styles.timerProgressFill}
                                    style={{ 
                                        transform: `rotate(${timeProgress * 3.6}deg)`,
                                        background: timeProgress > 80 ? '#dc3545' : timeProgress > 60 ? '#ffc107' : '#28a745'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className={styles.questionSection}>
                    <div className={styles.question}>
                        {question.question}
                    </div>
                </div>
                
                {/* Réponses */}
                <div className={styles.reponsesbox}>
                    {question.reponses.map((reponse, index) => (
                        <div
                            key={reponse.id}
                            className={`${styles[`reponsesbox${index + 1}`]} ${
                                (reponses[question.id] || []).includes(reponse.id) ? styles.selected : ''
                            }`}
                            onClick={() => handleReponseChange(
                                question.id, 
                                reponse.id, 
                                !(reponses[question.id] || []).includes(reponse.id)
                            )}
                        >
                            <samp>
                                {index === 0 ? <BiShapeTriangle /> : 
                                 index === 1 ? <LuDiamond /> : 
                                 index === 2 ? <FaCircleNotch /> : 
                                 <FaVectorSquare />}
                            </samp>
                            {reponse.reponse}
                        </div>
                    ))}
                </div>
                
                {/* Navigation en haut à droite */}
                <div className={styles.navigation}>
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className={styles.navButton}
                    >
                        ← Précédent
                    </button>

                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            className={styles.nextButton}
                        >
                            Suivant →
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowConfirmSubmit(true)}
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? 'Soumission...' : 'Terminer l\'examen'}
                        </button>
                    )}
                </div>

                {/* Indicateur de réponses sélectionnées */}
                <div className={styles.selectionIndicator}>
                    {Object.keys(reponses).filter(qId => reponses[parseInt(qId)].length > 0).length} / {questions.length} questions répondues
                </div>

                {/* Modal de confirmation */}
                {showConfirmSubmit && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>Confirmer la soumission</h3>
                            <p>Êtes-vous sûr de vouloir soumettre votre examen ? 
                               Vous ne pourrez plus modifier vos réponses.</p>
                            <div className={styles.modalButtons}>
                                <button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className={styles.cancelButton}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        setShowConfirmSubmit(false);
                                        soumettreExamen();
                                    }}
                                    disabled={loading}
                                    className={styles.confirmButton}
                                >
                                    {loading ? 'Soumission...' : 'Soumettre'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 