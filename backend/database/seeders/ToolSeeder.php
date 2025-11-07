<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tool;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tools = [
            [
                'name' => 'ChatGPT',
                'description' => 'Advanced AI language model for conversational AI, content creation, and problem-solving.',
                'category' => 'AI Assistant',
                'url' => 'https://chat.openai.com',
                'rating' => 4.8,
                'is_active' => true
            ],
            [
                'name' => 'GitHub Copilot',
                'description' => 'AI-powered code completion tool that helps developers write code faster.',
                'category' => 'Development',
                'url' => 'https://github.com/features/copilot',
                'rating' => 4.5,
                'is_active' => true
            ],
            [
                'name' => 'Midjourney',
                'description' => 'AI art generator that creates stunning images from text descriptions.',
                'category' => 'Design',
                'url' => 'https://midjourney.com',
                'rating' => 4.7,
                'is_active' => true
            ],
            [
                'name' => 'Notion AI',
                'description' => 'Productivity tool with AI-powered writing and note-taking capabilities.',
                'category' => 'Productivity',
                'url' => 'https://notion.so',
                'rating' => 4.4,
                'is_active' => true
            ],
            [
                'name' => 'Grammarly',
                'description' => 'AI-powered writing assistant for grammar, spelling, and style improvement.',
                'category' => 'Writing',
                'url' => 'https://grammarly.com',
                'rating' => 4.3,
                'is_active' => true
            ]
        ];

        foreach ($tools as $tool) {
            Tool::create($tool);
        }
    }
}
