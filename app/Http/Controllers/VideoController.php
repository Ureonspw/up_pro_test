<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function create()
    {
        return Inertia::render('profsVidUp/profviUp', [
            'user_id' => Auth::id()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'youtube_id' => 'required|string',
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id'
        ]);

        // Extraire l'ID YouTube de l'URL si nécessaire
        $youtubeId = $this->extractYoutubeId($request->youtube_id);

        // Vérifier si la vidéo existe déjà pour éviter les doublons
        $existingVideo = Video::where('youtube_id', $youtubeId)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingVideo) {
            return redirect()->back()->with('error', 'Cette vidéo existe déjà dans votre collection !');
        }

        $video = Video::create([
            'youtube_id' => $youtubeId,
            'titre' => $request->titre,
            'description' => $request->description,
            'user_id' => $request->user_id
        ]);

        return redirect()->back()->with('success', 'Vidéo enregistrée avec succès !');
    }

    private function extractYoutubeId($url)
    {
        $pattern = '/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/';
        preg_match($pattern, $url, $matches);
        return isset($matches[2]) ? $matches[2] : $url;
    }

    public function index()
    {
        // Nettoyer les doublons potentiels (à exécuter une seule fois)
        $this->cleanDuplicates();

        $videos = Video::with('user')
            ->orderBy('created_at', 'desc') // Trier par date de création
            ->get()
            ->unique('youtube_id') // Éviter les doublons par youtube_id
            ->map(function ($video) {
                return [
                    'id' => $video->id_video, // Utiliser id_video au lieu de id
                    'title' => $video->titre,
                    'thumbnail' => "https://img.youtube.com/vi/{$video->youtube_id}/maxresdefault.jpg",
                    'videoUrl' => "https://www.youtube.com/embed/{$video->youtube_id}?autoplay=1",
                    'description' => $video->description,
                    'author' => $video->user->name,
                    'views' => 0,
                    'date' => $video->created_at->format('Y-m-d')
                ];
            });

        return Inertia::render('videos_page/VideoGallery', [
            'videos' => $videos
        ]);
    }

    /**
     * Nettoie les doublons dans la table videos
     */
    private function cleanDuplicates()
    {
        // Supprimer les doublons basés sur youtube_id et user_id
        $duplicates = Video::select('youtube_id', 'user_id')
            ->groupBy('youtube_id', 'user_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $duplicate) {
            $videos = Video::where('youtube_id', $duplicate->youtube_id)
                ->where('user_id', $duplicate->user_id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Garder seulement la première vidéo (la plus récente)
            if ($videos->count() > 1) {
                $videos->skip(1)->each(function ($video) {
                    $video->delete();
                });
            }
        }
    }
} 