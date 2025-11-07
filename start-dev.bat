@echo off
REM AI Tools Management System - Windows Development Startup Script

echo.
echo 🚀 Starting AI Tools Management System (Development Mode)
echo ========================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)
echo ✅ Docker is running

REM Setup environment files
echo 📄 Setting up environment files...

if not exist "backend\.env" (
    echo    Creating backend .env file...
    copy ".env.example" "backend\.env" >nul
    echo    ✅ Backend .env created
) else (
    echo    ✅ Backend .env already exists
)

if not exist "frontend\.env.local" (
    echo    Creating frontend .env.local file...
    copy "frontend\.env.local.example" "frontend\.env.local" >nul
    echo    ✅ Frontend .env.local created
) else (
    echo    ✅ Frontend .env.local already exists
)

REM Build and start containers
echo.
echo 🐳 Building and starting Docker containers...
echo    Pulling latest base images...
docker-compose pull mysql redis nginx

echo    Building application images...
docker-compose build --parallel

echo    Starting services...
docker-compose up -d

echo    ✅ All services started

REM Wait for services
echo.
echo ⏳ Waiting for services to be healthy...

:wait_mysql
echo    Waiting for MySQL...
docker-compose exec -T mysql mysqladmin ping -h localhost --silent >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    echo       MySQL is starting...
    goto wait_mysql
)
echo    ✅ MySQL is ready

:wait_redis
echo    Waiting for Redis...
docker-compose exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    echo       Redis is starting...
    goto wait_redis
)
echo    ✅ Redis is ready

:wait_laravel
echo    Waiting for Laravel API...
curl -f http://localhost/api/health >nul 2>&1
if errorlevel 1 (
    timeout /t 5 /nobreak >nul
    echo       Laravel is starting...
    goto wait_laravel
)
echo    ✅ Laravel API is ready

:wait_nextjs
echo    Waiting for Next.js frontend...
curl -f http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    timeout /t 5 /nobreak >nul
    echo       Next.js is starting...
    goto wait_nextjs
)
echo    ✅ Next.js frontend is ready

REM Show service URLs
echo.
echo 🎉 AI Tools Management System is ready!
echo ======================================
echo.
echo 📱 Frontend (Next.js):     http://localhost:3000
echo 🔧 API (Laravel):          http://localhost/api
echo 🌐 Full Application:       http://localhost
echo 🗄️  Database (MySQL):       localhost:3306
echo 🔴 Cache (Redis):          localhost:6379
echo.
echo 🏥 Health Checks:
echo    Frontend:               http://localhost:3000/api/health
echo    Backend:                http://localhost/api/health
echo    Nginx:                  http://localhost/health
echo.
echo 📊 Admin Interface:        http://localhost:3000/admin
echo 🔐 Login Page:             http://localhost:3000/login
echo.
echo 📝 Demo Users:
echo    owner@aitools.dev       (Owner - Full Access)
echo    pm@aitools.dev          (Project Manager)
echo    backend@aitools.dev     (Backend Developer)
echo    frontend@aitools.dev    (Frontend Developer)
echo    qa@aitools.dev          (QA Engineer)
echo    designer@aitools.dev    (Designer)
echo    Password for all: password123
echo.
echo 💡 Useful Commands:
echo    View logs:              docker-compose logs -f
echo    Stop system:            stop-dev.bat
echo    Restart:                docker-compose restart
echo    Shell access:           docker-compose exec laravel-app bash
echo.
echo Press Ctrl+C to stop all services
echo.

REM Keep showing logs
docker-compose logs -f