# WEB MUSIC — Panduan Instalasi & Arsitektur Sistem

Aplikasi web pemutar musik modern berbasis **React 19**, **Vite 8**, dan **Tailwind CSS 4** dengan estetika **Cinematic Velvet Void**. Aplikasi ini mengintegrasikan katalog musik mainstream resmi melalui API Deezer serta modul cuplikan **Reff Viral (Quotes)** dengan arsitektur audio terpusat dan kepatuhan hak cipta tingkat tinggi.

---

## 1. Teknologi Utama
- **Frontend Framework:** React 19 (`react`, `react-dom`)
- **Build Tool & Bundler:** Vite 8 (`@vitejs/plugin-react`)
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`) dengan custom token CSS `:root` Velvet Void
- **Icons:** `lucide-react`
- **Linter & Code Quality:** `oxlint`
- **Testing:** Node.js native test runner (`node --test tests/**/*.test.js`)
- **Audio Engine:** Single central `HTMLAudioElement` via React Context (`AudioContext`)

---

## 2. Prasyarat Sistem
- **Node.js:** Versi 20.x, 22.x, atau lebih baru (mendukung native test runner `node --test` dan ES modules).
- **Package Manager:** `npm` versi 9.x atau 10.x ke atas.
- **Koneksi Internet:** Diperlukan saat memuat dependensi dan streaming cuplikan audio Deezer.

---

## 3. Instalasi & Menjalankan Aplikasi

### A. Menginstal Dependensi
Buka terminal di root project dan jalankan:
```bash
npm install
```

### B. Menjalankan Server Pengembangan (Development Server)
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173` secara default.

### C. Melakukan Pengujian Otomatis (Unit Testing)
```bash
npm test
```
Menjalankan seluruh 40 suite test unit untuk validasi legal metadata, kedaluwarsa UTC, kompatibilitas track Deezer, dan regression engine.

### D. Menjalankan Pemeriksaan Kualitas Kode (Linter)
```bash
npm run lint
```
Menjalankan `oxlint` untuk deteksi potensi error JavaScript dan JSX.

### E. Membangun Bundle Produksi (Production Build)
```bash
npm run build
```
Menghasilkan aset teroptimasi di folder `dist/`. Untuk melihat preview hasil build:
```bash
npm run preview
```

---

## 4. Struktur Direktori Utama

```
WEB MUSIC/
├── docs/
│   └── VIRAL-AUDIO-CURATION.md       # Kebijakan legal kurasi audio dan standar bukti izin
├── src/
│   ├── assets/                       # Aset gambar & logo statis
│   ├── components/
│   │   ├── Navbar.jsx                # Header navigasi, pencarian lagu, & selector genre
│   │   ├── ViewTabs.jsx              # Tab switcher aksesibel (Katalog Hits vs. Reff Viral)
│   │   ├── TrackCard.jsx             # Kartu musik katalog Deezer dengan play overlay
│   │   ├── Player.jsx                # Konsol floating player bawah (lengkap kontrol volume desktop & mobile)
│   │   ├── ViralSoundsView.jsx       # Tampilan Reff Viral & empty state transparan
│   │   └── ViralSoundCard.jsx        # Kartu Reff Viral semantik WAI-ARIA
│   ├── context/
│   │   └── AudioContext.jsx          # Sumber kebenaran playback terpusat (single HTMLAudioElement)
│   ├── data/
│   │   └── viralSounds.js            # Kontrak UnifiedTrack, konstanta kategori, & validator legal
│   ├── services/
│   │   ├── musicApi.js               # Service API Deezer dan helper durasi
│   │   └── audius.js                 # Service cadangan provider Audius (arsip referensi)
│   ├── App.jsx                       # Komponen root aplikasi & Hero Showcase
│   ├── index.css                     # Token desain Velvet Void, atmosphere ambient, & scrollbar
│   └── main.jsx                      # Entry point React DOM
├── tests/
│   └── viralSoundsValidator.test.js  # 40 unit test pengujian legalitas dan engine playback
├── vite.config.js                    # Konfigurasi Vite & proxy API Deezer
├── package.json                      # Daftar script dan dependency project
├── AGENTS.md                         # Panduan master agen AI dan aturan keselamatan Git
└── README-INSTALASI.md               # Dokumentasi instalasi dan arsitektur (file ini)
```

---

## 5. Arsitektur Audio & Integrasi API

### A. Integrasi API Deezer & Vite Proxy
Untuk mencegah kendala CORS pada browser saat mengakses API publik Deezer, konfigurasi `vite.config.js` menyediakan reverse proxy:
- Endpoint lokal `/api/deezer/*` dialihkan otomatis ke `https://api.deezer.com/*`.
- Fungsi `fetchTopCharts()` dan `searchTracks()` pada `src/services/musicApi.js` mengonsumsi data lagu melalui jalur proxy ini.

### B. Single Audio Element Terpusat (`AudioContext.jsx`)
- **Single Source of Truth:** Seluruh manipulasi audio dikelola oleh satu instansiasi `HTMLAudioElement` terpusat di `src/context/AudioContext.jsx`.
- **Fitur Engine:**
  - Play / Pause / Next / Previous / Seek.
  - Shuffle acak antrean lagu.
  - Repeat mode tri-state (`off`, `all`, `one`).
  - Segment Loop (pemutaran segmen pengulangan titik waktu `segmentStart` ke `segmentEnd` otomatis tanpa jeda untuk fitur Reff Viral).
- **Proteksi Mutlak:** Komponen UI (`TrackCard`, `Player`, `ViralSoundCard`) dilarang keras membuat elemen `<audio>` baru atau menduplikasi state playback.

---

## 6. Fitur Reff Viral & Standar Legalitas Ketat
- **Status Katalog Saat Ini:** `curatedViralSounds` diatur secara sengaja berupa array kosong `[]`.
- **Tanpa Konten Fiktif:** Platform tidak menampilkan track dummy, kutipan buatan, atau statistik palsu.
- **Kebijakan Hak Cipta:** Setiap audio yang akan ditambahkan wajib memenuhi verifikasi `isValidLegalMeta()`:
  - Karya orisinal buatan sendiri (`self-created`) atau izin tertulis pihak ketiga (`written-permission`).
  - Cakupan izin wajib (`permissionScope`): `streaming`, `segment-editing`, dan `website-distribution`.
  - Deklarasi status hosting (`isProjectHosted: true/false`).
  - Penolakan otomatis pada izin kedaluwarsa berbasis kalender UTC (`expiresAt`) dan tombol darurat pencabutan izin (`isRevoked: true`).
  - Pencegahan kebocoran data pribadi (PII free).
- Panduan kurasi lengkap dapat dibaca pada `docs/VIRAL-AUDIO-CURATION.md`.

---

## 7. Keamanan Git & Instruksi Agen
- Seluruh commit pesan mengikuti format konvensi: `<type>: <deskripsi dalam Bahasa Indonesia>`.
- **Dilarang keras melakukan commit atau push tanpa persetujuan eksplisit dari pengguna.**
