# Kebijakan Kurasi, Bukti Izin, & Cakupan Hak Audio — Reff Viral

Dokumen ini mendefinisikan standar teknis, hukum, dan etika untuk penambahan materi audio ke dalam katalog **Reff Viral / Sound TikTok Quotes** pada project WEB MUSIC.

---

## 1. Prinsip Utama Sumber Audio

Katalog Reff Viral hanya menerima audio yang status hak ciptanya dapat diverifikasi secara independen dan terdokumentasi.

### Pilihan Sumber Audio yang Diterima:
1. **Audio Orisinal Buatan Sendiri (`self-created`):** Karya musik, beat, atau rekaman audio yang diproduksi langsung oleh pemilik proyek atau tim pengembang, di mana seluruh hak cipta dikuasai penuh.
2. **Audio Kreator Lain dengan Izin Tertulis (`written-permission`):** Karya dari musisi independen atau kreator pihak ketiga yang telah memberikan izin tertulis secara eksplisit untuk penggunaan dan pemotongan audio.
3. **Karya Public Domain / CC Terverifikasi:** Karya berlisensi terbuka resmi (CC0, CC BY) dengan tautan lisensi publik yang sah.

### Larangan Keras:
1. **Dilarang** mengambil, memotong, atau meng-host ulang audio komersial berhak cipta tanpa izin tertulis dari pemilik hak/penerbit (misal: lagu label Sony, Universal, Warner, dsb).
2. **Dilarang** menggunakan audio ripping dari video TikTok, Instagram Reels, YouTube Shorts, atau platform media sosial lainnya.
3. **Dilarang** menyertakan lirik lengkap berhak cipta pada metadata quotes.
4. **Dilarang** mengarang attribution, nama kreator, nomor izin, atau URL lisensi fiktif.

---

## 2. Kategori Status Hukum Audio & Kebijakan Penerimaan

| Kategori | Status Penerimaan | Keterangan & Kewajiban |
| :--- | :--- | :--- |
| **Public Domain (CC0 / PD)** | **DITERIMA** | Karya yang hak ciptanya telah kedaluwarsa atau dilepaskan secara sukarela melalui lisensi CC0 1.0 Universal. Tidak memerlukan izin khusus, namun kredit kreator asli tetap dianjurkan. |
| **Creative Commons Attribution (CC BY)** | **DITERIMA** | Diizinkan untuk streaming/distribusi dengan syarat mencantumkan nama kreator, judul karya, tautan lisensi CC BY, dan tautan ke sumber asli. |
| **CC BY-SA (ShareAlike)** | **DITERIMA BERSYARAT** | Diizinkan dengan kewajiban atribusi lengkap dan pemahaman bahwa jika karya turunan dibuat, harus dilisensikan serupa. |
| **CC BY-NC / CC BY-NC-SA (Non-Commercial)** | **DITINJAU KHUSUS** | Hanya dapat digunakan jika platform WEB MUSIC dipastikan beroperasi murni non-komersial tanpa monetisasi/iklan. Memerlukan penanda khusus (`licenseType: "CC-BY-NC-4.0"`). |
| **CC BY-ND (NoDerivatives)** | **DITOLAK UNTUK REFF CUT** | Lisensi ND melarang pemotongan, remix, atau pembuatan karya turunan. Cuplikan segmen reff 30 detik berpotensi melanggar klausul NoDerivatives kecuali materi sumber aslinya memang berupa rekaman pendek 30 detik. |
| **Izin Tertulis Pemilik Hak (Direct Permission)** | **DITERIMA** | Audio dari musisi indie / kreator independen yang memberikan izin tertulis untuk katalog. Bukti persetujuan / surat izin wajib disimpan dan ditautkan (`licenseUrl` / record verifikasi). |
| **Fair Use / Tidak Jelas** | **DITOLAK MUTLAK** | Tidak menerima klaim "fair use" generik dari internet tanpa dasar hukum legal yang mengikat. |

---

## 3. Bukti Izin: Bukti Publik vs. Bukti Privat

Untuk melindungi hak kreator sekaligus menjaga privasi, bukti izin dibagi menjadi dua tipe referensi:

### A. Bukti Publik (`Public Evidence`)
- **Format:** URL **HTTPS** resmi yang dapat diakses oleh publik secara bebas.
- **Contoh:**
  - Tautan ke postingan pengumuman resmi di situs web / blog resmi sang artis.
  - Tautan repositori rilis resmi kreator dengan lisensi terbuka (misal: GitHub, Bandcamp resmi, atau Free Music Archive resmi).
  - Tautan dokumen lisensi Creative Commons resmi.

### B. Bukti Privat (`Private Internal Evidence`)
- Digunakan untuk perjanjian tertulis langsung (Direct Permission) antara kreator dan kurator proyek.
- **Format di Kode:** Berupa string penanda rekam jejak internal terenkripsi/anonim, diawali dengan format: `internal-private-record:<ID_DOKUMEN_INTERNAL>` (contoh: `internal-private-record:rec-2026-auth-001`).
- Dokumen asli (seperti PDF surat perjanjian, thread email persetujuan, atau rekaman digital) disimpan secara offline/internal di arsip aman kurator.

