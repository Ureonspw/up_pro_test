import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from "../../../../css/resumer_page/component/Summary.module.css";
import Loader from "./Loader";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FaBookOpen, FaLightbulb, FaCode, FaListUl, FaQuestionCircle } from "react-icons/fa";
import { MdTopic, MdSchool } from "react-icons/md";

interface SummaryProps {
  file: {
    file: string;
    type: string;
    imageUrl: string;
    name: string;
    size: number;
  };
}

interface SummarySection {
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface LessonSuggestion {
  title: string;
  description: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  topics: string[];
  estimatedTime: string;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function generatePdf(sections: SummarySection[], fileName: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]); // A4
  
  const { width, height } = currentPage.getSize();
  const margin = 50;
  const maxY = height - margin;
  const minY = margin + 30;

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const sectionTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const codeFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const footerFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let y = maxY;

  // Fonction pour créer une nouvelle page
  const createNewPage = () => {
    currentPage = pdfDoc.addPage([595, 842]);
    y = maxY;
    // Pied de page
    currentPage.drawText('Fiche de revision - Page ' + (pdfDoc.getPageCount()), {
      x: margin,
      y: margin - 10,
      size: 8,
      font: footerFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  // Fonction pour vérifier l'espace et créer une page si nécessaire
  const checkSpace = (neededSpace: number) => {
    if (y - neededSpace < minY) {
      createNewPage();
    }
  };

  // Fonction pour diviser une ligne longue en plusieurs lignes
  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Mot trop long, on le coupe
          lines.push(word);
        }
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  // En-tête principal
  currentPage.drawText('FICHE DE RÉVISION', {
    x: margin,
    y: y,
    size: 20,
    font: titleFont,
    color: rgb(0.1, 0.7, 0.3),
  });
  y -= 30;

  // Nom du fichier (limité à 60 caractères)
  const displayFileName = fileName.length > 60 ? fileName.substring(0, 60) + '...' : fileName;
  currentPage.drawText(`Document: ${displayFileName}`, {
    x: margin,
    y: y,
    size: 12,
    font: contentFont,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 40;

  // Traiter chaque section
  sections.forEach((section, sectionIndex) => {
    checkSpace(60); // Espace minimum pour une section

    // Ligne de séparation
    if (sectionIndex > 0) {
      currentPage.drawLine({
        start: { x: margin, y: y + 10 },
        end: { x: width - margin, y: y + 10 },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
      });
      y -= 20;
    }

    // Titre de section avec préfixe
    const sectionPrefixes: { [key: string]: string } = {
      'définitions': '[DEF]',
      'définition': '[DEF]',
      'concepts': '[CONCEPT]',
      'concept': '[CONCEPT]', 
      'méthodologie': '[METHOD]',
      'methodologie': '[METHOD]',
      'exemples': '[EXEMPLES]',
      'exemple': '[EXEMPLES]',
      'astuces': '[ASTUCES]',
      'astuce': '[ASTUCES]',
      'code': '[CODE]',
      'algorithme': '[CODE]',
      'formules': '[FORMULES]',
      'formule': '[FORMULES]'
    };

    const prefixKey = Object.keys(sectionPrefixes).find(key => 
      section.title.toLowerCase().includes(key)
    );
    const sectionPrefix = prefixKey ? sectionPrefixes[prefixKey] : '[SECTION]';

    currentPage.drawText(`${sectionPrefix} ${section.title.toUpperCase()}`, {
      x: margin,
      y: y,
      size: 14,
      font: sectionTitleFont,
      color: rgb(0.2, 0.5, 0.3),
    });
    y -= 25;

    // Contenu de la section
    const contentLines = section.content.split('\n').filter(line => line.trim());
    
    contentLines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      checkSpace(20); // Espace pour une ligne

      // Détecter si c'est du code
      const isCode = line.startsWith('  ') || 
                    line.includes('{') || 
                    line.includes('}') || 
                    line.includes('function') || 
                    line.includes('class') ||
                    line.includes('SELECT') ||
                    line.includes('INSERT') ||
                    line.includes('UPDATE') ||
                    line.includes('DELETE');

             if (isCode) {
         // Limiter la longueur du code (80 caractères max)
         const codeToDisplay = trimmedLine.length > 80 ? trimmedLine.substring(0, 80) + '...' : trimmedLine;
         
         // Fond gris pour le code
         currentPage.drawRectangle({
           x: margin - 5,
           y: y - 15,
           width: width - 2 * margin + 10,
           height: 18,
           color: rgb(0.95, 0.95, 0.95),
         });
         
         // Ligne verte à gauche pour le code
         currentPage.drawRectangle({
           x: margin - 5,
           y: y - 15,
           width: 3,
           height: 18,
           color: rgb(0.1, 0.7, 0.3),
         });

         currentPage.drawText(codeToDisplay, {
           x: margin + 10,
           y: y,
           size: 10,
           font: codeFont,
           color: rgb(0.2, 0.2, 0.2),
         });
             } else {
         // Texte normal avec indentation pour les puces
         const isListItem = trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ');
         const textX = isListItem ? margin + 15 : margin;
         const displayText = isListItem ? '• ' + trimmedLine.substring(2) : trimmedLine;
         const maxTextWidth = width - 2 * margin - (isListItem ? 15 : 0);

         // Diviser le texte en lignes si nécessaire
         const wrappedLines = wrapText(displayText, maxTextWidth, contentFont, 11);
         
         wrappedLines.forEach((wrappedLine, lineIndex) => {
           if (lineIndex > 0) {
             checkSpace(18);
           }
           
           currentPage.drawText(wrappedLine, {
             x: textX,
             y: y,
             size: 11,
             font: contentFont,
             color: rgb(0.1, 0.1, 0.1),
           });
           
           y -= 18;
         });
         
         // Ajuster y pour ne pas avoir de double soustraction
         y += 18;
       }
       y -= 18;
    });

    y -= 15; // Espace entre sections
  });

  // Pied de page final
  currentPage.drawText(`Genere le ${new Date().toLocaleDateString('fr-FR')} - e-Learning`, {
    x: margin,
    y: margin - 10,
    size: 8,
    font: footerFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

function Summary({ file }: SummaryProps) {
  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
  const [summary, setSummary] = useState<string>("");
  const [parsedSections, setParsedSections] = useState<SummarySection[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [lessonSuggestions, setLessonSuggestions] = useState<LessonSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
  
  // Fonction pour tester la connexion API
  const testApiConnection = async () => {
    try {
      console.log('🔍 Test de connexion API...');
      const testResult = await model.generateContent("Test de connexion");
      console.log('✅ API fonctionnelle');
      return true;
    } catch (error) {
      console.log('❌ API non accessible:', error);
      return false;
    }
  };
  
  const handleSave = async () => {
    if (!parsedSections.length) {
      console.log('Aucune section à sauvegarder');
      return;
    }
  
    console.log('Génération du PDF avec', parsedSections.length, 'sections');
    console.log('Sections:', parsedSections);
    
    try {
      const pdfBlob = await generatePdf(parsedSections, file.name);
      const pdfBase64 = await blobToBase64(pdfBlob);
      localStorage.setItem('pdfBase64', pdfBase64);

      const pdfUrl = URL.createObjectURL(pdfBlob);
      localStorage.setItem('pdfUrl', pdfUrl);
      
      console.log('PDF généré avec succès');
      window.location.href = '/enregistrement_page';
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

  const getIconForSection = (title: string): React.ReactNode => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('définition') || lowerTitle.includes('definition')) {
      return <FaBookOpen />;
    } else if (lowerTitle.includes('concept') || lowerTitle.includes('notion')) {
      return <MdTopic />;
    } else if (lowerTitle.includes('méthodologie') || lowerTitle.includes('methode')) {
      return <MdSchool />;
    } else if (lowerTitle.includes('exemple') || lowerTitle.includes('application')) {
      return <FaListUl />;
    } else if (lowerTitle.includes('astuce') || lowerTitle.includes('conseil')) {
      return <FaLightbulb />;
    } else if (lowerTitle.includes('code') || lowerTitle.includes('algorithme')) {
      return <FaCode />;
    } else {
      return <FaQuestionCircle />;
    }
  };

  const parseSummaryContent = (content: string): SummarySection[] => {
    const sections: SummarySection[] = [];
    const lines = content.split('\n');
    let currentSection: SummarySection | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Détecter les titres de section (lignes qui se terminent par : ou qui sont en majuscules/importantes)
      if (
        (trimmedLine.length > 0 && trimmedLine.length < 50 && 
         (trimmedLine.endsWith(':') || /^[A-Z][a-zA-ZÀ-ÿ\s]+$/.test(trimmedLine))) ||
        ['Définitions', 'Concepts clés', 'Concepts cles', 'Méthodologie', 'Methodologie', 
         'Exemples', 'Astuces', 'Points essentiels', 'Résumé', 'Resume', 'Introduction',
         'Objectifs', 'Conclusion', 'Code', 'Algorithmes', 'Formules'].some(keyword => 
          trimmedLine.toLowerCase().includes(keyword.toLowerCase()))
      ) {
        // Sauvegarder la section précédente si elle existe
        if (currentSection && currentSection.content.trim()) {
          sections.push(currentSection);
        }
        
        // Créer une nouvelle section
        const cleanTitle = trimmedLine.replace(':', '').trim();
        currentSection = {
          title: cleanTitle,
          content: '',
          icon: getIconForSection(cleanTitle)
        };
      } else if (currentSection && trimmedLine) {
        // Ajouter le contenu à la section actuelle
        currentSection.content += line + '\n';
      }
    }
    
    // Ajouter la dernière section
    if (currentSection && currentSection.content.trim()) {
      sections.push(currentSection);
    }
    
    // Si aucune section n'a été détectée, créer une section par défaut
    if (sections.length === 0) {
      sections.push({
        title: 'Contenu du résumé',
        content: content,
        icon: <FaBookOpen />
      });
    }
    
    return sections;
  };
  
  async function getSummary() {
    setStatus("loading");

    try {
      console.log('🔄 Début de la génération du résumé...');
      console.log('📄 Fichier:', {
        name: file.name,
        type: file.type,
        size: file.file.length,
        preview: file.file.substring(0, 100) + '...'
      });

      // Vérifier que le fichier est valide
      if (!file.file || file.file.length === 0) {
        throw new Error('Fichier vide ou invalide');
      }

      // Vérifier la taille du fichier (limite approximative : 10MB en base64)
      if (file.file.length > 10 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux (max 10MB). Veuillez utiliser un fichier plus petit.');
      }

      // Vérifier le type MIME
      if (!file.type || (!file.type.includes('pdf') && !file.type.includes('image'))) {
        throw new Error('Type de fichier non supporté: ' + file.type + '. Utilisez un PDF ou une image.');
      }

      console.log('🤖 Appel API Google Generative AI...');
      
      const result = await model.generateContent([
        {
          inlineData: {
            data: file.file,
            mimeType: file.type,
          },
        },
        `
        Crée une fiche de révision complète et bien structurée basée sur le contenu du document.

        STRUCTURE OBLIGATOIRE :
        1. Commence par "Définitions :" pour les termes importants
        2. Puis "Concepts clés :" pour les idées principales
        3. Ensuite "Méthodologie :" pour les processus et méthodes
        4. Ajoute "Exemples :" avec des cas concrets
        5. Termine par "Astuces :" avec des conseils pratiques

        RÈGLES DE FORMATAGE :
        - Utilise EXACTEMENT ces titres suivis de deux points
        - Sépare chaque section par une ligne vide
        - Utilise des phrases courtes et claires
        - Pour le code, utilise une indentation propre
        - Évite les symboles de mise en forme (**, *, etc.)
        - Sois synthétique et précis

        EXEMPLE DE STRUCTURE :
        Définitions :
        [contenu des définitions]

        Concepts clés :
        [contenu des concepts]

        Méthodologie :
        [contenu de la méthodologie]

        Exemples :
        [exemples concrets]

        Astuces :
        [conseils pratiques]
        `
      ]);
      
      console.log('✅ Réponse reçue de l\'API');
      
      const responseText = result.response.text();
      
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Réponse vide de l\'API');
      }

      console.log('📝 Contenu généré:', responseText.substring(0, 200) + '...');
      
      setSummary(responseText);
      const sections = parseSummaryContent(responseText);
      setParsedSections(sections);
      
      console.log('🎯 Sections parsées:', sections.length, 'sections trouvées');
      
      setStatus("success");
    } catch (error: any) {
      console.error('❌ Erreur lors de la génération du résumé:', error);
      console.error('📊 Détails de l\'erreur:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause
      });
      
      // Analyser le type d'erreur pour donner un message plus précis
      let userMessage = "Une erreur inattendue s'est produite. ";
      
      if (error.message?.includes('API key') || error.message?.includes('401')) {
        console.error('🔑 Problème de clé API');
        userMessage = "Problème d'authentification API. Veuillez réessayer plus tard.";
      } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        console.error('📊 Quota API dépassé');
        userMessage = "Limite de quota atteinte. Veuillez réessayer dans quelques minutes.";
      } else if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('NetworkError')) {
        console.error('🌐 Problème de réseau');
        userMessage = "Problème de connexion. Vérifiez votre connexion internet et réessayez.";
      } else if (error.message?.includes('file') || error.message?.includes('type')) {
        console.error('📄 Problème avec le fichier');
        userMessage = "Le fichier semble être corrompu ou dans un format non supporté.";
      } else if (error.message?.includes('size') || error.message?.includes('too large')) {
        userMessage = "Le fichier est trop volumineux. Essayez avec un fichier plus petit.";
      } else if (error.message?.includes('timeout')) {
        userMessage = "La génération a pris trop de temps. Réessayez avec un document plus court.";
      }
      
      setErrorMessage(userMessage);
      setStatus("error");
    }
  }

