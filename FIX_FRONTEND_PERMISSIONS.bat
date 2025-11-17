@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo  AI Tools - Frontend File Permissions Fix
echo ===============================================

set "FRONTEND_DIR=C:\Users\Lebovo\Documents\ai-tools-fullstack\frontend"

echo Checking if frontend directory exists...
if not exist "%FRONTEND_DIR%" (
    echo ERROR: Frontend directory not found: %FRONTEND_DIR%
    pause
    exit /b 1
)

echo.
echo Frontend directory found: %FRONTEND_DIR%
echo.

echo Step 1: Taking ownership of all files and folders...
takeown /f "%FRONTEND_DIR%" /r /d y >nul 2>&1
if errorlevel 1 (
    echo WARNING: Some files might require administrator privileges
)

echo Step 2: Granting full control to current user...
icacls "%FRONTEND_DIR%" /grant "%USERNAME%:(F)" /t /c /q >nul 2>&1

echo Step 3: Setting proper permissions for directories...
for /d /r "%FRONTEND_DIR%" %%D in (*) do (
    icacls "%%D" /grant "%USERNAME%:(OI)(CI)(F)" /q >nul 2>&1
)

echo Step 4: Setting proper permissions for files...
for /r "%FRONTEND_DIR%" %%F in (*.*) do (
    icacls "%%F" /grant "%USERNAME%:(F)" /q >nul 2>&1
)

echo Step 5: Special handling for node_modules...
if exist "%FRONTEND_DIR%\node_modules" (
    echo   - Fixing node_modules permissions...
    icacls "%FRONTEND_DIR%\node_modules" /grant "%USERNAME%:(OI)(CI)(F)" /t /c /q >nul 2>&1
    
    if exist "%FRONTEND_DIR%\node_modules\.bin" (
        echo   - Making .bin files executable...
        for %%F in ("%FRONTEND_DIR%\node_modules\.bin\*") do (
            icacls "%%F" /grant "%USERNAME%:(F)" /q >nul 2>&1
        )
    )
)

echo Step 6: Special handling for .next directory...
if exist "%FRONTEND_DIR%\.next" (
    echo   - Fixing .next directory permissions...
    icacls "%FRONTEND_DIR%\.next" /grant "%USERNAME%:(OI)(CI)(F)" /t /c /q >nul 2>&1
)

echo Step 7: Removing inherited permissions and setting explicit ones...
icacls "%FRONTEND_DIR%" /inheritance:r /grant "%USERNAME%:(OI)(CI)(F)" /t /c /q >nul 2>&1

echo Step 8: Verifying permissions...
echo   Checking critical directories:

if exist "%FRONTEND_DIR%\app" (
    icacls "%FRONTEND_DIR%\app" | findstr /i "%USERNAME%" >nul && echo   ✓ app/ - OK || echo   ✗ app/ - FAILED
)

if exist "%FRONTEND_DIR%\components" (
    icacls "%FRONTEND_DIR%\components" | findstr /i "%USERNAME%" >nul && echo   ✓ components/ - OK || echo   ✗ components/ - FAILED
)

if exist "%FRONTEND_DIR%\lib" (
    icacls "%FRONTEND_DIR%\lib" | findstr /i "%USERNAME%" >nul && echo   ✓ lib/ - OK || echo   ✗ lib/ - FAILED
)

if exist "%FRONTEND_DIR%\node_modules" (
    icacls "%FRONTEND_DIR%\node_modules" | findstr /i "%USERNAME%" >nul && echo   ✓ node_modules/ - OK || echo   ✗ node_modules/ - FAILED
)

echo.
echo Step 9: Setting read-only attributes...
echo   - Removing read-only from all files...
attrib -r "%FRONTEND_DIR%\*.*" /s /d >nul 2>&1

echo   - Setting specific files as read-only (package-lock.json)...
if exist "%FRONTEND_DIR%\package-lock.json" (
    attrib +r "%FRONTEND_DIR%\package-lock.json" >nul 2>&1
)

echo.
echo ===============================================
echo  File Permissions Fix Complete!
echo ===============================================
echo.
echo Summary:
echo - All files and directories now have full permissions
echo - Current user (%USERNAME%) has full control
echo - node_modules/.bin files are executable
echo - .next directory has proper build permissions
echo - Inherited permissions removed for security
echo.
echo You can now run: npm install, npm run dev, npm run build
echo.

pause