### ⚠️ Larangan Penyebaran Informasi Pribadi (No PII in Public Repository):
**DILARANG KERAS** memasukkan data pribadi kreator ke dalam repositori publik, metadata kode, commit message, maupun catatan issue, termasuk:
- Alamat email pribadi kreator.
- Nomor telepon / WhatsApp.
- Alamat tempat tinggal / fisik.
- Foto KTP, identitas diri, atau tanda tangan basah.
- Tangkapan layar chat pribadi yang memuat percakapan personal.

**Catatan Keterbatasan Validator Otomatis:**
Fungsi `isValidEvidenceReference()` menerapkan regex dasar untuk mendeteksi email mentah dan nomor telepon sebagai pengaman baris pertama. Namun, validator otomatis **tidak dapat menjamin 100% deteksi seluruh bentuk PII** (misal: nama lengkap dengan alamat tempat tinggal, tautan media sosial pribadi tertutup, atau format data non-standar). Oleh karena itu, **pemeriksaan manual oleh kurator tetap mutlak wajib** sebelum metadata didaftarkan ke kode.

---

## 4. Standar Cakupan Izin Minimum (`Permission Scope`)

Sebuah materi audio **hanya dapat dimasukkan ke katalog** jika izin tertulis mencakup hak-hak minimum berikut (`REQUIRED_CORE_SCOPES`):

1. **`streaming`**: Hak untuk memutar audio secara langsung (*on-demand playback*) di antarmuka web.
2. **`segment-editing`**: Hak untuk menentukan titik awal (`segmentStart`) dan titik akhir (`segmentEnd`) sebagai cuplikan reff berulang (loop 30 detik) tanpa melanggar hak moral/integritas karya.
3. **`website-distribution`**: Hak untuk mendistribusikan audio kepada pengunjung web aplikasi WEB MUSIC.
4. **`hosting` (Wajib jika di-host mandiri / `isProjectHosted: true`)**: Hak untuk menyimpan dan menyajikan file audio langsung dari server, CDN, atau infrastruktur proyek WEB MUSIC. Izin `streaming` pihak ketiga tidak otomatis mencakup izin menyimpan/meng-host file secara mandiri.
5. **`commercial-use` (Wajib jika produk komersial)**: Hak untuk memanfaatkan audio dalam konteks komersial jika platform menggunakan model bisnis berbayar/iklan.

Jika kreator hanya mengizinkan *streaming lagu utuh* namun menolak pemotongan karya (`segment-editing`), audio **wajib ditolak** untuk fitur Reff Viral.

### Perbedaan Model Hosting & Kewajiban Deklarasi:
Setiap materi kurasi **wajib** mencantumkan deklarasi eksplisit `isProjectHosted` bertipe boolean (`true` atau `false`). Nilai `undefined`, `null`, string, atau angka tidak diperbolehkan dan akan menyebabkan penolakan otomatis oleh validator.
- **Audio Eksternal (Direct Stream / `isProjectHosted: false`):** Audio di-stream langsung dari endpoint resmi kreator/platform berlisensi terbuka tanpa file diduplikasi ke server proyek. Scope `hosting` tidak wajib, namun `streaming`, `segment-editing`, dan `website-distribution` tetap wajib.
- **Audio Di-Host Mandiri (`isProjectHosted: true`):** Audio disimpan di server atau repositori aset proyek. Scope `hosting` **mutlak wajib** ada di dalam `permissionScope`. Izin pemutaran (*streaming*) dari kreator tidak otomatis memberikan hak untuk menyimpan dan meng-host ulang file audio di infrastruktur proyek.

---

## 5. Batas Waktu Izin (`expiresAt`) & Penanganan Izin Dicabut

### Batas Waktu Izin (`expiresAt`):
- Beberapa kreator memberikan izin penggunaan terbatas waktu (misalnya berlaku selama 1 tahun).
- Field `expiresAt` diisi dengan format tanggal kalender `YYYY-MM-DD`.
- Sistem mengevaluasi masa berlaku secara UTC (`isDateExpiredUtc()`) untuk mencegah perbedaan zona waktu lokal mesin.
- **Aturan Evaluasi Waktu:** Tanggal hari ini (UTC) masih dianggap valid hingga pergantian hari UTC berikutnya (`dateStr < todayUtcStr`). Jika tanggal hari ini telah melewati `expiresAt`, status track otomatis ditolak meskipun `verificationStatus` masih `"verified"`.
- Jika izin bersifat permanen (misal: Public Domain, CC0, atau lisensi tertulis selamanya tanpa batas waktu), `expiresAt` dikosongkan (`undefined`).

