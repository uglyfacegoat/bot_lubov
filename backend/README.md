# Backend MVP

FastAPI backend for the Telegram Mini App MVP.

## Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Telegram bot

```bash
cd backend
.venv\Scripts\activate
python -m app.bot
```

For a real Telegram Mini App button, `APP_TELEGRAM_WEBAPP_URL` must be a public HTTPS URL. A local `127.0.0.1` URL is only useful for local browser checks.

API docs:

```text
http://127.0.0.1:8000/docs
```

Frontend API base URL:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
