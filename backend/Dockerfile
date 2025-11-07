# Multi-stage Dockerfile for Laravel Application
# Base PHP image with essential extensions
FROM php:8.2-fpm-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    bash \
    curl \
    freetype-dev \
    g++ \
    gcc \
    git \
    icu-dev \
    jpeg-dev \
    libc-dev \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    make \
    mysql-client \
    nginx \
    nodejs \
    npm \
    oniguruma-dev \
    openssl-dev \
    postgresql-dev \
    redis \
    supervisor \
    unzip \
    zip

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        bcmath \
        exif \
        gd \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        sockets \
        xml \
        zip

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create Laravel user
RUN addgroup -g 1000 -S laravel \
    && adduser -u 1000 -S laravel -G laravel

# =============================================================================
# Development Stage
# =============================================================================
FROM base AS development

# Install Xdebug for development
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Copy PHP configuration for development
COPY docker/php/php.ini /usr/local/etc/php/php.ini
COPY docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Copy application code
COPY . /var/www/html

# Install Composer dependencies
RUN composer install --optimize-autoloader --no-scripts

# Set permissions
RUN chown -R laravel:laravel /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker/scripts/laravel-entrypoint.sh /usr/local/bin/laravel-entrypoint.sh
RUN chmod +x /usr/local/bin/laravel-entrypoint.sh

# Switch to laravel user
USER laravel

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9000/api/health || exit 1

# Start PHP-FPM
ENTRYPOINT ["/usr/local/bin/laravel-entrypoint.sh"]
CMD ["php-fpm"]

# =============================================================================
# Production Stage
# =============================================================================
FROM base AS production

# Copy PHP configuration for production
COPY docker/php/php.prod.ini /usr/local/etc/php/php.ini
COPY docker/php/php-fpm.prod.conf /usr/local/etc/php-fpm.d/www.conf

# Copy application code
COPY . /var/www/html

# Install Composer dependencies for production
RUN composer install --optimize-autoloader --no-dev --no-scripts \
    && composer dump-autoload --optimize

# Laravel optimizations
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Set permissions
RUN chown -R laravel:laravel /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Remove unnecessary files
RUN rm -rf /var/www/html/.git \
    && rm -rf /var/www/html/tests \
    && rm -rf /var/www/html/docker

# Copy supervisor configuration
COPY docker/supervisor/supervisord.prod.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker/scripts/laravel-entrypoint.sh /usr/local/bin/laravel-entrypoint.sh
RUN chmod +x /usr/local/bin/laravel-entrypoint.sh

# Switch to laravel user
USER laravel

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9000/api/health || exit 1

# Start services with supervisor
ENTRYPOINT ["/usr/local/bin/laravel-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]