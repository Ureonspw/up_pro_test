import React, { useState } from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Footer from '@/Components/Footer';

import '../../../css/historique_page/historique_page.css'
import {
  MdSchool,
  MdDescription,
  MdHelpOutline,
  MdMenuBook,
  MdArrowBack,
  MdArrowForward
} from 'react-icons/md'
import { AiFillRead } from 'react-icons/ai'

interface Fiche {
  id: number;
  titre: string;
  icon: React.ComponentType;
  pdf: string;
}

const fiches: Fiche[] = [
  { id: 1, titre: "Java", icon: MdSchool, pdf: "/Cours de laravel.pdf" },
  { id: 2, titre: "Réseau", icon: MdDescription, pdf: "/Cours de laravel.pdf" },
  { id: 3, titre: "Maths", icon: MdHelpOutline, pdf: "/Cours de laravel.pdf" },
  { id: 4, titre: "Anglais", icon: MdMenuBook, pdf: "/Cours de laravel.pdf" },
  { id: 5, titre: "Lecture", icon: AiFillRead, pdf: "/Cours de laravel.pdf" },
]

interface TopIcon {
  icon: React.ReactNode;
  label: string;
}

function MainApp(): JSX.Element {
  const [current, setCurrent] = useState<number>(2)
  const [direction, setDirection] = useState<string>('');
  const [showPdf, setShowPdf] = useState<boolean>(false);

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

  const topIcons: TopIcon[] = [
    { icon: <MdSchool style={{ color: "#37925a", fontSize: "2rem" }} />, label: 'Méthode 1' },
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
    { icon: <MdHelpOutline style={{ color: "#37925a", fontSize: "2rem" }} />, label: 'Méthode 3' },
    { icon: <MdMenuBook style={{ color: "#37925a", fontSize: "2rem" }} />, label: 'Méthode 4' }
  ];

  return (
    <AuthenticatedLayout>

    <div className="app-bg">
      <div className="bg-deco">
        <div className="bg-deco-circle one"></div>
        <div className="bg-deco-circle two"></div>
        <div className="bg-deco-circle three"></div>
      </div>
      <div className="top-icons">
        {topIcons.map((item, idx) => (
          <button className="icon-btn fav" key={idx} aria-label={item.label}>
            {item.icon}
          </button>
        ))}
      </div>
      <div className="cards-row">
        <button className="arrow left fav" aria-label="Précédent" onClick={prevFiche} disabled={current === 0}>
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
            {showPdf && fiches[current].pdf ? (
              <iframe
                src={fiches[current].pdf}
                title="Aperçu PDF"
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '16px', background: "#fff", minHeight: 300 }}
              />
            ) : (
              <span className="card-title main-title">{fiches[current].titre}</span>
            )}
          </div>
          <div className="card faded right-card">
            {fiches[current + 1] && (
              <span className="card-title">{fiches[current + 1].titre}</span>
            )}
          </div>
        </div>
        <button className="arrow right fav" aria-label="Suivant" onClick={nextFiche} disabled={current === fiches.length - 1}>
          <MdArrowForward />
        </button>
      </div>
      <div className="bottom">
        <div className="title">
          Fiche de Révision {fiches[current].id} : {fiches[current].titre}
        </div>
        <div className="actions">
          <button
            className="action-btn"
            onClick={() => setShowPdf(true)}
            disabled={!fiches[current].pdf}
          >
            Aperçu PDF
          </button>
        </div>
      </div>
    </div>
    <Footer />

    </AuthenticatedLayout>


  )
}

export default function App(): JSX.Element {
  return <MainApp />;
}