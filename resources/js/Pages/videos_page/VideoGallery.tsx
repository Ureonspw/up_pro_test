import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import styles from './VideoGallery.module.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Video {
    id: number;
    title: string;
    thumbnail: string;
    videoUrl: string;
    description: string;
    author: string;
    views: number;
    date: string;
}

interface Props {
    videos: Video[];
}

const VideoGallery: React.FC<Props> = ({ videos }) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const handleVideoClick = (video: Video) => {
        setSelectedVideo(video);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Galerie de Vidéos" />
            
            <div className={styles.container}>
                {selectedVideo ? (
                    <div className={styles.playerSection}>
                        <div className={styles.player}>
                            <div className={styles.videoWrapper}>
                                <iframe
                                    src={selectedVideo.videoUrl}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className={styles.mainVideo}
                                />
                            </div>
                            <div className={styles.playerInfo}>
                                <h2 className={styles.playerTitle}>{selectedVideo.title}</h2>
                                <p className={styles.metaInfo}>
                                    {selectedVideo.views} vues • {selectedVideo.date}
                                </p>
                                <p className={styles.author}>Par {selectedVideo.author}</p>
                                <p className={styles.description}>{selectedVideo.description}</p>
                            </div>
                        </div>
                        <button 
                            className={styles.backButton}
                            onClick={() => setSelectedVideo(null)}
                        >
                            Retour à la galerie
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {videos.map((video) => (
                            <div 
                                key={video.id} 
                                className={styles.card}
                                onClick={() => handleVideoClick(video)}
                            >
                                <div className={styles.thumbnailContainer}>
                                    <img 
                                        src={video.thumbnail} 
                                        alt={video.title}
                                        className={styles.thumbnail}
                                    />
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.title}>{video.title}</h3>
                                    <p className={styles.author}>{video.author}</p>
                                    <p className={styles.views}>{video.views} vues • {video.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default VideoGallery; 