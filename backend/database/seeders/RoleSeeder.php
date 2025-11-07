<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            [
                'name' => 'owner',
                'display_name' => 'Owner',
                'description' => 'Full system access and administration rights'
            ],
            [
                'name' => 'pm',
                'display_name' => 'Project Manager',
                'description' => 'Project management and team coordination'
            ],
            [
                'name' => 'backend',
                'display_name' => 'Backend Developer',
                'description' => 'Backend development and API management'
            ],
            [
                'name' => 'frontend',
                'display_name' => 'Frontend Developer',
                'description' => 'Frontend development and UI/UX implementation'
            ],
            [
                'name' => 'qa',
                'display_name' => 'QA Engineer',
                'description' => 'Quality assurance and testing'
            ],
            [
                'name' => 'designer',
                'display_name' => 'Designer',
                'description' => 'UI/UX design and visual content creation'
            ]
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
