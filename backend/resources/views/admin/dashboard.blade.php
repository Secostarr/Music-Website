@extends('layouts.admin')

@section('title', 'Katalog lagu')

@section('body')
    <header class="top">
        <div><strong>Admin Studio</strong><br><small>Kelola katalog musik SoundVibe</small></div>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button class="logout" type="submit">Keluar · {{ auth()->user()->name }}</button>
        </form>
    </header>
    <section class="content">
        <div class="eyebrow">Admin Studio · Katalog lokal</div>
        <h1 class="title">Kelola katalog musik.</h1>
        <p class="muted">Unggah audio yang kamu miliki atau berizin untuk digunakan. Jika lirik dan LRC dikosongkan, Whisper lokal akan mencoba mentranskripsikan vokal otomatis; hasilnya dapat perlu koreksi.</p>
        @if (session('status'))<p class="flash">{{ session('status') }}</p>@endif
        @if ($errors->any())<div class="error" role="alert">Periksa kembali form. {{ $errors->first() }}</div>@endif

        <form class="panel" method="POST" action="{{ route('admin.tracks.store') }}" enctype="multipart/form-data" style="margin-top:24px">
            @csrf
            <div class="eyebrow">Tambah lagu</div>
            <label class="field" for="audio">File MP3 · maksimal 50 MB</label>
            <input class="input" id="audio" name="audio" type="file" accept=".mp3,audio/mpeg" required>
            @error('audio')<div class="error">{{ $message }}</div>@enderror
            <div class="grid" style="margin-top:8px">
                <div><label class="field" for="title">Judul · otomatis dari nama file</label><input class="input" id="title" name="title" value="{{ old('title') }}" maxlength="180" placeholder="Kosongkan untuk memakai nama file"></div>
                <div><label class="field" for="artist">Artis</label><input class="input" id="artist" name="artist" value="{{ old('artist') }}" maxlength="180" required></div>
                <div><label class="field" for="category">Kategori</label><input class="input" id="category" name="category" value="{{ old('category', 'Umum') }}" maxlength="100" required></div>
            </div>
            <label class="field" for="lrc">Impor lirik tersinkron (.lrc, opsional; jika dikosongkan Whisper mencoba transkripsi)</label>
            <input class="input" id="lrc" name="lrc" type="file" accept=".lrc,.txt,text/plain">
            <p class="muted" style="font-size:13px">Baris LRC: [00:12.50] Teks lirik. LRC yang diimpor menggantikan teks lirik manual.</p>
            @error('lrc')<div class="error">{{ $message }}</div>@enderror
            <label class="field" for="lyrics_text">Atau masukkan lirik manual (satu baris per baris)</label>
            <textarea class="input" id="lyrics_text" name="lyrics_text" rows="7" style="resize:vertical">{{ old('lyrics_text') }}</textarea>
            <p class="muted" style="font-size:13px">Lirik manual dibagi per 4 detik sebagai timestamp awal. Untuk sinkronisasi yang akurat, impor LRC. Editor timestamp visual belum tersedia.</p>
            @error('lyrics_text')<div class="error">{{ $message }}</div>@enderror
            <button class="button" type="submit" style="margin-top:18px">Simpan lagu</button>
        </form>

        <div style="display:flex;align-items:end;justify-content:space-between;gap:16px;margin-top:48px;flex-wrap:wrap">
            <div><div class="eyebrow">Koleksi</div><h2 style="margin:8px 0">Lagu tersimpan <span class="muted" style="font-size:16px">({{ $tracks->total() }})</span></h2></div>
            <form method="GET" action="{{ route('admin.dashboard') }}" style="display:flex;gap:8px;min-width:min(100%,320px)">
                <label for="q" class="muted" style="position:absolute;left:-9999px">Cari judul, artis, kategori, atau lirik</label>
                <input class="input" id="q" name="q" value="{{ $search }}" placeholder="Cari lagu, artis, kategori, lirik…">
                <button class="button secondary" type="submit">Cari</button>
            </form>
        </div>
        @forelse ($tracks as $track)
            <article class="panel" style="margin-top:14px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center">
                <div><strong>{{ $track->title }}</strong><div class="muted" style="margin-top:5px">{{ $track->artist }} · {{ $track->category }}</div>
                    @if ($track->lyrics)<details style="margin-top:10px"><summary style="cursor:pointer;color:#72e2a0">Lihat lirik ({{ count($track->lyrics) }} baris)</summary><div style="max-height:160px;overflow:auto;color:#aebbb2;font-size:13px;margin-top:8px">@foreach ($track->lyrics as $line)<div>[{{ gmdate('i:s', (int) $line['time']) }}] {{ $line['text'] }}</div>@endforeach</div></details>@endif
                    <audio controls preload="none" src="{{ asset('storage/' . $track->audio_path) }}" style="width:min(100%,440px);height:38px;margin-top:12px"></audio>
                </div>
                <form method="POST" action="{{ route('admin.tracks.destroy', $track) }}" onsubmit="return confirm('Hapus lagu ini dari katalog?')">@csrf @method('DELETE')<button class="button secondary" type="submit">Hapus</button></form>
            </article>
        @empty
            <div class="empty">Belum ada lagu. Pilih MP3 di atas untuk mengisi katalog pertama.</div>
        @endforelse
        <div style="margin-top:20px">{{ $tracks->links() }}</div>
    </section>
@endsection
