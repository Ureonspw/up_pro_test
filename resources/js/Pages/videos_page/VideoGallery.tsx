import React, { useState, useCallback, useMemo } from 'react';
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

// Composant séparé pour la carte vidéo
const VideoCard: React.FC<{
    video: Video;
    onClick: (video: Video) => void;
}> = React.memo(({ video, onClick }) => (
    <div 
        className={styles.card}
        onClick={() => onClick(video)}
    >
        <div className={styles.thumbnailContainer}>
            <img 
                src={video.thumbnail} 
                alt={video.title}
                className={styles.thumbnail}
                loading="lazy"
            />
        </div>
        <div className={styles.info}>
            <h3 className={styles.title}>{video.title}</h3>
            <p className={styles.author}>{video.author}</p>
            <p className={styles.views}>{video.views} vues • {video.date}</p>
        </div>
    </div>
));

// Composant séparé pour le lecteur vidéo
const VideoPlayer: React.FC<{
    video: Video;
    onBack: () => void;
}> = React.memo(({ video, onBack }) => (
    <div className={styles.playerSection}>
        <div className={styles.player}>
            <div className={styles.videoWrapper}>
                <iframe
                    src={video.videoUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.mainVideo}
                />
            </div>
            <div className={styles.playerInfo}>
                <h2 className={styles.playerTitle}>{video.title}</h2>
                <p className={styles.metaInfo}>
                    {video.views} vues • {video.date}
                </p>
                <p className={styles.author}>Par {video.author}</p>
                <p className={styles.description}>{video.description}</p>
            </div>
        </div>
        <button 
            className={styles.backButton}
            onClick={onBack}
        >
            Retour à la galerie
        </button>
    </div>
));

const VideoGallery: React.FC<Props> = ({ videos }) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    // Utiliser useCallback pour éviter les re-rendus inutiles
    const handleVideoClick = useCallback((video: Video) => {
        setSelectedVideo(video);
    }, []);

    const handleBackToGallery = useCallback(() => {
        setSelectedVideo(null);
    }, []);

    // Utiliser useMemo pour optimiser le rendu de la grille
    const videoGrid = useMemo(() => (
        <div className={styles.grid}>
            {videos.map((video) => (
                <VideoCard
                    key={`video-${video.id}`}
                    video={video}
                    onClick={handleVideoClick}
                />
            ))}
        </div>
    ), [videos, handleVideoClick]);

    return (
        <AuthenticatedLayout>
            <Head title="Galerie de Vidéos" />
            
            <div className={styles.container}>
                {selectedVideo ? (
                    <VideoPlayer
                        video={selectedVideo}
                        onBack={handleBackToGallery}
                    />
                ) : (
                    videoGrid
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default VideoGallery; 