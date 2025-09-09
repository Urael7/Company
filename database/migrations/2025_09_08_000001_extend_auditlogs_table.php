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
        Schema::table('auditlogs', function (Blueprint $table) {
            $table->string('ip_address')->nullable()->after('user_id');
            $table->string('user_agent', 1024)->nullable()->after('ip_address');
            $table->string('action')->nullable()->change();
            $table->string('route_name')->nullable()->after('action');
            $table->string('http_method', 10)->nullable()->after('route_name');
            $table->string('url', 2048)->nullable()->after('http_method');
            $table->string('target_type')->nullable()->after('url');
            $table->string('target_id')->nullable()->after('target_type');
            $table->integer('status_code')->nullable()->after('target_id');
            $table->text('message')->nullable()->after('status_code');
            $table->json('context')->nullable()->after('message');
            $table->timestamp('occurred_at')->nullable()->index()->after('context');
            $table->unsignedBigInteger('impersonated_by')->nullable()->after('occurred_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auditlogs', function (Blueprint $table) {
            $table->dropColumn([
                'ip_address',
                'user_agent',
                'route_name',
                'http_method',
                'url',
                'target_type',
                'target_id',
                'status_code',
                'message',
                'context',
                'occurred_at',
                'impersonated_by',
            ]);
        });
    }
};


