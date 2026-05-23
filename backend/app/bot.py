from __future__ import annotations

import asyncio
import logging
import socket
from typing import Any

import httpx
from sqlalchemy.orm import Session

from app.core import get_settings
from app.db.init_db import init_db
from app.db.seed import seed_db
from app.db.session import SessionLocal
from app.models.domain import UserProfile

logger = logging.getLogger(__name__)


class TelegramBot:
    def __init__(self) -> None:
        self.settings = get_settings()
        if not self.settings.telegram_bot_token:
            raise RuntimeError("APP_TELEGRAM_BOT_TOKEN is not set")
        self.base_url = f"https://api.telegram.org/bot{self.settings.telegram_bot_token}"
        self.offset = 0

    async def run(self) -> None:
        logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
        await self._setup_commands()
        logger.info("Telegram bot polling started")
        async with httpx.AsyncClient(timeout=35) as client:
            while True:
                try:
                    updates = await self._get_updates(client)
                    for update in updates:
                        self.offset = max(self.offset, update["update_id"] + 1)
                        await self._handle_update(client, update)
                except Exception:
                    logger.exception("Polling error")
                    await asyncio.sleep(2)

    async def _get_updates(self, client: httpx.AsyncClient) -> list[dict[str, Any]]:
        response = await client.post(
            f"{self.base_url}/getUpdates",
            json={"offset": self.offset, "timeout": 30, "allowed_updates": ["message", "web_app_data"]},
        )
        response.raise_for_status()
        payload = response.json()
        if not payload.get("ok"):
            raise RuntimeError(payload)
        return payload.get("result", [])

    async def _handle_update(self, client: httpx.AsyncClient, update: dict[str, Any]) -> None:
        message = update.get("message")
        if not message:
            return

        chat_id = message["chat"]["id"]
        telegram_id = message["from"]["id"]
        text = (message.get("text") or "").strip()

        if telegram_id not in self.allowed_ids:
            await self._send_message(
                client,
                chat_id,
                "Доступ закрыт. Этот бот подключен только для пары.",
            )
            return

        if text.startswith("/start"):
            await self._send_start(client, chat_id, telegram_id)
        elif text.startswith("/app"):
            await self._send_app_button(client, chat_id, telegram_id)
        elif text.startswith("/admin"):
            await self._send_admin(client, chat_id, telegram_id)
        elif text.startswith("/id"):
            await self._send_message(client, chat_id, f"Твой Telegram ID: {telegram_id}")
        else:
            await self._send_message(
                client,
                chat_id,
                "Команды: /app открыть приложение, /admin админ-панель, /id показать Telegram ID.",
                reply_markup=self._main_keyboard(telegram_id),
            )

    @property
    def allowed_ids(self) -> set[int]:
        return {
            item
            for item in [self.settings.telegram_admin_id, self.settings.telegram_user_id]
            if item is not None
        }

    def _role_for(self, telegram_id: int) -> str:
        if telegram_id == self.settings.telegram_admin_id:
            return "admin"
        return "participant"

    async def _send_start(self, client: httpx.AsyncClient, chat_id: int, telegram_id: int) -> None:
        role = "админ" if self._role_for(telegram_id) == "admin" else "участник"
        text = (
            f"Привет. Роль: {role}.\n\n"
            "Это MVP системы: питание, вода, активность, задания, магазин наград и прогресс без наказаний."
        )
        await self._send_message(client, chat_id, text, reply_markup=self._main_keyboard(telegram_id))

    async def _send_app_button(self, client: httpx.AsyncClient, chat_id: int, telegram_id: int) -> None:
        url = self.settings.telegram_webapp_url
        text = "Открыть Mini App:"
        if not url.startswith("https://"):
            text += "\n\nСейчас указан локальный URL. Для открытия внутри Telegram нужен публичный HTTPS URL."
        await self._send_message(client, chat_id, text, reply_markup=self._main_keyboard(telegram_id))

    async def _send_admin(self, client: httpx.AsyncClient, chat_id: int, telegram_id: int) -> None:
        if telegram_id != self.settings.telegram_admin_id:
            await self._send_message(client, chat_id, "Админка доступна только тебе.")
            return

        with SessionLocal() as db:
            profile = db.get(UserProfile, "couple-01")
            if not profile:
                await self._send_message(client, chat_id, "Профиль не найден. Запусти seed базы.")
                return
            text = (
                "Админ-сводка\n\n"
                f"Уровень: {profile.level}\n"
                f"XP: {profile.xp}/{profile.xp_to_next_level}\n"
                f"Звезды: {profile.stars}\n"
                f"Прогресс недели: {profile.weekly_progress_percent}%"
            )
        await self._send_message(client, chat_id, text, reply_markup=self._main_keyboard(telegram_id))

    def _main_keyboard(self, telegram_id: int) -> dict[str, Any]:
        app_url = self.settings.telegram_webapp_url
        if app_url.startswith("https://"):
            app_button: dict[str, Any] = {"text": "Открыть приложение", "web_app": {"url": app_url}}
        else:
            app_button = {"text": "Открыть локальный URL", "url": app_url}

        rows: list[list[dict[str, Any]]] = [[app_button]]
        if telegram_id == self.settings.telegram_admin_id:
            rows.append([{"text": "Админ: открыть", "url": app_url}])
        return {"inline_keyboard": rows}

    async def _send_message(
        self,
        client: httpx.AsyncClient,
        chat_id: int,
        text: str,
        reply_markup: dict[str, Any] | None = None,
    ) -> None:
        payload: dict[str, Any] = {"chat_id": chat_id, "text": text}
        if reply_markup:
            payload["reply_markup"] = reply_markup
        response = await client.post(f"{self.base_url}/sendMessage", json=payload)
        response.raise_for_status()

    async def _setup_commands(self) -> None:
        async with httpx.AsyncClient(timeout=15) as client:
            await client.post(
                f"{self.base_url}/setMyCommands",
                json={
                    "commands": [
                        {"command": "start", "description": "Запуск"},
                        {"command": "app", "description": "Открыть приложение"},
                        {"command": "admin", "description": "Админ-сводка"},
                        {"command": "id", "description": "Показать Telegram ID"},
                    ]
                },
            )
            if self.settings.telegram_webapp_url.startswith("https://"):
                await client.post(
                    f"{self.base_url}/setChatMenuButton",
                    json={
                        "menu_button": {
                            "type": "web_app",
                            "text": "Mini App",
                            "web_app": {"url": self.settings.telegram_webapp_url},
                        }
                    },
                )


async def main() -> None:
    lock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        lock.bind(("127.0.0.1", 8765))
        lock.listen(1)
    except OSError:
        return

    init_db()
    with SessionLocal() as db:
        seed_db(db)
    await TelegramBot().run()


if __name__ == "__main__":
    asyncio.run(main())
