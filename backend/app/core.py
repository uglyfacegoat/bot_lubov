from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Couple Habits MVP API"
    database_url: str = f"sqlite:///{Path(__file__).resolve().parents[1] / 'app.db'}"
    cors_origins: list[str] = [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "https://bot-lubov-d825.vercel.app",
    ]
    telegram_bot_token: str | None = None
    telegram_admin_id: int | None = None
    telegram_user_id: int | None = None
    telegram_webapp_url: str = "http://127.0.0.1:5173"
    telegram_webhook_secret: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_")


@lru_cache
def get_settings() -> Settings:
    return Settings()
