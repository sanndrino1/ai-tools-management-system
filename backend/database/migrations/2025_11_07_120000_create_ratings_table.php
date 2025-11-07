<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tool_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned()->comment('Rating from 1 to 5');
            $table->text('review')->nullable();
            $table->timestamps();

            // Ensure one rating per user per tool
            $table->unique(['user_id', 'tool_id']);
            
            // Index for performance
            $table->index(['tool_id', 'rating']);
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ratings');
    }
};