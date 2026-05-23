from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.domain import (
    Achievement,
    DailyLog,
    DailyTask,
    DailyTaskOption,
    NutritionDay,
    TreatSlot,
    UserProfile,
)

USER_ID = "couple-01"
TODAY = date(2026, 5, 23)


def seed_db(db: Session) -> None:
    exists = db.scalar(select(UserProfile).where(UserProfile.id == USER_ID))
    if exists:
        return

    db.add(
        UserProfile(
            id=USER_ID,
            name="Любимая",
            role="participant",
            system_day=1,
            level=1,
            xp=0,
            xp_to_next_level=220,
            stars=0,
            weekly_progress_percent=0,
            is_admin=False,
        )
    )
    db.flush()

    for offset in range(6, -1, -1):
        log_date = TODAY - timedelta(days=offset)
        db.add(
            DailyLog(
                user_id=USER_ID,
                log_date=log_date,
                water_liters=0,
                water_goal_liters=2.5,
                steps=0,
                activity_goal=6500,
                calories_burned=0,
                nutrition_in_plan=True,
                mood="calm",
                unplanned_food=False,
                returned_to_plan=False,
            )
        )
        db.add(
            NutritionDay(
                user_id=USER_ID,
                log_date=log_date,
                calorie_goal=1850,
                protein_goal=105,
                fat_goal=62,
                carbs_goal=205,
            )
        )

    db.add(
        TreatSlot(
            id="weekly-treat",
            user_id=USER_ID,
            status="locked",
            available_at=TODAY,
            days_until_available=0,
        )
    )

    tasks = [
        (
            "plank-video",
            "Видео планки",
            "Выбрать время и отправить на проверку. Звезды начисляет админ после доказательства.",
            "proof",
            [("1m", "1 минута", 15), ("2m", "2 минуты", 25), ("3m", "3 минуты", 40)],
        ),
        (
            "walk",
            "Прогулка",
            "Выбрать длительность прогулки и отправить на проверку.",
            "movement",
            [("20", "20 минут", 15), ("40", "40 минут", 25), ("60", "60 минут", 35)],
        ),
        (
            "water",
            "Вода в ритме",
            "Выбрать объем воды и отправить на проверку.",
            "water",
            [("05", "+0.5 л", 10), ("1", "+1 л", 18), ("goal", "закрыть цель", 25)],
        ),
        (
            "food-photo",
            "Фото еды",
            "Сфоткать прием пищи для честной отметки и отправить на проверку.",
            "food",
            [("one", "1 прием", 8), ("two", "2 приема", 14), ("all", "весь день", 25)],
        ),
    ]
    for task_id, title, description, category, options in tasks:
        db.add(
            DailyTask(
                id=task_id,
                title=title,
                description=description,
                category=category,
                selected_option_id=options[0][0],
                completed=False,
            )
        )
        for option_id, label, points in options:
            db.add(DailyTaskOption(id=f"{task_id}:{option_id}", task_id=task_id, label=label, points=points))

    for achievement_id, title, description in [
        ("honesty", "Честность", "Отметки без стыда и наказаний"),
        ("water", "Вода в ритме", "Стабильная вода маленькими шагами"),
        ("return", "Возвращение", "Вернуться в план после сложного дня"),
    ]:
        db.add(Achievement(id=achievement_id, title=title, description=description, unlocked=False))

    db.commit()
