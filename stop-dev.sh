#!/bin/bash
# AI Tools Management System - Stop Development Environment

echo "🛑 Stopping AI Tools Management System..."
echo "========================================"

# Stop all containers
echo "📦 Stopping Docker containers..."
docker-compose down

# Remove orphaned containers
echo "🧹 Cleaning up orphaned containers..."
docker-compose down --remove-orphans

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "🗑️  Removing volumes..."
# docker-compose down -v

echo "✅ All services stopped successfully"
echo ""
echo "💡 To start again, run: ./start-dev.sh"