@echo off
echo ===============================================
echo  AI Tools - Docker Container Reset
echo ===============================================

echo Stopping all containers...
docker compose down

echo Removing old images to force rebuild...
docker rmi ai-tools-fullstack-nextjs-app 2>nul
docker rmi ai-tools-fullstack-laravel-app 2>nul

echo Cleaning up volumes...
docker volume prune -f

echo Building and starting containers with proper permissions...
docker compose up --build -d

echo Waiting for services to be ready...
timeout /t 10

echo Checking container status...
docker compose ps

echo.
echo ===============================================
echo Setup complete! Access your application at:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo ===============================================

pause