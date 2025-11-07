# 🚀 AI Tools Management System

Централизирана платформа за управление на AI инструменти в организацията с role-based достъп, 2FA authentication и comprehensive audit система.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Съдържание

- [Функционалности](#-функционалности)
- [Инсталация](#-инсталация)
- [Docker Setup](#-docker-setup)
- [Ролева система](#-ролева-система)
- [Използване](#-използване)
- [API Документация](#-api-документация)
- [AI Агенти](#-ai-агенти)
- [Deployment](#-deployment)

## ✨ Функционалности

### 🔐 Сигурност
- **2FA Email Authentication** - Безпаролов вход с email код
- **Role-based Access Control** - 6 роли с различни права
- **Route Protection** - Middleware за защита на endpoints
- **Audit Logging** - Проследяване на всички действия

### 👑 Админ панел
- **Tool Management** - Одобрение/отказ на инструменти
- **User Management** - Управление на потребители и роли
- **Statistics Dashboard** - Real-time статистики и analytics
- **Export Functionality** - CSV/JSON експорт на данни

### ⚡ Performance
- **Redis Caching** - Автоматично кеширане на данни
- **Optimized Queries** - Ефективни database заявки
- **Lazy Loading** - Постепенно зареждане на компоненти
- **CDN Ready** - Готов за CDN интеграция

### 📱 User Experience
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - Live notifications
- **Dark/Light Mode** - Theme switching
- **Accessibility** - WCAG 2.1 compliant

## 🛠️ Технологии

- **Frontend:** Next.js 14.2.33 + TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Mock 2FA + JWT-like tokens
- **Caching:** MockRedis (ready for real Redis)
- **Database:** Mock data (ready for PostgreSQL/MySQL)
- **Deployment:** Docker + Docker Compose

## �️ Инсталация

### Предварителни изисквания

- **Node.js** >= 18.0.0
- **npm** или **yarn**
- **Git**

### Локална инсталация

1. **Клониране на репозиторията**
```bash
git clone <repository-url>
cd model-nextjs
```

2. **Инсталиране на dependencies**
```bash
npm install
# или
yarn install
```

3. **Environment конфигурация**
```bash
# Копирай .env.example в .env.local
cp .env.example .env.local
```

4. **Стартиране на приложението**
```bash
npm run dev
# или
yarn dev
```

Приложението ще стартира на http://localhost:3000

## 🐳 Docker Setup

### Бързо стартиране

```bash
# Стартиране с Docker Compose
docker-compose up -d

# Спиране
docker-compose down
```

### Development Environment

```bash
# Development mode с hot reload
docker-compose -f docker-compose.dev.yml up
```

## 👥 Ролева система

### Роли и права

| Роля | Описание | Права |
|------|----------|-------|
| **Owner** | Собственик на системата | Всички права + User management |
| **PM** | Project Manager | Tool approval + Team management |
| **Backend** | Backend Developer | Code tools + Backend resources |
| **Frontend** | Frontend Developer | UI tools + Frontend resources |
| **QA** | Quality Assurance | Testing tools + QA resources |
| **Designer** | UI/UX Designer | Design tools + Creative resources |

### Защитени страници

```
/admin/*          → PM, Owner
/admin/users      → Owner only
/admin/settings   → Owner only
/dashboard        → Всички authenticated
/profile          → Всички authenticated
/team             → Всички authenticated
```

### Test accounts

| Email | Роля | Достъп |
|-------|------|--------|
| owner@company.com | Owner | Пълен достъп |
| pm@company.com | PM | Admin panel access |
| dev@company.com | Backend | Developer tools |
| designer@company.com | Designer | Design tools |

## 📁 Структура на проекта

```
model-nextjs/
├── app/                          # Next.js страници
│   ├── auth/login/              # Страница за вход
│   ├── dashboard/               # Главен Dashboard с български интерфейс
│   └── admin/                   # Админ панел
├── laravel/                     # Laravel backend
│   ├── app/Models/User.php      # Модел на потребители с роли
│   ├── app/Http/Controllers/    # API контролери
│   └── database/               # Миграции и seeders
├── docker/                      # Docker конфигурация
│   ├── Dockerfile              # Laravel контейнер
│   ├── Dockerfile.frontend     # Next.js контейнер
│   ├── nginx/                  # Nginx настройки
│   └── mysql/                  # MySQL настройки
├── docker-compose.yml          # Главна Docker конфигурация
├── START_SYSTEM.bat            # Лесно стартиране
├── STOP_SYSTEM.bat             # Лесно спиране
└── QUICK_START.md              # Кратко ръководство
```

## 🎯 Dashboard функции

### Персонализиран поздрав по роли:
- **Owner:** "Добре дошъл, [име]! Ти си Собственик и управляваш цялата компания."
- **PM:** "Добре дошъл, [име]! Ти си Проект Мениджър и координираш екипа."
- **Backend:** "Добре дошъл, [име]! Ти си Backend разработчик и изграждаш сървърната логика."
- **Frontend:** "Добре дошъл, [име]! Ти си Frontend разработчик и създаваш потребителския интерфейс."
- **QA:** "Добре дошъл, [име]! Ти си QA специалист и осигуряваш качеството на продукта."
- **Designer:** "Добре дошъл, [име]! Ти си Дизайнер и създаваш визуалната концепция."

### Роле-специфични бутони:
Всяка роля има 4 уникални бутона с подходящи функции и български надписи.

## 🔧 Управление на системата

### Стартиране:
```bash
START_SYSTEM.bat              # Windows батч файл
# или
docker compose up -d          # Ръчно
```

### Спиране:
```bash
STOP_SYSTEM.bat               # Windows батч файл  
# или
docker compose down           # Ръчно
```

### Проверка на състоянието:
```bash
docker compose ps            # Статус на контейнерите
docker compose logs          # Логове от всички услуги
```

## 📖 Документация

- **QUICK_START.md** - Бърз старт за новаци
- **DOCKER_INSTALLATION_GUIDE.md** - Подробно ръководство за Docker
- **DASHBOARD_TESTING_GUIDE.md** - Тестване на Dashboard функциите
- **FORTIFY_READY.md** - Laravel Fortify настройки
- **PROJECT_COMPLETION.md** - Статус на проекта

## 🔐 Сигурност

- Laravel Fortify автентификация
- JWT токени за API
- Роле-базирани разрешения
- CORS защита
- Хеширани пароли

## 🌐 API Endpoints

```bash
POST /api/login              # Вход
POST /api/logout             # Изход
GET  /api/user               # Потребителска информация
GET  /api/permissions        # Разрешения на потребителя
GET  /api/team               # Екипна информация
```

## 💡 Следващи стъпки

1. **Функционалност на бутоните** - Добавяне на реални страници
2. **Файлово управление** - Upload и споделяне на файлове
3. **Екипен чат** - Комуникация между членовете
4. **Проектно управление** - Tasks, deadline, progress tracking
5. **Нотификации** - Real-time известия

## 🆘 Поддръжка

Ако срещнете проблеми:
1. Проверете дали Docker Desktop работи
2. Уверете се, че портовете не се използват от други приложения
3. Рестартирайте Docker Desktop
4. Вижте подробните ръководства в папката

---

**🎉 Готово! Влезте в системата и тествайте персонализирания български Dashboard!**