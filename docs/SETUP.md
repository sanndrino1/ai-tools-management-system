# 🚀 AI Tools Management System - Complete Setup Guide

Пълна стъпка-по-стъпка инструкция за настройка на Full Stack платформата.

## 📋 Предварителни изисквания

### Инсталирани инструменти:
- **Node.js 18+** - https://nodejs.org/
- **PHP 8.2+** - https://www.php.net/downloads
- **Composer** - https://getcomposer.org/download/
- **PostgreSQL** (optional - ще използваме Supabase)

### Външни услуги:
- **GitHub акаунт** - https://github.com
- **Supabase акаунт** - https://supabase.com
- **Vercel акаунт** (за deployment) - https://vercel.com

---

## 🗄️ СТЪПКА 1: Supabase Setup

### 1.1 Създаване на проект
1. Отиди на https://supabase.com/dashboard
2. **New Project**
3. **Project Name**: `ai-tools-management`
4. **Database Password**: генерирай силна парола
5. **Region**: избери най-близкия (Europe West)
6. **Create new project** (2-3 минути)

### 1.2 Database Schema
1. В Supabase dashboard → **SQL Editor**
2. Копирай съдържанието от `docs/supabase-schema.sql`
3. **Run** за да създадеш схемата

### 1.3 Authentication Setup
1. **Authentication** → **Settings**
2. **Site URL**: `http://localhost:3000` (за development)
3. **Redirect URLs**: добави `http://localhost:3000/auth/callback`
4. **Email Templates**: персонализирай (optional)

### 1.4 API Keys
1. **Settings** → **API**
2. Копирай:
   - `anon` / `public` key
   - `service_role` / `secret` key
   - Project URL

---

## 🔧 СТЪПКА 2: Backend Setup (Laravel)

### 2.1 Инсталация на Laravel
```bash
# Навигирай към главната папка
cd C:\Users\Lebovo\Documents\ai-tools-fullstack

# Създай Laravel проект
composer create-project laravel/laravel backend

# Влез в backend папката
cd backend
```

### 2.2 Environment Configuration
```bash
# Копирай .env файла
cp .env.example .env

# Генерирай application key
php artisan key:generate
```

### 2.3 Конфигурирай .env файла
```bash
# Database (Supabase PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=твоята-supabase-парола

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=твоят-service-role-key

# CORS за frontend
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=твоят-jwt-secret
```

### 2.4 Инсталирай пакети
```bash
# Laravel Sanctum за API authentication
composer require laravel/sanctum

# CORS support
composer require fruitcake/laravel-cors

# Supabase client
composer require supabase/supabase-php
```

### 2.5 Конфигурация
```bash
# Публикувай Sanctum конфигурацията
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Стартирай миграциите
php artisan migrate

# Създай storage link
php artisan storage:link
```

### 2.6 API Routes
Създай `routes/api.php`:
```php
<?php

use App\Http\Controllers\Api\ToolController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\AdminController;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('/tools', [ToolController::class, 'index']);
    Route::get('/tools/{id}', [ToolController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    
    // Protected routes
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::apiResource('tools', ToolController::class)->except(['index', 'show']);
        Route::post('/tools/{id}/status', [ToolController::class, 'updateStatus']);
        
        Route::post('/tools/{tool}/ratings', [RatingController::class, 'store']);
        Route::get('/tools/{tool}/ratings', [RatingController::class, 'index']);
        
        Route::post('/tools/{tool}/comments', [CommentController::class, 'store']);
        Route::get('/tools/{tool}/comments', [CommentController::class, 'index']);
        Route::post('/comments/{comment}/vote', [CommentController::class, 'vote']);
        
        // Admin routes
        Route::middleware(['admin'])->prefix('admin')->group(function () {
            Route::get('/stats', [AdminController::class, 'stats']);
            Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
        });
    });
});
```

### 2.7 Стартиране на сървъра
```bash
php artisan serve
# Backend ще работи на http://localhost:8000
```

---

