<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedTrack extends Model
{
    protected $fillable = [
        'user_id', 'track_id', 'title', 'artist', 'artwork', 'duration', 'album', 'source', 'videoId',
    ];

    protected $casts = ['duration' => 'integer'];
}
