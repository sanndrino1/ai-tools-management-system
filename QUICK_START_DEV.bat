@echo off
echo ============================================
echo   AI Tools Management System - Quick Start
echo ============================================
echo.

echo Starting Backend (Laravel)...
start "Laravel Backend" cmd /k "cd /d C:\Users\Lebovo\Documents\ai-tools-fullstack\backend && php artisan serve"

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend (Next.js)...
start "Next.js Frontend" cmd /k "cd /d C:\Users\Lebovo\Documents\ai-tools-fullstack\frontend && npm run dev"

echo.
echo ============================================
echo   System Starting...
echo ============================================
echo.
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo Login page: http://localhost:3000/login
echo Dashboard: http://localhost:3000/dashboard
echo.
echo Test Credentials:
echo - Admin: admin@test.com / password123
echo - User:  user@test.com / password123
echo.
echo ============================================
echo   Press any key to open the login page...
echo ============================================

pause >nul

start http://localhost:3000/login

echo.
echo System is running! Check the opened browser window.
echo Close this window when you're done testing.
pause