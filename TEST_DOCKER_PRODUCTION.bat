@echo off
echo ==========================================
echo   AI Tools - Docker Production Test
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

echo Stopping any existing containers...
docker-compose -f docker-compose.production.yml down -v

echo.
echo Building and starting production system...
docker-compose -f docker-compose.production.yml up --build -d

echo.
echo Waiting 30 seconds for services to start...
timeout /t 30 /nobreak

echo.
echo ==========================================
echo   System Status Check
echo ==========================================
docker-compose -f docker-compose.production.yml ps

echo.
echo Checking container logs for errors...
docker-compose -f docker-compose.production.yml logs --tail=10 laravel-app
docker-compose -f docker-compose.production.yml logs --tail=10 nextjs-app

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

pause