# Love Habit Mini App

MVP Telegram Mini App для мягкой геймифицированной системы привычек, воды, активности, питания, вкусного слота, заданий дня и магазина наград.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Zustand, Framer Motion, Recharts
- Backend: FastAPI, SQLAlchemy, SQLite locally
- Telegram: safe WebApp helper on frontend, bot long polling on backend

## Frontend

```bash
npm install
npm run dev
npm run build
```

Optional API env:

```bash
VITE_API_BASE_URL=https://your-backend-url.com/api
```

If `VITE_API_BASE_URL` is not set, frontend uses `http://127.0.0.1:8000/api`.

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python scripts\init_db.py
.venv\Scripts\uvicorn app.main:app --reload
```

Local env goes into `backend/.env` and must not be committed:

```bash
APP_TELEGRAM_BOT_TOKEN=...
APP_TELEGRAM_USER_ID=408254038
APP_TELEGRAM_ADMIN_ID=989807462
APP_TELEGRAM_WEBAPP_URL=https://your-frontend-url.vercel.app
```

Run bot locally:

```bash
cd backend
.venv\Scripts\python -m app.bot
```

## Deploy Notes

Recommended free MVP path:

- Frontend: Vercel
- Backend: Render, Koyeb, Railway trial, or a small VPS later
- Database: Supabase Postgres free tier

For Vercel:

1. Import this GitHub repository.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_BASE_URL` after backend is deployed.

For production Telegram Mini App, `APP_TELEGRAM_WEBAPP_URL` must be a public HTTPS frontend URL.
