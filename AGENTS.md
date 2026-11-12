## Advanced UI Engineering & Design Intelligence

Tujuan utama: menghasilkan antarmuka website dengan kualitas visual profesional, modern, kreatif, dan memiliki karakter desain yang kuat. Jangan hanya mengejar fungsi, tetapi perhatikan kualitas pengalaman visual dan interaksi pengguna.

### 1. Referensi Komponen dan Inspirasi

Sebelum mengimplementasikan UI yang kompleks, pertimbangkan untuk mengeksplorasi referensi berikut:

- Uiverse (https://uiverse.io/) — inspirasi komponen CSS, button, toggle, loader, dan hover effects.
- Aceternity UI (https://ui.aceternity.com/) — animasi modern, visual effects, background, dan komponen interaktif.
- Magic UI (https://magicui.design/) — text animation, marquee, border animation, dan micro-interactions.
- 21st.dev (https://21st.dev/) — inspirasi komponen React dan implementasi UI modern.
- shadcn/ui (https://ui.shadcn.com/) — komponen reusable, form, dialog, dropdown, sidebar, dan dashboard.
- Dribbble (https://dribbble.com/) — inspirasi layout, tipografi, dan komposisi visual.
- Awwwards (https://www.awwwards.com/) — inspirasi website kreatif dan pengalaman interaktif.

Ketentuan:
- Gunakan referensi sebagai inspirasi, bukan menyalin seluruh desain secara membabi buta.
- Periksa lisensi dan ketentuan penggunaan kode maupun aset.
- Pastikan teknologi referensi kompatibel dengan framework project.
- Jangan memasang dependency hanya karena sebuah referensi menggunakannya.
- Jika akses internet tidak tersedia, gunakan komponen dan dependency yang sudah ada.

### 2. Standar Visual Design

Setiap halaman harus memiliki:
- Visual hierarchy yang jelas.
- Tipografi dengan ukuran dan bobot yang konsisten.
- Spacing dan alignment yang terukur.
- Palet warna yang memiliki identitas.
- Kontras yang nyaman dan memenuhi aksesibilitas.
- Komposisi layout yang tidak monoton.
- Responsive design untuk desktop, tablet, dan mobile.

Hindari:
- Semua elemen dijadikan card.
- Gradient berlebihan tanpa tujuan.
- Shadow terlalu tebal.
- Border radius seragam pada seluruh elemen.
- Terlalu banyak warna aksen.
- Ikon emoji sebagai pengganti ikon UI.
- Tampilan dashboard generik.
- Animasi dekoratif yang mengganggu.

### 3. Interactive UI Components

Gunakan komponen interaktif secara selektif sesuai kebutuhan:
- Animated buttons.
- Interactive cards.
- Hover dan focus effects.
- Tooltips.
- Dropdown dan popover.
- Tabs dan segmented controls.
- Skeleton loading.
- Progress indicators.
- Modal dan drawer.
- Toast notifications.
- Animated navigation.
- Empty state dengan visual yang informatif.

Setiap komponen harus memiliki fungsi nyata, bukan sekadar dekorasi.

### 4. Motion & Animation

Gunakan animasi untuk meningkatkan pengalaman pengguna:
- Smooth transitions.
- Hover feedback.
- Page transitions jika sesuai arsitektur.
- Scroll-triggered animations jika relevan.
- Animated typography.
- Loading animations.
- Micro-interactions.

Ketentuan:
- Animasi harus memiliki tujuan.
- Hindari animasi berlebihan.
- Jaga performa dan penggunaan GPU.
- Hormati prefers-reduced-motion.
- Jangan menghambat navigasi atau interaksi pengguna.

### 5. Design Exploration

Untuk pekerjaan UI besar atau redesign:
1. Pahami tujuan halaman dan pengguna.
2. Identifikasi pola desain yang sudah ada.
3. Cari referensi visual yang relevan jika akses web tersedia.
4. Tentukan arah desain sebelum implementasi.
5. Tentukan sistem warna, tipografi, spacing, dan komponen.
6. Implementasikan desain secara konsisten.
7. Evaluasi hasil melalui browser preview jika tersedia.

Jangan langsung menggunakan desain pertama yang muncul dari AI. Pertimbangkan alternatif layout dan komposisi visual sebelum menentukan hasil akhir.

### 6. Framework & Component Compatibility

- Periksa framework dan dependency yang sudah digunakan.
- Prioritaskan dependency yang sudah terpasang.
- Gunakan komponen yang kompatibel dengan arsitektur project.
- Untuk React, pertimbangkan shadcn/ui, Aceternity UI, Magic UI, atau 21st.dev jika sesuai.
- Untuk HTML/CSS/JavaScript atau Laravel Blade, prioritaskan implementasi native atau komponen yang kompatibel.
- Jangan memaksakan library React pada project non-React.
- Hindari memasang beberapa library dengan fungsi yang sama.
- Pastikan seluruh komponen bisa dipelihara dan dikembangkan.

### 7. Visual Quality Assurance

Sebelum menyatakan UI selesai:
1. Jalankan aplikasi dan buka browser preview jika tersedia.
2. Periksa tampilan desktop dan mobile.
3. Periksa overflow, alignment, spacing, dan typography.
4. Uji seluruh tombol, dropdown, modal, tab, dan interaksi.
5. Periksa loading, empty, error, dan success states.
6. Periksa konsistensi antarhalaman.
7. Pastikan tidak ada elemen yang hanya terlihat bagus tetapi tidak berfungsi.

Jika browser preview tidak tersedia, jelaskan keterbatasannya dan jangan mengklaim telah melakukan visual inspection.

### 8. Standar Hasil Akhir

Hasil implementasi harus:
- Terlihat seperti produk digital yang benar-benar dirancang oleh UI/UX designer.
- Memiliki identitas visual yang konsisten.
- Tidak terlihat seperti template AI generik.
- Mengutamakan usability tanpa mengorbankan estetika.
- Memiliki interaksi yang halus dan responsif.
- Tetap ringan, maintainable, dan sesuai arsitektur project.

Prioritas utama: Design Quality, Usability, Accessibility, Performance, dan Maintainability.