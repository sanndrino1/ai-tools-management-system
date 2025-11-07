# AI Tools Management System - Installation Guide

## Quick Start

Follow these steps to get the full-stack application running:

### 1. Install Project Dependencies

```bash
# Navigate to project root
cd c:\Users\Lebovo\Documents\ai-tools-fullstack

# Install Node.js dependencies (for development scripts)
npm install

# Install backend dependencies (Laravel)
npm run setup:backend

# Install frontend dependencies (Next.js)
npm run setup:frontend
```

### 2. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the database schema from `docs/supabase-schema.sql`
3. Run it in the Supabase SQL Editor
4. Get your project URL and anon key from Settings > API

### 3. Configure Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### 4. Configure Frontend (.env.local)

```bash
cd frontend
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api
```

### 5. Start Development Servers

```bash
# From project root - starts both frontend and backend
npm run dev

# Or start separately:
npm run dev:frontend  # Next.js on http://localhost:3000
npm run dev:backend   # Laravel on http://localhost:8000
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Supabase Dashboard: https://app.supabase.com

## Development Commands

```bash
# Setup everything
npm run setup

# Development
npm run dev              # Start both servers
npm run dev:frontend    # Next.js only
npm run dev:backend     # Laravel only

# Building
npm run build           # Build both
npm run build:frontend # Next.js build
npm run build:backend  # Laravel cache

# Testing
npm run test           # Test both
npm run test:frontend # Next.js tests
npm run test:backend  # Laravel tests

# Database
npm run migrate        # Run Laravel migrations
```

## Project Structure

```
ai-tools-fullstack/
├── frontend/          # Next.js 14 application
├── backend/           # Laravel 11 API
├── docs/             # Documentation & schemas
├── package.json      # Root development scripts
└── README.md         # This file
```

## Next Steps

1. Complete the setup steps above
2. Check `docs/SETUP.md` for detailed configuration
3. Review API documentation in `backend/routes/api.php`
4. Explore the frontend components in `frontend/components/`

## Support

If you encounter issues:
1. Check the logs in both frontend and backend terminals
2. Verify Supabase connection in the dashboard
3. Ensure all environment variables are set correctly
4. Review the detailed setup guide in `docs/SETUP.md`