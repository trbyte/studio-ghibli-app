<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GhibliController extends Controller
{
    /**
     * Get cached films from Ghibli API.
     * Centralized caching logic with 3-second timeout.
     */
    public static function getCachedFilms()
    {
        return Cache::remember('ghibli_films', 3600, function () {
            $response = Http::timeout(3)->get('https://ghibliapi.vercel.app/films');

            if ($response->failed()) {
                Log::error('Ghibli API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return [];
            }

            return $response->json();
        });
    }

    /**
     * Fetch films from Ghibli API with caching and error handling.
     * This method can be called from other controllers or routes.
     */
    public static function fetchFilms()
    {
        try {
            return self::getCachedFilms();
        } catch (\Exception $e) {
            Log::error('Ghibli API exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    /**
     * Display the timeline with Studio Ghibli films.
     * Fetches data from external API with caching and error handling.
     */
    public function index()
    {
        $films = self::fetchFilms();

        return Inertia::render('Timeline', [
            'films' => $films,
        ]);
    }
}
