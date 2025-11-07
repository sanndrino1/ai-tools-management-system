# 🐳 Docker Setup - Оптимизиран и Бърз

## 🚀 Бърз старт (< 2 минути)

### Windows
```bash
# Бърз build с оптимизирани images
docker-fast-build.bat
```

### Linux/Mac
```bash
# Направете скрипта executable
chmod +x docker-fast-build.sh

# Стартирайте бързия build
./docker-fast-build.sh
```

## ⚡ Какво е оптимизирано?

### 1. **Pre-built PHP Image**
- ✅ Използва `serversideup/php:8.2-fmp-nginx` 
- ✅ Всички PHP extensions са предкомпилирани
- ✅ Nginx, PHP-FPM и Supervisor са готови
- ⏱️ **Времето за build: от 10+ минути → под 2 минути**

### 2. **Multi-stage Dockerfile**
- 🔧 Development stage за разработка  
- 🚀 Production stage за deployment
- 📦 Отделни конфигурации за всяко environment

### 3. **Supervisor Configuration**
- ✅ `supervisord.conf` - за development
- 🚀 `supervisord.prod.conf` - за production  
- 🔄 Управлява PHP-FPM, Nginx и Laravel workers

### 4. **Health Checks**
- 🏥 `/health` endpoint за Docker healthcheck
- 📊 `/api/health` за detailed status
- ✅ Database и cache connectivity checks

## 📁 Файлова структура

```
backend/
├── Dockerfile                     # Оптимизиран dockerfile
├── docker/
│   ├── supervisor/
│   │   ├── supervisord.conf       # Development config
│   │   └── supervisord.prod.conf  # Production config  
│   └── nginx/
│       ├── default.conf           # Development nginx
│       └── nginx.prod.conf        # Production nginx
└── app/Http/Controllers/Api/
    └── HealthController.php       # Health check API

docker-compose.fast.yml            # Оптимизиран compose file
docker-fast-build.bat             # Windows build script  
docker-fast-build.sh              # Linux/Mac build script
```

## 🛠 Команди

### Стартиране
```bash
# Бърз старт
docker-compose -f docker-compose.fast.yml up -d

# С rebuild
docker-compose -f docker-compose.fast.yml up --build -d
```

### Мониторинг
```bash
# Логове
docker-compose -f docker-compose.fast.yml logs -f

# Статус на контейнерите
docker-compose -f docker-compose.fast.yml ps

# Health check
curl http://localhost:8000/health
```

### Спиране
```bash
# Спиране на услугите  
docker-compose -f docker-compose.fast.yml down

# С изтриване на volumes
docker-compose -f docker-compose.fast.yml down -v
```

## 🔧 Конфигурация

### Environment Variables
```bash
# Backend (.env)
APP_ENV=local
APP_DEBUG=true  
DB_CONNECTION=mysql
DB_HOST=mysql
CACHE_DRIVER=redis
REDIS_HOST=redis

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Портове
- **Frontend**: `3000` → http://localhost:3000
- **Backend**: `8000` → http://localhost:8000  
- **MySQL**: `3306` → localhost:3306
- **Redis**: `6379` → localhost:6379

## 🏥 Health Monitoring

### API Endpoints
- `GET /health` - Simple health check
- `GET /api/health` - Detailed health status

### Response Example  
```json
{
  "status": "healthy",
  "timestamp": "2025-11-07T10:30:00.000Z",
  "checks": {
    "database": "connected",
    "cache": "connected", 
    "app": {
      "environment": "local",
      "debug": true,
      "version": "1.0.0"
    }
  }
}
```

## 🚀 Production Deployment

### Build за production
```bash
# Build production image
docker build --target production -t ai-tools-backend:prod ./backend

# Deploy с production compose
docker-compose -f docker-compose.prod.yml up -d
```

### Production optimizations
- ✅ PHP opcache enabled
- ✅ Laravel config/route/view cache
- ✅ Nginx rate limiting  
- ✅ Security headers
- ✅ Gzip compression
- 🔒 Removed debug tools

## 🛡️ Troubleshooting

### Common Issues

**1. PHP Extensions грешки**
```bash
# Resolved: Използваме pre-built image
# serversideup/php:8.2-fpm-nginx включва всички extensions
```

**2. Supervisord не стартира**
```bash
# Проверете конфигурацията
docker exec ai-tools-backend supervisorctl status

# Рестартирайте supervisor
docker exec ai-tools-backend supervisorctl reload
```

**3. Build отнема много време**
```bash
# Използвайте fast build скрипта
./docker-fast-build.sh

# Или с cache
docker-compose -f docker-compose.fast.yml build --parallel
```

**4. Database connection проблеми**
```bash
# Проверете дали MySQL е стартирал
docker-compose -f docker-compose.fast.yml logs mysql

# Тествайте връзката
docker exec ai-tools-backend php artisan tinker --execute="DB::connection()->getPdo()"
```

## 🎯 Performance Tips

1. **Use BuildKit** за по-бързи builds:
   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **Multi-stage caching**:
   ```bash  
   docker build --cache-from ai-tools-backend:latest .
   ```

3. **Persistent volumes** за node_modules и vendor:
   ```yaml
   volumes:
     - frontend-modules:/app/node_modules
     - backend-vendor:/var/www/html/vendor
   ```

---

**⚡ Резултат: Docker setup който build-ва за под 2 минути вместо 10+ минути!**