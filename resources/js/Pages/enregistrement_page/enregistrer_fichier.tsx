import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import '../../../css/enregistrement_fichier/enregistrer_fichier.css'

interface Method {
  icon: JSX.Element;
  label: string;
}

interface DisciplinePDFs {
  [key: string]: string;
}

interface Matiere {
  id_Matiere: number;
  nom: string;
  description: string;
  id_Ue: number;
}

interface IAResponse {
  ia: {
    titre: string;
    contenu_ia: string;
    ID_type_IA: number;
    id_doc: number;
    created_at: string;
    updated_at: string;
    id_ia: number;
  };
}

interface Props {
  auth: {
    user: {
      name: string;
    };
  };
}

function enregistrement_page({ auth }: Props): JSX.Element {
  const [selectedMethod, setSelectedMethod] = useState<number>(0)
  const [discipline, setDiscipline] = useState<string>('')
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [fileName, setFileName] = useState<string>('')

  const disciplinePDFs: DisciplinePDFs = {
    'Informatique': '/Cours de laravel.pdf',
    'java': '/Cours de laravel.pdf',
    'reseau': '/Cours de laravel.pdf',
    'secu': '/Cours de laravel.pdf'
  }
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedPdfBase64 = localStorage.getItem('pdfBase64');
    if (storedPdfBase64) {
      setPdfUrl(storedPdfBase64);
    }
  }, []);

  useEffect(() => {
    // Fetch matieres from API
    fetch('/api/matieres')
      .then(response => response.json())
      .then(data => {
        setMatieres(data);
        if (data.length > 0) {
          setDiscipline(data[0].nom); // Set first matiere as default
        }
      })
      .catch(error => console.error('Error fetching matieres:', error));
  }, []);
  

  const methods: Method[] = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L2 9l10 6 10-6-10-6zm0 13.09L4.47 12.6 12 17l7.53-4.4L12 16.09z" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      label: 'questionnaire'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
          <line x1="8" y1="8" x2="16" y2="8" stroke="#388e5a" strokeWidth="1.5"/>
          <line x1="8" y1="12" x2="16" y2="12" stroke="#388e5a" strokeWidth="1.5"/>
          <line x1="8" y1="16" x2="12" y2="16" stroke="#388e5a" strokeWidth="1.5"/>
        </svg>
      ),
      label: 'Resumer'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
          <path d="M12 8v2a2 2 0 0 1 2 2c0 1-1 2-2 2" stroke="#388e5a" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="17" r="1" fill="#388e5a"/>
        </svg>
      ),
      label: 'Doc_prof'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
          <path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H4" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
          <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      label: 'autre_doc'
    }
  ]

  const handleSave = async () => {
    try {
      const documentId = 1; // ID du document par défaut
      const fullFileName = `${auth.user.name}_${fileName}`; // Ajouter le nom de l'utilisateur au début
      const data = {
        titre: fullFileName,
        contenu_ia: pdfUrl || disciplinePDFs[discipline],
        id_type_IA: selectedMethod + 1,
        id_doc: documentId
      };

      console.log('Sending data:', data);

      router.post(`/generate-ia/${documentId}`, data, {
        preserveScroll: true,
        onSuccess: () => {
          // Le PDF est déjà affiché dans l'iframe
          alert('Document enregistré avec succès!');
        },
        onError: (errors) => {
          console.error('Error details:', errors);
          alert('Erreur lors de l\'enregistrement du document: ' + JSON.stringify(errors));
        }
      });
    } catch (error: any) {
      console.error('Full error object:', error);
      alert('Erreur lors de l\'enregistrement du document: ' + JSON.stringify(error));
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <button 
        className="back-btn" 
        aria-label="Retour"
        onClick={() => router.visit('/resumer_page')}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="none"/>
          <path d="M17 8L11 14L17 20" stroke="#388e5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="main-card">
        <div className="left-rect">
        <iframe
  src={pdfUrl || disciplinePDFs[discipline]}
  title="Aperçu PDF"
  style={{ width: '100%', height: '100%' }}
/>
        </div>
        <div className="form-section">
          <label>NOM DE FICHIER :</label>
          <input 
            type="text" 
            className='file-name' 
            placeholder='Entrez le nom du fichier'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <label>METHODE :</label>
          <div className="method-icons">
            {methods.map((m, i) => (
              <div
                key={i}
                className={`method-icon${selectedMethod === i ? ' selected' : ''}`}
                onClick={() => setSelectedMethod(i)}
                title={m.label}
              >
                {m.icon}
              </div>
            ))}
          </div>
          <label>Matiere :</label>
          <br />
          <select 
            value={discipline} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDiscipline(e.target.value)}
          >
            {matieres.map((matiere) => (
              <option key={matiere.id_Matiere} value={matiere.nom}>
                {matiere.nom}
              </option>
            ))}
          </select>
          <br />
          <button className="save-btn" onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default enregistrement_page