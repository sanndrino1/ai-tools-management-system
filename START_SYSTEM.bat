@echo off
echo.
echo ====================================
echo   AI Tools Management System
echo   Starting Full Stack Application
echo ====================================
echo.

echo [1/3] Starting Laravel Backend Server...
cd /d "%~dp0backend"
start "Laravel Backend" cmd /k "C:\xampp\php\php.exe artisan serve --port=8001"

echo [2/3] Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo [3/3] Starting Next.js Frontend Server...
cd /d "%~dp0frontend"  
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo ✅ System starting up!
echo.
echo 🌐 Frontend: http://localhost:3002
echo 🔗 Backend:  http://localhost:8000
echo 📊 API:      http://localhost:8000/api/tools
echo.
echo Press any key to exit this window...
pause >nul