# 🚀 PHP + Laravel Инсталация за Windows

## БЪРЗА ИНСТАЛАЦИЯ (5-10 минути)

### Стъпка 1: Изтеглете PHP
1. Отидете на: https://windows.php.net/download/
2. Изтеглете **PHP 8.2 Thread Safe** (zip файл)
3. Разархивирайте в `C:\php`

### Стъпка 2: Добавете PHP в PATH
1. Натиснете `Win + R`, напишете `sysdm.cpl`
2. Advanced tab → Environment Variables
3. System Variables → Path → Edit → New
4. Добавете: `C:\php`
5. OK на всички прозорци

### Стъпка 3: Инсталирайте Composer
1. Отидете на: https://getcomposer.org/download/
2. Изтеглете `Composer-Setup.exe`
3. Инсталирайте (ще намери PHP автоматично)

### Стъпка 4: Рестартирайте PowerShell
Отворете нов PowerShell терминал в VS Code

### Стъпка 5: Проверете инсталацията
```bash
php --version
composer --version
```

## АЛТЕРНАТИВA: XAMPP (по-лесно)

### Опция A: XAMPP
1. Изтеглете от: https://www.apachefriends.org/
2. Инсталирайте (включва PHP + Composer)
3. Добавете `C:\xampp\php` в PATH

## СЛЕД ИНСТАЛАЦИЯТА:

```bash
# Навигирайте към backend
cd c:\Users\Lebovo\Documents\ai-tools-fullstack\backend

# Създайте Laravel проект
composer create-project laravel/laravel . --prefer-dist

# Стартирайте сървъра
php artisan serve
```

## РЕЗУЛТАТ:
- ✅ Next.js: localhost:3000 (работи)
- ✅ Laravel: localhost:8000 (готов)
- ✅ Supabase: Database (работи)

## ПЪЛНА АРХИТЕКТУРА:
```
Next.js Frontend ↔ Laravel API ↔ Supabase Database
```

Изберете една от опциите и след това се върнете за да завършим! 🎯