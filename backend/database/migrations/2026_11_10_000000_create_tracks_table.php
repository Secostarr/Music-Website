<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracks', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->string('artist')->default('Unknown artist');
            $table->string('category')->default('Umum');
            $table->string('audio_path');
            $table->json('lyrics')->nullable();
            $table->timestamps();
            $table->index(['title', 'artist', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
