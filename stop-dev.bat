@echo off
REM AI Tools Management System - Stop Development Environment

echo.
echo 🛑 Stopping AI Tools Management System...
echo ========================================
echo.

REM Stop all containers
echo 📦 Stopping Docker containers...
docker-compose down

REM Remove orphaned containers
echo 🧹 Cleaning up orphaned containers...
docker-compose down --remove-orphans

REM Optional: Remove volumes (uncomment if you want to reset data)
REM echo 🗑️  Removing volumes...
REM docker-compose down -v

echo.
echo ✅ All services stopped successfully
echo.
echo 💡 To start again, run: start-dev.bat
echo.
pause