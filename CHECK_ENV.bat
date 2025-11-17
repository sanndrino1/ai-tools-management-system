@echo off
echo ===============================================
echo  AI Tools - Environment Configuration Check
echo ===============================================

echo.
echo Checking Frontend .env.local...
if exist "frontend\.env.local" (
    echo ✓ Frontend .env.local exists
    findstr "NEXT_PUBLIC_API_URL" frontend\.env.local >nul
    if %errorlevel%==0 (
        echo ✓ API URL configured
    ) else (
        echo ✗ API URL missing
    )
    
    findstr "NEXT_PUBLIC_SUPABASE_URL" frontend\.env.local >nul
    if %errorlevel%==0 (
        echo ✓ Supabase URL configured
    ) else (
        echo ✗ Supabase URL missing
    )
) else (
    echo ✗ Frontend .env.local missing
)

echo.
echo Checking Backend .env...
if exist "backend\.env" (
    echo ✓ Backend .env exists
    findstr "APP_KEY" backend\.env >nul
    if %errorlevel%==0 (
        echo ✓ App key configured
    ) else (
        echo ✗ App key missing
    )
    
    findstr "DB_DATABASE" backend\.env >nul
    if %errorlevel%==0 (
        echo ✓ Database configured
    ) else (
        echo ✗ Database configuration missing
    )
    
    findstr "MAIL_FROM_ADDRESS" backend\.env >nul
    if %errorlevel%==0 (
        echo ✓ Mail configuration found
    ) else (
        echo ✗ Mail configuration missing
    )
) else (
    echo ✗ Backend .env missing
)

echo.
echo Checking Database...
if exist "backend\database\database.sqlite" (
    echo ✓ SQLite database exists
) else (
    echo ✗ SQLite database missing - run migrations
)

echo.
echo Environment Check Complete!
echo.
echo Current Configuration:
echo - Development Mode: localhost:3000 → localhost:8000
echo - Frontend: Next.js with Supabase integration
echo - Backend: Laravel with SQLite + 2FA support
echo - Email: SMTP configured for 2FA codes
echo.

pause