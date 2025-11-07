<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('two_factor_authentications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('method', ['email', 'telegram', 'google_authenticator']);
            $table->boolean('is_enabled')->default(false);
            $table->string('secret_key')->nullable(); // For Google Authenticator
            $table->string('telegram_chat_id')->nullable(); // For Telegram
            $table->string('backup_codes')->nullable(); // JSON array of backup codes
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('two_factor_authentications');
    }
};