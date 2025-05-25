import styles from '../../../css/acceuil_page/accueil.module.css';
import accueil from '../../../assets/photo/acceui_page/Studying-bro.svg'
import { Link } from '@inertiajs/react';
import { FaUserPlus } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";

import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa6";
import { BiLogInCircle } from "react-icons/bi";
import { usePage } from '@inertiajs/react';

export default function Accueil() {
  const { auth } = usePage().props;

  return (
    <>
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>E~Learning</div>

        <nav className={styles.navbar}>
          <span>Accueil</span>
          <span>Services</span>
          <span>À propos</span>
          <span>Contact</span>
        </nav>
        
        <div className={styles.headerIcons}>
          {auth.user ? (
            <div className={styles.icond}>
              <Link href={route('dashboard')} className={styles.dashboardButton}>
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.icon}>
                <Link href={route('login')}>
                  <BiLogInCircle />
                </Link>
              </div>
              <div className={styles.icon2}>
                <Link href={route('register')}>
                  <FaUserPlus />
                </Link>
              </div>
            </>
          )}
        </div>


      </header>

      <main className={styles.main}>
        <section className={styles.leftSection}>
          <h1 className={styles.title}>Découvre notre plateforme ! </h1>
          <h1  className={styles.title}>Apprends efficacement avec nos outils modernes.</h1>
          <p className={styles.subtitle}>
          Notre solution vise à simplifier l'apprentissage à l'ère du numérique.
          </p>


        
          <div className={styles.contenuvus}>
            <div className={styles.menu1}>
                <span><FaBook />                </span>
                <h3>QCM</h3>
            </div>
            <div className={styles.menu2}>
                <span><IoCheckmarkDoneCircle /></span>
                <h3>Révision</h3>
            </div>
            <div className={styles.menu3}>
                <span><MdAssignment /></span>
                <h3>Tests</h3>
            </div>
        </div>

        </section>

        <section className={styles.rightSection}>
        
            <img src={accueil} alt="e-learning illustration" className={styles.imageInside} />
          
        </section>
      </main>
    </div>
    </>
  );
}
