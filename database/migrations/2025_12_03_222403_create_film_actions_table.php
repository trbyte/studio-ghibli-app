<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('film_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('film_id'); // Ghibli API film ID
            $table->string('film_title'); // Store title for quick access
            $table->enum('action_type', ['favorite', 'plan', 'on_hold', 'dropped', 'finished']);
            $table->timestamps();
            
            // Ensure a user can only have one action per film
            $table->unique(['user_id', 'film_id', 'action_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('film_actions');
    }
};
