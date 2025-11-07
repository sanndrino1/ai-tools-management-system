@echo off
setlocal EnableDelayedExpansion

echo ================================================================
echo                🔧 SYSTEM DIAGNOSTICS TOOL
echo ================================================================
echo.

set "LOG_FILE=diagnostics_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%.log"
echo 📊 Diagnostics report will be saved to: %LOG_FILE%
echo.

echo ================================================================ >> %LOG_FILE%
echo SYSTEM DIAGNOSTICS REPORT - %date% %time% >> %LOG_FILE%
echo ================================================================ >> %LOG_FILE%
echo. >> %LOG_FILE%

echo 🔍 STEP 1: Checking system requirements...
echo === SYSTEM REQUIREMENTS === >> %LOG_FILE%

echo   📦 Node.js version:
node --version 2>>%LOG_FILE% && (
    echo ✅ Node.js is installed >> %LOG_FILE%
    node --version >> %LOG_FILE%
) || (
    echo ❌ Node.js not found >> %LOG_FILE%
    echo WARNING: Node.js is required for this application!
)

echo   🐳 Docker version:
docker --version 2>>%LOG_FILE% && (
    echo ✅ Docker is installed >> %LOG_FILE%
    docker --version >> %LOG_FILE%
) || (
    echo ❌ Docker not found >> %LOG_FILE%
    echo INFO: Docker is optional - using fallback mode >> %LOG_FILE%
)

echo   🔧 Git version:
git --version 2>>%LOG_FILE% && (
    echo ✅ Git is installed >> %LOG_FILE%
    git --version >> %LOG_FILE%
) || (
    echo ❌ Git not found >> %LOG_FILE%
    echo INFO: Git is optional for running the application >> %LOG_FILE%
)

echo.
echo 🌐 STEP 2: Checking network ports...
echo === NETWORK PORTS === >> %LOG_FILE%

echo   🔍 Scanning critical ports...
for %%p in (3000 8000 3306 6379) do (
    echo Checking port %%p... >> %LOG_FILE%
    netstat -an | findstr ":%%p " >nul 2>&1 && (
        echo ✅ Port %%p is in use >> %LOG_FILE%
        echo   Port %%p: ACTIVE
    ) || (
        echo ❌ Port %%p is free >> %LOG_FILE%
        echo   Port %%p: FREE
    )
)

echo.
echo 📂 STEP 3: Checking project structure...
echo === PROJECT STRUCTURE === >> %LOG_FILE%

set "REQUIRED_FILES=package.json mock-api-server.js docker-compose.yml"
set "REQUIRED_DIRS=app components contexts lib"

echo   📁 Required files:
for %%f in (%REQUIRED_FILES%) do (
    if exist "%%f" (
        echo ✅ %%f found >> %LOG_FILE%
        echo     ✅ %%f
    ) else (
        echo ❌ %%f missing >> %LOG_FILE%
        echo     ❌ %%f - MISSING!
    )
)

echo   📁 Required directories:
for %%d in (%REQUIRED_DIRS%) do (
    if exist "%%d\" (
        echo ✅ %%d directory found >> %LOG_FILE%
        echo     ✅ %%d\
    ) else (
        echo ❌ %%d directory missing >> %LOG_FILE%
        echo     ❌ %%d\ - MISSING!
    )
)

echo.
echo 🔄 STEP 4: Checking running processes...
echo === RUNNING PROCESSES === >> %LOG_FILE%

echo   🔍 Node.js processes:
for /f "tokens=1,2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO CSV ^| findstr /V "INFO:"') do (
    if not "%%a"=="Image Name" (
        echo ✅ Node process found: %%a %%b >> %LOG_FILE%
        echo     🟢 Node.js process active
    )
)

echo   🔍 Docker processes:
docker ps 2>>%LOG_FILE% && (
    echo ✅ Docker containers: >> %LOG_FILE%
    docker ps --format "table {{.Names}}\t{{.Status}}" >> %LOG_FILE%
    echo     🟢 Docker containers running
) || (
    echo ❌ No Docker containers or Docker not available >> %LOG_FILE%
    echo     🔴 Docker not active
)

