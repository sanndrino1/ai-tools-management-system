@echo off
echo 🚀 Starting AI Tools Management System - Fixed Version
echo.

:: Check if Docker Desktop is running
docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop first and try again.
    pause
    exit /b 1
)

echo ✅ Docker Desktop is running
echo.

:: Clean up any existing containers
echo 🧹 Cleaning up existing containers...
docker-compose -f docker-compose.simple.yml down -v

:: Install frontend dependencies first
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install frontend dependencies!
    pause
    exit /b 1
)
cd ..

:: Install backend dependencies  
echo 📦 Installing backend dependencies...
cd backend
call composer install --no-dev --optimize-autoloader
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install backend dependencies!
    pause
    exit /b 1
)
cd ..

:: Start with simplified Docker Compose
echo 🏗️ Starting AI Tools Management System...
docker-compose -f docker-compose.simple.yml up --build -d

:: Wait for services to start
echo ⏳ Waiting for services to initialize...
timeout /t 30 /nobreak >nul

:: Check if successful
docker-compose -f docker-compose.simple.yml ps

echo.
echo ✅ AI Tools Management System is starting!
echo.
echo 🌐 Access Points:
echo   📱 Frontend:        http://localhost:3000
echo   🚀 Backend API:     http://localhost:8000/api
echo   🏥 Health Check:    http://localhost:8000/api/health  
echo   💾 Database:        localhost:3306
echo   🔄 Redis:           localhost:6379
echo.
echo 📋 Management:
echo   📊 Status:          docker-compose -f docker-compose.simple.yml ps
echo   📝 Logs:            docker-compose -f docker-compose.simple.yml logs -f
echo   🛑 Stop:            docker-compose -f docker-compose.simple.yml down
echo.
echo ⏳ Services may take 2-3 minutes to fully initialize...

pause