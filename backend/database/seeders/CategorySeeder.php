<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Natural Language Processing',
                'slug' => 'nlp',
                'description' => 'AI tools for text analysis, language understanding, and text generation',
                'icon' => '💬',
                'color' => '#3B82F6',
                'sort_order' => 1,
                'is_active' => true,
                'metadata' => ['keywords' => ['text', 'language', 'nlp', 'chatbot']]
            ],
            [
                'name' => 'Computer Vision',
                'slug' => 'computer-vision',
                'description' => 'AI tools for image and video analysis, object detection, and visual recognition',
                'icon' => '👁️',
                'color' => '#10B981',
                'sort_order' => 2,
                'is_active' => true,
                'metadata' => ['keywords' => ['image', 'video', 'detection', 'recognition']]
            ],
            [
                'name' => 'Machine Learning',
                'slug' => 'machine-learning',
                'description' => 'General ML platforms, frameworks, and training tools',
                'icon' => '🤖',
                'color' => '#8B5CF6',
                'sort_order' => 3,
                'is_active' => true,
                'metadata' => ['keywords' => ['ml', 'training', 'model', 'algorithm']]
            ],
            [
                'name' => 'Generative AI',
                'slug' => 'generative-ai',
                'description' => 'Tools for content creation, art generation, and creative AI applications',
                'icon' => '🎨',
                'color' => '#F59E0B',
                'sort_order' => 4,
                'is_active' => true,
                'metadata' => ['keywords' => ['generate', 'create', 'art', 'content']]
            ],
            [
                'name' => 'Data Analysis',
                'slug' => 'data-analysis',
                'description' => 'AI-powered analytics, insights, and data processing tools',
                'icon' => '📊',
                'color' => '#EF4444',
                'sort_order' => 5,
                'is_active' => true,
                'metadata' => ['keywords' => ['data', 'analytics', 'insights', 'processing']]
            ],
            [
                'name' => 'Automation',
                'slug' => 'automation',
                'description' => 'AI tools for workflow automation and process optimization',
                'icon' => '⚡',
                'color' => '#06B6D4',
                'sort_order' => 6,
                'is_active' => true,
                'metadata' => ['keywords' => ['automation', 'workflow', 'process', 'optimize']]
            ],
            [
                'name' => 'Development Tools',
                'slug' => 'development-tools',
                'description' => 'AI-assisted coding, debugging, and development utilities',
                'icon' => '💻',
                'color' => '#84CC16',
                'sort_order' => 7,
                'is_active' => true,
                'metadata' => ['keywords' => ['coding', 'development', 'programming', 'debug']]
            ],
            [
                'name' => 'Business Intelligence',
                'slug' => 'business-intelligence',
                'description' => 'AI tools for business analytics, forecasting, and decision making',
                'icon' => '📈',
                'color' => '#EC4899',
                'sort_order' => 8,
                'is_active' => true,
                'metadata' => ['keywords' => ['business', 'analytics', 'forecast', 'decision']]
            ]
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
