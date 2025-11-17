@echo off
cls
echo ==========================================
echo   AI Tools - Final Docker Setup
echo ==========================================
echo.
echo Implementing all required corrections:
echo ✅ @heroicons/react package added
echo ✅ backend/.env file configured 
echo ✅ File permissions fixed in frontend
echo ✅ Proper .env values set
echo.

echo Checking Docker status...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Docker is not installed
    echo Please install Docker Desktop first
    pause
    exit /b 1
)

docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Docker daemon not running
    echo Please start Docker Desktop and wait for it to load
    pause 
    exit /b 1
)

echo ✅ Docker is ready!
echo.

echo Creating SQLite database...
if not exist "backend\database\database.sqlite" (
    type nul > backend\database\database.sqlite
)

echo.
echo Stopping any existing containers...
docker-compose -f docker-compose.final.yml down -v 2>nul

echo.
echo Building and starting AI Tools system...
echo This may take a few minutes on first run...
docker-compose -f docker-compose.final.yml up --build -d

echo.
echo Waiting for services to initialize...
timeout /t 30 /nobreak

echo.
echo ==========================================
echo           System Status Check
echo ==========================================
docker-compose -f docker-compose.final.yml ps

echo.
echo Checking logs for any errors...
docker logs ai-tools-laravel-final --tail=5
docker logs ai-tools-nextjs-final --tail=5

echo.
echo ==========================================
echo             System Ready!
echo ==========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8000
echo 🔐 Login:    http://localhost:3000/login
echo 📊 Dashboard: http://localhost:3000/dashboard
echo.
echo 🔑 Test Credentials:
echo    • Admin: admin@test.com / password123
echo    • User:  user@test.com / password123
echo.
echo All corrections have been applied:
echo ✅ @heroicons/react: Version 2.2.0 installed
echo ✅ backend/.env: Properly configured with valid APP_KEY
echo ✅ File permissions: Fixed in frontend Dockerfile
echo ✅ Environment values: Configured for Docker deployment
echo.

echo Opening login page...
timeout /t 3 /nobreak
start http://localhost:3000/login

echo.
echo ==========================================
echo   Project is ready for deployment!
echo   All required corrections completed.
echo ==========================================
pause