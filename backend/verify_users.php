<?php
require 'vendor/autoload.php';

$db = new PDO('sqlite:database/database.sqlite');
$users = $db->query('SELECT id, name, email, role_id FROM users ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);

echo "=== Seeded Users in Database ===\n";
echo str_pad("ID", 4) . str_pad("Email", 30) . "Role\n";
echo str_repeat("-", 50) . "\n";

foreach ($users as $u) {
    echo str_pad($u['id'], 4) . str_pad($u['email'], 30) . $u['role_id'] . "\n";
}

echo "\nTotal: " . count($users) . " users\n";
?>
