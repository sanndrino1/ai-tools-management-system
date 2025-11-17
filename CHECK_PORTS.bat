@echo off
echo ==========================================
echo   AI Tools System - Port Check
echo ==========================================
echo.

echo Checking active ports...
netstat -ano | findstr ":3000 :3001 :3002 :3003 :8000"

echo.
echo ==========================================
echo   Quick URLs (try all):
echo ==========================================
echo Frontend URLs:
echo - http://localhost:3000/login
echo - http://localhost:3001/login  
echo - http://localhost:3002/login
echo - http://localhost:3003/login
echo.
echo Backend:
echo - http://localhost:8000
echo.
echo Test Credentials:
echo - Admin: admin@test.com / password123
echo - User:  user@test.com / password123
echo.
echo Opening all possible login URLs...

start http://localhost:3000/login
timeout /t 1 /nobreak >nul
start http://localhost:3001/login  
timeout /t 1 /nobreak >nul
start http://localhost:3002/login
timeout /t 1 /nobreak >nul
start http://localhost:3003/login

echo.
echo ==========================================
pause