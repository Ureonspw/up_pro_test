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
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
  const [summary, setSummary] = useState<string>("");
  const [parsedSections, setParsedSections] = useState<SummarySection[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
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
      
      const responseText = result.response.text();
      setSummary(responseText);
      setParsedSections(parseSummaryContent(responseText));
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  useEffect(() => {
    if (status === "idle") {
      getSummary();
    }
  }, [status]);

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
        </div>
      ) : status === "error" ? (
        <div className={styles.errorSection}>
          <p className={styles.error}>❌ Erreur lors de la génération du résumé</p>
          <button 
            className={styles.retryButton} 
            onClick={() => setStatus("idle")}
          >
            Réessayer
          </button>
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
