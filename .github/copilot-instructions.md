## Quick agent guide — AI Tools Management System

This project is a full-stack Next.js (frontend) + Laravel (backend) platform with Supabase for DB/auth and Docker for local runs. Keep guidance concise and tied to actual files and commands.

- Big picture: frontend in `frontend/` (Next.js 14, App Router, TypeScript, Tailwind). backend in `backend/` (Laravel 11, PHP 8.2). Supabase provides PostgreSQL, auth and realtime. Docker configs live at `docker/` and `docker-compose.yml` at repo root.

- When editing Frontend UI or API calls:
  - Use `frontend/app/` (App Router) and `frontend/lib/` for shared utilities and types.
  - API base URL = `NEXT_PUBLIC_API_URL` (see `frontend/.env.local` convention). Example: fetch `${process.env.NEXT_PUBLIC_API_URL}/tools`.

- When editing Backend:
  - Laravel code is under `backend/app/`, routes under `backend/routes/`, and migrations/seeders in `backend/database/`.
  - Common dev commands: `cd backend && composer install`, `php artisan migrate`, `php artisan serve` (API on http://localhost:8000).

- Dev run options (pick one):
  - Local (manual):
    - Backend: `cd backend && composer install && php artisan migrate && php artisan serve`
    - Frontend: `cd frontend && npm install && npm run dev` (http://localhost:3000)
  - Docker-based: `docker compose up --build` (root). Windows helper scripts: `START_SYSTEM.bat` / `STOP_SYSTEM.bat`.

- Integration & important patterns to preserve:
  - Authentication: Supabase Auth is the source of truth; Laravel uses Sanctum/JWT-style tokens. Tokens and Supabase keys live in `.env` / `.env.local` variables (see README examples). Don't hardcode keys.
  - Real-time: Supabase realtime subscriptions are used for notifications/comments; check frontend code in `frontend/app/*` for subscription usage and `frontend/lib/` for Supabase client wrappers.
  - File uploads: use Supabase Storage (backend passes file metadata; frontend uses client keys scoped by env vars).

- Naming & structural conventions:
  - Frontend uses `app/` (Next.js App Router) and `components/` for UI pieces.
  - Backend follows standard Laravel layout (models in `app/Models`, controllers in `app/Http/Controllers`). Look at `backend/database/` for schema shape (Tools, Categories, Ratings, Comments, Audit_logs, User_roles).
  - Role-based access: 6 roles (Owner, PM, Backend, Frontend, QA, Designer). Protected routes live under `/admin/*` and are guarded by middleware — mirror checks when adding APIs.

- Quick examples to copy/paste:
  - Frontend API fetch: `const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools`);`
  - Run migrations (backend): `cd backend && php artisan migrate`
  - Start full system (Docker): `docker compose up -d` (or `START_SYSTEM.bat` on Windows)

- Where to look for docs and tests:
  - Project overview and env examples: root `README.md` and `frontend/README.md`.
  - API docs: `docs/api/` and `frontend/DEMO_API_EXAMPLES.json`.

- Safety / what NOT to change without review:
  - Supabase project settings, keys, and secret env vars.
  - Database migrations in `backend/database/` (Coordinate DB schema changes with migration files and seeders).
  - Auth flow (Supabase + Sanctum) — altering token handling requires full end-to-end checks.

- When adding features or agents, include:
  - Short 2–3 line summary in `docs/` describing purpose and data flows.
  - Example env vars required and which component needs them.
  - A tiny manual verification step: endpoint, request sample, and expected success response.

If anything in this guide is unclear or you want more examples (e.g., a sample fetch/response for a specific endpoint or where to add a new migration), tell me which part to expand and I will iterate.
