#!/bin/bash
# AI Tools Management System - Development Startup Script

set -e

echo "🚀 Starting AI Tools Management System (Development Mode)"
echo "========================================================"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to setup environment files
setup_env() {
    echo "📄 Setting up environment files..."
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        echo "   Creating backend .env file..."
        cp .env.example backend/.env
        echo "   ✅ Backend .env created"
    else
        echo "   ✅ Backend .env already exists"
    fi
    
    # Frontend environment
    if [ ! -f frontend/.env.local ]; then
        echo "   Creating frontend .env.local file..."
        cp frontend/.env.local.example frontend/.env.local
        echo "   ✅ Frontend .env.local created"
    else
        echo "   ✅ Frontend .env.local already exists"
    fi
}

# Function to build and start containers
start_containers() {
    echo "🐳 Building and starting Docker containers..."
    
    # Pull latest images
    echo "   Pulling latest base images..."
    docker-compose pull mysql redis nginx
    
    # Build custom images
    echo "   Building application images..."
    docker-compose build --parallel
    
    # Start services
    echo "   Starting services..."
    docker-compose up -d
    
    echo "   ✅ All services started"
}

# Function to wait for services
wait_for_services() {
    echo "⏳ Waiting for services to be healthy..."
    
    # Wait for MySQL
    echo "   Waiting for MySQL..."
    while ! docker-compose exec -T mysql mysqladmin ping -h localhost --silent; do
        sleep 2
        echo "      MySQL is starting..."
    done
    echo "   ✅ MySQL is ready"
    
    # Wait for Redis
    echo "   Waiting for Redis..."
    while ! docker-compose exec -T redis redis-cli ping > /dev/null; do
        sleep 2
        echo "      Redis is starting..."
    done
    echo "   ✅ Redis is ready"
    
    # Wait for Laravel
    echo "   Waiting for Laravel API..."
    while ! curl -f http://localhost/api/health > /dev/null 2>&1; do
        sleep 5
        echo "      Laravel is starting..."
    done
    echo "   ✅ Laravel API is ready"
    
    # Wait for Next.js
    echo "   Waiting for Next.js frontend..."
    while ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; do
        sleep 5
        echo "      Next.js is starting..."
    done
    echo "   ✅ Next.js frontend is ready"
}

# Function to show service URLs
show_urls() {
    echo ""
    echo "🎉 AI Tools Management System is ready!"
    echo "======================================"
    echo ""
    echo "📱 Frontend (Next.js):     http://localhost:3000"
    echo "🔧 API (Laravel):          http://localhost/api"
    echo "🌐 Full Application:       http://localhost"
    echo "🗄️  Database (MySQL):       localhost:3306"
    echo "🔴 Cache (Redis):          localhost:6379"
    echo ""
    echo "🏥 Health Checks:"
    echo "   Frontend:               http://localhost:3000/api/health"
    echo "   Backend:                http://localhost/api/health"
    echo "   Nginx:                  http://localhost/health"
    echo ""
    echo "📊 Admin Interface:        http://localhost:3000/admin"
    echo "🔐 Login Page:             http://localhost:3000/login"
    echo ""
    echo "📝 Demo Users:"
    echo "   owner@aitools.dev       (Owner - Full Access)"
    echo "   pm@aitools.dev          (Project Manager)"
    echo "   backend@aitools.dev     (Backend Developer)"
    echo "   frontend@aitools.dev    (Frontend Developer)"
    echo "   qa@aitools.dev          (QA Engineer)"
    echo "   designer@aitools.dev    (Designer)"
    echo "   Password for all: password123"
    echo ""
    echo "💡 Useful Commands:"
    echo "   View logs:              docker-compose logs -f"
    echo "   Stop system:            ./stop-dev.sh"
    echo "   Restart:                docker-compose restart"
    echo "   Shell access:           docker-compose exec laravel-app bash"
    echo ""
}

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    docker-compose down
    echo "✅ Services stopped"
}

# Set trap for cleanup
trap cleanup EXIT

# Main execution
main() {
    check_docker
    setup_env
    start_containers
    wait_for_services
    show_urls
    
    echo "Press Ctrl+C to stop all services"
    
    # Keep script running and show logs
    docker-compose logs -f
}

# Run main function
main "$@"