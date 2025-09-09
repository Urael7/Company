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
        // Change user_id to string (UUID) and add missing columns used by app
        if (Schema::hasTable('auditlogs')) {
            // Change user_id type to string(36)
            Schema::table('auditlogs', function (Blueprint $table) {
                // Some drivers require doctrine/dbal for change(); assume it's available in this project
                if (Schema::hasColumn('auditlogs', 'user_id')) {
                    $table->string('user_id', 36)->nullable()->change();
                }
            });

            // Add columns if they don't exist
            Schema::table('auditlogs', function (Blueprint $table) {
                if (!Schema::hasColumn('auditlogs', 'ip_address')) {
                    $table->string('ip_address', 45)->nullable()->after('user_id');
                }
                if (!Schema::hasColumn('auditlogs', 'user_agent')) {
                    $table->text('user_agent')->nullable()->after('ip_address');
                }
                if (!Schema::hasColumn('auditlogs', 'route_name')) {
                    $table->string('route_name')->nullable()->after('user_agent');
                }
                if (!Schema::hasColumn('auditlogs', 'http_method')) {
                    $table->string('http_method', 10)->nullable()->after('route_name');
                }
                if (!Schema::hasColumn('auditlogs', 'url')) {
                    $table->text('url')->nullable()->after('http_method');
                }
                if (!Schema::hasColumn('auditlogs', 'target_type')) {
                    $table->string('target_type')->nullable()->after('url');
                }
                if (!Schema::hasColumn('auditlogs', 'target_id')) {
                    $table->string('target_id')->nullable()->after('target_type');
                }
                if (!Schema::hasColumn('auditlogs', 'status_code')) {
                    $table->integer('status_code')->nullable()->after('target_id');
                }
                if (!Schema::hasColumn('auditlogs', 'message')) {
                    $table->text('message')->nullable()->after('status_code');
                }
                if (!Schema::hasColumn('auditlogs', 'context')) {
                    $table->json('context')->nullable()->after('meta');
                }
                if (!Schema::hasColumn('auditlogs', 'occurred_at')) {
                    $table->timestamp('occurred_at')->nullable()->after('context');
                }
                if (!Schema::hasColumn('auditlogs', 'impersonated_by')) {
                    $table->string('impersonated_by', 36)->nullable()->after('occurred_at');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('auditlogs')) {
            // Attempt to revert type; if doctrine/dbal is present
            Schema::table('auditlogs', function (Blueprint $table) {
                if (Schema::hasColumn('auditlogs', 'user_id')) {
                    $table->unsignedBigInteger('user_id')->nullable()->change();
                }
            });

            Schema::table('auditlogs', function (Blueprint $table) {
                foreach ([
                    'ip_address', 'user_agent', 'route_name', 'http_method', 'url',
                    'target_type', 'target_id', 'status_code', 'message', 'context',
                    'occurred_at', 'impersonated_by',
                ] as $col) {
                    if (Schema::hasColumn('auditlogs', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};


