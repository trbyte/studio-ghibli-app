<?php

namespace App\Http\Controllers;

use App\Models\FilmAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FilmActionController extends Controller
{
    /**
     * Store or update a film action for the authenticated user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'film_id' => 'required|string',
            'action_type' => 'required|in:favorite,plan,on_hold,dropped,finished',
        ]);

        // Create or update the film action
        FilmAction::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'film_id' => $request->film_id,
            ],
            [
                'action_type' => $request->action_type,
            ]
        );

        return redirect()->back();
    }

    /**
     * Update a film action's personal note.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'note' => 'nullable|string|max:500',
        ]);

        // Find the film action and ensure it belongs to the authenticated user
        $filmAction = FilmAction::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Update the note
        $filmAction->update([
            'note' => $request->note,
        ]);

        return redirect()->back();
    }

    /**
     * Get user's film actions merged with API film data.
     */
    public function getUserList()
    {
        // Fetch user's film actions
        $userActions = FilmAction::where('user_id', Auth::id())->get();

        // Fetch films from API with caching
        try {
            $films = \App\Http\Controllers\GhibliController::getCachedFilms();

            // Create a lookup map for films by ID
            $filmsMap = collect($films)->keyBy('id');

            // Map user actions and merge with API data
            $mergedData = $userActions->map(function ($action) use ($filmsMap) {
                $film = $filmsMap->get($action->film_id);

                return [
                    'id' => $action->id,
                    'film_id' => $action->film_id,
                    'action_type' => $action->action_type,
                    'note' => $action->note,
                    'film_title' => $film['title'] ?? 'Unknown Film',
                    'image' => $film['image'] ?? $film['movie_banner'] ?? null,
                ];
            });

            return response()->json($mergedData);
        } catch (\Exception $e) {
            Log::error('Error fetching films in getUserList', [
                'message' => $e->getMessage(),
            ]);

            // Return user actions without film data if API fails
            $fallbackData = $userActions->map(function ($action) {
                return [
                    'id' => $action->id,
                    'film_id' => $action->film_id,
                    'action_type' => $action->action_type,
                    'note' => $action->note,
                    'film_title' => 'Film data unavailable',
                    'image' => null,
                ];
            });

            return response()->json($fallbackData);
        }
    }
}
