# Optimized Dockerfile for Laravel Application
# Using pre-built PHP image with extensions to avoid compilation issues

# =============================================================================
# Base PHP image with pre-compiled extensions  
# =============================================================================
FROM serversideup/php:8.2-fpm-nginx AS base

# Install additional system dependencies
USER root
RUN apt-get update && apt-get install -y \
    supervisor \
    redis-tools \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# =============================================================================
# Development Stage
# =============================================================================
FROM base AS development

# Ensure www-data user has correct permissions
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

# Copy application code with correct ownership
COPY --chown=www-data:www-data . .

# Install Composer dependencies as www-data user
USER www-data
RUN composer install --optimize-autoloader

# Switch back to root for configuration
USER root

# Copy configuration files
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/nginx/default.conf /etc/nginx/sites-available/default

# Set comprehensive permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 storage bootstrap/cache && \
    chmod -R 664 storage/logs && \
    find storage -type d -exec chmod 775 {} \; && \
    find bootstrap/cache -type d -exec chmod 775 {} \;

# Expose ports
EXPOSE 80 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# =============================================================================
# Production Stage  
# =============================================================================
FROM base AS production

# Ensure www-data user has correct permissions
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

# Copy application code with correct ownership
COPY --chown=www-data:www-data . .

# Install production dependencies as www-data user
USER www-data
RUN composer install --no-dev --optimize-autoloader --no-scripts && \
    composer dump-autoload --optimize

# Laravel optimizations (skip if no .env exists)
RUN if [ -f .env ]; then \
        php artisan config:cache && \
        php artisan route:cache && \
        php artisan view:cache; \
    fi

# Switch back to root for system configuration
USER root

# Remove development files
RUN rm -rf tests docker .git && \
    rm -f docker-compose* README.md

# Copy production configuration files (fallback to development configs if production not found)
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/nginx/default.conf /etc/nginx/sites-available/default

# Set comprehensive production permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 storage bootstrap/cache && \
    chmod -R 664 storage/logs && \
    find /var/www/html -type f -exec chmod 644 {} \; && \
    find /var/www/html -type d -exec chmod 755 {} \; && \
    find storage -type d -exec chmod 775 {} \; && \
    find bootstrap/cache -type d -exec chmod 775 {} \;

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]