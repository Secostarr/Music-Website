<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Admin lokal

Setup awal membuat satu akun admin melalui seeder:

- Email: `admin@webmusic.local`
- Password: `AdminLocal123!`

Login tersedia di `/login`; dashboard di `/admin`. Password disimpan sebagai hash Laravel di database. Kredensial ini hanya untuk pengembangan lokal: ganti `ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `.env` sebelum memakai server bersama atau mengaksesnya dari jaringan. Jangan commit `.env`.

Jalankan `php artisan db:seed` untuk membuat atau memperbarui akun admin dari nilai environment tersebut.

## Admin katalog musik

1. Buat database MySQL `web_music`, salin `.env.example` menjadi `.env`, lalu sesuaikan koneksi MySQL.
2. Jalankan `php artisan key:generate`, `php artisan migrate --seed`, dan `php artisan storage:link`.
3. Jalankan `php artisan serve` lalu buka `/login`.
4. Login lokal: `admin@webmusic.local` / `AdminLocal123!` (ganti password sebelum server dibuka ke jaringan).
5. Di `/admin`, unggah MP3 maks. 50 MB, isi artis/kategori, impor `.lrc` atau masukkan lirik manual.

LRC memakai timestamp `[mm:ss.xx] teks`. Audio disimpan pada `storage/app/public/tracks`; metadata dan lirik tersimpan di MySQL. Batas unggah PHP juga harus mengizinkan file 50 MB (`upload_max_filesize` dan `post_max_size`). Lirik manual dibagi per 4 detik sebagai placeholder; gunakan LRC untuk timestamp akurat. Editor timestamp manual dan integrasi katalog ke frontend React belum tersedia.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
