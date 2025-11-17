<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Create Admin role if not exists
        $adminRole = Role::firstOrCreate([
            'name' => 'Admin',
            'display_name' => 'Administrator',
            'description' => 'Administrator with full access'
        ]);

        // Create test admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Create regular user role
        $userRole = Role::firstOrCreate([
            'name' => 'User',
            'display_name' => 'User',
            'description' => 'Regular user with basic access'
        ]);

        // Create test regular user
        $regularUser = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password123'),
                'role_id' => $userRole->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Test users created successfully!');
        $this->command->info('📧 Admin: admin@test.com / password123');
        $this->command->info('📧 User: user@test.com / password123');
    }
}
