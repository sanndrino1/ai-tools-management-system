@echo off
echo ===============================================
echo  AI Tools - Development Servers Starter
echo ===============================================

echo Starting Backend (Laravel)...
start "Laravel Backend" cmd /c "cd backend && php artisan serve"

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting Frontend (Next.js)...
start "Next.js Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo ===============================================
echo Servers are starting...
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo Login:    http://localhost:3000/login
echo ===============================================

echo Demo credentials:
echo Email: admin@test.com
echo Password: password123
echo.
echo Press any key to continue...
pause >nul