echo.
echo 🧪 STEP 5: Testing application endpoints...
echo === ENDPOINT TESTING === >> %LOG_FILE%

echo   🌐 Testing Frontend (port 3000):
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -Method GET -TimeoutSec 5 | Select-Object StatusCode } catch { Write-Host 'ERROR' }" 2>>%LOG_FILE% | findstr "200" >nul && (
    echo ✅ Frontend responding on port 3000 >> %LOG_FILE%
    echo     ✅ Frontend: ONLINE
) || (
    echo ❌ Frontend not responding on port 3000 >> %LOG_FILE%
    echo     ❌ Frontend: OFFLINE
)

echo   🔌 Testing API (port 8000):
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:8000/api/health' -Method GET -TimeoutSec 5 } catch { Write-Host 'ERROR' }" 2>>%LOG_FILE% | findstr "status" >nul && (
    echo ✅ API responding on port 8000 >> %LOG_FILE%
    echo     ✅ API: ONLINE
) || (
    echo ❌ API not responding on port 8000 >> %LOG_FILE%
    echo     ❌ API: OFFLINE
)

echo.
echo 📋 STEP 6: NPM Dependencies check...
echo === NPM DEPENDENCIES === >> %LOG_FILE%

if exist "package.json" (
    echo   📦 Checking package.json...
    powershell -Command "Get-Content package.json | ConvertFrom-Json | Select-Object name, version" >> %LOG_FILE% 2>&1
    
    if exist "node_modules\" (
        echo ✅ node_modules directory exists >> %LOG_FILE%
        echo     ✅ Dependencies installed
    ) else (
        echo ❌ node_modules directory missing >> %LOG_FILE%
        echo     ❌ Dependencies NOT installed
        echo     💡 Run: npm install
    )
) else (
    echo ❌ package.json not found >> %LOG_FILE%
    echo     ❌ Not a valid Node.js project
)

echo.
echo 🎯 STEP 7: System recommendations...
echo === RECOMMENDATIONS === >> %LOG_FILE%

set "ISSUES_FOUND=0"

if not exist "node_modules\" (
    echo 💡 RECOMMENDATION: Install dependencies with 'npm install' >> %LOG_FILE%
    echo     💡 Run: npm install
    set /a ISSUES_FOUND+=1
)

netstat -an | findstr ":3000 " >nul 2>&1 || (
    echo 💡 RECOMMENDATION: Start frontend with 'npm run dev' >> %LOG_FILE%
    echo     💡 Run: npm run dev
    set /a ISSUES_FOUND+=1
)

netstat -an | findstr ":8000 " >nul 2>&1 || (
    echo 💡 RECOMMENDATION: Start API with 'node mock-api-server.js' >> %LOG_FILE%
    echo     💡 Run: node mock-api-server.js
    set /a ISSUES_FOUND+=1
)

echo.
echo ================================================================
echo                    📊 DIAGNOSTIC SUMMARY
echo ================================================================

if !ISSUES_FOUND!==0 (
    echo 🎉 All systems operational! No issues found.
    echo ✅ STATUS: HEALTHY >> %LOG_FILE%
) else (
    echo ⚠️  Found !ISSUES_FOUND! issue(s). Check recommendations above.
    echo ❌ STATUS: NEEDS ATTENTION >> %LOG_FILE%
)

echo.
echo 📄 Full diagnostic report saved to: %LOG_FILE%
echo 🔧 To fix issues, follow the recommendations above.
echo.

echo === DIAGNOSTIC SUMMARY === >> %LOG_FILE%
echo Issues found: !ISSUES_FOUND! >> %LOG_FILE%
echo Report generated: %date% %time% >> %LOG_FILE%
echo ================================================================ >> %LOG_FILE%

pause