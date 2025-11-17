@echo off
echo ===============================================
echo  AI Tools - Environment Configuration Check
echo ===============================================

echo.
echo [1/5] Checking Frontend .env.local...
if exist "frontend\.env.local" (
    echo ✓ Frontend .env.local exists
    findstr "NEXT_PUBLIC_API_URL" frontend\.env.local >nul
    if !errorlevel! equ 0 (
        echo ✓ NEXT_PUBLIC_API_URL configured
    ) else (
        echo ✗ NEXT_PUBLIC_API_URL missing
    )
) else (
    echo ✗ Frontend .env.local missing
)

echo.
echo [2/5] Checking Backend .env...
if exist "backend\.env" (
    echo ✓ Backend .env exists
    findstr "APP_KEY" backend\.env >nul
    if !errorlevel! equ 0 (
        echo ✓ APP_KEY configured
    ) else (
        echo ✗ APP_KEY missing
    )
) else (
    echo ✗ Backend .env missing
)

echo.
echo [3/5] Testing Frontend Server Connection...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 >temp_status.txt
set /p status=<temp_status.txt
if "%status%"=="200" (
    echo ✓ Frontend server responding (HTTP %status%)
) else (
    echo ✗ Frontend server not responding (HTTP %status%)
)
del temp_status.txt 2>nul

echo.
echo [4/5] Testing Backend Server Connection...
curl -s -o nul -w "%%{http_code}" http://localhost:8000 >temp_status.txt
set /p status=<temp_status.txt
if "%status%"=="404" (
    echo ✓ Backend server responding (HTTP %status%)
) else (
    echo ✗ Backend server not responding (HTTP %status%)
)
del temp_status.txt 2>nul

echo.
echo [5/5] Testing 2FA API Endpoint...
curl -s -o nul -w "%%{http_code}" http://localhost:8000/api/v1/2fa/status >temp_status.txt
set /p status=<temp_status.txt
if "%status%"=="405" (
    echo ✓ 2FA endpoint exists (HTTP %status%)
) else (
    echo ✗ 2FA endpoint issue (HTTP %status%)
)
del temp_status.txt 2>nul

echo.
echo ===============================================
echo Configuration check completed!
echo ===============================================
echo.
echo Access URLs:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Login:    http://localhost:3000/login
echo ===============================================

pause