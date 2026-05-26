# VPS deploy

This setup runs the Mini App on one HTTPS domain:

- `web`: built React app served by Caddy
- `api`: FastAPI backend behind `/api`
- `db`: local Postgres database stored in a Docker volume
- Caddy automatically gets and renews TLS certificates

## DNS

Point your domain or subdomain to the VPS IP:

```text
A record: your-domain -> 87.251.78.178
```

Telegram Mini Apps need HTTPS, so using only the raw IP is not enough for the final setup.

## First server setup

SSH into the VPS as root, install Docker, then clone the repo:

```bash
ssh root@87.251.78.178

apt update
apt install -y ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Clone the app into the default deploy directory:

```bash
mkdir -p /opt
cd /opt
git clone https://github.com/uglyfacegoat/bot_lubov.git
cd bot_lubov
cp .env.production.example .env.production
```

Edit `.env.production`:

- `APP_DOMAIN`: your domain, for example `love.example.com`
- `APP_TELEGRAM_WEBAPP_URL`: `https://your-domain`
- `POSTGRES_PASSWORD`: long random database password
- `APP_DATABASE_URL`: local Docker Postgres URL with the same password
- `APP_TELEGRAM_BOT_TOKEN`: Telegram bot token
- `APP_TELEGRAM_WEBHOOK_SECRET`: long random string
- `APP_CORS_ORIGINS`: `["https://your-domain"]`

Start the app:

```bash
docker compose --env-file .env.production up -d --build
docker compose --env-file .env.production logs -f
```

Health check:

```bash
curl https://your-domain/api/health
```

## Auto deploy from GitHub

After the first server setup, add these repository secrets in GitHub:

```text
VPS_HOST=87.251.78.178
VPS_USER=root
VPS_APP_DIR=/opt/bot_lubov
VPS_SSH_KEY=<private SSH key that can login to the VPS>
```

Then every push to `main` will automatically run:

```bash
git fetch origin main
git reset --hard origin/main
docker compose --env-file .env.production up -d --build
```

Important: `.env.production` stays only on the server and is not committed.

## Local Postgres

The production setup does not require Supabase. Postgres runs on the VPS inside Docker:

```text
postgres_data -> /var/lib/postgresql/data
```

Do not delete the `postgres_data` Docker volume unless you intentionally want to wipe production data.

## Telegram webhook

After the domain is online, set the webhook:

```bash
curl "https://api.telegram.org/bot$APP_TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-domain/api/telegram/webhook","secret_token":"replace_with_long_random_secret"}'
```

Then update the Mini App URL in BotFather to:

```text
https://your-domain
```

## Deploy updates

```bash
git pull
docker compose --env-file .env.production up -d --build
docker compose --env-file .env.production logs -f
```
