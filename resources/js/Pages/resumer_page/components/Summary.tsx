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
  selectedLanguage: 'français' | 'yoruba';
  onLanguageChange: (language: 'français' | 'yoruba') => void;
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

async function generateUltraSimplePdf(sections: SummarySection[], fileName: string): Promise<Blob> {
  console.log('🔧 Génération PDF robuste pour yoruba...');
  
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    let y = 800;
    const margin = 50;
    
    // Fonction de nettoyage ultra-robuste
    const sanitizeText = (text: string): string => {
      if (!text) return 'Contenu non disponible';
      
      return text
        // Remplacer tous les caractères non-ASCII par leurs équivalents
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e') 
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[ß]/g, 'ss')
        // Caractères yoruba spécifiques
        .replace(/[ọọ́ọ̀]/g, 'o')
        .replace(/[ẹẹ́ẹ̀]/g, 'e')
        .replace(/[ṣ]/g, 's')
        .replace(/[ń]/g, 'n')
        .replace(/[ṃ]/g, 'm')
        .replace(/[ẅ]/g, 'w')
        // Supprimer les caractères de contrôle et autres caractères problématiques
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques
        .replace(/[^\x20-\x7E]/g, ' ') // Garder seulement les caractères ASCII printables
        .replace(/\s+/g, ' ') // Normaliser les espaces
        .trim();
    };
    
    // Titre simple
    page.drawText('FICHE DE REVISION - YORUBA', {
      x: margin,
      y: y,
      size: 16,
      font: font,
    });
    y -= 40;
    
    // Nom du fichier sécurisé
    const safeFileName = sanitizeText(fileName).substring(0, 50);
    page.drawText('Fichier: ' + safeFileName, {
      x: margin,
      y: y,
      size: 12,
      font: font,
    });
    y -= 30;
    
    // Information sur le nombre de sections
    page.drawText(`Nombre de sections: ${sections.length}`, {
      x: margin,
      y: y,
      size: 12,
      font: font,
    });
    y -= 30;
    
         // Traiter chaque section avec contenu complet
     sections.forEach((section, index) => {
       if (y < 100) {
         // Pas assez de place, créer une nouvelle page
         const newPage = pdfDoc.addPage([595, 842]);
         y = 800;
         // Ajouter le contenu sur la nouvelle page
         try {
           const safeTitle = sanitizeText(section.title);
           newPage.drawText(`${index + 1}. ${safeTitle}`, {
             x: margin,
             y: y,
             size: 12,
             font: font,
           });
           y -= 25;
           
           // Contenu complet sur la nouvelle page
           const fullContent = sanitizeText(section.content);
           const contentLines = fullContent.split('\n').filter(line => line.trim());
           
                       for (const line of contentLines) {
              if (y < 100) break; // Éviter le débordement
              
              // Découper les lignes trop longues
              const words = line.trim().split(' ');
              let currentLine = '';
              
              for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                if (testLine.length <= 80) { // Limite en caractères plutôt qu'en pixels
                  currentLine = testLine;
                } else {
                  if (currentLine) {
                    newPage.drawText(currentLine, {
                      x: margin + 20,
                      y: y,
                      size: 10,
                      font: font,
                    });
                    y -= 15;
                  }
                  currentLine = word;
                }
              }
              
              if (currentLine && y > 100) {
                newPage.drawText(currentLine, {
                  x: margin + 20,
                  y: y,
                  size: 10,
                  font: font,
                });
                y -= 15;
              }
            }
           
         } catch (newPageError) {
           console.warn('Erreur nouvelle page section', index, ':', newPageError);
         }
         return;
       }
       
       try {
         // Titre de section sécurisé
         const safeTitle = sanitizeText(section.title);
         page.drawText(`${index + 1}. ${safeTitle}`, {
           x: margin,
           y: y,
           size: 12,
           font: font,
         });
         y -= 25;
         
         // Contenu complet sécurisé
         const fullContent = sanitizeText(section.content);
         const contentLines = fullContent.split('\n').filter(line => line.trim());
         
         // Afficher au maximum 5 lignes par section sur cette page
         const maxLines = Math.min(5, contentLines.length);
         
         for (let i = 0; i < maxLines; i++) {
           if (y < 100) break;
           
           const line = contentLines[i];
           // Découper les lignes trop longues
           const words = line.trim().split(' ');
           let currentLine = '';
           
                       for (const word of words) {
              const testLine = currentLine ? `${currentLine} ${word}` : word;
              if (testLine.length <= 80) { // Limite en caractères
                currentLine = testLine;
              } else {
                if (currentLine) {
                  page.drawText(currentLine, {
                    x: margin + 20,
                    y: y,
                    size: 10,
                    font: font,
                  });
                  y -= 15;
                  if (y < 100) break;
                }
                currentLine = word;
              }
            }
           
           if (currentLine && y > 100) {
             page.drawText(currentLine, {
               x: margin + 20,
               y: y,
               size: 10,
               font: font,
             });
             y -= 15;
           }
         }
         
         // Indiquer s'il y a plus de contenu
         if (contentLines.length > maxLines && y > 100) {
           page.drawText('... (contenu continue)', {
             x: margin + 20,
             y: y,
             size: 9,
             font: font,
           });
           y -= 20;
         }
         
         y -= 10; // Espace entre sections
         
       } catch (sectionError) {
         console.warn('Erreur section', index, ':', sectionError);
         page.drawText(`${index + 1}. Section ${index + 1} (erreur de formatage)`, {
           x: margin,
           y: y,
           size: 10,
           font: font,
         });
         y -= 20;
       }
     });
    
    // Pied de page simple
    page.drawText('PDF genere automatiquement pour Yoruba', {
      x: margin,
      y: 30,
      size: 8,
      font: font,
    });
    
    const pdfBytes = await pdfDoc.save();
    console.log('✅ PDF robuste créé avec succès, taille:', pdfBytes.length);
    return new Blob([pdfBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du PDF robuste:', error);
    
    // Version de secours ultra-minimale
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      page.drawText('FICHE DE REVISION YORUBA', {
        x: 50,
        y: 750,
        size: 16,
        font: font,
      });
      
      page.drawText('Contenu genere avec succes', {
        x: 50,
        y: 700,
        size: 12,
        font: font,
      });
      
      page.drawText(`Sections: ${sections.length}`, {
        x: 50,
        y: 680,
        size: 12,
        font: font,
      });
      
      const pdfBytes = await pdfDoc.save();
      console.log('✅ PDF de secours créé');
      return new Blob([pdfBytes], { type: 'application/pdf' });
      
    } catch (fallbackError) {
      console.error('❌ Même le PDF de secours a échoué:', fallbackError);
      throw new Error('Impossible de créer un PDF');
    }
  }
}

