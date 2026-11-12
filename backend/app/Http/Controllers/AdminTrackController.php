<?php

namespace App\Http\Controllers;

use App\Models\Track;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Throwable;

class AdminTrackController extends Controller
{
    public function index(Request $request): View
    {
        $query = Track::query();
        $term = trim((string) $request->query('q', ''));

        if ($term !== '') {
            $query->where(function ($tracks) use ($term): void {
                $tracks->where('title', 'like', "%{$term}%")
                    ->orWhere('artist', 'like', "%{$term}%")
                    ->orWhere('category', 'like', "%{$term}%");

                $tracks->orWhere(function ($lyrics) use ($term): void {
                    $lyrics->where('lyrics', 'like', '%"text":"%' . addcslashes($term, '%_') . '%"%');
                });
            });
        }

        return view('admin.dashboard', [
            'tracks' => $query->latest()->paginate(10)->withQueryString(),
            'search' => $term,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'audio' => ['required', 'file', 'mimes:mp3,mpeg', 'max:51200'],
            'title' => ['nullable', 'string', 'max:180'],
            'artist' => ['required', 'string', 'max:180'],
            'category' => ['required', 'string', 'max:100'],
            'lyrics_text' => ['nullable', 'string', 'max:100000'],
            'lrc' => ['nullable', 'file', 'mimes:lrc,txt', 'max:2048'],
        ]);

        $name = pathinfo($request->file('audio')->getClientOriginalName(), PATHINFO_FILENAME);
        $title = trim($data['title'] ?? '') ?: trim((string) preg_replace('/[_-]+/', ' ', $name));
        $lrc = $request->file('lrc')?->get();
        $lyrics = $this->parseLyrics($lrc, $data['lyrics_text'] ?? '');
        $artist = $data['artist'];
        $path = $request->file('audio')->store('tracks', 'public');

        if (! $lrc && ! trim($data['lyrics_text'] ?? '')) {
            try {
                [$artist, $lyrics] = $this->findLyrics($title, $artist)
                    ?? [$artist, $this->transcribe(Storage::disk('public')->path($path))];
            } catch (Throwable $error) {
                Storage::disk('public')->delete($path);
                report($error);

                throw ValidationException::withMessages([
                    'audio' => 'Lirik otomatis gagal ditemukan atau ditranskripsikan. Periksa koneksi/API, atau coba file lirik manual. (' . $error->getMessage() . ')',
                ]);
            }
        }

        try {
            Track::create([
                'title' => $title,
                'artist' => $artist,
                'category' => $data['category'],
                'audio_path' => $path,
                'lyrics' => $lyrics,
            ]);
        } catch (Throwable $error) {
            Storage::disk('public')->delete($path);
            throw $error;
        }

        return redirect()->route('admin.dashboard')->with('status', 'Lagu berhasil ditambahkan ke katalog.');
    }

    public function destroy(Track $track): RedirectResponse
    {
        DB::transaction(fn () => $track->delete());
        Storage::disk('public')->delete($track->audio_path);

        return redirect()->route('admin.dashboard')->with('status', 'Lagu berhasil dihapus.');
    }

