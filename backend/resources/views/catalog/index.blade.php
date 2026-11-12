<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Katalog Musik — SoundVibe</title>
    <style>
        :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#080d0a;color:#eef4ef}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 15% 0%,#123022 0,transparent 34%),#080d0a}a{color:inherit;text-decoration:none}button,input{font:inherit}.wrap{max-width:1120px;padding:26px 24px 150px;margin:auto}.header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff16;padding:8px 0 22px}.brand{font-weight:850;letter-spacing:.13em;color:#5ee0a1}.admin{color:#aab8af;font-size:14px}.intro{padding:58px 0 32px}.eyebrow{font-size:12px;color:#6cdea0;letter-spacing:.16em;text-transform:uppercase}.intro h1{font-size:clamp(36px,7vw,64px);letter-spacing:-.045em;margin:12px 0}.muted{color:#9ba99f}.search{display:flex;gap:10px;max-width:700px;margin-top:24px}.input{width:100%;padding:13px 15px;color:#fff;background:#0b120e;border:1px solid #ffffff25;border-radius:9px}.button{border:0;border-radius:9px;padding:12px 18px;background:#40c982;color:#052111;font-weight:700;cursor:pointer}.chips{display:flex;gap:9px;flex-wrap:wrap;margin:24px 0 34px}.chip{background:#101813;border:1px solid #ffffff18;border-radius:999px;padding:8px 13px;font-size:13px;color:#c6d2ca}.section-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}.section-head h2{font-size:22px;margin:0}.list{border-top:1px solid #ffffff1a}.track{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:16px;align-items:center;padding:17px 4px;border-bottom:1px solid #ffffff14}.number{font:13px ui-monospace,monospace;color:#718078}.track h3{margin:0;font-size:16px}.track p{margin:5px 0 0;font-size:13px;color:#9ba99f}.track-lyrics{margin-top:9px;color:#c8d6cd;font-size:13px}.track-lyrics summary{width:max-content;color:#70e3a0;cursor:pointer}.track-lyrics div{max-height:170px;overflow:auto;padding:4px 12px;border-left:1px solid #40c98266}.track-lyrics div p{margin:5px 0;color:#c8d6cd;line-height:1.5}.play{height:40px;width:40px;border-radius:50%;border:1px solid #ffffff24;background:#14231a;color:#6ce49e;cursor:pointer}.empty{padding:34px 0;color:#aab8af}.pagination{display:flex;gap:8px;justify-content:center;list-style:none;padding:24px 0}.pagination a,.pagination span{display:block;padding:8px 12px;border:1px solid #ffffff20;border-radius:7px;color:#bbc8be}.pagination .active span{background:#40c982;color:#052111}.player{position:fixed;bottom:0;left:0;right:0;background:#0b110eF2;backdrop-filter:blur(18px);border-top:1px solid #ffffff20;padding:14px 24px calc(14px + env(safe-area-inset-bottom));display:grid;grid-template-columns:minmax(150px,1fr) minmax(200px,2fr) auto;gap:20px;align-items:center}.now-title{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.now-artist{color:#9ba99f;font-size:13px;margin-top:4px}.controls{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.controls button{justify-self:center}.time{display:flex;gap:10px;align-items:center;font:12px ui-monospace,monospace;color:#9ba99f}.time input{width:100%;accent-color:#40c982}.volume{width:100px;accent-color:#40c982}.lyrics{grid-column:1/-1;text-align:center;font-size:14px;color:#70e3a0;min-height:18px}@media(max-width:650px){.wrap{padding:18px 16px 185px}.intro{padding-top:40px}.track{grid-template-columns:32px minmax(0,1fr) auto;gap:10px}.player{grid-template-columns:1fr auto;gap:8px 12px;padding-left:14px;padding-right:14px}.controls{grid-column:1/-1;grid-row:2}.volume{width:70px}.lyrics{grid-row:3}}
    </style>
