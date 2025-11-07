<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get roles
        $ownerRole = Role::where('name', 'owner')->first();
        $pmRole = Role::where('name', 'pm')->first();
        $backendRole = Role::where('name', 'backend')->first();
        $frontendRole = Role::where('name', 'frontend')->first();
        $qaRole = Role::where('name', 'qa')->first();
        $designerRole = Role::where('name', 'designer')->first();

        // Create demo users
        $users = [
            [
                'name' => 'System Owner',
                'email' => 'owner@aitools.dev',
                'password' => Hash::make('password123'),
                'role_id' => $ownerRole->id,
            ],
            [
                'name' => 'Project Manager',
                'email' => 'pm@aitools.dev',
                'password' => Hash::make('password123'),
                'role_id' => $pmRole->id,
            ],
            [
                'name' => 'Backend Developer',
                'email' => 'backend@aitools.dev',
                'password' => Hash::make('password123'),
                'role_id' => $backendRole->id,
            ],
            [
                'name' => 'Frontend Developer',
                'email' => 'frontend@aitools.dev',
                'password' => Hash::make('password123'),
                'role_id' => $frontendRole->id,
            ],
            [
                'name' => 'QA Engineer',
                'email' => 'qa@aitools.dev',
                'password' => Hash::make('password123'),
                'role_id' => $qaRole->id,
            ],
            [
                'name' => 'UI/UX Designer',
                'email' => 'designer@aitools.dev',
                'password' => Hash::make('password123'),
                'role_id' => $designerRole->id,
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
