<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavedTracksApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_returns_token_and_rejects_duplicate_email(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'     => 'Pengguna Test',
            'email'    => 'test@example.com',
            'password' => 'rahasia123',
        ]);

        $response->assertStatus(201)->assertJsonStructure(['user', 'token']);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);

        $this->postJson('/api/auth/register', [
            'name'     => 'Pengguna Lain',
            'email'    => 'test@example.com',
            'password' => 'rahasia123',
        ])->assertStatus(422);
    }

    public function test_login_rejects_wrong_password(): void
    {
        User::factory()->create([
            'email'    => 'test@example.com',
            'password' => 'rahasia123',
        ]);

        $this->postJson('/api/auth/login', [
            'email'    => 'test@example.com',
            'password' => 'salah',
        ])->assertStatus(401);
    }

    public function test_saved_tracks_require_authentication(): void
    {
        $this->getJson('/api/saved-tracks')->assertStatus(401);
        $this->postJson('/api/saved-tracks', ['track_id' => 'abc', 'title' => 'Lagu'])->assertStatus(401);
    }

    public function test_save_is_idempotent_and_scoped_per_user(): void
    {
        $alice = User::factory()->create();
        $bob = User::factory()->create();

        $payload = [
            'track_id' => 'YtVid00001',
            'title'    => 'Lagu Hits',
            'artist'   => 'Penyanyi',
            'duration' => 210,
            'source'   => 'youtube',
            'videoId'  => 'YtVid00001',
        ];

        $this->actingAs($alice, 'sanctum')
            ->postJson('/api/saved-tracks', $payload)
            ->assertStatus(201)
            ->assertJsonPath('track.id', 'YtVid00001');

        // Simpan ulang: idempoten, tidak menduplikat
        $this->actingAs($alice, 'sanctum')
            ->postJson('/api/saved-tracks', $payload)
            ->assertStatus(200);

        $this->assertDatabaseCount('saved_tracks', 1);

        // Bob tidak melihat koleksi Alice dan bisa menyimpan track yang sama
        $this->actingAs($bob, 'sanctum')
            ->getJson('/api/saved-tracks')
            ->assertOk()
            ->assertJsonCount(0, 'tracks');

        $this->actingAs($bob, 'sanctum')
            ->postJson('/api/saved-tracks', $payload)
            ->assertStatus(201);

        $this->assertDatabaseCount('saved_tracks', 2);

        // Alice menghapus miliknya sendiri
        $this->actingAs($alice, 'sanctum')
            ->deleteJson('/api/saved-tracks/YtVid00001')
            ->assertOk();

        $this->assertDatabaseCount('saved_tracks', 1);
        $this->assertDatabaseHas('saved_tracks', ['user_id' => $bob->id]);
    }
}
