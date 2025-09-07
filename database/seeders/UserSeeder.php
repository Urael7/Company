<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Ramsey\Uuid\Uuid;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $User = [
            [
                'name' => 'Test',
                // 'last_name' => 'System',
                'email' => 'test@gmail.com',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($User as $user)
        {
            User::create([
                'id' => Uuid::uuid4()->toString(),
                'name' => $user['name'],
                // 'last_name' => $user['last_name'],
                'email' => $user['email'],
                'password' => $user['password'],
            ]);
        }

        // Assign role to all users
        $role = Role::where('name', 'Test')->first();
        if ($role) {
            User::all()->each(function ($User) use ($role) {
                $User->assignRole($role);
            });
        }

    }
}
