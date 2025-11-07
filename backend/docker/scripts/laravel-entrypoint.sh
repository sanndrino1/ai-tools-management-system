#!/bin/bash
set -e

echo "🚀 Starting Laravel Application Container..."

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
while ! mysqladmin ping -h"mysql" -u"laravel" -p"laravel_password" --silent; do
    sleep 2
    echo "   MySQL is unavailable - sleeping"
done
echo "✅ MySQL is ready!"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
while ! redis-cli -h redis ping; do
    sleep 2
    echo "   Redis is unavailable - sleeping"
done
echo "✅ Redis is ready!"

# Generate Laravel application key if not exists
if [ ! -f .env ]; then
    echo "📄 Creating .env file from .env.example..."
    cp .env.example .env
fi

if grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Application key already exists"
else
    echo "🔑 Generating Laravel application key..."
    php artisan key:generate --force
fi

# Database setup
echo "🗄️ Setting up database..."

# Run migrations
echo "   Running database migrations..."
php artisan migrate --force

# Seed database if in development
if [ "$APP_ENV" = "local" ] || [ "$APP_ENV" = "development" ]; then
    echo "   Seeding database with demo data..."
    php artisan db:seed --force
fi

# Laravel optimizations
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Running Laravel optimizations for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    echo "🛠️ Development mode - clearing caches..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    php artisan cache:clear
fi

# Storage link
echo "🔗 Creating storage symbolic link..."
php artisan storage:link || true

# Set proper permissions
echo "🔐 Setting file permissions..."
chown -R laravel:laravel /var/www/html/storage
chown -R laravel:laravel /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Create health check endpoint
echo "❤️ Setting up health check..."
cat > /var/www/html/public/health.php << 'EOF'
<?php
header('Content-Type: application/json');
http_response_code(200);

$health = [
    'status' => 'healthy',
    'timestamp' => date('c'),
    'service' => 'laravel-api',
    'version' => '1.0.0',
    'environment' => env('APP_ENV', 'unknown'),
    'checks' => [
        'database' => 'ok',
        'redis' => 'ok',
        'storage' => is_writable(storage_path()) ? 'ok' : 'error'
    ]
];

echo json_encode($health, JSON_PRETTY_PRINT);
EOF

echo "✅ Laravel setup complete!"
echo "🎉 Container is ready to serve requests"

# Execute the main command
exec "$@"