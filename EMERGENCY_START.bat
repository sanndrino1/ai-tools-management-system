@echo off
echo ===============================================
echo   AI Tools System - Emergency Quick Start
echo ===============================================

echo Stopping any running processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im php.exe 2>nul

echo.
echo Starting Backend (Laravel)...
start "Laravel Backend" cmd /k "cd /d C:\Users\Lebovo\Documents\ai-tools-fullstack\backend && php artisan serve"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend (Next.js)...
start "Next.js Frontend" cmd /k "cd /d C:\Users\Lebovo\Documents\ai-tools-fullstack\frontend && npm run dev"

echo.
echo Waiting 10 seconds for servers to start...
timeout /t 10 /nobreak >nul

echo.
echo ===============================================
echo   Checking Server Status...
echo ===============================================

echo Checking for Laravel server on port 8000...
netstat -ano | findstr :8000

echo.
echo Checking for Next.js server on available ports...
netstat -ano | findstr ":3000 :3001 :3002 :3003"

echo.
echo ===============================================
echo   Opening Login Page...
echo ===============================================

echo Trying different ports for frontend...
start http://localhost:3000/login
timeout /t 2 /nobreak >nul
start http://localhost:3001/login  
timeout /t 2 /nobreak >nul
start http://localhost:3002/login
timeout /t 2 /nobreak >nul
start http://localhost:3003/login

echo.
echo ===============================================
echo   System Info
echo ===============================================
echo.
echo Frontend URLs to try:
echo - http://localhost:3000/login
echo - http://localhost:3001/login
echo - http://localhost:3002/login
echo - http://localhost:3003/login
echo.
echo Backend API: http://localhost:8000
echo.
echo Test Credentials:
echo - Admin: admin@test.com / password123
echo - User:  user@test.com / password123
echo.
echo ===============================================

pause