-- Initialize database for Laravel application with team roles

USE laravel_db;

-- Create additional databases if needed
CREATE DATABASE IF NOT EXISTS laravel_testing;

-- Grant privileges
GRANT ALL PRIVILEGES ON laravel_db.* TO 'laravel_user'@'%';
GRANT ALL PRIVILEGES ON laravel_testing.* TO 'laravel_user'@'%';

FLUSH PRIVILEGES;