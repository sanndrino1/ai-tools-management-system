@echo off
echo 🚀 Starting AI Tools Management System - Development Mode (without Docker)
echo.

echo ⚠️  Docker Desktop не е готов. Стартиране в development режим...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if PHP is installed
php --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ PHP is not installed!
    echo Please install PHP from https://windows.php.net/download/
    pause
    exit /b 1
)

echo ✅ Node.js and PHP are available
echo.

:: Start Frontend
echo 🔧 Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    npm install
)

echo 🚀 Starting Next.js frontend on port 3000...
start /B npm run dev

:: Start Backend
echo 🔧 Installing backend dependencies...
cd ..\backend
if not exist "vendor" (
    composer install
)

:: Create SQLite database if not exists
if not exist "database\database.sqlite" (
    echo 🗄️ Creating SQLite database...
    mkdir database 2>nul
    type nul > database\database.sqlite
    php artisan migrate --force
)

echo 🚀 Starting Laravel backend on port 8000...
start /B php artisan serve --host=0.0.0.0 --port=8000

cd ..

echo.
echo ✅ AI Tools Management System is starting...
echo.
echo 🌐 Access your platform:
echo   📱 Frontend:    http://localhost:3000
echo   🚀 Backend API: http://localhost:8000
echo.
echo 📝 Features Available:
echo   ✅ AI Tools Management Interface
echo   ✅ User Authentication
echo   ✅ SQLite Database (development)
echo   ✅ API Endpoints
echo.
echo 🛑 To stop: Close this window or press Ctrl+C in each terminal
echo ⏳ Please wait 30 seconds for services to fully start...

timeout /t 30 >nul

echo.
echo 🎉 Opening frontend in browser...
start http://localhost:3000

echo.
pause