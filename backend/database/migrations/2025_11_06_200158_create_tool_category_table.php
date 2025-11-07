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
        Schema::create('tool_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tool_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->boolean('is_primary')->default(false); // Primary category flag
            $table->timestamps();
            
            // Composite unique constraint
            $table->unique(['tool_id', 'category_id']);
            
            // Indexes
            $table->index('tool_id');
            $table->index('category_id');
            $table->index(['tool_id', 'is_primary']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tool_category');
    }
};
