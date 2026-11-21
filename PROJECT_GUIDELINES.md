# Panduan Pengembangan

Dokumen ini menetapkan standar implementasi dan pemeliharaan untuk IramaNusantara. Terapkan panduan sesuai kebutuhan fitur; hindari perubahan yang tidak diperlukan.

## Prinsip Umum

- Pahami struktur, framework, dependensi, dan pola yang sudah digunakan sebelum mengubah kode.
- Utamakan solusi sederhana, mudah dirawat, dan konsisten dengan arsitektur proyek.
- Jangan menambah dependensi jika kemampuan bawaan platform atau dependensi yang ada sudah memadai.
- Jangan mengubah file atau konfigurasi yang tidak terkait dengan permintaan.
- Periksa perubahan lokal sebelum mengedit agar pekerjaan yang sudah ada tidak tertimpa.

## Antarmuka dan Pengalaman Pengguna

- Buat hierarki informasi, tipografi, jarak, dan alignment yang konsisten.
- Gunakan palet warna yang sesuai identitas produk dan pastikan teks memiliki kontras memadai.
- Rancang tampilan untuk desktop, tablet, dan ponsel; jangan hanya mengecilkan layout desktop.
- Gunakan komponen interaktif hanya jika membantu tugas pengguna. Pastikan setiap kontrol memiliki fungsi yang jelas.
- Hindari dekorasi berlebihan, penggunaan card yang tidak perlu, bayangan berat, aksen warna yang terlalu banyak, dan ikon emoji sebagai ikon antarmuka.
- Gunakan animasi secara terukur untuk memberi umpan balik atau menjelaskan perubahan. Hormati `prefers-reduced-motion` dan jaga performa.
- Jika memakai kode, aset, atau referensi eksternal, periksa lisensi dan kecocokannya dengan teknologi proyek.

## Aksesibilitas dan Responsivitas

- Gunakan elemen HTML semantik, label yang sesuai, teks alternatif, serta indikator fokus keyboard yang terlihat.
- Pastikan fitur dapat digunakan dengan keyboard dan area sentuh memiliki ukuran yang wajar.
- Periksa overflow horizontal, dialog, navigasi, dan kontrol pemutar pada ukuran layar kecil.
- Jangan mengandalkan warna saja untuk menyampaikan status.

## Keamanan dan Data

- Jangan menambahkan kredensial, token, kunci privat, atau nilai rahasia ke source control.
- Simpan konfigurasi sensitif di environment variable dan jaga file `.env` tetap diabaikan Git.
- Validasi input pada batas kepercayaan dan lakukan otorisasi di server untuk operasi yang memerlukannya.
- Jangan menonaktifkan perlindungan keamanan untuk menghilangkan error.
- Jangan menghapus atau mengubah data persisten tanpa izin yang jelas.
- Pastikan sumber musik, artwork, metadata, dan lirik memiliki izin penggunaan yang sesuai. Jangan mengunduh atau mendistribusikan ulang konten tanpa hak yang diperlukan.

## Pengujian dan Pemeriksaan

- Periksa script yang tersedia di `package.json` dan konfigurasi proyek sebelum menjalankan perintah.
- Jalankan test, lint, typecheck, atau build yang relevan terhadap perubahan.
- Untuk perubahan antarmuka, periksa preview browser bila tersedia, termasuk tampilan ponsel dan desktop.
- Uji interaksi dan state yang terdampak, termasuk loading, kosong, gagal, dan berhasil jika relevan.
- Laporkan dengan jelas pemeriksaan yang dilakukan serta keterbatasan yang belum diverifikasi. Jangan menyatakan inspeksi visual telah dilakukan tanpa melihat hasilnya.

## Git dan Rilis

- Periksa `git status`, `git diff`, dan `git diff --check` sebelum commit.
- Stage hanya file yang terkait; pastikan tidak ada rahasia, file build, atau perubahan pengguna yang tidak dimaksudkan.
- Gunakan pesan commit yang ringkas dan deskriptif, misalnya `fix: perbaiki sinkronisasi lirik` atau `update: rapikan pemutar layar penuh`.
- Jangan melakukan commit atau push tanpa persetujuan eksplisit pengguna.
- Sebelum push, pastikan branch dan remote tujuan sudah benar.
