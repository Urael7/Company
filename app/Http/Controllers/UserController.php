<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->latest()->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name'),
                'role_ids' => $user->roles->pluck('id'),
                'employment_type' => $user->employment_type,
                'created_at' => $user->created_at?->toDateTimeString(),
            ];
        });

        $roles = Role::all(['id','name']);

        return Inertia::render('users', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'integer|exists:roles,id',
            'employment_type' => 'required|string|in:employee,intern,manager',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // cast to hashed in model
            'employment_type' => $validated['employment_type'],
        ]);

        // assign roles
        $user->syncRoles(Role::whereIn('id', $validated['role_ids'])->pluck('name'));

        return redirect()->route('users')->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'integer|exists:roles,id',
            'employment_type' => 'required|string|in:employee,intern,manager',
        ]);

        $update = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'employment_type' => $validated['employment_type'],
        ];
        if (!empty($validated['password'])) {
            $update['password'] = $validated['password']; // hashed by model cast
        }

        $user->update($update);
        $user->syncRoles(Role::whereIn('id', $validated['role_ids'])->pluck('name'));

        return redirect()->route('users')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users')->with('success', 'User deleted successfully.');
    }
}


