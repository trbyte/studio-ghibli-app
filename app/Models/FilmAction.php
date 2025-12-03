<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FilmAction extends Model
{
    protected $fillable = [
        'user_id',
        'film_id',
        'film_title',
        'action_type',
    ];

    /**
     * Get the user that owns the film action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
