@echo off
echo ============================================
echo   AI Tools Management System - Docker Start
echo ============================================
echo.

echo Checking Docker status...
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Testing Docker daemon connection...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop manually:
    echo 1. Press Windows+R and type "docker desktop"
    echo 2. Wait for Docker Desktop to fully load (green whale icon)
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is running!
echo.

echo Stopping any existing containers...
docker-compose -f docker-compose.production.yml down -v

echo.
echo Building and starting the AI Tools system...
docker-compose -f docker-compose.production.yml up --build -d

echo.
echo Waiting for services to start...
timeout /t 30 /nobreak

echo.
echo ============================================
echo   System Status Check
echo ============================================
docker-compose -f docker-compose.production.yml ps

echo.
echo ============================================
echo   Access URLs:
echo ============================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:3000/admin
echo Login:    http://localhost:3000/login
echo.
echo Test Credentials:
echo - Admin: admin@test.com / password123
echo - User:  user@test.com / password123
echo.
echo ============================================

pause