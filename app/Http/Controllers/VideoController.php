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
        $videos = Video::with('user')->get()->map(function ($video) {
            return [
                'id' => $video->id,
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
} 