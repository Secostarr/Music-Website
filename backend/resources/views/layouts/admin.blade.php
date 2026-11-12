<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Admin Studio') — SoundVibe</title>
    <style>
        :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#080d0a;color:#eef4ef}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 15% 0%,#123022 0,transparent 38%),#080d0a}a{color:inherit;text-decoration:none}button,input{font:inherit}.shell{display:grid;grid-template-columns:240px 1fr;min-height:100vh}.sidebar{padding:28px 20px;border-right:1px solid #ffffff14;background:#080d0acc}.brand{font-weight:800;letter-spacing:.12em;color:#5ee0a1}.nav{margin-top:42px;color:#a7b4aa;font-size:14px}.nav a,.nav span{display:block;padding:12px 14px;border-radius:10px}.nav .active{background:#163324;color:#75e2a5}.main{padding:30px clamp(20px,5vw,64px)}.top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff14;padding-bottom:20px}.top small,.muted{color:#9ba99f}.content{max-width:1000px;margin:54px auto}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:#6cdea0}.title{font-size:clamp(30px,5vw,46px);margin:10px 0}.panel{border:1px solid #ffffff17;background:#101813;padding:28px;border-radius:14px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:28px}.stat{padding:20px;border:1px solid #ffffff14;border-radius:12px;background:#0c130f}.stat strong{display:block;font-size:27px;margin-bottom:8px}.button{border:0;border-radius:9px;padding:11px 16px;background:#40c982;color:#052111;font-weight:700;cursor:pointer}.input[type=file]{max-width:100%}.panel audio{max-width:100%}.pagination{display:flex;gap:8px;align-items:center;list-style:none;padding:0}.pagination a,.pagination span{padding:7px 10px;border:1px solid #ffffff20;border-radius:7px;color:#b9c8be}.pagination .active span{background:#40c982;color:#052111}.button.secondary{background:#1b2720;color:#e8f1eb;border:1px solid #ffffff20}.form{max-width:440px;margin:8vh auto}.field{display:block;margin:20px 0 6px;color:#d3ded6;font-size:14px}.input{width:100%;padding:12px 13px;color:#fff;background:#090f0b;border:1px solid #ffffff25;border-radius:8px}.error{color:#ff9696;font-size:13px;margin-top:5px}.flash{color:#77e5a6;margin:10px 0}.logout{background:none;border:0;color:#aab8af;cursor:pointer}.empty{margin-top:24px;padding:24px;border:1px dashed #ffffff2a;border-radius:10px;color:#aab8af} @media(max-width:700px){.shell{grid-template-columns:1fr}.sidebar{padding:16px;border-right:0;border-bottom:1px solid #ffffff14}.nav{margin-top:14px;display:flex;gap:6px;overflow:auto}.nav a,.nav span{white-space:nowrap}.main{padding:20px}.content{margin:34px auto}.grid{grid-template-columns:1fr}.top{align-items:flex-start}}
    </style>
</head>
<body>
<div class="shell">
    <aside class="sidebar">
        <a class="brand" href="{{ route('admin.dashboard') }}">SOUND<span style="color:#eef4ef">VIBE</span></a>
        <nav class="nav" aria-label="Navigasi admin">
            <a class="active" href="{{ route('admin.dashboard') }}">Ringkasan</a>
            <a href="{{ route('admin.dashboard') }}">Katalog & lirik</a>
            <a href="{{ route('catalog.index') }}" target="_blank">Lihat katalog publik ↗</a>
        </nav>
    </aside>
    <main class="main">
        @yield('body')
    </main>
</div>
</body>
</html>
