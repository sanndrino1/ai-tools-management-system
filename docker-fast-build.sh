#!/bin/bash

# Fast Docker Build Script for AI Tools Management System
# This script builds optimized Docker images quickly

set -e

echo "🚀 Starting Fast Docker Build for AI Tools Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_status "Docker is running ✅"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.fast.yml down --remove-orphans || true

# Remove old images (optional - comment out to keep cache)
# print_warning "Removing old images..."
# docker rmi $(docker images -q "ai-tools-*" 2>/dev/null) 2>/dev/null || true

# Build images with optimized cache
print_status "Building backend image (using pre-built PHP image)..."
docker build \
    --target development \
    --cache-from serversideup/php:8.2-fpm-nginx \
    -t ai-tools-backend:latest \
    ./backend

print_status "Building frontend image..."
docker build \
    --target development \
    --cache-from node:18-alpine \
    -t ai-tools-frontend:latest \
    ./frontend

# Start services
print_status "Starting services..."
docker-compose -f docker-compose.fast.yml up -d

# Wait for services to be healthy
print_status "Waiting for services to start..."
sleep 10

# Check service health
print_status "Checking service health..."

# Check backend health
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    print_status "Backend is healthy ✅"
else
    print_warning "Backend health check failed - it may still be starting"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "Frontend is healthy ✅"
else
    print_warning "Frontend health check failed - it may still be starting"
fi

print_status "🎉 Build completed!"
echo ""
echo "🔗 Services are available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API:      http://localhost:8000/api/health"
echo ""
echo "📊 To check logs:"
echo "   docker-compose -f docker-compose.fast.yml logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f docker-compose.fast.yml down"