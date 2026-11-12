<?php

namespace Tests\Feature;

use App\Models\Track;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_catalog_lists_admin_tracks_and_searches_lyrics(): void
    {
        $track = Track::create([
            'title' => 'Uploaded Song',
            'artist' => 'Local Artist',
            'category' => 'Pop',
            'audio_path' => 'tracks/uploaded.mp3',
            'lyrics' => [['time' => 2.5, 'text' => 'findable lyric phrase']],
        ]);

        $this->get('/')
            ->assertOk()
            ->assertSee('Uploaded Song')
            ->assertSee('Local Artist');

        $this->get('/?q=findable%20lyric%20phrase')
            ->assertOk()
            ->assertSee($track->title);
    }
}
