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
        Schema::table('film_actions', function (Blueprint $table) {
            // Remove film_title column to achieve 3NF compliance
            $table->dropColumn('film_title');

            // Add note column for user personal notes
            $table->text('note')->nullable()->after('action_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('film_actions', function (Blueprint $table) {
            // Add film_title column back
            $table->string('film_title')->nullable()->after('film_id');

            // Drop note column
            $table->dropColumn('note');
        });
    }
};
