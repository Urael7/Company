<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignAdminRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assign:admin-role';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign Admin role to admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $admin = User::where('email', 'admin@gmail.com')->first();
        
        if (!$admin) {
            $this->error('Admin user not found!');
            return;
        }

        $role = Role::where('name', 'Admin')->first();
        
        if (!$role) {
            $this->error('Admin role not found!');
            return;
        }

        if (!$admin->hasRole('Admin')) {
            $admin->assignRole('Admin');
            $this->info('Admin role assigned to ' . $admin->name);
        } else {
            $this->info('Admin role already assigned to ' . $admin->name);
        }

        // Check permissions
        $this->info('Admin permissions:');
        $permissions = $admin->getAllPermissions()->pluck('name');
        foreach ($permissions as $permission) {
            $this->line('- ' . $permission);
        }

        // Check if has performance review permission
        if ($admin->can('View_PerformanceReview_list')) {
            $this->info('Admin has View_PerformanceReview_list permission');
        } else {
            $this->error('Admin does NOT have View_PerformanceReview_list permission');
        }
    }
}
