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
        Schema::table('performance_reviews', function (Blueprint $table) {
            // Change user_id column to support UUIDs
            $table->string('user_id', 36)->change();
            
            // Change reviewer_id column to support UUIDs
            $table->string('reviewer_id', 36)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            // Revert user_id column back to bigint
            $table->unsignedBigInteger('user_id')->change();
            
            // Revert reviewer_id column back to bigint
            $table->unsignedBigInteger('reviewer_id')->nullable()->change();
        });
    }
};
