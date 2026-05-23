from sqlalchemy.orm import Session

from app.models.domain import DailyLog, MealItem, NutritionDay, UserProfile


def award_points(profile: UserProfile, points: int) -> None:
    if points <= 0:
        return

    profile.stars += points
    profile.xp += points
    while profile.xp >= profile.xp_to_next_level:
        profile.xp -= profile.xp_to_next_level
        profile.level += 1
        profile.xp_to_next_level = int(profile.xp_to_next_level * 1.12)


def nutrition_totals(nutrition_day: NutritionDay | None) -> dict[str, int]:
    if nutrition_day is None:
        return {"calories": 0, "protein": 0, "fat": 0, "carbs": 0}

    meals: list[MealItem] = nutrition_day.meals
    return {
        "calories": sum(meal.calories for meal in meals),
        "protein": sum(meal.protein for meal in meals),
        "fat": sum(meal.fat for meal in meals),
        "carbs": sum(meal.carbs for meal in meals),
    }


def calculate_day_score(log: DailyLog, eaten: int, burned: int) -> int:
    balance = burned - eaten
    score = 0
    score += 30 if log.water_liters >= log.water_goal_liters else round((log.water_liters / log.water_goal_liters) * 20)
    score += 30 if log.steps >= log.activity_goal else round((log.steps / log.activity_goal) * 20)
    score += 25 if balance >= 0 else 10
    score += 15 if log.nutrition_in_plan else 8
    return min(max(score, 0), 100)


def refresh_weekly_progress(db: Session, profile: UserProfile, logs: list[DailyLog]) -> None:
    if not logs:
        profile.weekly_progress_percent = 0
        return

    total = 0
    for log in logs:
        nutrition = (
            db.query(NutritionDay)
            .filter(NutritionDay.user_id == profile.id, NutritionDay.log_date == log.log_date)
            .first()
        )
        eaten = nutrition_totals(nutrition)["calories"]
        burned = log.calories_burned or round(1850 + log.steps * 0.045)
        total += calculate_day_score(log, eaten, burned)

    profile.weekly_progress_percent = round(total / len(logs))
