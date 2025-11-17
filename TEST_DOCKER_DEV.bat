@echo off
echo ==========================================
echo   AI Tools - Docker Development Test
echo ==========================================

echo Checking Docker status...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    echo Please start Docker Desktop first
    pause
    exit /b 1
)

echo.
echo Checking Docker daemon...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker daemon is not running
    echo Please start Docker Desktop and wait for it to fully load
    pause
    exit /b 1
)

echo ✅ Docker is ready!
echo.

echo Ensuring SQLite database exists...
if not exist "backend\database\database.sqlite" (
    echo Creating SQLite database...
    cd backend
    type nul > database\database.sqlite
    cd ..
)

echo.
echo Stopping any existing containers...
docker-compose -f docker-compose.dev.yml down -v

echo.
echo Building and starting development system...
docker-compose -f docker-compose.dev.yml up --build -d

echo.
echo Waiting 20 seconds for services to start...
timeout /t 20 /nobreak

echo.
echo Running database migrations...
docker exec ai-tools-laravel-dev php artisan migrate --force

echo.
echo Seeding test data...
docker exec ai-tools-laravel-dev php artisan db:seed --force

echo.
echo ==========================================
echo   System Status Check
echo ==========================================
docker-compose -f docker-compose.dev.yml ps

echo.
echo Checking container logs...
echo --- Laravel Logs ---
docker-compose -f docker-compose.dev.yml logs --tail=5 laravel-app
echo --- Next.js Logs ---  
docker-compose -f docker-compose.dev.yml logs --tail=5 nextjs-app

echo.
echo ==========================================
echo   Access Information
echo ==========================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000  
echo Login: http://localhost:3000/login
echo Dashboard: http://localhost:3000/dashboard
echo.
echo Test Credentials:
echo - Admin: admin@test.com / password123
echo - User: user@test.com / password123
echo.
echo ==========================================
echo Testing endpoints...
curl -s http://localhost:8000/api/health >nul 2>&1 && echo ✅ Backend API: Working || echo ❌ Backend API: Not responding
curl -s http://localhost:3000 >nul 2>&1 && echo ✅ Frontend: Working || echo ❌ Frontend: Not responding

echo.
echo Opening login page...
start http://localhost:3000/login

echo.
echo ==========================================
pause