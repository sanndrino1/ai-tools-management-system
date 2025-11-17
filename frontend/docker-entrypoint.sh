#!/bin/sh
set -e

# Fix ownership and permissions for mounted volumes
echo "Fixing file permissions..."

# Check if we're running as root (UID 0)
if [ "$(id -u)" = "0" ]; then
    echo "Running as root, fixing permissions..."
    
    # Ensure nextjs user owns all application files
    chown -R nextjs:nodejs /app
    
    # Set proper directory permissions (755)
    find /app -type d -exec chmod 755 {} \;
    
    # Set proper file permissions (644)
    find /app -type f -exec chmod 644 {} \;
    
    # Make node_modules binaries executable
    if [ -d "/app/node_modules/.bin" ]; then
        chmod +x /app/node_modules/.bin/*
    fi
    
    # Ensure .next directory has proper permissions
    if [ -d "/app/.next" ]; then
        chown -R nextjs:nodejs /app/.next
        chmod -R 755 /app/.next
    fi
    
    echo "Switching to nextjs user..."
    exec su-exec nextjs "$@"
else
    echo "Running as non-root user ($(id -u)), proceeding..."
    exec "$@"
fi