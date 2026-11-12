<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Validation\ValidationException;
use Throwable;

class MusicSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $videoId = trim((string) $request->query('videoId', ''));
        if ($videoId !== '') {
            if (! preg_match('/^[a-zA-Z0-9_-]{11}$/', $videoId)) {
                throw ValidationException::withMessages(['videoId' => 'ID video tidak valid.']);
            }
            return $this->runPython([$videoId, 'lyrics'], 'lyrics');
        }

        $query = trim((string) $request->query('q', ''));
        if (mb_strlen($query) > 120) {
            throw ValidationException::withMessages(['q' => 'Pencarian maksimal 120 karakter.']);
        }

        return $this->runPython([$query], 'tracks');
    }

    private function runPython(array $arguments, string $kind): JsonResponse
    {
        $python = config('services.ytmusic.python', 'python');
        $script = base_path('scripts/ytmusic_search.py');
        try {
            $addresses = dns_get_record('music.youtube.com', DNS_A);
            $resolvedIp = $addresses[0]['ip'] ?? '';
            $env = array_merge($_SERVER, [
                'YTMUSIC_RESOLVED_IP' => $resolvedIp,
                'SystemRoot' => env('SYSTEMROOT', 'C:\\Windows'),
                'SYSTEMROOT' => env('SYSTEMROOT', 'C:\\Windows'),
                'PATH' => getenv('PATH') ?: '',
            ]);
            $result = Process::path(base_path())->timeout(30)->env($env)->run(array_merge([$python, $script], $arguments));
        } catch (Throwable $error) {
            report($error);
            return response()->json(['message' => 'Layanan katalog musik gagal dijalankan.'], 503);
        }

        if (! $result->successful()) {
            report(new \RuntimeException('ytmusicapi ' . $kind . ' failed: ' . $result->errorOutput()));
            return response()->json(['message' => 'Data YouTube Music gagal dimuat. Coba lagi sebentar.'], 503);
        }

        $data = json_decode($result->output(), true);
        return response()->json($kind === 'tracks' ? ['tracks' => is_array($data) ? $data : []] : ['lyrics' => is_array($data) ? $data : []]);
    }
}
