<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_tracks', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('track_id', 30);
            $table->string('title');
            $table->string('artist')->nullable();
            $table->string('artwork', 500)->nullable();
            $table->unsignedInteger('duration')->default(0);
            $table->string('album')->nullable();
            $table->string('source', 30)->default('youtube');
            $table->string('videoId', 30)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'track_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_tracks');
    }
};