### Penanganan Izin yang Dicabut (`isRevoked`):
- Jika kreator mencabut izin sewaktu-waktu atau terjadi sengketa:
  1. Tandai properti `isRevoked: true` pada `legalMeta`.
  2. Validator `isValidLegalMeta()` secara otomatis akan menolak track tersebut meskipun `expiresAt` masih aktif di masa depan.
  3. Filter katalog publik pada `ViralSoundsView.jsx` dan pengecekan saat event pemutaran (`handlePlaySound`) akan secara instan menghapus sound dari antarmuka dan memutus akses playback.
  4. Hapus file audio dari penyimpanan aset jika di-host mandiri.

---

## 6. Kriteria Penolakan Otomatis (Auto-Reject)

Sound **wajib ditolak** jika memenuhi salah satu kondisi berikut:
1. Audio di-host pada file hosting sementara atau situs pembajakan (misal: zippyshare, anonfiles, mediafire pribadi, dsb).
2. Tautan sumber audio mengarah ke YouTube video URL atau TikTok video URL (bukan direct audio stream).
3. Kreator meminta atribusi berbayar atau melarang redistribusi digital.
4. Artwork gambar menampilkan foto selebritas/tokoh tanpa hak publisitas atau gambar berhak cipta Getty/Shutterstock ber-watermark.
5. Referensi izin mengandung data pribadi sensitif (alamat email, nomor telepon, atau data PII).
6. Izin yang diberikan tidak mencakup hak pemotongan segmen (`segment-editing`).
7. `isProjectHosted` tidak dideklarasikan secara eksplisit sebagai boolean (`true`/`false`).
8. `isProjectHosted: true` tetapi scope `hosting` tidak tercantum di `permissionScope`.
9. `expiresAt` tidak valid menurut kalender atau telah kedaluwarsa menurut waktu UTC.
10. `isRevoked` bernilai `true`.

---

## 7. Struktur Data Katalog & Panduan Menambahkan Audio Legal di Masa Depan

Ketika audio legal (orisinal buatan sendiri atau berizin tertulis) telah tersedia, daftarkan track ke dalam array `curatedViralSounds` di `src/data/viralSounds.js` sesuai kontrak `UnifiedTrack`.

### A. Format Entri Track:
```javascript
{
  id: "curated-001", // Identifier unik diawali 'curated-'
  source: "curated",
  type: "segment", // 'segment' untuk potongan reff
  title: "Judul Sound / Lagu",
  artist: "Nama Kreator / Musisi",
  artwork: "https://example.com/artwork.jpg", // Wajib URL HTTPS
  audioUrl: "https://example.com/audio.mp3", // Tautan streaming langsung HTTPS yang sah
  duration: 120, // Durasi total audio sumber (detik)
  previewDuration: 30, // Durasi segmen reff yang diputar (detik)
  segmentStart: 45, // Detik awal cuplikan reff
  segmentEnd: 75, // Detik akhir cuplikan reff (segmentEnd - segmentStart = 30)
  isLoopable: true, // true untuk auto seamless loop
  attribution: "Nama Kreator (Lisensi / Izin Resmi)",
  sourceUrl: "https://example.com/track-source", // Tautan sumber resmi kreator

  // Metadata Legal Kurasi (Mutlak Wajib)
  legalMeta: {
    licenseType: "Direct-Permission", // Lihat ALLOWED_LICENSE_TYPES
    licenseUrl: "https://example.com/artist/terms",
    attributionText: "Karya oleh Musisi X dengan izin resmi",
    creatorUrl: "https://example.com/artist",
    verificationStatus: "verified", // 'verified' | 'pending' | 'rejected'
    evidenceType: "written-permission", // 'self-created' | 'written-permission'
    evidenceReference: "internal-private-record:rec-2026-001", // HTTPS URL atau internal record ID
    permissionScope: ["streaming", "segment-editing", "website-distribution"], // Tambah 'hosting' jika isProjectHosted: true
    isProjectHosted: false, // Wajib boolean eksplisit (true/false)
    expiresAt: "2027-12-31", // Opsional (YYYY-MM-DD UTC)
    verifiedAt: "2026-11-07",
    verifierNotes: "Surat izin tersimpan di arsip kurator offline",
  },

  // Metadata Konten Viral & Navigasi (Opsional)
  viralMeta: {
    quote: "Kutipan hook lirik pendek orisinal atau berizin",
    trendTag: "Galau", // Tag tren
    category: "Galau", // Lihat ALLOWED_VIRAL_CATEGORIES: Galau, Sad, Romantic, Funny, Anime, Speed Up
  },
}
```

### B. Prosedur Pendaftaran:
1. Pastikan berkas audio dan izin telah lolos audit kurator offline.
2. Isi seluruh metadata di atas dengan lengkap tanpa ada field wajib yang tertinggal.
3. Jalankan `npm test` untuk memverifikasi kepatuhan seluruh validator otomatis.
4. Jalankan `npm run lint` dan `npm run build` sebelum merilis perubahan.
