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
        // Drop table if it exists
        Schema::dropIfExists('film_actions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // recreate a minimal table (matching the previous simple migration)
        Schema::create('film_actions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }
};
