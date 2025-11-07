<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tools', function (Blueprint $table) {
            // Extended fields for AI tools management
            $table->string('slug')->nullable()->unique()->after('name');
            $table->text('short_description')->nullable()->after('description');
            $table->string('website_url')->nullable()->after('url');
            $table->string('documentation_url')->nullable();
            $table->string('video_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->json('screenshots')->nullable(); // Array of screenshot URLs
            
            // AI-specific fields
            $table->enum('ai_type', ['nlp', 'cv', 'ml', 'generative', 'automation', 'analysis', 'other'])->nullable();
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced', 'expert'])->default('intermediate');
            $table->enum('pricing_type', ['free', 'freemium', 'paid', 'enterprise'])->default('free');
            $table->decimal('price_per_month', 10, 2)->nullable();
            
            // Usage and metadata
            $table->json('features')->nullable(); // Array of key features
            $table->json('supported_formats')->nullable(); // Input/output formats
            $table->json('integrations')->nullable(); // Available integrations
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('usage_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0.00);
            $table->unsignedInteger('total_ratings')->default(0);
            
            // Role associations
            $table->json('target_roles')->nullable(); // Array of role IDs or names
            
            // Status and visibility
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('featured_until')->nullable();
            
            // Metadata and extensibility
            $table->json('metadata')->nullable(); // For future extensions
            $table->text('admin_notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Indexes for performance
            $table->index(['is_active', 'status']);
            $table->index(['is_featured', 'featured_until']);
            $table->index(['difficulty_level', 'pricing_type']);
            $table->index(['ai_type', 'is_active']);
            $table->index(['average_rating', 'total_ratings']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tools', function (Blueprint $table) {
            // Drop indexes first
            $table->dropIndex(['is_active', 'status']);
            $table->dropIndex(['is_featured', 'featured_until']);
            $table->dropIndex(['difficulty_level', 'pricing_type']);
            $table->dropIndex(['ai_type', 'is_active']);
            $table->dropIndex(['average_rating', 'total_ratings']);
            $table->dropIndex(['slug']);
            
            // Drop foreign keys
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            
            // Drop columns
            $table->dropColumn([
                'slug', 'short_description', 'website_url', 'documentation_url', 
                'video_url', 'github_url', 'logo_url', 'screenshots',
                'ai_type', 'difficulty_level', 'pricing_type', 'price_per_month',
                'features', 'supported_formats', 'integrations', 
                'view_count', 'usage_count', 'average_rating', 'total_ratings',
                'target_roles', 'status', 'is_featured', 'featured_until',
                'metadata', 'admin_notes', 'created_by', 'updated_by'
            ]);
        });
    }
};
