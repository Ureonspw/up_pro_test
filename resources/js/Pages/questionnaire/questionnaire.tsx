import Classes from "../../../css/questionnaire/questionnaire.module.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function Questionnaire() {
    return (
        <AuthenticatedLayout>
            <div className={Classes.containerquestionnaire}>
                <div className={Classes.containerTitle}>
                    <div></div>
                    <div className={Classes.Title}>
                        {" "}
                        Questionnaires d'informatique{" "}
                    </div>
                    <div className={Classes.heure}>2h</div>
                </div>

                <div className={Classes.Questioncontainer}>
                    {/* Question 1 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 1.</div>
                            <div className={Classes.enoncerQuestion}>Quelle est la différence entre la RAM et la ROM ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 2 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 2.</div>
                            <div className={Classes.enoncerQuestion}>Qu'est-ce qu'un système d'exploitation ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 3.</div>
                            <div className={Classes.enoncerQuestion}>Donne un exemple de langage de programmation.</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 4 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 4.</div>
                            <div className={Classes.enoncerQuestion}>Qu'est-ce qu'une base de données ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 5 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 5.</div>
                            <div className={Classes.enoncerQuestion}>Qu'est-ce qu'un algorithme ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 6 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 6.</div>
                            <div className={Classes.enoncerQuestion}>Qu'est-ce qu'une adresse IP ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 7 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 7.</div>
                            <div className={Classes.enoncerQuestion}>Que signifie HTML ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 8 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 8.</div>
                            <div className={Classes.enoncerQuestion}>Qu'est-ce qu'un serveur web ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 9 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 9.</div>
                            <div className={Classes.enoncerQuestion}>Donne deux exemples de systèmes d'exploitation.</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                    {/* Question 10 */}
                    <div className={Classes.QuestionsPoserbloc}>
                        <div className={Classes.questioncontainernum}>
                            <div className={Classes.questionnum}> Question 10.</div>
                            <div className={Classes.enoncerQuestion}>À quoi sert un navigateur web ?</div>
                            <div className={Classes.propreponse}>
                                <input type="text" placeholder="Entre ta réponse ici" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Questionnaire;
