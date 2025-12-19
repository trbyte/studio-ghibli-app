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
     * 
     * Toggle rules:
     * - "favorite" and "plan" can be active simultaneously
     * - "on_hold", "dropped", and "finished" are mutually exclusive (only one can be active)
     * - Status actions (on_hold, dropped, finished) can coexist with favorite/plan
     */
    public function store(Request $request)
    {
        $request->validate([
            'film_id' => 'required|string',
            'action_type' => 'required|in:favorite,plan,on_hold,dropped,finished',
        ]);

        $userId = Auth::id();
        $filmId = $request->film_id;
        $actionType = $request->action_type;

        // Status actions that are mutually exclusive
        $statusActions = ['on_hold', 'dropped', 'finished'];
        
        // Check if this specific action already exists
        $existingAction = FilmAction::where('user_id', $userId)
            ->where('film_id', $filmId)
            ->where('action_type', $actionType)
            ->first();

        if ($existingAction) {
            // Toggle: Remove the action if it's already set
            $existingAction->delete();
        } else {
            // If clicking a status action, remove any other status actions first
            if (in_array($actionType, $statusActions)) {
                FilmAction::where('user_id', $userId)
                    ->where('film_id', $filmId)
                    ->whereIn('action_type', $statusActions)
                    ->delete();
            }
            
            // Create the new action
            FilmAction::create([
                'user_id' => $userId,
                'film_id' => $filmId,
                'action_type' => $actionType,
            ]);
        }

        return redirect()->back();
    }

    /**
     * Update a film action's personal note.
     * Updates ALL film actions for this film_id to share the same note.
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

        // Update ALL film actions for this film_id to share the same note
        FilmAction::where('user_id', Auth::id())
            ->where('film_id', $filmAction->film_id)
            ->update([
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
