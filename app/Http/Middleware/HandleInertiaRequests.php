<?php

namespace App\Http\Middleware;

use App\Models\FilmAction;
use Illuminate\Http\Request;
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
            $actions = FilmAction::where('user_id', $user->id)
                ->get()
                ->groupBy('action_type')
                ->map(function ($items) {
                    return $items->map(function ($item) {
                        return [
                            'id' => $item->film_id,
                            'title' => $item->film_title,
                        ];
                    })->values()->toArray();
                });

            $userList = [
                'favorite' => $actions->get('favorite', []),
                'plan' => $actions->get('plan', []),
                'on_hold' => $actions->get('on_hold', []),
                'dropped' => $actions->get('dropped', []),
                'finished' => $actions->get('finished', []),
            ];
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
