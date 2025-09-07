<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PermissionModel;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\User;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        $roles = Role::withCount('permissions')->get();
        return Inertia::render('roles', [
            'permissions' => $permissions,
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['required', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);
        $role = Role::create(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions']);
        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function destroy(Role $role)
    {
    $role->delete();
    return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all();
        return Inertia::render('roles/EditRole', [
            'role' => $role,
        'permissions' => $permissions,
    ]);
}


public function update(Request $request, Role $role)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255', "unique:roles,name,{$role->id}"],
        'permissions' => ['required', 'array'],
        'permissions.*' => ['integer', 'exists:permissions,id'],
    ]);

    $role->update(['name' => $validated['name']]);
    $role->syncPermissions($validated['permissions']);

    return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
}

}