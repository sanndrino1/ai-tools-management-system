# 🚀 AI Tools Management System

> **Enterprise-grade AI tools management platform with role-based access control, 2FA security, and advanced analytics.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.33-blueviolet.svg)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🐳 Docker Setup](#-docker-setup)
- [📦 Manual Installation](#-manual-installation)
- [🔧 Configuration](#-configuration)
- [👥 Role System](#-role-system)
- [🛠️ Adding Tools](#️-adding-tools)
- [🔐 Security Features](#-security-features)
- [📡 API Documentation](#-api-documentation)
- [🤖 AI Agents Integration](#-ai-agents-integration)

## ✨ Features

### 🔐 **Advanced Security**
- **Two-Factor Authentication** (Email, Telegram, Google Authenticator)
- **Role-based access control** (6-tier hierarchy)
- **JWT token management** with session handling
- **Audit logging** for all system actions
- **Route protection** middleware

### 🛡️ **Admin Dashboard**
- **Tool management** (approve, reject, categorize)
- **User role management** with permission control
- **Real-time analytics** and statistics
- **Activity monitoring** and audit trails
- **Redis caching** for performance

### ⚡ **Performance & Scalability**
- **Redis caching** for categories and statistics
- **Lazy loading** and pagination
- **Optimized database queries**
- **CDN-ready** architecture
- **Auto-scaling** Docker containers

## 🚀 **Quick Start**

### Предварителни изисквания
- **Node.js** 16+ и **npm** 
- **PHP** 8.0+ (XAMPP препоръчан)
- **Composer** 

### 1️⃣ Стартиране на Backend (Laravel)
```bash
cd backend
php artisan serve --port=8000
# Backend API ще е на: http://localhost:8000
```

### 2️⃣ Стартиране на Frontend (Next.js)  
```bash
cd frontend
npm run dev
# Frontend ще е на: http://localhost:3002
```

### 3️⃣ Отваряне в браузъра
- **Приложението**: http://localhost:3002  
- **API данни**: http://localhost:8000/api/tools
- **Laravel dashboard**: http://localhost:8000

🎉 **Готово! Имате работещо full-stack приложение с примерни данни!**

## 🏗️ Архитектура

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    PostgreSQL    ┌─────────────────┐
│   Next.js 14    │ ◄─────────────► │   Laravel 11    │ ◄───────────────► │    Supabase     │
│   (Frontend)    │                 │   (Backend API) │                   │  (Database +    │
│                 │                 │                 │                   │   Auth + RT)    │
└─────────────────┘                 └─────────────────┘                   └─────────────────┘
```

## 🎯 Компоненти

### 🎨 Frontend (Next.js 14)
- **Локация**: `/frontend`
- **Технологии**: Next.js 14, TypeScript, Tailwind CSS
- **Роля**: User Interface, Client-side логика
- **API**: Consumption на Laravel REST API

### 🔧 Backend (Laravel 11)
- **Локация**: `/backend`
- **Технологии**: Laravel 11, PHP 8.2, Laravel Sanctum
- **Роля**: REST API, Business логика, Валидация
- **Auth**: JWT tokens + Supabase integration

### 🗄️ Database (Supabase)
- **PostgreSQL база данни**
- **Real-time subscriptions**
- **Built-in автентикация**
- **Storage за файлове**

## 📦 Структура на проекта

```
ai-tools-fullstack/
├── frontend/              # Next.js 14 приложение
│   ├── app/              # App Router
│   ├── components/       # React компоненти
│   ├── lib/             # Utilities и типове
│   └── public/          # Статични ресурси
├── backend/             # Laravel 11 API
│   ├── app/            # Laravel application
│   ├── routes/         # API маршрути
│   ├── database/       # Migrations & Seeders
│   └── config/         # Конфигурации
├── docs/               # Документация
│   ├── api/           # API документация
│   ├── deployment/    # Deployment guides
│   └── setup/         # Setup инструкции
└── docker/            # Docker configuration
```

## 🚀 Ключови функционалности

### 🔐 Автентикация & Сигурност
- **Supabase Auth** - OAuth providers, email/password
- **Laravel Sanctum** - API token authentication
- **Role-based Access Control** - 6 роли с йерархия
- **2FA поддръжка** - Email и SMS verification

### 🛠️ Tool Management
- **CRUD операции** чрез REST API
- **Category система** - AI/ML, Development, Design, etc.
- **Status workflow** - Pending → Under Review → Approved/Rejected
- **File upload** - Supabase Storage integration

### ⭐ Rating & Comments
- **5-star rating система**
- **Nested comments** с real-time updates
- **Vote система** - Upvote/downvote
- **Moderation tools**

### 📊 Analytics & Monitoring
- **Admin dashboard** - Real-time статистики
- **Audit logging** - All user actions
- **Performance metrics** - API response times
- **Real-time notifications** - Supabase real-time

## 🔧 Технически детайли

### API Endpoints
```
GET    /api/tools                 # List tools
POST   /api/tools                 # Create tool
GET    /api/tools/{id}            # Get tool
PUT    /api/tools/{id}            # Update tool
DELETE /api/tools/{id}            # Delete tool
POST   /api/tools/{id}/rate       # Rate tool
GET    /api/tools/{id}/comments   # Get comments
POST   /api/tools/{id}/comments   # Add comment
```

### Database Schema
```sql
-- Users (Supabase built-in)
-- Tools
-- Categories  
-- Ratings
-- Comments
-- Audit_logs
-- User_roles
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Backend (.env)
SUPABASE_URL=
SUPABASE_SECRET_KEY=
DB_CONNECTION=pgsql
DB_HOST=db.supabase.co
```

## 🚀 Development Setup

### 1. Backend Setup
```bash
cd backend
composer install
php artisan migrate
php artisan serve # http://localhost:8000
```

### 2. Frontend Setup  
```bash
cd frontend
npm install
npm run dev # http://localhost:3000
```

### 3. Supabase Setup
- Create project at supabase.com
- Configure authentication providers
- Run database migrations
- Setup storage buckets

## 📈 Deployment

### Production Stack
- **Frontend**: Vercel (Next.js optimized)
- **Backend**: DigitalOcean/AWS (Laravel Forge)
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Cloudflare
- **Monitoring**: Sentry + Laravel Telescope

### Docker Support
```bash
docker-compose up --build
```

## 🔄 Data Flow

1. **User Login** → Supabase Auth → JWT token
2. **Frontend Request** → Laravel API (with token)
3. **Backend Processing** → Database operations
4. **Real-time Updates** → Supabase subscriptions
5. **Response** → JSON API response

## 🎯 Roadmap

- [ ] Setup Supabase project
- [ ] Create Laravel API structure
- [ ] Implement authentication flow
- [ ] Build core CRUD operations
- [ ] Add real-time features
- [ ] Implement file upload
- [ ] Add comprehensive testing
- [ ] Deploy to production

---

**Версия**: 1.0.0  
**Последна актуализация**: Ноември 2025  
**Статус**: В разработка