# Laravel Setup Commands - Run After PHP Installation

## Commands to run in backend directory:

```bash
# Navigate to backend
cd c:\Users\Lebovo\Documents\ai-tools-fullstack\backend

# Create Laravel project
composer create-project laravel/laravel . --prefer-dist

# Copy environment configuration
copy .env.example .env

# Generate application key
php artisan key:generate

# Install Laravel Sanctum for API authentication
composer require laravel/sanctum

# Publish Sanctum configuration
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Create API routes
php artisan make:controller Api/ToolController --api

# Start the development server
php artisan serve
```

## API Endpoints will be available at:
- GET http://localhost:8000/api/tools
- POST http://localhost:8000/api/tools
- GET http://localhost:8000/api/tools/{id}
- PUT http://localhost:8000/api/tools/{id}
- DELETE http://localhost:8000/api/tools/{id}

## Frontend Integration:
The Next.js app at localhost:3000 will automatically connect to Laravel API at localhost:8000

## Complete Stack:
Next.js (3000) ↔ Laravel (8000) ↔ Supabase (database)