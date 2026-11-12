<?php

namespace App\Http\Controllers;

use App\Models\SavedTrack;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedTrackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tracks = $request->user()
            ->savedTracks()
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['tracks' => $tracks->map(fn ($t) => $this->serialize($t))]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'track_id' => ['required', 'string', 'max:30'],
            'title'    => ['required', 'string', 'max:255'],
            'artist'   => ['nullable', 'string', 'max:255'],
            'artwork'  => ['nullable', 'string', 'max:500'],
            'duration' => ['nullable', 'integer', 'min:0'],
            'album'    => ['nullable', 'string', 'max:255'],
            'source'   => ['nullable', 'string', 'max:30'],
            'videoId'  => ['nullable', 'string', 'max:30'],
        ]);

        // Idempoten: jangan duplikat
        $existing = $request->user()->savedTracks()->where('track_id', $validated['track_id'])->first();
        if ($existing) {
            return response()->json(['track' => $this->serialize($existing)], 200);
        }

        $saved = $request->user()->savedTracks()->create($validated);

        return response()->json(['track' => $this->serialize($saved)], 201);
    }

    public function destroy(Request $request, string $trackId): JsonResponse
    {
        $request->user()->savedTracks()->where('track_id', $trackId)->delete();
        return response()->json(['message' => 'Lagu dihapus dari koleksi.']);
    }

    private function serialize(SavedTrack $t): array
    {
        return [
            'id'       => $t->track_id,
            'title'    => $t->title,
            'artist'   => $t->artist ?? 'Unknown artist',
            'artwork'  => $t->artwork ?? '',
            'duration' => $t->duration ?? 0,
            'album'    => $t->album ?? '',
            'source'   => $t->source ?? 'youtube',
            'videoId'  => $t->videoId ?? $t->track_id,
        ];
    }
}
