# AI Tools Management System - Development Guide

## Текущо състояние

✅ **Frontend (Next.js)**: Работи на http://localhost:3000
🔄 **Backend (Laravel)**: Нужна инсталация на PHP + Composer
✅ **Database Schema**: Готова за Supabase

## Стъпки за пълна настройка:

### 1. Инсталирайте PHP и Composer

#### Опция A: Ръчна инсталация
1. Изтеглете PHP 8.2+ от https://windows.php.net/download/
2. Разархивирайте в C:\php
3. Добавете C:\php към PATH променливата
4. Изтеглете Composer от https://getcomposer.org/download/
5. Инсталирайте Composer

#### Опция B: Използвайте XAMPP
1. Изтеглете XAMPP от https://www.apachefriends.org/
2. Инсталирайте (включва PHP + Composer)
3. Стартирайте XAMPP Control Panel

### 2. След инсталация на PHP:

```bash
# Навигирайте към backend
cd c:\Users\Lebovo\Documents\ai-tools-fullstack\backend

# Създайте Laravel проект
composer create-project laravel/laravel . --prefer-dist

# Копирайте API контролерите от docs/
# Те са готови в backend/app/Http/Controllers/Api/ToolController.php
```

### 3. Настройте Supabase:

1. Отидете на https://supabase.com
2. Създайте нов проект
3. Копирайте и изпълнете schema от `docs/supabase-schema.sql`
4. Получете URL и API keys

### 4. Конфигурация:

#### Backend .env:
```env
DB_CONNECTION=pgsql
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

#### Frontend .env.local:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api
```

## Временно решение (само Frontend + Supabase):

Можете да стартирате frontend-а с директна Supabase интеграция:

1. Създайте Supabase проект
2. Приложете database schema
3. Конфигурирайте .env.local във frontend
4. Frontend ще работи директно със Supabase

## Текущи команди:

```bash
# Frontend (работи сега)
cd frontend
npm run dev    # http://localhost:3000

# След инсталация на PHP
cd backend
php artisan serve    # http://localhost:8000

# Или използвайте root скриптовете
cd ..
npm run dev    # Стартира и двата сървъра
```

## Следващи стъпки:

1. **Инсталирайте PHP + Composer** (приоритет)
2. **Създайте Supabase проект** (може веднага)
3. **Настройте environment файловете**
4. **Тествайте пълната интеграция**

Системата е архитектурно готова - нужна е само техническа настройка! 🚀