  async function generateLessonSuggestions() {
    setSuggestionsLoading(true);
    try {
      console.log('🔄 Génération des suggestions de leçons...');
      
      const result = await model.generateContent([
        `
        Basé sur ce résumé de cours : "${summary}"
        
        Génère 4 suggestions de leçons simples et complémentaires qui aideraient l'apprenant à mieux comprendre ce sujet.
        
        Chaque suggestion doit être dans un domaine connexe mais plus simple ou approfondir un aspect spécifique.
        
        Retourne UNIQUEMENT un tableau JSON sans texte supplémentaire avec cette structure exacte :
        [
          {
            "title": "Titre de la leçon",
            "description": "Description courte et claire de ce qui sera appris",
            "difficulty": "Débutant", // ou "Intermédiaire" ou "Avancé"
            "topics": ["sujet1", "sujet2", "sujet3"],
            "estimatedTime": "30 minutes" // ou autre durée réaliste
          }
        ]
        
        Assure-toi que les suggestions soient :
        - Progressives (du plus simple au plus complexe)
        - Complémentaires au contenu actuel
        - Pratiques et réalisables
        - Adaptées au niveau de l'apprenant
        `
      ]);

      let responseText = result.response.text().trim();
      // Nettoyer la réponse pour extraire uniquement le JSON
      responseText = responseText.replace(/```json|```/g, '').trim();
      
      const suggestions = JSON.parse(responseText) as LessonSuggestion[];
      setLessonSuggestions(suggestions);
      
      console.log('✅ Suggestions générées:', suggestions.length, 'suggestions');
    } catch (error) {
      console.error('❌ Erreur lors de la génération des suggestions:', error);
      // En cas d'erreur, on peut afficher des suggestions par défaut ou laisser vide
      setLessonSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }

  useEffect(() => {
    if (status === "idle") {
      getSummary();
    }
  }, [status]);

  useEffect(() => {
    if (status === "success" && summary && lessonSuggestions.length === 0) {
      generateLessonSuggestions();
    }
  }, [status, summary]);

  return (
    <section className={styles.summaryContainer}>
      <div className={styles.header}>
        <img src={file.imageUrl} alt="Preview" className={styles.previewImage} />
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>📚 Fiche de Révision</h2>
          <p className={styles.fileName}>{file.name}</p>
        </div>
      </div>

      {status === "loading" ? (
        <div className={styles.loadingSection}>
          <Loader />
          <p>Génération de votre fiche de révision personnalisée...</p>
        </div>
      ) : status === "success" ? (
        <div className={styles.sectionsContainer}>
          {parsedSections.map((section, index) => (
            <div key={index} className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>{section.icon}</span>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
              </div>
              <div className={styles.sectionContent}>
                {section.content.split('\n').map((line, lineIndex) => {
                  if (line.trim()) {
                    // Détecter si c'est du code (indentation ou caractères spéciaux)
                    if (line.startsWith('  ') || line.includes('{') || line.includes('}') || line.includes('function') || line.includes('class')) {
                      return (
                        <pre key={lineIndex} className={styles.codeLine}>
                          {line}
                        </pre>
                      );
                    } else {
                      return (
                        <p key={lineIndex} className={styles.contentLine}>
                          {line}
                        </p>
                      );
                    }
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
          
          {/* Section des suggestions de leçons */}
          {(lessonSuggestions.length > 0 || suggestionsLoading) && (
            <div className={styles.suggestionsSection}>
              <div className={styles.suggestionsHeader}>
                <h3 className={styles.suggestionsTitle}>
                  💡 Leçons recommandées pour approfondir
                </h3>
                <p className={styles.suggestionsSubtitle}>
                  Voici des suggestions de leçons simples pour vous aider à mieux comprendre ce sujet
                </p>
              </div>
              
              {suggestionsLoading ? (
                <div className={styles.suggestionsLoading}>
                  <Loader />
                  <p>Génération des suggestions de leçons...</p>
                </div>
              ) : (
                <div className={styles.suggestionsGrid}>
                  {lessonSuggestions.map((suggestion, index) => (
                    <div key={index} className={styles.suggestionCard}>
                      <div className={styles.suggestionHeader}>
                        <h4 className={styles.suggestionTitle}>{suggestion.title}</h4>
                        <div className={styles.suggestionMeta}>
                          <span className={`${styles.difficultyBadge} ${styles[suggestion.difficulty.toLowerCase()]}`}>
                            {suggestion.difficulty}
                          </span>
                          <span className={styles.timeBadge}>⏱️ {suggestion.estimatedTime}</span>
                        </div>
                      </div>
                      
                      <p className={styles.suggestionDescription}>
                        {suggestion.description}
                      </p>
                      
                      <div className={styles.suggestionTopics}>
                        <strong>Sujets abordés :</strong>
                        <div className={styles.topicsList}>
                          {suggestion.topics.map((topic, topicIndex) => (
                            <span key={topicIndex} className={styles.topicTag}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.suggestionActions}>
                        <button 
                          className={styles.searchButton}
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(suggestion.title + ' cours ' + suggestion.topics.join(' '))}`, '_blank')}
                        >
                          🔍 Rechercher en ligne
                        </button>
                        <button 
                          className={styles.youtubeButton}
                          onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(suggestion.title + ' tutorial ' + suggestion.topics.join(' '))}`, '_blank')}
                        >
                          📺 Voir sur YouTube
                        </button>
                        <div className={styles.pdfButtonGroup}>
                          <button 
                            className={styles.pdfButton}
                            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(suggestion.title + ' ' + suggestion.topics.join(' ') + ' filetype:pdf cours')}`, '_blank')}
                            title="Rechercher des PDF sur Google"
                          >
                            📄 PDF Google
                          </button>
                          <button 
                            className={styles.academicButton}
                            onClick={() => window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(suggestion.title + ' ' + suggestion.topics.join(' '))}`, '_blank')}
                            title="Rechercher sur Google Scholar"
                          >
                            🎓 Scholar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : status === "error" ? (
        <div className={styles.errorSection}>
          <p className={styles.error}>❌ Erreur lors de la génération du résumé</p>
          <p className={styles.errorDetail}>{errorMessage}</p>
          
          {retryCount >= 2 && (
            <div className={styles.troubleshootSection}>
              <h4>💡 Conseils de dépannage :</h4>
              <ul>
                <li>✅ Vérifiez votre connexion internet</li>
                <li>📄 Essayez avec un fichier plus petit (moins de 5MB)</li>
                <li>🔄 Rechargez la page et réessayez</li>
                <li>📱 Utilisez un autre format (PDF plutôt qu'image)</li>
                <li>⏰ Attendez quelques minutes et réessayez</li>
              </ul>
            </div>
          )}
          
          <div className={styles.errorActions}>
            <button 
              className={styles.retryButton} 
              onClick={async () => {
                setRetryCount(prev => prev + 1);
                console.log(`🔄 Tentative ${retryCount + 1}/3`);
                
                // Si c'est le 2ème retry, tester d'abord la connexion API
                if (retryCount === 1) {
                  const apiWorks = await testApiConnection();
                  if (!apiWorks) {
                    setErrorMessage("L'API Google Generative AI semble indisponible. Veuillez réessayer plus tard.");
                    return;
                  }
                }
                
                setStatus("idle");
                setErrorMessage("");
              }}
            >
              Réessayer {retryCount > 0 ? `(${retryCount}/3)` : ''}
            </button>
            <button 
              className={styles.helpButton} 
              onClick={() => window.open('https://support.google.com/generativeai/', '_blank')}
            >
              Aide
            </button>
          </div>
        </div>
      ) : null}

      {status === "success" && parsedSections.length > 0 && (
        <div className={styles.actionSection}>
          <button className={styles.saveButton} onClick={handleSave}>
            💾 Enregistrer la fiche
          </button>
        </div>
      )}
    </section>
  );
}

export default Summary;
