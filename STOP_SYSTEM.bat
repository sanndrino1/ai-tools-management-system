@echo off
echo.
echo ====================================
echo   AI Tools Management System  
echo   Stopping All Servers
echo ====================================
echo.

echo Stopping processes on ports 3000, 3001, 3002, 8000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /pid %%a /f >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /pid %%a /f >nul 2>&1  
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    taskkill /pid %%a /f >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    taskkill /pid %%a /f >nul 2>&1
)

echo.
echo ✅ All servers stopped!
echo.
pause