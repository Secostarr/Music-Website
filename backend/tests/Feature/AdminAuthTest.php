<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
        $response->assertSee('admin@webmusic.local');
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@webmusic.local',
            'password' => 'AdminLocal123!',
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@webmusic.local',
            'password' => 'AdminLocal123!',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/admin');
    }

    public function test_admin_dashboard_is_protected_and_track_search_matches_lyrics(): void
    {
        $user = User::factory()->create();
        $track = \App\Models\Track::create([
            'title' => 'Test Track',
            'artist' => 'Test Artist',
            'category' => 'Pop',
            'audio_path' => 'tracks/test.mp3',
            'lyrics' => [['time' => 3.5, 'text' => 'Unique lyric search term']],
        ]);

        $this->get('/admin')->assertRedirect('/login');

        $this->actingAs($user)
            ->get('/admin?q=Unique%20lyric%20search%20term')
            ->assertOk()
            ->assertSee($track->title);
    }

    public function test_admin_upload_transcribes_audio_when_lyrics_are_omitted(): void
    {
        Storage::fake('public');
        Process::fake([
            '*' => Process::result(output: json_encode([
                'language' => 'en',
                'segments' => [
                    ['time' => 1.2, 'text' => 'Hello'],
                    ['time' => 2.1, 'text' => 'there'],
                ],
            ])),
        ]);

        $this->actingAs(User::factory()->create())
            ->post('/admin/tracks', [
                'audio' => UploadedFile::fake()->create('sample.mp3', 100, 'audio/mpeg'),
                'artist' => 'Test Artist',
                'category' => 'Pop',
            ])
            ->assertRedirect('/admin');

        $this->assertDatabaseHas('tracks', ['title' => 'sample']);
        $this->assertSame(
            [['time' => 1.2, 'text' => 'Hello'], ['time' => 2.1, 'text' => 'there']],
            \App\Models\Track::firstOrFail()->lyrics,
        );
    }

    public function test_admin_upload_uses_synced_lyrics_match_and_corrects_artist(): void
    {
        Storage::fake('public');
        Http::fake([
            'lrclib.net/api/search?track_name=Yellow&artist_name=Wrong%20artist' => Http::response([[
                'trackName' => 'Yellow', 'artistName' => 'Coldplay', 'syncedLyrics' => null, 'plainLyrics' => null,
            ]]),
            'lrclib.net/api/search?track_name=Yellow' => Http::response([[
                'trackName' => 'Yellow',
                'artistName' => 'Coldplay',
                'syncedLyrics' => "[00:01.20]Hello there",
                'plainLyrics' => 'Hello there',
            ]]),
        ]);
        Process::fake([
            '*' => Process::result(output: json_encode([
                'segments' => [['time' => 0, 'text' => 'fallback']],
            ])),
        ]);

        $this->actingAs(User::factory()->create())
            ->post('/admin/tracks', [
                'audio' => UploadedFile::fake()->create('Yellow.mp3', 100, 'audio/mpeg'),
                'artist' => 'Wrong artist',
                'category' => 'Pop',
            ])
            ->assertRedirect(route('admin.dashboard'));

        $track = \App\Models\Track::firstOrFail();
        $this->assertSame('Coldplay', $track->artist);
        $this->assertSame([['time' => 1.2, 'text' => 'Hello there']], $track->lyrics);
        Http::assertSent(fn ($request) => $request->url() === 'https://lrclib.net/api/search?track_name=Yellow&artist_name=Wrong%20artist');
    }

    public function test_admin_cannot_login_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'admin@webmusic.local',
            'password' => bcrypt('AdminLocal123!'),
        ]);

        $response = $this->from('/login')->post('/login', [
            'email' => 'admin@webmusic.local',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('email');
    }
}
