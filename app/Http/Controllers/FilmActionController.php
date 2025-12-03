<?php

namespace App\Http\Controllers;

use App\Models\FilmAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FilmActionController extends Controller
{
    /**
     * Store a new film action or toggle existing one.
     */
    public function store(Request $request)
    {
        $request->validate([
            'film_id' => 'required|string',
            'film_title' => 'required|string',
            'action_type' => 'required|in:favorite,plan,on_hold,dropped,finished',
        ]);

        $user = Auth::user();
        $actionType = $request->action_type;

        // Check if exact action already exists → toggle off
        $existingAction = FilmAction::where('user_id', $user->id)
            ->where('film_id', $request->film_id)
            ->where('action_type', $actionType)
            ->first();

        if ($existingAction) {
            $existingAction->delete();
            return redirect()->back();
        }

        // ============================
        //  GROUP 1: favorite + plan
        //  → Can coexist with anything
        // ============================
        if (in_array($actionType, ['favorite', 'plan'])) {
            FilmAction::create([
                'user_id' => $user->id,
                'film_id' => $request->film_id,
                'film_title' => $request->film_title,
                'action_type' => $actionType,
            ]);
            return redirect()->back();
        }

        // ===================================
        //  GROUP 2: on_hold + dropped + finished
        //  → Mutually exclusive with each other
        //  → DO NOT affect favorite or plan
        // ===================================
        $statusGroup = ['on_hold', 'dropped', 'finished'];

        // Delete ONLY the statuses from the same group
        FilmAction::where('user_id', $user->id)
            ->where('film_id', $request->film_id)
            ->whereIn('action_type', $statusGroup)
            ->delete();

        // Create the new status
        FilmAction::create([
            'user_id' => $user->id,
            'film_id' => $request->film_id,
            'film_title' => $request->film_title,
            'action_type' => $actionType,
        ]);

        return redirect()->back();
    }

    /**
     * Get user's film actions grouped by type.
     */
    public function getUserList()
    {
        $user = Auth::user();
        
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

        return response()->json([
            'favorite' => $actions->get('favorite', []),
            'plan' => $actions->get('plan', []),
            'on_hold' => $actions->get('on_hold', []),
            'dropped' => $actions->get('dropped', []),
            'finished' => $actions->get('finished', []),
        ]);
    }
}
