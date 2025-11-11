@echo off
echo 🛑 Stopping AI Tools Management System - Production Mode
echo.

:: Stop production containers
docker-compose -f docker-compose.production.yml down

if %ERRORLEVEL% eq 0 (
    echo ✅ AI Tools Management System stopped successfully!
    echo.
    echo 🔧 Management options:
    echo   🗑️ Remove all data:      docker-compose -f docker-compose.production.yml down -v
    echo   🧹 Clean Docker cache:   docker system prune -f
    echo   🚀 Restart system:       .\start-production.bat
    echo.
    echo 💾 Data volumes preserved (MySQL, Redis) unless you run with -v flag
) else (
    echo ❌ Error stopping the system!
    echo.
    echo Try manually: docker-compose -f docker-compose.production.yml down -v
)

echo.
pause