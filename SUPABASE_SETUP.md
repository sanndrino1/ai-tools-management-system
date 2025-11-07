## Supabase Configuration Steps

### 1. Apply Database Schema
Copy and paste the entire content from `docs/supabase-schema.sql` into the Supabase SQL Editor and run it.

### 2. Get Your Credentials
From Supabase Project Settings > API:

- **Project URL**: `https://ztvykfgbrkhkrpymbdvi.supabase.co`
- **Anon Key**: (copy from API settings)
- **Service Role Key**: (copy from API settings - for backend only)

### 3. Configure Frontend Environment

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ztvykfgbrkhkrpymbdvi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api
```

### 4. Test Database Connection

After running the schema, you should see these tables in your Database tab:
- ✅ categories
- ✅ tools  
- ✅ user_profiles
- ✅ ratings
- ✅ comments
- ✅ comment_votes
- ✅ audit_logs

### 5. Enable Authentication

Go to Authentication > Settings and enable:
- ✅ Email confirmations
- ✅ Enable email auth
- Configure email templates (optional)

### 6. Test Frontend Connection

```bash
cd frontend
npm run dev
```

The app should connect to Supabase and you should be able to:
- ✅ Register/Login users
- ✅ View seeded categories
- ✅ Add new tools (after authentication)

### Next Steps

Once Supabase is working:
1. Install PHP + Composer for backend
2. Configure Laravel backend
3. Deploy to production

Your Supabase project is ready! 🚀