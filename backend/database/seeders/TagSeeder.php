<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'Free', 'slug' => 'free', 'color' => '#10B981', 'description' => 'Free to use tools'],
            ['name' => 'Open Source', 'slug' => 'open-source', 'color' => '#3B82F6', 'description' => 'Open source projects'],
            ['name' => 'API Available', 'slug' => 'api-available', 'color' => '#8B5CF6', 'description' => 'Tools with API access'],
            ['name' => 'Cloud Based', 'slug' => 'cloud-based', 'color' => '#06B6D4', 'description' => 'Cloud-hosted solutions'],
            ['name' => 'Real-time', 'slug' => 'real-time', 'color' => '#F59E0B', 'description' => 'Real-time processing'],
            ['name' => 'No Code', 'slug' => 'no-code', 'color' => '#84CC16', 'description' => 'No coding required'],
            ['name' => 'Enterprise', 'slug' => 'enterprise', 'color' => '#EF4444', 'description' => 'Enterprise-grade solutions'],
            ['name' => 'Beginner Friendly', 'slug' => 'beginner-friendly', 'color' => '#EC4899', 'description' => 'Easy for beginners'],
            ['name' => 'Mobile Support', 'slug' => 'mobile-support', 'color' => '#6366F1', 'description' => 'Mobile app available'],
            ['name' => 'Batch Processing', 'slug' => 'batch-processing', 'color' => '#F97316', 'description' => 'Supports batch operations'],
            ['name' => 'Multi-language', 'slug' => 'multi-language', 'color' => '#14B8A6', 'description' => 'Multiple language support'],
            ['name' => 'Integration Ready', 'slug' => 'integration-ready', 'color' => '#8B5CF6', 'description' => 'Easy integration with other tools'],
            ['name' => 'Drag & Drop', 'slug' => 'drag-drop', 'color' => '#06B6D4', 'description' => 'Drag and drop interface'],
            ['name' => 'AI Powered', 'slug' => 'ai-powered', 'color' => '#F59E0B', 'description' => 'Uses artificial intelligence'],
            ['name' => 'Data Privacy', 'slug' => 'data-privacy', 'color' => '#10B981', 'description' => 'Strong data privacy features'],
        ];

        foreach ($tags as $tag) {
            \App\Models\Tag::create($tag);
        }
    }
}
