<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->get();
        return response()->json($roles);
    }

    public function show(Role $role)
    {
        $role->loadCount('users');
        return response()->json($role);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $role = Role::create($validated);
        return response()->json($role, 201);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:roles,name,' . $role->id,
            'display_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $role->update($validated);
        return response()->json($role);
    }

    public function destroy(Role $role)
    {
        // Check if role has users
        if ($role->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete role with assigned users'
            ], 400);
        }

        $role->delete();
        return response()->json(null, 204);
    }
}
