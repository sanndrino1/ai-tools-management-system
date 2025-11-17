@echo off
echo ?? AI Tools - Quick Fix
cd /d C:\Users\Lebovo\Documents\ai-tools-fullstack

echo ?? Starting Backend...
cd backend
start /B php artisan serve --host=0.0.0.0 --port=8000
timeout /t 3 >nul

echo ?? Starting Frontend...
cd ..\frontend
start /B npm run dev -- --port 3000
cd ..

echo ? Opening http://localhost:3000
timeout /t 10 >nul
start http://localhost:3000
start http://localhost:8000
