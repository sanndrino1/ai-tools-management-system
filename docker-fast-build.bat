@echo off
REM Fast Docker Build Script for AI Tools Management System (Windows)
REM This script builds optimized Docker images quickly

echo 🚀 Starting Fast Docker Build for AI Tools Management System...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

echo ✅ Docker is running

REM Stop existing containers
echo 📦 Stopping existing containers...
docker-compose -f docker-compose.fast.yml down --remove-orphans 2>nul

REM Build backend image with pre-built PHP
echo 🔨 Building backend image using pre-built PHP image...
docker build --target development --cache-from serversideup/php:8.2-fpm-nginx -t ai-tools-backend:latest ./backend

if %errorlevel% neq 0 (
    echo ❌ Backend build failed!
    exit /b 1
)

REM Build frontend image
echo 🔨 Building frontend image...
docker build --target development --cache-from node:18-alpine -t ai-tools-frontend:latest ./frontend

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    exit /b 1
)

REM Start services
echo 🚀 Starting services...
docker-compose -f docker-compose.fast.yml up -d

REM Wait for services
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Check health
echo 🔍 Checking service health...

REM Check backend
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy
) else (
    echo ⚠️  Backend health check failed - may still be starting
)

REM Check frontend  
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is healthy
) else (
    echo ⚠️  Frontend health check failed - may still be starting
)

echo.
echo 🎉 Build completed!
echo.
echo 🔗 Services are available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000  
echo    API:      http://localhost:8000/api/health
echo.
echo 📊 To check logs:
echo    docker-compose -f docker-compose.fast.yml logs -f
echo.
echo 🛑 To stop services:
echo    docker-compose -f docker-compose.fast.yml down

pause