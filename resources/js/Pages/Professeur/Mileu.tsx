import styles from '../../../css/menu_principal/homepageprof.module.css';
import { IoArrowBackOutline } from "react-icons/io5";
import { IoChevronForward } from "react-icons/io5";
import { FaRegFileLines } from "react-icons/fa6";
import { PiBookOpenTextBold } from "react-icons/pi";
import { MdOutlineQuiz } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';   

interface CardItem {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string; // lien vers la page
}

const cards: CardItem[] = [
  {
    title: "Video",
    description: "ajoute des video pour les apprenant",
    icon: < HiOutlineAcademicCap />,
    path: "/prof_video"
  },
  {
    title: "Resumer",
    description: "Resume ton cours pour un apprentissage rapide",
    icon: <PiBookOpenTextBold />,
    path: "/resumer_page"
  },
  {
    title: "Questionnaire",
    description: "Un questionnaire téléchargeable pour tester tes connaissances partout et à tout moment",
    icon: <MdOutlineQuiz />,
    path: "/questionnaire"
  },
  {
    title: "Publication",
    description: "mettre a la disposition de tous mes documents",
    icon: <FaRegFileLines />,
    path: "/import_prof"
  },
  {
    title: "ExamCode",
    description: "Créer un examen avec des questions et des réponses pour evaluer les eleves en temps reel",
    icon: <FaRegFileLines />,
    path: "/professeur/examens"
  },
];

const milieu: React.FC = () => {
//   const navigate = useNavigate();

return (
    <div className={styles.pageContainer}>
      {/* Back Button */}
      <div className={styles.backButton} >
        <IoArrowBackOutline color="#2e7d32" size ={30} />
      </div>
  
      {/* Card Grid */}
      <div className={styles.cardGrid}>
        {cards.map((card, index) => (
          <div key={index} className={styles.card}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <div>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
            </div>
            <Link href={card.path} className={styles.backButton2}>
              <IoChevronForward size={20} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default milieu;

  