@echo off
echo ========================================
echo    AI Tools Management System Setup
echo ========================================
echo.

REM Set colors for better readability
set GREEN=[92m
set YELLOW=[93m  
set RED=[91m
set RESET=[0m

echo %GREEN%Step 1: Installing Backend Dependencies%RESET%
cd backend
echo %YELLOW%Installing Composer packages...%RESET%
call composer install --no-interaction --prefer-dist --optimize-autoloader

echo.
echo %YELLOW%Installing additional packages...%RESET%
call composer require spatie/laravel-activitylog --no-interaction
call composer require pragmarx/google2fa --no-interaction

echo.
echo %GREEN%Step 2: Database Setup%RESET%
echo %YELLOW%Running database migrations...%RESET%
call php artisan migrate --force

echo.
echo %GREEN%Step 3: Starting Backend Server%RESET%
echo %YELLOW%Laravel API server starting on http://localhost:8000%RESET%
start /B php artisan serve --host=127.0.0.1 --port=8000

cd ..

echo.
echo %GREEN%Step 4: Installing Frontend Dependencies%RESET%
cd frontend
echo %YELLOW%Installing NPM packages...%RESET%
call npm install

echo.
echo %GREEN%Step 5: Starting Frontend Server%RESET%
echo %YELLOW%Next.js development server starting on http://localhost:3000%RESET%
start /B npm run dev

cd ..

echo.
echo %GREEN%========================================%RESET%
echo %GREEN%    🚀 SYSTEM READY FOR TESTING 🚀%RESET%
echo %GREEN%========================================%RESET%
echo.
echo %YELLOW%Frontend:%RESET% http://localhost:3000
echo %YELLOW%Backend API:%RESET% http://localhost:8000
echo %YELLOW%Admin Panel:%RESET% http://localhost:3000/admin
echo.
echo %GREEN%Features Available:%RESET%
echo - 🔐 2FA Security (Email, Telegram, Google Authenticator)  
echo - 🛡️  Admin Panel with Tool Management
echo - 👥 Role-Based Access Control
echo - 📊 Redis Caching System
echo - 📝 Activity Logging & Audit Trail
echo.
echo %YELLOW%Press any key to view logs or Ctrl+C to exit...%RESET%
pause >nul

echo.
echo %GREEN%Checking server status...%RESET%
echo.
echo %YELLOW%Backend API Health:%RESET%
curl -s http://localhost:8000/api/health >nul && echo %GREEN%✓ Backend API is running%RESET% || echo %RED%✗ Backend API not responding%RESET%

echo %YELLOW%Frontend Server:%RESET%  
curl -s http://localhost:3000 >nul && echo %GREEN%✓ Frontend is running%RESET% || echo %RED%✗ Frontend not responding%RESET%

echo.
echo %GREEN%System is ready! Access the admin panel to test 2FA and tool management.%RESET%
echo.
pause