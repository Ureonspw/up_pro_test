import styles from '../../../css/menu_principal/homepage.module.css';
import { IoArrowBackOutline } from "react-icons/io5";
import { IoChevronForward } from "react-icons/io5";
import { FaRegFileLines } from "react-icons/fa6";
import { PiBookOpenTextBold } from "react-icons/pi";
import { MdOutlineQuiz } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { Link } from '@inertiajs/react';

interface CardItem {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string; // lien vers la page
}

const cards: CardItem[] = [
  {
    title: "Quizz",
    description: "Test tes connaissance dans un QCM ludique",
    icon: < HiOutlineAcademicCap />,
    path: "/importation_quizz"
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
    title: "FlashCard",
    description: "Révise rapidement pour vérifier si tu maîtrises les notions essentielles",
    icon: <FaRegFileLines />,
    path: "/flashcard"
  },
];

const HomePage: React.FC = () => {
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

export default HomePage;