## 🎨 СТЪПКА 3: Frontend Setup (Next.js)

### 3.1 Създаване на Next.js проект
```bash
# Върни се в главната папка
cd C:\Users\Lebovo\Documents\ai-tools-fullstack

# Създай Next.js проект
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Влез в frontend папката
cd frontend
```

### 3.2 Инсталирай зависимости
```bash
# Supabase client
npm install @supabase/supabase-js

# UI Libraries
npm install @headlessui/react @heroicons/react

# Forms и validation
npm install react-hook-form @hookform/resolvers zod

# Date handling
npm install date-fns

# State management
npm install zustand

# Additional utilities
npm install clsx tailwind-merge
```

### 3.3 Environment Variables
Създай `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твоят-anon-key

# Laravel API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.4 Копирай файловете
Копирай създадените файлове:
- `lib/supabase.ts`
- `lib/api.ts`
- Добави компонентите от оригиналния проект

### 3.5 Стартиране
```bash
npm run dev
# Frontend ще работи на http://localhost:3000
```

---

## 🔗 СТЪПКА 4: Интеграция

### 4.1 Автентикация Flow
1. **Frontend**: Supabase Auth за login/register
2. **Backend**: Validate Supabase JWT tokens
3. **Database**: User profiles в Supabase

### 4.2 API Communication
1. **Frontend**: Fetch данни от Laravel API
2. **Backend**: Връща JSON responses
3. **Real-time**: Supabase subscriptions за live updates

### 4.3 File Upload
1. **Frontend**: Upload към Supabase Storage
2. **Backend**: Store file URLs в database
3. **Security**: RLS policies за достъп

---

## 🚀 СТЪПКА 5: Testing

### 5.1 Backend Tests
```bash
cd backend
php artisan test
```

### 5.2 Frontend Tests
```bash
cd frontend
npm run test
```

### 5.3 E2E Testing
```bash
# Инсталирай Playwright
npm install -D @playwright/test
npx playwright install

# Стартирай E2E тестове
npm run test:e2e
```

---

## 📦 СТЪПКА 6: Deployment

### 6.1 Frontend (Vercel)
1. Push проекта в GitHub
2. Свържи Vercel с репозиторията
3. Добави environment variables
4. Deploy автоматично

### 6.2 Backend (Laravel Forge/DigitalOcean)
1. Създай сървър в Laravel Forge
2. Deploy от GitHub
3. Конфигурирай environment
4. Setup SSL certificate

### 6.3 Database (Supabase)
1. Supabase автоматично управлява database
2. Backup и monitoring included
3. Production environment variables

---

## ✅ Проверка

След завършване на setup-а:

### Проверки:
- [ ] Supabase проект създаден и schema applied
- [ ] Laravel API работи на localhost:8000
- [ ] Next.js frontend работи на localhost:3000
- [ ] Authentication flow функционира
- [ ] API calls между frontend и backend работят
- [ ] Database операции успешни
- [ ] Real-time updates работят

### Тестови потребител:
1. Регистрирай се през frontend
2. Създай test tool
3. Добави rating и comment
4. Проверка на admin dashboard

### Production готовност:
- [ ] Environment variables конфигурирани
- [ ] Security headers добавени
- [ ] CORS правилно настроен
- [ ] Database migrations tested
- [ ] Error handling implemented

---

## 🆘 Troubleshooting

### Чести проблеми:

**Database connection failed**
- Провери Supabase credentials
- Убеди се че IP-то ти е whitelisted

**CORS errors**
- Конфигурирай `config/cors.php` в Laravel
- Добави frontend URL в allowed origins

**Authentication не работи**
- Провери JWT secret
- Убеди се че Supabase keys са правилни

**API calls failed**
- Провери че Laravel сървърът работи
- Убеди се че API routes са регистрирани

### Logs:
- **Laravel**: `storage/logs/laravel.log`
- **Supabase**: Dashboard → Logs
- **Next.js**: Browser console / Terminal

---

🎉 **Успешен setup! Платформата е готова за development!**