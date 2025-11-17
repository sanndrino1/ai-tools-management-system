@echo off
echo 🔧 AI Tools Management System - Fixed Permissions Docker Setup
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

:: Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose -f docker-compose.fixed.yml down -v >nul 2>&1
docker-compose -f docker-compose.production.yml down -v >nul 2>&1

:: Clean up any existing images with permission issues
echo 🧹 Cleaning up previous builds...
docker image prune -f >nul 2>&1

:: Build with no cache to ensure clean permissions
echo 🏗️ Building containers with fixed permissions...
docker-compose -f docker-compose.fixed.yml build --no-cache

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed! Check the logs above.
    pause
    exit /b 1
)

:: Start the containers
echo 🚀 Starting AI Tools Management System...
docker-compose -f docker-compose.fixed.yml up -d

:: Check if successful
if %ERRORLEVEL% eq 0 (
    echo.
    echo ✅ SUCCESS! AI Tools Management System is starting with fixed permissions...
    echo.
    echo 🌐 Access your platform:
    echo   📱 Frontend App:     http://localhost:3000
    echo   🚀 Laravel API:      http://localhost:8000/api
    echo   📊 Health Check:     http://localhost:3000/health
    echo   💾 Database:         MySQL 8.0 (ai_tools)
    echo   🔄 Redis Cache:      Available
    echo.
    echo 🔧 Fixed Issues:
    echo   ✅ File permissions (nextjs:1001, www-data:1000)
    echo   ✅ @heroicons/react dependency
    echo   ✅ Laravel .env configuration
    echo   ✅ SQLite to MySQL migration
    echo   ✅ Security headers and CORS
    echo.
    echo 📋 Management Commands:
    echo   📊 Check status:     docker-compose -f docker-compose.fixed.yml ps
    echo   📝 View logs:        docker-compose -f docker-compose.fixed.yml logs -f
    echo   🛑 Stop system:      docker-compose -f docker-compose.fixed.yml down
    echo   🗑️ Full reset:       docker-compose -f docker-compose.fixed.yml down -v
    echo.
    echo ⏳ Platform initialization may take 2-3 minutes...
    echo    Watch logs: docker-compose -f docker-compose.fixed.yml logs -f
) else (
    echo.
    echo ❌ Failed to start AI Tools Management System!
    echo.
    echo 🔧 Troubleshooting steps:
    echo 1. Check Docker Desktop is running properly
    echo 2. Ensure no other services are using ports 3000, 8000
    echo 3. Try: docker-compose -f docker-compose.fixed.yml logs
    echo 4. Or try: docker-compose -f docker-compose.fixed.yml down -v
    echo.
)

echo.
pause