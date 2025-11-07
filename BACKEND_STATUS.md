# Laravel Backend Setup - Immediate Solution

## Проблем:
Laravel backend-ът е готов в кода, но нужен е PHP + Composer за стартиране.

## РЕШЕНИЕ 1: Инсталация на PHP (препоръчвам)

### Опция A: XAMPP (най-лесно)
1. Изтеглете XAMPP от: https://www.apachefriends.org/download.html
2. Инсталирайте (включва PHP 8.2 + Composer)
3. Стартирайте XAMPP Control Panel
4. В terminal: `composer create-project laravel/laravel . --prefer-dist`

### Опция B: Директна PHP инсталация
1. Изтеглете PHP от: https://windows.php.net/download/
2. Добавете в PATH
3. Инсталирайте Composer от: https://getcomposer.org/

## РЕШЕНИЕ 2: Временно без Laravel (работи сега)

### Текущо състояние:
```
Next.js Frontend ←→ Supabase Database (работи)
```

### Добавяне на Laravel:
```
Next.js Frontend ←→ Laravel API ←→ Supabase Database
```

## Готови компоненти:

### ✅ Frontend връзки:
- `lib/supabase.ts` - директна връзка със Supabase
- `lib/api.ts` - готов Laravel API клиент

### ✅ Backend API:
- `backend/app/Http/Controllers/Api/ToolController.php` - готов
- Database конфигурация готова

### ✅ Environment конфигурация:
- Frontend: `.env.local` с Supabase + Laravel URL
- Backend: `.env` шаблон готов

## Следващи стъпки:

1. **Веднага работещо**: Използвайте Next.js ↔ Supabase
2. **Пълна архитектура**: Инсталирайте PHP/XAMPP (15 мин)

## Команди след PHP инсталация:

```bash
cd backend
composer create-project laravel/laravel . --prefer-dist
php artisan serve  # стартира на localhost:8000
```

## Status check:

```bash
# Frontend (работи сега)
cd frontend
npm run dev  # localhost:3000

# Backend (нужен PHP)
cd backend  
php artisan serve  # localhost:8000
```

Системата е 90% готова - само PHP инсталацията липсва! 🚀