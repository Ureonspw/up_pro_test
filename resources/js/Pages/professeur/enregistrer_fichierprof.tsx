import { useEffect, useState } from 'react'
import styles from '../../../css/enregistrement_fichier/enregistrer_fichier.module.css'

interface Method {
  icon: JSX.Element;
  label: string;
}

interface DisciplinePDFs {
  [key: string]: string;
}

interface EnregistrementPageProps {
  uploadedFile: {
    type: string;
    file: string;
    imageUrl: string;
  };
}

function EnregistrementPage({ uploadedFile }: EnregistrementPageProps): JSX.Element {
  const [selectedMethod, setSelectedMethod] = useState<number>(0)
  const [discipline, setDiscipline] = useState<string>('Informatique')

  const disciplinePDFs: DisciplinePDFs = {
    'Informatique': '/Cours de laravel.pdf',
    'java': '/Cours de laravel.pdf',
    'reseau': '/Cours de laravel.pdf',
    'secu': '/Cours de laravel.pdf'
  }
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedFile) {
      setPdfUrl(`data:${uploadedFile.type};base64,${uploadedFile.file}`);
    }
  }, [uploadedFile]);
  

  const methods: Method[] = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L2 9l10 6 10-6-10-6zm0 13.09L4.47 12.6 12 17l7.53-4.4L12 16.09z" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      label: 'Méthode 1'
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
      label: 'Méthode 2'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
          <path d="M12 8v2a2 2 0 0 1 2 2c0 1-1 2-2 2" stroke="#388e5a" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="17" r="1" fill="#388e5a"/>
        </svg>
      ),
      label: 'Méthode 3'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
          <path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H4" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
          <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="#388e5a" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      label: 'Méthode 4'
    }
  ]

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container} style={{ position: 'relative', minHeight: '100vh' }}>
        <button className={styles['back-btn']} aria-label="Retour">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" fill="none"/>
            <path d="M17 8L11 14L17 20" stroke="#388e5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles['main-card']}>
          <div className={styles['left-rect']}>
            <iframe
              src={pdfUrl || disciplinePDFs[discipline]}
              title="Aperçu PDF"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className={styles['form-section']}>
            <label>NOM DE FICHIER :</label>
            <input type="text" className={styles['file-name']} placeholder='Entrez le nom du fichier'/>
            <label>METHODE :</label>
            <div className={styles['method-icons']}>
              {methods.map((m, i) => (
                <div
                  key={i}
                  className={`${styles['method-icon']} ${selectedMethod === i ? styles['selected'] : ''}`}
                  onClick={() => setSelectedMethod(i)}
                  title={m.label}
                >
                  {m.icon}
                </div>
              ))}
            </div>
            <label>DISCIPLINE :</label>
            <br />
            <select 
              value={discipline} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDiscipline(e.target.value)}
            >
              <option>Informatique</option>
              <option>java</option>
              <option>reseau</option>
              <option>secu</option>
            </select>
            <br />
            <button className={styles['save-btn']}>Enregistrer</button>
            <button className={styles['save-btn']}>sauvegarder</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default EnregistrementPage