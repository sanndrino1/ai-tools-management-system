@echo off
echo ==========================================
echo   AI Tools System - Clean Restart  
echo ==========================================

echo Stopping any existing processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im php.exe 2>nul

echo.
echo Starting Backend (Laravel)...
start "Laravel Backend" cmd /k "cd /d C:\Users\Lebovo\Documents\ai-tools-fullstack\backend && php artisan serve"

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend (Next.js)...
start "Next.js Frontend" cmd /k "cd /d C:\Users\Lebovo\Documents\ai-tools-fullstack\frontend && npm run dev"

echo.
echo Waiting 8 seconds for servers to start...
timeout /t 8 /nobreak >nul

echo.
echo ==========================================
echo   System Ready!
echo ==========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Login:    http://localhost:3000/login
echo Dashboard: http://localhost:3000/dashboard
echo.
echo Test Credentials:
echo - Admin: admin@test.com / password123
echo - User:  user@test.com / password123
echo.
echo Opening login page...

start http://localhost:3000/login

echo.
echo ==========================================
pause