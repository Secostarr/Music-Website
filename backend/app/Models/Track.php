<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    protected $fillable = ['title', 'artist', 'category', 'audio_path', 'lyrics'];

    protected function casts(): array
    {
        return ['lyrics' => 'array'];
    }
}
