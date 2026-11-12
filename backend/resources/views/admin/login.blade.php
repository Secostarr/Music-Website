<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login Admin — SoundVibe</title>
    <style>
        *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 0%,#123022 0,transparent 50%),#080d0a;color:#eef4ef;font-family:Inter,ui-sans-serif,system-ui,sans-serif;padding:20px}.panel{width:min(100%,440px);padding:36px;background:#101813;border:1px solid #ffffff1b;border-radius:16px;box-shadow:0 24px 80px #0007}.brand{font-weight:800;letter-spacing:.14em;color:#5ee0a1}.eyebrow{margin-top:42px;color:#71dda0;text-transform:uppercase;font-size:12px;letter-spacing:.15em}h1{font-size:32px;margin:10px 0}p{color:#9ba99f;line-height:1.6}.field{display:block;margin:22px 0 7px;font-size:14px}.input{width:100%;padding:13px;color:white;background:#090f0b;border:1px solid #ffffff25;border-radius:8px;font:inherit}.button{margin-top:24px;width:100%;padding:13px;border:0;border-radius:8px;background:#40c982;color:#052111;font:inherit;font-weight:700;cursor:pointer}.error{margin-top:6px;color:#ff9696;font-size:13px}.back{display:inline-block;margin-top:24px;color:#9ba99f;font-size:14px} :focus-visible{outline:2px solid #62e69c;outline-offset:2px}
    </style>
</head>
<body>
<main class="panel">
    <a class="brand" href="{{ route('login') }}">SOUND<span style="color:#eef4ef">VIBE</span></a>
    <div class="eyebrow">Admin Studio</div>
    <h1>Masuk ke dashboard</h1>
    <p>Kelola katalog audio lokal dan lirik tersinkron untuk aplikasi.</p>
    <aside id="demo-box" style="margin:20px 0;padding:13px 15px;border:1px solid #40c98255;border-radius:9px;background:#40c9820d;color:#b8c8bd;font-size:14px;line-height:1.8;cursor:pointer;transition:border-color .2s" title="Klik untuk otomatis mengisi email dan password">
        <strong style="color:#72e2a0">Akun admin lokal (Klik untuk isi otomatis)</strong><br>
        Email: <code>admin@webmusic.local</code><br>
        Password: <code>AdminLocal123!</code>
    </aside>
    <form method="POST" action="{{ route('login.store') }}">
        @csrf
        <label class="field" for="email">Email admin</label>
        <input class="input" id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="username" required autofocus>
        @error('email')<div class="error">{{ $message }}</div>@enderror
        <label class="field" for="password">Password</label>
        <input class="input" id="password" name="password" type="password" autocomplete="current-password" required>
        @error('password')<div class="error">{{ $message }}</div>@enderror
        <button class="button" type="submit">Masuk</button>
    </form>
    <script>
        document.getElementById('demo-box').addEventListener('click', function() {
            document.getElementById('email').value = 'admin@webmusic.local';
            document.getElementById('password').value = 'AdminLocal123!';
            this.style.borderColor = '#40c982';
        });
    </script>
    <a class="back" href="{{ url('/') }}">← Kembali ke beranda</a>
</main>
</body>
</html>