</head>
<body>
<main class="wrap">
    <header class="header">
        <a class="brand" href="{{ route('catalog.index') }}">SOUND<span style="color:#eef4ef">VIBE</span></a>
        <a class="admin" href="{{ route('admin.dashboard') }}">Admin Studio →</a>
    </header>
    <section class="intro">
        <div class="eyebrow">Katalog komunitas</div>
        <h1>Lagu pilihan,<br>tersimpan di sini.</h1>
        <p class="muted">Koleksi MP3 dan lirik yang ditambahkan admin.</p>
        <form class="search" method="GET" action="{{ route('catalog.index') }}">
            <label for="q" style="position:absolute;left:-9999px">Cari judul, artis, kategori, atau lirik</label>
            <input class="input" id="q" name="q" value="{{ $search }}" placeholder="Cari lagu, artis, kategori, atau lirik…">
            <button class="button" type="submit">Cari</button>
        </form>
    </section>
    @if ($tracks->isNotEmpty())
        <nav class="chips" aria-label="Filter kategori">
            <a class="chip" href="{{ route('catalog.index') }}">Semua</a>
            @foreach ($tracks->getCollection()->pluck('category')->unique() as $category)
                <a class="chip" href="{{ route('catalog.index', ['q' => $category]) }}">{{ $category }}</a>
            @endforeach
        </nav>
    @endif
    <section>
        <div class="section-head"><h2>{{ $search ? 'Hasil pencarian' : 'Semua lagu' }}</h2><span class="muted">{{ $tracks->total() }} lagu</span></div>
        <div class="list">
            @forelse ($tracks as $track)
                <article class="track">
                    <span class="number">{{ str_pad((string) $tracks->firstItem() + $loop->index, 2, '0', STR_PAD_LEFT) }}</span>
                    <div><h3>{{ $track->title }}</h3><p>{{ $track->artist }} · {{ $track->category }}</p>@if (!empty($track->lyrics))<details class="track-lyrics"><summary>Lihat lirik</summary><div>@foreach ($track->lyrics as $line)<p>{{ $line['text'] ?? '' }}</p>@endforeach</div></details>@endif</div>
                    <button class="play" type="button" data-track="{{ $track->id }}" data-title="{{ $track->title }}" data-artist="{{ $track->artist }}" data-audio="{{ asset('storage/' . $track->audio_path) }}" data-lyrics="{{ json_encode($track->lyrics ?? [], JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP) }}" aria-label="Putar {{ $track->title }}">▶</button>
                </article>
            @empty
                <div class="empty">{{ $search ? 'Belum ada lagu yang cocok dengan pencarian.' : 'Belum ada lagu di katalog. Lagu yang ditambahkan admin akan tampil di sini.' }}</div>
            @endforelse
        </div>
        {{ $tracks->links() }}
    </section>
</main>
<footer class="player" aria-label="Pemutar katalog">
    <div><div class="now-title" id="now-title">Pilih lagu untuk diputar</div><div class="now-artist" id="now-artist">Katalog SoundVibe</div></div>
    <div class="controls">
        <span class="time"><span id="current">0:00</span><input id="progress" type="range" min="0" max="1000" value="0" aria-label="Posisi lagu"><span id="duration">0:00</span></span>
        <button class="play" id="toggle" type="button" aria-label="Putar" disabled>▶</button>
        <span></span>
    </div>
    <input class="volume" id="volume" type="range" min="0" max="1" step="0.01" value="0.8" aria-label="Volume">
    <div class="lyrics" id="lyrics" aria-live="polite">Lirik tersinkron akan tampil di sini</div>
</footer>
<audio id="audio-engine" preload="metadata"></audio>
<script>
(() => {
    const audio = document.getElementById('audio-engine');
    const toggle = document.getElementById('toggle');
    const progress = document.getElementById('progress');
    const current = document.getElementById('current');
    const duration = document.getElementById('duration');
    const lyricView = document.getElementById('lyrics');
    let lines = [];
    const format = (seconds) => `${Math.floor((seconds || 0) / 60)}:${String(Math.floor((seconds || 0) % 60)).padStart(2, '0')}`;
    document.querySelectorAll('[data-track]').forEach((button) => button.addEventListener('click', () => {
        if (audio.src === button.dataset.audio) {
            audio.paused ? audio.play() : audio.pause();
            return;
        }
        audio.src = button.dataset.audio;
        lines = JSON.parse(button.dataset.lyrics || '[]');
        lyricView.textContent = lines.length ? 'Lirik akan mengikuti pemutaran lagu' : 'Lirik belum ditambahkan untuk lagu ini';
        document.getElementById('now-title').textContent = button.dataset.title;
        document.getElementById('now-artist').textContent = button.dataset.artist;
        toggle.disabled = false;
        audio.play().catch(() => { lyricView.textContent = 'Audio gagal diputar. Coba lagi.'; });
    }));
    toggle.addEventListener('click', () => audio.paused ? audio.play() : audio.pause());
    document.getElementById('volume').addEventListener('input', (event) => audio.volume = Number(event.target.value));
    audio.volume = 0.8;
    audio.addEventListener('play', () => { toggle.textContent = 'Ⅱ'; toggle.setAttribute('aria-label', 'Jeda'); });
    audio.addEventListener('pause', () => { toggle.textContent = '▶'; toggle.setAttribute('aria-label', 'Putar'); });
    audio.addEventListener('loadedmetadata', () => duration.textContent = format(audio.duration));
    audio.addEventListener('timeupdate', () => {
        current.textContent = format(audio.currentTime);
        if (Number.isFinite(audio.duration) && audio.duration > 0) progress.value = String(Math.round(audio.currentTime / audio.duration * 1000));
        const active = [...lines].reverse().find((line) => Number(line.time) <= audio.currentTime);
        if (lines.length) lyricView.textContent = active?.text || 'Lirik akan dimulai';
    });
    progress.addEventListener('input', () => { if (audio.duration) audio.currentTime = Number(progress.value) / 1000 * audio.duration; });
    audio.addEventListener('error', () => { lyricView.textContent = 'Audio tidak dapat dimuat.'; });
})();
</script>
</body>
</html>
