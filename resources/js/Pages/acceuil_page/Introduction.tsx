import Classes from "../../../css/acceuil_page/introduction.module.css";
import { GiSpellBook } from "react-icons/gi";
import { TfiBarChart } from "react-icons/tfi";
import { FaBrain } from "react-icons/fa";
import { TbLogin2 } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import imginfo from "../../../assets/photo/acceui_page/Kids Studying from Home-bro.svg"
import { router } from "@inertiajs/react";
function Introduction() {
  return (
    <>
      <div className={Classes.containerbox1}>
        <div className={Classes.containerboxson1}>
          <div className={Classes.containerboxson1title}>
            QUI SOMMES NOUS <span>?</span>
          </div>
          <div className={Classes.containerboxson1content}>
            Nous sommes une équipe engagée dans la transformation numérique de
            l’apprentissage. Notre mission est d’offrir une plateforme
            e-learning moderne, accessible et interactive, adaptée aux besoins
            des apprenants d’aujourd’hui. À travers des contenus de qualité, des
            outils intelligents et une approche flexible, nous permettons à
            chacun de progresser à son rythme, où qu’il soit. Convaincus que
            l’éducation doit être innovante et stimulante, nous intégrons des
            technologies avancées pour favoriser une expérience d’apprentissage
            fluide et efficace. Rejoignez-nous et faites partie d’une nouvelle
            ère de formation, où savoir et performance vont de pair.{" "}
          </div>
        </div>
        <div className={Classes.containerboxson2}> <img src={imginfo} alt="" /></div>
      </div>
      <div className={Classes.objectifcontainer}>
        <div className={Classes.objectifcontainerson1}>
          L’intelligence artificielle au service de votre apprentissage
        </div>
        <div className={Classes.objectifcontainerson2}>
          Notre plateforme combine l’Intelligence Artificielle et les principes
          de l’apprentissage moderne pour vous offrir une expérience éducative
          innovante, interactive et parfaitement adaptée à vos besoins.
        </div>
        <div className={Classes.objectifcontainerson3}>
          <div className={Classes.objectifcontainerson3box1}>
            <div className={Classes.objectifcontainerson3box1son1}>
              <div className={Classes.objectifcontainerson3box1son1img}>
                <GiSpellBook />
              </div>
            </div>
            <div className={Classes.objectifcontainerson3box1son2}>
              Un apprentissage interactif
            </div>
            <div className={Classes.objectifcontainerson3box1son3}>
              <span>Accédez à des cours dynamiques et engageants </span> avec
              des supports variés, des exercices pratiques et des évaluations
              adaptées pour renforcer votre compréhension.
            </div>
          </div>
          <div className={Classes.objectifcontainerson3box1}>
            <div className={Classes.objectifcontainerson3box1son1}>
              <div className={Classes.objectifcontainerson3box1son1img}>
                <FaBrain />
              </div>
            </div>
            <div className={Classes.objectifcontainerson3box1son2}>
              Une gestion intelligente des ressources
            </div>
            <div className={Classes.objectifcontainerson3box1son3}>
              <span>
                Organisez et retrouvez facilement vos supports pédagogiques{" "}
              </span>
              grâce à un espace structuré où chaque fichier peut être analysé et
              exploité pour en tirer des fiches de révision et des
              questionnaires.{" "}
            </div>
          </div>
          <div className={Classes.objectifcontainerson3box1}>
            <div className={Classes.objectifcontainerson3box1son1}>
              <div className={Classes.objectifcontainerson3box1son1img}>
                <TfiBarChart />
              </div>
            </div>
            <div className={Classes.objectifcontainerson3box1son2}>
              Un suivi personnalisé
            </div>
            <div className={Classes.objectifcontainerson3box1son3}>
              <span>
                Progressez à votre rythme avec des outils intelligents
              </span>
              qui facilitent l’évaluation de vos acquis, vous permettent de
              tester vos connaissances et d’optimiser votre apprentissage en
              fonction de vos résultats.{" "}
            </div>
          </div>
        </div>
      </div>
      <div className={Classes.methodConn_container}>
        <div className={Classes.methodConn_containertitle}>
          METHODES DE CONNEXION
        </div>
        <div className={Classes.methodcontainerson}>
          <div className={Classes.methodcontainerson1}>
            <div className={Classes.methodcontainerson1title}>ETUDIANT</div>
            <div className={Classes.methodcontainerson1container}>
              <div className={Classes.methodcontainerson1containerimg}>
                <PiStudentBold />
              </div>
              <div className={Classes.methodcontainerson1containercontent}>
                En tant qu’élève, vous accédez à une plateforme d’apprentissage
                interactive conçue pour vous accompagner tout au long de votre
                parcours. Profitez de cours adaptés à votre niveau, de fiches de
                révision générées automatiquement et d’exercices interactifs
                pour tester vos connaissances. Suivez vos progrès en temps réel
                et avancez à votre rythme grâce à un suivi personnalisé.
                <div
                  className={Classes.methodcontainerson1containercontent_con}
                >
                  {" "}
                  <span onClick={() => router.visit("login")}>
                    Se connecter <TbLogin2 />
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className={Classes.methodcontainerson1}>
            <div className={Classes.methodcontainerson1title}>PROFESSEUR</div>
            <div className={Classes.methodcontainerson1container}>
              <div className={Classes.methodcontainerson1containerimg}>
                <FaChalkboardTeacher />
              </div>
              <div className={Classes.methodcontainerson1containercontent}>
                En tant qu’enseignant, vous bénéficiez d’un espace dédié pour
                organiser et structurer vos cours en toute simplicité.
                Téléchargez vos supports pédagogiques, créez des quiz
                interactifs et suivez les performances de vos élèves grâce à des
                outils d’analyse avancés. Notre plateforme vous permet d’offrir
                un enseignement plus dynamique, interactif et efficace.{" "}
                <div
                  className={Classes.methodcontainerson1containercontent_con}
                >
                  {" "}
                  <span onClick={() => router.visit("login")}>
                    Se connecter <TbLogin2 />
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Introduction;
