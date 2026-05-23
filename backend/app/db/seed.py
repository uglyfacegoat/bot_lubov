from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.domain import (
    Achievement,
    DailyLog,
    DailyTask,
    DailyTaskOption,
    MealItem,
    NutritionDay,
    Reward,
    TreatSlot,
    UserProfile,
    WeightLog,
)

USER_ID = "couple-01"


def seed_db(db: Session) -> None:
    exists = db.scalar(select(UserProfile).where(UserProfile.id == USER_ID))
    if exists:
        return

    db.add(
        UserProfile(
            id=USER_ID,
            name="Любимая",
            role="participant",
            system_day=8,
            level=3,
            xp=360,
            xp_to_next_level=520,
            stars=820,
            weekly_progress_percent=78,
            is_admin=True,
        )
    )

    db.flush()

    daily_logs = [
        ("2026-05-17", 2.0, 6900, 2140, True, "calm"),
        ("2026-05-18", 1.6, 6200, 2070, True, "good"),
        ("2026-05-19", 2.0, 7800, 2220, True, "inspired"),
        ("2026-05-20", 2.5, 7100, 2160, True, "calm"),
        ("2026-05-21", 2.1, 6500, 2110, False, "tired"),
        ("2026-05-22", 1.7, 6200, 2060, True, "good"),
        ("2026-05-23", 1.1, 6200, 2050, True, "calm"),
    ]
    for log_date, water, steps, burned, in_plan, mood in daily_logs:
        db.add(
            DailyLog(
                user_id=USER_ID,
                log_date=date.fromisoformat(log_date),
                water_liters=water,
                water_goal_liters=2.5,
                steps=steps,
                activity_goal=6500,
                calories_burned=burned,
                nutrition_in_plan=in_plan,
                mood=mood,
                unplanned_food=not in_plan,
                returned_to_plan=not in_plan,
            )
        )

    nutrition_payload = {
        "2026-05-17": [("d17", "dinner", "День в плане", "суммарно", 1760, 98, 58, 196)],
        "2026-05-18": [("d18", "dinner", "День в плане", "суммарно", 1680, 102, 54, 181)],
        "2026-05-19": [("d19", "dinner", "День в плане", "суммарно", 1810, 108, 61, 202)],
        "2026-05-20": [("d20", "dinner", "День в плане", "суммарно", 1740, 101, 55, 194)],
        "2026-05-21": [("d21", "dinner", "Внеплановая еда отмечена", "суммарно", 2040, 92, 78, 232)],
        "2026-05-22": [("d22", "dinner", "День в плане", "суммарно", 1710, 100, 56, 188)],
        "2026-05-23": [
            ("m1", "breakfast", "Греческий йогурт, ягоды, гранола", "280 г", 360, 28, 9, 42),
            ("m2", "lunch", "Курица, рис, салат", "1 порция", 520, 42, 14, 58),
            ("m3", "snack", "Капучино и банан", "1 набор", 210, 6, 6, 34),
            ("m4", "dinner", "Рыба, картофель, овощи", "1 порция", 430, 34, 13, 42),
        ],
    }
    for log_date, meals in nutrition_payload.items():
        nutrition_day = NutritionDay(
            user_id=USER_ID,
            log_date=date.fromisoformat(log_date),
            calorie_goal=1850,
            protein_goal=105,
            fat_goal=62,
            carbs_goal=205,
        )
        db.add(nutrition_day)
        db.flush()
        for meal_id, meal, name, amount, calories, protein, fat, carbs in meals:
            db.add(
                MealItem(
                    id=meal_id,
                    nutrition_day_id=nutrition_day.id,
                    meal=meal,
                    name=name,
                    amount=amount,
                    calories=calories,
                    protein=protein,
                    fat=fat,
                    carbs=carbs,
                )
            )

    for log_date, weight, note in [
        ("2026-04-27", 72.4, "Стартовая точка недели"),
        ("2026-05-04", 72.1, "Спокойная неделя"),
        ("2026-05-11", 71.8, "Больше воды и прогулок"),
        ("2026-05-18", 71.6, "Данные, не оценка"),
    ]:
        db.add(WeightLog(user_id=USER_ID, log_date=date.fromisoformat(log_date), weight_kg=weight, note=note))

    db.add(
        TreatSlot(
            id="weekly-treat",
            user_id=USER_ID,
            status="locked",
            available_at=date.fromisoformat("2026-05-26"),
            days_until_available=3,
        )
    )

    rewards = [
        ("movie", "Выбрать фильм", 150, "Вечер без споров по жанру"),
        ("coffee", "Кофе или напиток", 250, "Любимый напиток в красивом месте"),
        ("flowers", "Цветы", 400, "Букет без повода"),
        ("date", "Свидание", 500, "Планируем вечер только для нас"),
        ("home-spa", "Домашний spa-вечер", 350, "Маска, свечи, спокойный вечер"),
        ("breakfast", "Завтрак в городе", 650, "Красивое утро без спешки"),
        ("book", "Книга или ежедневник", 800, "Что-то приятное для себя"),
        ("restaurant-slot", "Ресторан как вкусный слот", 1000, "Праздничный слот внутри плана"),
        ("perfume", "Духи или аромат", 2200, "Выбрать аромат настроения"),
        ("massage", "Массаж", 3500, "Восстановление вместо давления"),
        ("weekend-hotel", "Ночь в отеле", 6500, "Мини-перезагрузка для двоих"),
    ]
    for reward_id, title, price, description in rewards:
        db.add(Reward(id=reward_id, title=title, price=price, description=description, purchased_count=0))

    tasks = [
        (
            "plank-video",
            "Видео планки",
            "Записать короткое видео. Не как экзамен, а как отметку силы.",
            "proof",
            [("1m", "1 минута", 15), ("2m", "2 минуты", 25), ("3m", "3 минуты", 40)],
        ),
        (
            "walk",
            "Прогулка",
            "Спокойно пройтись без цели наказать себя.",
            "movement",
            [("20", "20 минут", 15), ("40", "40 минут", 25), ("60", "60 минут", 35)],
        ),
        (
            "water",
            "Вода в ритме",
            "Добрать воду маленькими шагами.",
            "water",
            [("05", "+0.5 л", 10), ("1", "+1 л", 18), ("goal", "закрыть цель", 25)],
        ),
        (
            "food-photo",
            "Фото еды",
            "Сфоткать прием пищи для честной отметки.",
            "food",
            [("one", "1 прием", 8), ("two", "2 приема", 14), ("all", "весь день", 25)],
        ),
    ]
    for task_id, title, description, category, options in tasks:
        task = DailyTask(
            id=task_id,
            title=title,
            description=description,
            category=category,
            selected_option_id=options[0][0],
            completed=False,
        )
        db.add(task)
        for option_id, label, points in options:
            db.add(DailyTaskOption(id=f"{task_id}:{option_id}", task_id=task_id, label=label, points=points))

    for achievement_id, title, description in [
        ("honesty", "Честность", "Отметки без стыда и наказаний"),
        ("water", "Вода в ритме", "5 дней близко к цели"),
        ("return", "Возвращение", "Вернуться в план после сложного дня"),
    ]:
        db.add(Achievement(id=achievement_id, title=title, description=description, unlocked=True))

    db.commit()
