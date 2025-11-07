<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tool_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            $table->text('content');
            $table->boolean('is_approved')->default(true);
            $table->timestamp('edited_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['tool_id', 'created_at']);
            $table->index(['parent_id', 'created_at']);
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
};