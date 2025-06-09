import { useState, ChangeEvent, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import styles from '../../../css/profsvidUp/profsvidUp.module.css';

interface Props {
    user_id: number;
}

interface FormData {
    youtube_id: string;
    titre: string;
    description: string;
    user_id: number;
}

function ProfviUp({ user_id }: Props) {
    const [formData, setFormData] = useState<FormData>({
        youtube_id: '',
        titre: '',
        description: '',
        user_id: user_id
    });

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await router.post('/videos', {
                youtube_id: formData.youtube_id,
                titre: formData.titre,
                description: formData.description,
                user_id: formData.user_id
            }, {
                onSuccess: () => {
                    setFormData({
                        youtube_id: '',
                        titre: '',
                        description: '',
                        user_id: user_id
                    });
                    setSuccess('La vidéo a été enregistrée avec succès !');
                    // Faire disparaître le message après 5 secondes
                    setTimeout(() => {
                        setSuccess('');
                    }, 5000);
                },
                onError: (errors) => {
                    setError(errors.message || 'Une erreur est survenue lors de l\'enregistrement de la vidéo.');
                }
            });
        } catch (err) {
            setError('Une erreur est survenue lors de l\'enregistrement de la vidéo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour extraire l'ID YouTube de différentes URL formats
    const getYoutubeId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    };

    const youtubeId = getYoutubeId(formData.youtube_id);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Uploader une vidéo YouTube</h1>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className={styles.successMessage}>
                        {success}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="youtube_id">Lien YouTube</label>
                    <input
                        type="text"
                        id="youtube_id"
                        name="youtube_id"
                        className={styles.input}
                        value={formData.youtube_id}
                        onChange={handleInputChange}
                        placeholder="Collez le lien YouTube ici"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="titre">Titre</label>
                    <input
                        type="text"
                        id="titre"
                        name="titre"
                        className={styles.input}
                        value={formData.titre}
                        onChange={handleInputChange}
                        placeholder="Entrez le titre de la vidéo"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className={styles.textarea}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Entrez la description de la vidéo"
                        required
                    />
                </div>

                {youtubeId && (
                    <div className={styles.previewContainer}>
                        <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title="YouTube video preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}

                <button 
                    type="submit" 
                    className={styles.uploadButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer la vidéo'}
                </button>
            </form>
        </div>
    );
}

export default ProfviUp;