async function generateSimplePdf(sections: SummarySection[], fileName: string, language: 'français' | 'yoruba'): Promise<Blob> {
  console.log('🔧 Génération PDF simple pour yoruba...');
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let y = height - 50;
  const margin = 50;
  
  // Titre simple sans caractères spéciaux
  const title = language === 'yoruba' ? 'FICHE DE REVISION (YORUBA)' : 'FICHE DE RÉVISION';
  page.drawText(title, {
    x: margin,
    y: y,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;
  
  // Nom du fichier
  page.drawText(`Fichier: ${fileName}`, {
    x: margin,
    y: y,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 30;
  
  // Sections simplifiées
  sections.forEach((section, index) => {
    if (y < 100) return; // Éviter de déborder
    
    // Titre de section simplifié (enlever caractères spéciaux)
    const sectionTitle = section.title.replace(/[àáâãäåèéêëìíîïòóôõöùúûüñç]/g, (match) => {
      const replacements: {[key: string]: string} = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ñ': 'n', 'ç': 'c'
      };
      return replacements[match] || match;
    });
    
    page.drawText(`${index + 1}. ${sectionTitle}`, {
      x: margin,
      y: y,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    y -= 20;
    
    // Contenu simplifié (première ligne seulement)
    const content = section.content.split('\n')[0].substring(0, 80) + '...';
    const cleanContent = content.replace(/[àáâãäåèéêëìíîïòóôõöùúûüñç]/g, (match) => {
      const replacements: {[key: string]: string} = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ñ': 'n', 'ç': 'c'
      };
      return replacements[match] || match;
    });
    
    page.drawText(cleanContent, {
      x: margin + 20,
      y: y,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 25;
  });
  
  // Pied de page simple
  page.drawText('PDF simplifie - Compatible yoruba', {
    x: margin,
    y: 30,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

async function generatePdf(sections: SummarySection[], fileName: string, language: 'français' | 'yoruba' = 'français'): Promise<Blob> {
  console.log('📝 Début génération PDF, langue:', language);
  console.log('📊 Nombre de sections:', sections.length);
  
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]); // A4
  
  const { width, height } = currentPage.getSize();
  const margin = 50;
  const maxY = height - margin;
  const minY = margin + 30;

  // Fonction pour nettoyer le texte yoruba si nécessaire
  const sanitizeText = (text: string): string => {
    if (language === 'yoruba') {
      // Remplacer les caractères yoruba problématiques par des équivalents ASCII
      return text
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[ẹ]/g, 'e')
        .replace(/[ọ]/g, 'o')
        .replace(/[ṣ]/g, 's')
        .replace(/[ẹ̀]/g, 'e')
        .replace(/[ọ̀]/g, 'o')
        .replace(/[ṃ]/g, 'm')
        .replace(/[ṅ]/g, 'n');
    }
    return text;
  };

  let titleFont, sectionTitleFont, contentFont, codeFont, footerFont;
  try {
    titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    sectionTitleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    codeFont = await pdfDoc.embedFont(StandardFonts.Courier);
    footerFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    console.log('✅ Polices chargées avec succès');
  } catch (fontError) {
    console.error('❌ Erreur lors du chargement des polices:', fontError);
    throw new Error('Impossible de charger les polices PDF');
  }

  let y = maxY;

  // Fonction pour créer une nouvelle page
  const createNewPage = () => {
    currentPage = pdfDoc.addPage([595, 842]);
    y = maxY;
    // Pied de page
    const pageFooter = language === 'yoruba' ? 
      'Àkọ́ ìwé àtúnyẹ̀wò - Ojú-ìwé ' + (pdfDoc.getPageCount()) :
      'Fiche de revision - Page ' + (pdfDoc.getPageCount());
    currentPage.drawText(pageFooter, {
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
  const mainTitle = language === 'yoruba' ? 'ÀKỌ́ ÌWÉ ÀTÚNYẸ̀WÒ' : 'FICHE DE RÉVISION';
  try {
    currentPage.drawText(sanitizeText(mainTitle), {
      x: margin,
      y: y,
      size: 20,
      font: titleFont,
      color: rgb(0.1, 0.7, 0.3),
    });
    console.log('✅ Titre principal ajouté:', sanitizeText(mainTitle));
  } catch (titleError) {
    console.error('❌ Erreur lors de l\'ajout du titre:', titleError);
    // Version de secours avec titre simple
    currentPage.drawText(language === 'yoruba' ? 'FICHE DE REVISION' : 'FICHE DE RÉVISION', {
      x: margin,
      y: y,
      size: 20,
      font: titleFont,
      color: rgb(0.1, 0.7, 0.3),
    });
  }
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
  const footerText = language === 'yoruba' ? 
    `Tí a ṣẹ̀dá ní ${new Date().toLocaleDateString('fr-FR')} - e-Learning` :
    `Genere le ${new Date().toLocaleDateString('fr-FR')} - e-Learning`;
  currentPage.drawText(footerText, {
    x: margin,
    y: margin - 10,
    size: 8,
    font: footerFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

function Summary({ file, selectedLanguage, onLanguageChange }: SummaryProps) {
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
    console.log('🚀 Début de l\'enregistrement, langue:', selectedLanguage);
    
    if (!parsedSections.length) {
      console.log('❌ Aucune section à sauvegarder');
      alert(selectedLanguage === 'yoruba' ? 'Kò sí abala tí a lè pamọ́' : 'Aucune section à sauvegarder');
      return;
    }
  
    console.log('✅ Génération du PDF avec', parsedSections.length, 'sections');
    console.log('📄 Sections:', parsedSections);
    console.log('🌍 Langue sélectionnée:', selectedLanguage);
    
    try {
      console.log('🔄 Appel de generatePdf...');
      
      // Si c'est yoruba, essayer d'abord une version ultra-simplifiée
      if (selectedLanguage === 'yoruba') {
        console.log('🔧 Test version ultra-simplifiée pour yoruba...');
        try {
          const ultraSimplePdfBlob = await generateUltraSimplePdf(parsedSections, file.name);
          console.log('✅ PDF ultra-simplifié généré pour yoruba, taille:', ultraSimplePdfBlob.size, 'bytes');
          
          const pdfBase64 = await blobToBase64(ultraSimplePdfBlob);
          localStorage.setItem('pdfBase64', pdfBase64);
          const pdfUrl = URL.createObjectURL(ultraSimplePdfBlob);
          localStorage.setItem('pdfUrl', pdfUrl);
          localStorage.setItem('selectedLanguage', selectedLanguage);
          
          // Sauvegarder aussi les sections et le résumé pour pouvoir revenir
          localStorage.setItem('summaryContent', summary);
          localStorage.setItem('parsedSections', JSON.stringify(parsedSections));
          
          console.log('✅ Données complètes sauvegardées pour yoruba');
          console.log('🎉 PDF yoruba généré avec succès, redirection...');
          window.location.href = '/enregistrement_page';
          return;
        } catch (ultraError) {
          console.error('❌ Version ultra-simplifiée échouée:', ultraError);
          console.log('🔧 Tentative version simplifiée...');
          try {
            const simplePdfBlob = await generateSimplePdf(parsedSections, file.name, selectedLanguage);
            console.log('✅ PDF simplifié généré pour yoruba, taille:', simplePdfBlob.size, 'bytes');
            
            const pdfBase64 = await blobToBase64(simplePdfBlob);
            localStorage.setItem('pdfBase64', pdfBase64);
            const pdfUrl = URL.createObjectURL(simplePdfBlob);
            localStorage.setItem('pdfUrl', pdfUrl);
            localStorage.setItem('selectedLanguage', selectedLanguage);
            
            // Sauvegarder aussi les sections et le résumé pour pouvoir revenir
            localStorage.setItem('summaryContent', summary);
            localStorage.setItem('parsedSections', JSON.stringify(parsedSections));
            
            console.log('✅ Données complètes sauvegardées pour yoruba (version simple)');
            console.log('🎉 PDF yoruba généré avec succès, redirection...');
            window.location.href = '/enregistrement_page';
            return;
          } catch (simpleError) {
            console.error('❌ Version simplifiée aussi échouée:', simpleError);
            console.warn('⚠️ Tentative version complète...');
          }
        }
      }
      
      const pdfBlob = await generatePdf(parsedSections, file.name, selectedLanguage);
      console.log('✅ PDF généré, taille:', pdfBlob.size, 'bytes');
      
      const pdfBase64 = await blobToBase64(pdfBlob);
      console.log('✅ PDF converti en base64');
      
      localStorage.setItem('pdfBase64', pdfBase64);
      console.log('✅ PDF sauvé dans localStorage');

      const pdfUrl = URL.createObjectURL(pdfBlob);
      localStorage.setItem('pdfUrl', pdfUrl);
      console.log('✅ URL PDF créée:', pdfUrl);
      
      // Sauvegarder la langue pour l'enregistrement
      localStorage.setItem('selectedLanguage', selectedLanguage);
      console.log('✅ Langue sauvée:', selectedLanguage);
      
      // Sauvegarder aussi les sections et le résumé pour pouvoir revenir
      localStorage.setItem('summaryContent', summary);
      localStorage.setItem('parsedSections', JSON.stringify(parsedSections));
      console.log('✅ Données complètes sauvegardées');
      
      console.log('🎉 PDF généré avec succès, redirection...');
      window.location.href = '/enregistrement_page';
    } catch (error: any) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      console.error('📊 Détails de l\'erreur:', error?.message);
      console.error('📋 Stack trace:', error?.stack);
      
      const errorMsg = selectedLanguage === 'yoruba' ? 
        'Àṣìṣe nínú ṣíṣe PDF. Jọ̀wọ́ wo console fún àlàyé síi.' :
        'Erreur lors de la génération du PDF. Vérifiez la console pour plus de détails.';
      alert(errorMsg);
    }
  };

  const getIconForSection = (title: string): React.ReactNode => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('définition') || lowerTitle.includes('definition') || 
        lowerTitle.includes('ìtumọ̀') || lowerTitle.includes('itumọ')) {
      return <FaBookOpen />;
    } else if (lowerTitle.includes('concept') || lowerTitle.includes('notion') || 
               lowerTitle.includes('ìmọ̀ pàtàkì') || lowerTitle.includes('imọ pataki')) {
      return <MdTopic />;
    } else if (lowerTitle.includes('méthodologie') || lowerTitle.includes('methode') || 
               lowerTitle.includes('ọ̀nà ìṣe') || lowerTitle.includes('ọna ise')) {
      return <MdSchool />;
    } else if (lowerTitle.includes('exemple') || lowerTitle.includes('application') || 
               lowerTitle.includes('àpẹẹrẹ') || lowerTitle.includes('apẹẹrẹ')) {
      return <FaListUl />;
    } else if (lowerTitle.includes('astuce') || lowerTitle.includes('conseil') || 
               lowerTitle.includes('ìmọ̀ràn') || lowerTitle.includes('imọran')) {
      return <FaLightbulb />;
    } else if (lowerTitle.includes('code') || lowerTitle.includes('algorithme') || 
               lowerTitle.includes('kóòdù') || lowerTitle.includes('koodu')) {
      return <FaCode />;
    } else {
      return <FaQuestionCircle />;
    }
  };

  const parseSummaryContent = (content: string): SummarySection[] => {
    const sections: SummarySection[] = [];
    const lines = content.split('\n');
    let currentSection: SummarySection | null = null;
    
    // Mots-clés pour les sections en français et yoruba
    const frenchKeywords = ['Définitions', 'Concepts clés', 'Concepts cles', 'Méthodologie', 'Methodologie', 
                           'Exemples', 'Astuces', 'Points essentiels', 'Résumé', 'Resume', 'Introduction',
                           'Objectifs', 'Conclusion', 'Code', 'Algorithmes', 'Formules'];
    
    const yorubaKeywords = ['Àwọn ìtumọ̀', 'Àwọn ìmọ̀ pàtàkì', 'Ọ̀nà ìṣe', 'Àwọn àpẹẹrẹ', 
                           'Àwọn ìmọ̀ràn', 'Àwọn kókó pàtàkì', 'Ìfihàn', 'Ìpilẹ̀ṣẹ̀', 
                           'Àwọn ète', 'Àwọn àgbékalẹ̀', 'Àpẹẹrẹ', 'Ìmọ̀ràn'];
    
    const allKeywords = [...frenchKeywords, ...yorubaKeywords];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Détecter les titres de section (lignes qui se terminent par : ou qui sont en majuscules/importantes)
      if (
        (trimmedLine.length > 0 && trimmedLine.length < 50 && 
         (trimmedLine.endsWith(':') || /^[A-Z][a-zA-ZÀ-ÿ\s]+$/.test(trimmedLine))) ||
        allKeywords.some(keyword => 
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
      
      const prompt = selectedLanguage === 'yoruba' ? 
        `
        Ṣe akọsilẹ àkọ́kọ́ tó pé àti tó tẹ́lẹ̀ lọ́nà tó dára nípa àkọ́ọ̀lẹ̀ yìí.

        ỌNÀ ÀTÒPỌ̀ TÓ NÍ LÁÌ ṢE DÉÉDÉ :
        1. Bẹ̀rẹ̀ pẹ̀lú "Àwọn ìtumọ̀ :" fún àwọn ọ̀rọ̀ pàtàkì
        2. Lẹ́yìn náà "Àwọn ìmọ̀ pàtàkì :" fún àwọn ero àkọ́kọ́
        3. Lẹ́yìn náà "Ọ̀nà ìṣe :" fún àwọn ìlànà àti ọ̀nà
        4. Fi "Àwọn àpẹẹrẹ :" kún un pẹ̀lú àwọn àpẹẹrẹ tó ṣe é rí
        5. Parí pẹ̀lú "Àwọn ìmọ̀ràn :" pẹ̀lú àwọn ìmọ̀ràn tó wúlò

        ÀWỌN ÒFIN ÀGBÉKALẸ̀ :
        - Lo àwọn àkọlé wọ̀nyí gangan tó bá ó fún àmì idánimọ̀
        - Ya àwọn abala kọ̀ọ̀kan pẹ̀lú ìlà òfò
        - Lo àwọn gbólóhùn kúkurú àti tó yé ni
        - Fún kóòdù, lo àgbédémọ̀ tó dára
        - Yéra fún àwọn àmì àgbékalẹ̀ (**, *, àti bẹ́ẹ̀ bẹ́ẹ̀ lọ)
        - Jẹ́ kí ó ṣe gège bi àkópọ̀ àti tó péye

        ÀPẸẸRẸ ETÒ :
        Àwọn ìtumọ̀ :
        [àkọ́ọ̀lẹ̀ àwọn ìtumọ̀]

        Àwọn ìmọ̀ pàtàkì :
        [àkọ́ọ̀lẹ̀ àwọn ìmọ̀]

        Ọ̀nà ìṣe :
        [àkọ́ọ̀lẹ̀ ọ̀nà ìṣe]

        Àwọn àpẹẹrẹ :
        [àwọn àpẹẹrẹ tó ṣe é rí]

        Àwọn ìmọ̀ràn :
        [àwọn ìmọ̀ràn tó wúlò]

        KÒ GBỌDỌ̀ LO ÈDÈ MÌÍRÀN RÁRÁ, LO YORÙBÁ NÌKAN.
        ` : 
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
        `;

      const result = await model.generateContent([
        {
          inlineData: {
            data: file.file,
            mimeType: file.type,
          },
        },
        prompt
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
      
      const suggestionsPrompt = selectedLanguage === 'yoruba' ?
        `
        Dá lórí àkópọ̀ ẹ̀kọ́ yìí : "${summary}"
        
        Ṣe ìmọ̀ràn mẹ́rin ti àwọn ẹ̀kọ́ tó rọrùn àti tó ni ìbámú tó máa ran ẹni tó ń kọ́ ẹ̀kọ́ lọ́wọ́ láti yé e dáadáa.
        
        Ẹ̀kọ́ kọ̀ọ̀kan gbọdọ̀ wà ní agbègbè tó bá a mu ṣùgbọ́n tó rọrùn tàbí tó jinlẹ̀ sí apá kan.
        
        Da JSON àkójọ nìkan padà láì ní ọ̀rọ̀ àfikún pẹ̀lú ètò yìí gangan :
        [
          {
            "title": "Àkọlé ẹ̀kọ́",
            "description": "Àpèjúwe kúkurú àti tó yé ni nípa ohun tí a ó kọ́",
            "difficulty": "Àkọ́kọ́", // tàbí "Àárín" tàbí "Gíga"
            "topics": ["kókó1", "kókó2", "kókó3"],
            "estimatedTime": "ìṣẹ́jú 30" // tàbí àkókò mìíràn tó yẹ
          }
        ]
        
        Rí i dájú pé àwọn ìmọ̀ràn náà:
        - Ló nípa ìlọsíwájú (láti èyí tó rọrùn dé èyí tó nira)
        - Bá àkóó lọ́wọ́lọ́wọ́ mu
        - Ṣe é ṣe àti tó yẹ
        - Bá ipò ẹni tó ń kọ́ ẹ̀kọ́ mu

        KÒ GBỌDỌ̀ LO ÈDÈ MÌÍRÀN RÁRÁ, LO YORÙBÁ NÌKAN.
        ` :
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
        `;

      const result = await model.generateContent([suggestionsPrompt]);

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
          <h2 className={styles.title}>📚 {selectedLanguage === 'yoruba' ? 'Àkọ́ Ìwé Àtúnyẹ̀wò' : 'Fiche de Révision'}</h2>
          <p className={styles.fileName}>{file.name}</p>
        </div>
        <div className={styles.languageSelector}>
          <label className={styles.languageLabel}>
            🌍 Langue :
          </label>
          <select 
            value={selectedLanguage}
            onChange={(e) => {
              const newLanguage = e.target.value as 'français' | 'yoruba';
              onLanguageChange(newLanguage);
              // Regénérer le résumé dans la nouvelle langue
              setSummary("");
              setParsedSections([]);
              setLessonSuggestions([]);
              setStatus("idle");
            }}
            className={styles.languageSelect}
          >
            <option value="français">🇫🇷 Français</option>
            <option value="yoruba">🇳🇬 Yorùbá</option>
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div className={styles.loadingSection}>
          <Loader />
          <p>{selectedLanguage === 'yoruba' ? 'Ṣíṣe àkọ́ ìwé àtúnyẹ̀wò tí ẹ yàn...' : 'Génération de votre fiche de révision personnalisée...'}</p>
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
                  💡 {selectedLanguage === 'yoruba' ? 'Àwọn ẹ̀kọ́ tí a ṣe ìmọ̀ràn fún ìmúlò jinlẹ̀' : 'Leçons recommandées pour approfondir'}
                </h3>
                <p className={styles.suggestionsSubtitle}>
                  {selectedLanguage === 'yoruba' ? 
                    'Èyí ni àwọn ìmọ̀ràn ti àwọn ẹ̀kọ́ tó rọrùn láti ran ọ́ lọ́wọ́ láti yé kókó yìí dáadáa' :
                    'Voici des suggestions de leçons simples pour vous aider à mieux comprendre ce sujet'
                  }
                </p>
              </div>
              
              {suggestionsLoading ? (
                <div className={styles.suggestionsLoading}>
                  <Loader />
                  <p>{selectedLanguage === 'yoruba' ? 'Ṣíṣe àwọn ìmọ̀ràn ẹ̀kọ́...' : 'Génération des suggestions de leçons...'}</p>
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
          <p className={styles.error}>
            ❌ {selectedLanguage === 'yoruba' ? 'Àṣìṣe nínú ṣíṣe àkópọ̀' : 'Erreur lors de la génération du résumé'}
          </p>
          <p className={styles.errorDetail}>{errorMessage}</p>
          
          {retryCount >= 2 && (
            <div className={styles.troubleshootSection}>
              <h4>💡 {selectedLanguage === 'yoruba' ? 'Àwọn ìmọ̀ràn àtúnṣe :' : 'Conseils de dépannage :'}</h4>
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
          <button 
            className={styles.saveButton} 
            onClick={() => {
              console.log('🔘 Bouton cliqué, langue:', selectedLanguage);
              handleSave();
            }}
          >
            💾 {selectedLanguage === 'yoruba' ? 'Pamọ́ àkọ́ ìwé náà' : 'Enregistrer la fiche'}
          </button>
        </div>
      )}
    </section>
  );
}

export default Summary;
