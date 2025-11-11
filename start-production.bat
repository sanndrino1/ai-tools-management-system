@echo off
echo 🚀 Starting AI Tools Management System - Production Mode
echo.

:: Check if Docker Desktop is running
docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop first:
    echo 1. Open Docker Desktop application
    echo 2. Wait for it to fully start (green whale icon)
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Docker Desktop is running
echo.

:: Generate app key if needed
if not exist "backend\.env" (
    echo 🔑 Creating Laravel environment file...
    copy "backend\.env.example" "backend\.env"
    
    echo 🔐 Generating application key...
    docker run --rm -v "%cd%\backend:/app" composer:latest sh -c "cd /app && php artisan key:generate"
)

:: Start production environment
echo 🏗️ Starting AI Tools Management System...
echo    - Frontend: Next.js production build
echo    - Backend: Laravel production optimized  
echo    - Database: MySQL 8.0
echo    - Cache: Redis 7
echo    - Proxy: Nginx with rate limiting
echo.

docker-compose -f docker-compose.production.yml up --build -d

:: Check if successful
if %ERRORLEVEL% eq 0 (
    echo.
    echo ✅ SUCCESS! AI Tools Management System is starting...
    echo.
    echo 🌐 Access your platform:
    echo   📱 Frontend App:     http://localhost:3000
    echo   🚀 Laravel API:      http://localhost:8000/api
    echo   📊 Health Check:     http://localhost:3000/health
    echo   💾 Database:         localhost:3306 (ai_tools)
    echo   🔄 Redis Cache:      localhost:6379
    echo.
    echo 📋 Management Commands:
    echo   📊 Check status:     docker-compose -f docker-compose.production.yml ps
    echo   📝 View logs:        docker-compose -f docker-compose.production.yml logs -f
    echo   🛑 Stop system:      docker-compose -f docker-compose.production.yml down
    echo   🗑️ Full reset:       docker-compose -f docker-compose.production.yml down -v
    echo.
    echo 📈 Features Ready:
    echo   ✅ AI Tools Management
    echo   ✅ User Authentication (Supabase)
    echo   ✅ Role-based Access Control
    echo   ✅ API Rate Limiting
    echo   ✅ Redis Caching
    echo   ✅ Queue Processing
    echo   ✅ Scheduled Tasks
    echo   ✅ Production Security Headers
    echo.
    echo ⏳ Platform may take 2-3 minutes to fully initialize...
    echo    Watch logs: docker-compose -f docker-compose.production.yml logs -f
) else (
    echo.
    echo ❌ Failed to start AI Tools Management System!
    echo.
    echo 🔧 Troubleshooting steps:
    echo 1. Ensure Docker Desktop is running properly
    echo 2. Close any applications using ports 3000, 8000, 3306, 6379
    echo 3. Try: docker-compose -f docker-compose.production.yml down -v
    echo 4. Then run this script again
    echo.
    echo 📝 For detailed logs: docker-compose -f docker-compose.production.yml logs
)

echo.
pause