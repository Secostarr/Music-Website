# Project Instructions — WEB MUSIC

Kamu bekerja pada project **WEB MUSIC** menggunakan OpenCode melalui terminal VS Code. Model yang dipilih pengguna melalui 9Router adalah **Full Antigravity**. Model adalah penyedia kemampuan AI; OpenCode adalah coding agent yang membaca instruksi, mengubah file, dan menjalankan perintah.

## Aturan wajib sebelum bekerja
1. Baca file ini dan skill `professional-dev` di `.opencode/skills/professional-dev/SKILL.md` sebelum melakukan implementasi. Gunakan tool `skill` OpenCode dengan ID `professional-dev` jika tersedia; jika tidak, baca file skill tersebut secara langsung.
2. Periksa kondisi project terlebih dahulu: struktur folder, `package.json`, lockfile, framework dan versinya, konfigurasi, route, komponen, styling, database/API bila ada, serta `git status`.
3. Jangan mengasumsikan project memakai Next.js App Router, Pages Router, TypeScript, Tailwind, atau library tertentu. Temukan dari file yang benar-benar ada.
4. Jangan mengubah, menghapus, memformat ulang massal, atau menimpa perubahan pengguna yang sudah ada. Periksa `git status` dan diff sebelum mengedit.
5. Buat rencana singkat dan sebutkan file yang diperkirakan terdampak untuk pekerjaan yang berisiko atau lintas banyak file.
6. Kerjakan hanya ruang lingkup yang diminta. Jangan melakukan refactor besar atau mengganti dependency tanpa alasan dan persetujuan.
7. Pertahankan perilaku dan fitur lama. Lakukan regression check pada area yang berkaitan dengan perubahan.
8. Jangan mengaku sudah menjalankan test, build, browser check, atau pencarian referensi jika belum benar-benar dilakukan. Laporkan keterbatasan dengan jujur.

## Standar implementasi
- Ikuti konvensi framework dan pola arsitektur yang sudah dipakai project.
- Utamakan komponen reusable dan dependency yang sudah terpasang.
- Tulis kode jelas, konsisten, mudah dirawat; hindari duplikasi, dead code, `any` yang tidak perlu, dan abstraksi berlebihan.
- Beri komentar hanya untuk alasan atau alur yang tidak langsung jelas. Gunakan Bahasa Indonesia sederhana jika komentar diperlukan.
- Validasi input di server untuk operasi sensitif; jangan mengandalkan validasi browser saja.
- Jaga autentikasi, otorisasi, validasi, keamanan API, dan kerahasiaan environment variable.
- Jangan menampilkan secret, token, password, stack trace sensitif, atau isi `.env`.
- Jangan menjalankan perintah destruktif seperti reset database, penghapusan massal, `git reset --hard`, `git clean`, atau force push tanpa persetujuan eksplisit.
- Untuk konten musik, gunakan hanya aset/audio yang pengguna miliki, berlisensi, atau memang diizinkan untuk digunakan. Jangan mengambil atau mendistribusikan ulang audio, artwork, atau lirik berhak cipta tanpa izin.

## UI/UX
- Sebelum mendesain ulang, pahami pengguna, tujuan halaman, pola desain yang sudah ada, dan batasan project.
- Jika akses web tersedia dan referensi akan membantu, cari referensi produk nyata yang relevan (misalnya produk musik, audio player, library, playlist, atau dashboard). Jangan mengaku mencari jika tidak melakukannya.
- Hindari tampilan generik/AI-slop: gradient dekoratif berlebihan, semua elemen dijadikan card, shadow berlebihan, radius seragam tanpa alasan, emoji sebagai ikon UI, dan animasi tanpa tujuan.
- Utamakan hierarki visual, tipografi, spacing, kontras, konsistensi, aksesibilitas, dan responsive layout.
- Periksa package UI yang sudah tersedia sebelum menambah library. Pilih satu sistem komponen yang cocok dan konsisten; jangan mencampur banyak library dengan fungsi sama.
- Semua tombol dan kontrol harus punya aksi nyata. Sediakan loading, empty, error, success, disabled, dan confirmation state sesuai kebutuhan.
- Untuk audio player, pastikan kontrol play/pause, progress, volume, durasi, loading/error, dan keyboard/accessibility berperilaku benar sesuai ruang lingkup. Jangan mengklaim streaming/audio berfungsi tanpa mengujinya.

## Testing dan penyelesaian
Sebelum menyatakan selesai:
1. Jalankan pemeriksaan yang relevan berdasarkan scripts yang benar-benar tersedia di `package.json` (lint, typecheck, test, build).
2. Jalankan atau uji alur fitur yang diubah jika lingkungan memungkinkan.
3. Periksa responsive layout untuk perubahan UI bila browser/preview tersedia.
4. Periksa diff akhir dan pastikan tidak ada perubahan tidak terkait, secret, atau file hasil build yang tidak seharusnya.
5. Lakukan regression check pada fitur yang mungkin terdampak.
6. Laporkan perintah yang dijalankan dan hasil sebenarnya. Jika gagal/tidak bisa dijalankan, jelaskan sebabnya; jangan menyembunyikan kegagalan.
7. Jangan menyatakan pekerjaan selesai jika masih ada blocker penting.

## Git dan GitHub — wajib minta izin
Format pesan commit: `<type>: <deskripsi singkat dalam Bahasa Indonesia>`.

Jenis utama:
- `add:` menambahkan fitur, halaman, komponen, atau kemampuan baru.
- `fix:` memperbaiki bug atau error.
- `delete:` menghapus file, fitur, atau kode yang memang tidak diperlukan.

Jenis tambahan:
- `update:` memperbarui fitur/tampilan yang sudah ada.
- `refactor:` merapikan struktur tanpa mengubah perilaku.
- `docs:` memperbarui dokumentasi.
- `test:` menambah atau memperbarui pengujian.
- `chore:` pemeliharaan konfigurasi/dependency.

Contoh:
- `add: tambah playlist favorit`
- `fix: perbaiki progress audio player`
- `delete: hapus komponen pemutar lama`
- `update: perbarui tampilan halaman koleksi`

Sebelum commit:
- Periksa `git status`, `git diff`, dan `git diff --check`.
- Stage hanya file yang memang terkait; jangan otomatis `git add .`.
- Pastikan tidak ada `.env`, token, password, credential, atau file sensitif.
- Jangan commit perubahan pengguna yang tidak terkait.
- Pisahkan commit jika perubahan memiliki tujuan berbeda.

**Dilarang melakukan commit atau push tanpa persetujuan eksplisit pengguna.** Setelah testing dan review selesai, tanyakan: "Pemeriksaan selesai. Apakah kamu ingin saya membuat commit dan melakukan push ke GitHub?" Jika pengguna menyetujui, jelaskan file yang akan di-commit dan target branch/remote, lalu lakukan hanya tindakan yang disetujui. Jika tidak, biarkan perubahan di lokal.

## Format laporan akhir
- Status: selesai / belum selesai.
- Ringkasan perubahan.
- File baru dan file yang diubah beserta fungsinya.
- Test/build/lint yang dijalankan dan hasilnya.
- Regression check yang dilakukan.
- Risiko, keterbatasan, atau pekerjaan lanjutan.
- Konfirmasi commit/push (jangan melakukan otomatis).
