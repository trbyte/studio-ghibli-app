<?php

namespace App\Http\Middleware;

use App\Http\Controllers\GhibliController;
use App\Models\FilmAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userList = [];

        if ($user) {
            // Fetch user's film actions
            $actions = FilmAction::where('user_id', $user->id)->get();

            // Fetch films from API with caching (60 minutes)
            try {
                $films = GhibliController::getCachedFilms();

                // Create a lookup map for films by ID
                $filmsMap = collect($films)->keyBy('id');

                // Map actions with film titles from API
                $actionsByType = $actions->groupBy('action_type')->map(function ($items) use ($filmsMap) {
                    return $items->map(function ($item) use ($filmsMap) {
                        $film = $filmsMap->get($item->film_id);
                        return [
                            'id' => $item->film_id,
                            'title' => $film['title'] ?? 'Unknown Film',
                        ];
                    })->values()->toArray();
                });

                $userList = [
                    'favorite' => $actionsByType->get('favorite', []),
                    'plan' => $actionsByType->get('plan', []),
                    'on_hold' => $actionsByType->get('on_hold', []),
                    'dropped' => $actionsByType->get('dropped', []),
                    'finished' => $actionsByType->get('finished', []),
                ];
            } catch (\Exception $e) {
                Log::error('Error in HandleInertiaRequests', ['message' => $e->getMessage()]);
                $userList = [
                    'favorite' => [],
                    'plan' => [],
                    'on_hold' => [],
                    'dropped' => [],
                    'finished' => [],
                ];
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'userList' => $userList,
        ];
    }
}
