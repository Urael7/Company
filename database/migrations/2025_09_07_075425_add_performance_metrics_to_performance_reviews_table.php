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
            $table->integer('attendance_score')->nullable()->comment('Attendance score out of 100');
            $table->integer('efficiency_score')->nullable()->comment('Efficiency score out of 100');
            $table->integer('quality_score')->nullable()->comment('Quality of work score out of 100');
            $table->integer('teamwork_score')->nullable()->comment('Teamwork score out of 100');
            $table->integer('communication_score')->nullable()->comment('Communication score out of 100');
            $table->integer('punctuality_score')->nullable()->comment('Punctuality score out of 100');
            $table->integer('overall_score')->nullable()->comment('Overall performance score');
            $table->string('review_period')->nullable()->comment('e.g., Q1 2024, Monthly, etc.');
            $table->date('review_date')->nullable();
            $table->json('goals_achieved')->nullable()->comment('JSON array of achieved goals');
            $table->json('areas_for_improvement')->nullable()->comment('JSON array of improvement areas');
            $table->string('status')->default('pending')->comment('pending, completed, needs_improvement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->dropColumn([
                'attendance_score',
                'efficiency_score', 
                'quality_score',
                'teamwork_score',
                'communication_score',
                'punctuality_score',
                'overall_score',
                'review_period',
                'review_date',
                'goals_achieved',
                'areas_for_improvement',
                'status'
            ]);
        });
    }
};
