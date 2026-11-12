<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@webmusic.local');
        $password = env('ADMIN_PASSWORD');

        if (! $password && app()->isLocal()) {
            $password = 'AdminLocal123!';
        }

        if (! $password) {
            throw new \RuntimeException('ADMIN_PASSWORD harus diatur sebelum seeding admin.');
        }

        User::updateOrCreate(
            ['email' => $email],
            ['name' => 'Administrator', 'password' => $password],
        );
    }
}