    private function findLyrics(string $title, string $artist): ?array
    {
        $response = Http::timeout(12)->retry(1, 250)->get('https://lrclib.net/api/search', [
            'track_name' => $title,
            'artist_name' => $artist,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Layanan pencarian lirik membalas HTTP ' . $response->status() . '.');
        }

        $candidates = $response->json();
        if (! is_array($candidates)) return null;

        $normalize = static fn (string $value): string => preg_replace('/[^a-z0-9]+/i', '', mb_strtolower($value)) ?? '';
        $wantedTitle = $normalize($title);
        $wantedArtist = $normalize($artist);

        foreach ($candidates as $candidate) {
            if (! is_array($candidate)) continue;
            $candidateTitle = $normalize((string) ($candidate['trackName'] ?? ''));
            $candidateArtist = $normalize((string) ($candidate['artistName'] ?? ''));
            if ($candidateTitle !== $wantedTitle) continue;
            if ($wantedArtist !== '' && $candidateArtist !== $wantedArtist) {
                $alternate = Http::timeout(12)->retry(1, 250)->get('https://lrclib.net/api/search', [
                    'track_name' => $title,
                ]);
                if (! $alternate->successful()) continue;
                $candidates = $alternate->json();
                $matched = collect(is_array($candidates) ? $candidates : [])->first(
                    fn ($item) => is_array($item)
                        && $normalize((string) ($item['trackName'] ?? '')) === $wantedTitle
                        && $normalize((string) ($item['artistName'] ?? '')) === $candidateArtist,
                );
                if (! $matched) continue;
                $candidate = $matched;
            }

            $lines = $this->parseLyrics($candidate['syncedLyrics'] ?? null, '');
            if ($lines === []) $lines = $this->parseLyrics(null, (string) ($candidate['plainLyrics'] ?? ''));
            if ($lines !== []) return [(string) ($candidate['artistName'] ?? $artist), $lines];
        }

        return null;
    }

    private function transcribe(string $audioPath): array
    {
        $python = env('WHISPER_PYTHON');
        $ffmpeg = env('WHISPER_FFMPEG');
        $script = base_path('scripts/transcribe.py');

        if (! $python || ! is_file($python) || ! $ffmpeg || ! is_file($ffmpeg) || ! is_file($script)) {
            throw new \RuntimeException('Konfigurasi Whisper atau FFmpeg tidak ditemukan.');
        }

        $processPath = implode(PATH_SEPARATOR, array_filter([
            dirname($python), dirname($ffmpeg),
            getenv('SystemRoot') . '\\System32', getenv('SystemRoot'), getenv('PATH'),
        ]));
        $result = Process::timeout(1800)->env([
            'PATH' => $processPath,
            'SystemRoot' => getenv('SystemRoot'),
            'WINDIR' => getenv('WINDIR'),
            'TEMP' => sys_get_temp_dir(),
            'TMP' => sys_get_temp_dir(),
            'PYTHONUTF8' => '1',
        ])->run([$python, $script, $audioPath]);

        if (! $result->successful()) {
            throw new \RuntimeException('Whisper gagal memproses audio: ' . trim($result->errorOutput() ?: $result->output()));
        }

        $decoded = json_decode($result->output(), true, flags: JSON_THROW_ON_ERROR);
        $segments = $decoded['segments'] ?? [];

        if (! is_array($segments) || $segments === []) {
            throw new \RuntimeException('Whisper tidak menemukan ucapan/lirik pada audio.');
        }

        return $segments;
    }

    private function parseLyrics(?string $lrc, string $plainLyrics): array
    {
        $source = $lrc ?: $plainLyrics;
        $lines = [];
        $offset = 0;

        foreach (preg_split('/\R/u', $source) ?: [] as $line) {
            $line = trim($line);
            if ($line === '') continue;

            if (preg_match('/^\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)$/u', $line, $match)) {
                $fraction = isset($match[3]) ? (float) ('0.' . $match[3]) : 0;
                $lines[] = ['time' => (int) $match[1] * 60 + (int) $match[2] + $fraction, 'text' => trim($match[4])];
                continue;
            }

            if (preg_match('/^\[[^\]]+\]$/u', $line)) continue;
            if (preg_match('/^\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/u', $line, $match)) {
                $fraction = isset($match[3]) ? (float) ('0.' . $match[3]) : 0;
                $time = (int) $match[1] * 60 + (int) $match[2] + $fraction;
                $lines[] = ['time' => $time, 'text' => trim($match[4])];
                $offset = 1;
                continue;
            }

            $lines[] = ['time' => $offset, 'text' => $line];
            $offset += 4;
        }

        usort($lines, fn (array $a, array $b): int => $a['time'] <=> $b['time']);

        if ($lrc && count(array_filter($lines, fn (array $line): bool => $line['time'] > 0)) === 0 && trim($lrc) !== '') {
            throw ValidationException::withMessages(['lrc' => 'Format timestamp LRC tidak dikenali. Gunakan format [mm:ss.xx] lirik.']);
        }

        return $lines;
    }
}
