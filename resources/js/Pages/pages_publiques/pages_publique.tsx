import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Footer from '@/Components/Footer';
import axios from 'axios';

// Debug log pour vérifier le token CSRF
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
console.log('CSRF Token:', csrfToken);

// Configuration d'axios pour inclure le token CSRF et les headers appropriés
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true; // Important pour les requêtes authentifiées

// Configuration de l'URL de base pour les requêtes API
axios.defaults.baseURL = 'http://127.0.0.1:8000';

import '../../../css/historique_page/historique_page.css'
import {
  MdSchool,
  MdDescription,
  MdHelpOutline,
  MdMenuBook,
  MdArrowBack,
  MdArrowForward,
  MdSearch,
  MdError,
  MdDownload
} from 'react-icons/md'

interface Ia {
  id_ia: number;
  titre: string;
  contenue_ia: string;
  document: {
    id_doc: number;
    chemin: string;
    user: {
      name: string;
    } | null;
  } | null;
}

interface Fiche {
  id: number;
  titre: string;
  username: string;
  icon: React.ComponentType;
  pdf: string;
}

function PagePub(): JSX.Element {
  const [current, setCurrent] = useState<number>(0)
  const [direction, setDirection] = useState<string>('');
  const [showPdf, setShowPdf] = useState<boolean>(false);
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'user' | 'title'>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchIAs();
  }, []);

  const formatTitle = (titre: string): string => {
    // Si le titre contient un underscore, on prend la partie après
    const parts = titre.split('_');
    if (parts.length > 1) {
      // On retourne tout ce qui suit le premier underscore
      return parts.slice(1).join('_');
    }
    return titre;
  };

  const fetchIAs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/ias/adminP');
      
      if (!response.data.ias) {
        throw new Error('Format de réponse invalide');
      }

      const ias: Ia[] = response.data.ias;
      
      // Debug log détaillé pour vérifier les données
      console.log('Données IA reçues (détaillées):', ias.map(ia => ({
        id: ia.id_ia,
        titre: ia.titre,
        contenue_ia: ia.contenue_ia ? {
          type: typeof ia.contenue_ia,
          length: ia.contenue_ia.length,
          isBase64: ia.contenue_ia.startsWith('data:'),
          mimeType: ia.contenue_ia.startsWith('data:') ? ia.contenue_ia.split(';')[0].split(':')[1] : null,
          preview: ia.contenue_ia.substring(0, 100) + '...'
        } : null,
        document: ia.document ? {
          id: ia.document.id_doc,
          chemin: ia.document.chemin,
          user: ia.document.user ? {
            name: ia.document.user.name
          } : null
        } : null
      })));
      
      const formattedFiches = ias.map((ia) => {
        // Utiliser contenue_ia si disponible, sinon utiliser le chemin du document
        const pdfData = ia.contenue_ia || ia.document?.chemin || '';
        console.log('Traitement du document (détaillé):', {
          id: ia.id_ia,
          titre: ia.titre,
          pdfData,
          pdfDataType: typeof pdfData,
          pdfDataLength: pdfData.length,
          isBase64: pdfData.startsWith('data:'),
          isUrl: pdfData.startsWith('/storage/'),
          isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(pdfData),
          isPdf: /\.pdf$/i.test(pdfData),
          preview: pdfData.substring(0, 100) + '...',
          mimeType: pdfData.startsWith('data:') ? pdfData.split(';')[0].split(':')[1] : null
        });
        
        return {
          id: ia.id_ia,
          titre: ia.titre,
          username: ia.document?.user?.name || 'Utilisateur inconnu',
          icon: MdSchool,
          pdf: pdfData
        };
      });

      console.log('Fiches formatées (détaillées):', formattedFiches);
      setFiches(formattedFiches);
    } catch (error: any) {
      console.error('Error fetching IAs:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Une erreur est survenue';
      setError(`Erreur lors du chargement des documents: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      
      if (filterType === 'user') {
        response = await axios.get(`/ias/user/${searchTerm}`);
      } else if (filterType === 'title') {
        response = await axios.get(`/ias/title/${searchTerm}`);
      } else {
        response = await axios.get('/ias');
      }

      if (!response.data.ias) {
        throw new Error('Format de réponse invalide');
      }

      const ias: Ia[] = response.data.ias;
      
      // Debug log pour vérifier les données
      console.log('Données IA reçues après recherche:', ias);
      
      const formattedFiches = ias
        .filter(ia => ia.document && ia.document.chemin)
        .map((ia) => {
          const chemin = ia.document?.chemin || '';
          console.log('Chemin du document après recherche:', {
            id: ia.id_ia,
            cheminLength: chemin.length,
            isBase64: chemin.startsWith('data:'),
            preview: chemin.substring(0, 50) + '...'
          });
          
          return {
            id: ia.id_ia,
            titre: formatTitle(ia.titre),
            username: ia.document?.user?.name || 'Utilisateur inconnu',
            icon: MdSchool,
            pdf: chemin
          };
        });

      console.log('Fiches formatées après recherche:', formattedFiches);
      setFiches(formattedFiches);
      setCurrent(0);
    } catch (error: any) {
      console.error('Error searching IAs:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Une erreur est survenue';
      setError(`Erreur lors de la recherche: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const prevFiche = (): void => {
    if (current > 0) {
      setDirection('left');
      setCurrent(prev => prev - 1);
      setShowPdf(false);
    }
  };

  const nextFiche = (): void => {
    if (current < fiches.length - 1) {
      setDirection('right');
      setCurrent(prev => prev + 1);
      setShowPdf(false);
    }
  };

  const handleAnimationEnd = (): void => setDirection('');

  const renderPdfPreview = (pdfData: string) => {
    console.log('Rendu du document (détaillé):', {
      length: pdfData?.length || 0,
      type: typeof pdfData,
      isBase64: pdfData?.startsWith('data:') || false,
      isUrl: pdfData?.startsWith('/storage/') || false,
      isImage: pdfData?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || false,
      isPdf: pdfData?.toLowerCase().endsWith('.pdf') || false,
      preview: pdfData ? pdfData.substring(0, 100) + '...' : null
    });

    if (!pdfData) {
      console.log('Pas de données disponibles pour le rendu');
      return (
        <div className="text-red-500 flex items-center justify-center p-4">
          <MdError className="mr-2" />
          <span>Aucun document disponible</span>
        </div>
      );
    }

    // Si c'est en base64
    if (pdfData.startsWith('data:')) {
      const mimeType = pdfData.split(';')[0].split(':')[1];
      console.log('Type MIME détecté pour base64:', mimeType);

      if (mimeType === 'application/pdf') {
        return (
          <div className="pdf-container bg-white rounded-lg shadow-lg p-4 w-[95vw] max-w-[1600px] mx-auto">
            <object
              data={pdfData}
              type="application/pdf"
              className="w-full h-[400px]"
            >
              <div className="text-red-500 flex items-center justify-center p-4">
                <MdError className="mr-2" />
                <span>Impossible de charger le PDF.</span>
                <a 
                  href={pdfData} 
                  download="document.pdf" 
                  className="text-blue-500 hover:underline ml-2 flex items-center"
                >
                  <MdDownload className="mr-1" />
                  Télécharger le PDF
                </a>
              </div>
            </object>
            <div className="flex justify-center mt-4">
              <a 
                href={pdfData} 
                download="document.pdf" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MdDownload />
                Télécharger le PDF
              </a>
            </div>
          </div>
        );
      }

      if (mimeType.startsWith('image/')) {
        return (
          <div className="image-container bg-white rounded-lg shadow-lg p-4 w-[95vw] max-w-[1600px] mx-auto">
            <img 
              src={pdfData} 
              alt="Document" 
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error('Erreur de chargement de l\'image base64:', e);
                e.currentTarget.src = '/images/error.png';
              }}
            />
            <div className="flex justify-center mt-4">
              <a 
                href={pdfData} 
                download="document.jpg" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MdDownload />
                Télécharger l'image
              </a>
            </div>
          </div>
        );
      }
    }

    // Si c'est une URL (commence par /storage/)
    if (pdfData.startsWith('/storage/')) {
      const fullUrl = `${window.location.origin}${pdfData}`;
      console.log('URL complète construite:', fullUrl);
      
      // Vérifier si c'est un PDF
      if (pdfData.toLowerCase().endsWith('.pdf')) {
        return (
          <div className="pdf-container bg-white rounded-lg shadow-lg p-4 w-[95vw] max-w-[1600px] mx-auto">
            <object
              data={fullUrl}
              type="application/pdf"
              className="w-full h-[400px]"
            >
              <div className="text-red-500 flex items-center justify-center p-4">
                <MdError className="mr-2" />
                <span>Impossible de charger le PDF.</span>
                <a 
                  href={fullUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline ml-2 flex items-center"
                >
                  <MdDownload className="mr-1" />
                  Télécharger le PDF
                </a>
              </div>
            </object>
            <div className="flex justify-center mt-4">
              <a 
                href={fullUrl} 
                download 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MdDownload />
                Télécharger le PDF
              </a>
            </div>
          </div>
        );
      }
      
      // Si c'est une image
      if (pdfData.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return (
          <div className="image-container bg-white rounded-lg shadow-lg p-4 w-[95vw] max-w-[1600px] mx-auto">
            <img 
              src={fullUrl} 
              alt="Document" 
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error('Erreur de chargement de l\'image:', e);
                e.currentTarget.src = '/images/error.png';
              }}
            />
            <div className="flex justify-center mt-4">
              <a 
                href={fullUrl} 
                download 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MdDownload />
                Télécharger l'image
              </a>
            </div>
          </div>
        );
      }
    }

    console.log('Format de document non supporté:', pdfData);
    return (
      <div className="text-red-500 flex items-center justify-center p-4">
        <MdError className="mr-2" />
        <span>Format de document non supporté</span>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
    <div className="app-bg">
      <div className="bg-deco">
        <div className="bg-deco-circle one"></div>
        <div className="bg-deco-circle two"></div>
        <div className="bg-deco-circle three"></div>
      </div>
        
        <div className="search-container">
        </div>

        {error && (
          <div className="error-message">
            <MdError />
            <span>{error}</span>
      </div>
        )}

        {loading ? (
          <div className="loading-message">Chargement...</div>
        ) : fiches.length > 0 ? (
          <>
      <div className="cards-row">
              <button 
                className="arrow left fav" 
                aria-label="Précédent" 
                onClick={prevFiche} 
                disabled={current === 0}
              >
          <MdArrowBack />
        </button>
        <div className="cards">
          <div className="card faded left-card">
            {fiches[current - 1] && (
              <span className="card-title">{fiches[current - 1].titre}</span>
            )}
          </div>
          <div
            className={`card main${direction ? ` slide-${direction}` : ''}`}
            onAnimationEnd={handleAnimationEnd}
          >
                  {showPdf && fiches[current]?.pdf ? (
                    renderPdfPreview(fiches[current].pdf)
                  ) : (
                    <div className="card-content">
                      <span className="card-title main-title">{fiches[current]?.titre}</span>
                    </div>
            )}
          </div>
          <div className="card faded right-card">
            {fiches[current + 1] && (
              <span className="card-title">{fiches[current + 1].titre}</span>
            )}
          </div>
        </div>
              <button 
                className="arrow right fav" 
                aria-label="Suivant" 
                onClick={nextFiche} 
                disabled={current === fiches.length - 1}
              >
          <MdArrowForward />
        </button>
      </div>
      <div className="bottom">
        <div className="title">
                {fiches[current] && `Fiche de Révision ${fiches[current].id} : ${fiches[current].titre}`}
        </div>
        <div className="actions">
          <button
            className="action-btn"
            onClick={() => setShowPdf(true)}
                  disabled={!fiches[current]?.pdf}
          >
            Aperçu Document
          </button>
        </div>
      </div>
          </>
        ) : (
          <div className="no-results">Aucun document trouvé</div>
        )}
    </div>
    <Footer />
    </AuthenticatedLayout>
  )
}

export default function App(): JSX.Element {
  return <PagePub />;
}