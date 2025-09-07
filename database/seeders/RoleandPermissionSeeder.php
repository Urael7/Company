<?php

namespace Database\Seeders;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Ramsey\Uuid\Uuid;

class RoleandPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    protected $guard_name = 'web';


    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            //Auditlog
            'View_auditlog_list',
            'View_all_auditlog_list',
            'Create_auditlog',
            'Show_auditlog',
            'Edit_auditlog',
            'Delete_auditlog',

            //User Management
            'View_user_list',
            'Create_user',
            'Show_user',
            'Edit_user',
            'Delete_user',

            //Requests (Leave/Permission Requests)
            'View_leave_requests',
            'Create_leave_request',
            'Show_leave_request',
            'Edit_leave_request',
            'Delete_leave_request',

            //Events
            'View_event_list',
            'Create_event',
            'Show_event',
            'Edit_event',
            'Delete_event',

            //Announcements
            'View_Announcement_list',
            'Create_Announcement',
            'Show_Announcement',
            'Edit_Announcement',
            'Delete_Announcement',

            //Performance Reviews
            'View_PerformanceReview_list',
            'Create_PerformanceReview',
            'Show_PerformanceReview',
            'Edit_PerformanceReview',
            'Delete_PerformanceReview',

            
        ];

        // Create permissions with UUIDs
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $roleAdmin = Role::create([ 'name' => 'Admin']);

        // Assign all permissions to the admin role
        $roleAdmin->givePermissionTo(Permission::all());
    }
}
