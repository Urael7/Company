<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            // Add new columns
            $table->string('name')->after('user_id');
            $table->enum('position', ['full-time', 'part-time', 'intern', 'other'])->after('name');
            $table->string('attachment')->nullable()->after('status');
            $table->text('comment')->nullable()->after('attachment');

            // Modify 'type' column to be enum
            $table->enum('type', [
                'sick leave', 
                'service request', 
                'purchase request', 
                'parental leave',
                'bereavement',
                'other'
            ])->change();
        });
    }

    public function down()
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->dropColumn(['name', 'position', 'attachment', 'comment']);
            // If needed, revert 'type' back to string
            $table->string('type')->change();
        });
    }
};
