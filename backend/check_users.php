<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$users = \App\Models\User::select('id', 'name', 'email')->orderBy('id')->get();

echo "\n========== TEST USERS ==========\n";
foreach ($users as $user) {
    echo "ID: {$user->id} | Email: {$user->email} | Name: {$user->name}\n";
}
echo "================================\n";
echo "Total users: " . $users->count() . "\n";
