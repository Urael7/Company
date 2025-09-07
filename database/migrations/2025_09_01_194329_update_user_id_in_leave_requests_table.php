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
        Schema::table('leave_requests', function (Blueprint $table) {
            // Drop the old user_id column if it exists
            $table->dropColumn('user_id');
        });

        Schema::table('leave_requests', function (Blueprint $table) {
            // Add new UUID foreign key column
            $table->foreignUuid('user_id')
                  ->after('id') // put it right after the id column
                  ->constrained('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');

            // Optionally recreate as old column type (bigint) if you want rollback compatibility
            $table->unsignedBigInteger('user_id')->nullable();
        });
    }
};
