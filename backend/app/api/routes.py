from datetime import date
from typing import Any

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.bot import TelegramBot
from app.core import get_settings
from app.db.session import get_db
from app.models.domain import (
    Achievement,
    DailyLog,
    DailyTask,
    DailyTaskOption,
    NutritionDay,
    Reward,
    TreatSlot,
    UserProfile,
    WeightLog,
)
from app.schemas.domain import (
    AchievementOut,
    AdminDailyLogIn,
    AdminPointsIn,
    AdminTreatSlotIn,
    AdminWeightIn,
    DailyLogOut,
    DailyTaskOut,
    DashboardOut,
    ProgressDayOut,
    ProgressOut,
    RewardCreateIn,
    RewardOut,
    TaskSelectIn,
    TreatSlotOut,
    UserProfileOut,
    WaterChangeIn,
    WeightLogOut,
)
from app.services.game import award_points, calculate_day_score, nutrition_totals, refresh_weekly_progress

router = APIRouter(prefix="/api")
USER_ID = "couple-01"


def get_profile(db: Session) -> UserProfile:
    profile = db.get(UserProfile, USER_ID)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found. Run seed first.")
    return profile


def get_today_log(db: Session) -> DailyLog:
    log = db.scalars(select(DailyLog).where(DailyLog.user_id == USER_ID).order_by(DailyLog.log_date.desc())).first()
    if log is None:
        raise HTTPException(status_code=404, detail="Daily log not found")
    return log


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/telegram/webhook")
async def telegram_webhook(
    request: Request,
    x_telegram_bot_api_secret_token: str | None = Header(default=None),
) -> dict[str, bool]:
    settings = get_settings()
    if settings.telegram_webhook_secret and x_telegram_bot_api_secret_token != settings.telegram_webhook_secret:
        raise HTTPException(status_code=403, detail="Invalid Telegram webhook secret")

    update: dict[str, Any] = await request.json()
    async with httpx.AsyncClient(timeout=15) as client:
        await TelegramBot()._handle_update(client, update)
    return {"ok": True}


@router.get("/profile", response_model=UserProfileOut)
def read_profile(db: Session = Depends(get_db)) -> UserProfile:
    return get_profile(db)


@router.get("/dashboard", response_model=DashboardOut)
def read_dashboard(db: Session = Depends(get_db)) -> DashboardOut:
    profile = get_profile(db)
    today = get_today_log(db)
    nutrition = db.scalars(
        select(NutritionDay)
        .options(selectinload(NutritionDay.meals))
        .where(NutritionDay.user_id == USER_ID, NutritionDay.log_date == today.log_date)
    ).first()
    treat_slot = db.scalars(select(TreatSlot).where(TreatSlot.user_id == USER_ID)).first()
    tasks = db.scalars(select(DailyTask).options(selectinload(DailyTask.options))).all()
    if nutrition is None or treat_slot is None:
        raise HTTPException(status_code=404, detail="Dashboard data incomplete")
    return DashboardOut(profile=profile, today=today, nutrition=nutrition, treat_slot=treat_slot, daily_tasks=list(tasks))


@router.get("/progress", response_model=ProgressOut)
def read_progress(db: Session = Depends(get_db)) -> ProgressOut:
    logs = list(db.scalars(select(DailyLog).where(DailyLog.user_id == USER_ID).order_by(DailyLog.log_date)).all())
    nutrition_days = list(
        db.scalars(
            select(NutritionDay)
            .options(selectinload(NutritionDay.meals))
            .where(NutritionDay.user_id == USER_ID)
            .order_by(NutritionDay.log_date)
        ).all()
    )
    weights = list(db.scalars(select(WeightLog).where(WeightLog.user_id == USER_ID).order_by(WeightLog.log_date)).all())
    nutrition_by_date = {item.log_date: item for item in nutrition_days}

    day_reports: list[ProgressDayOut] = []
    for log in logs[-7:]:
        eaten = nutrition_totals(nutrition_by_date.get(log.log_date))["calories"]
        burned = log.calories_burned or round(1850 + log.steps * 0.045)
        day_reports.append(
            ProgressDayOut(
                date=log.log_date,
                eaten=eaten,
                burned=burned,
                balance=burned - eaten,
                score=calculate_day_score(log, eaten, burned),
                water_liters=log.water_liters,
                water_goal_liters=log.water_goal_liters,
                steps=log.steps,
                activity_goal=log.activity_goal,
            )
        )

    return ProgressOut(daily_logs=logs, nutrition_days=nutrition_days, weight_logs=weights, day_reports=day_reports)


@router.post("/water/change", response_model=DailyLogOut)
def change_water(payload: WaterChangeIn, db: Session = Depends(get_db)) -> DailyLog:
    log = get_today_log(db)
    delta = payload.liters if payload.mode == "add" else -payload.liters
    before_goal = log.water_liters >= log.water_goal_liters
    log.water_liters = min(max(round(log.water_liters + delta, 2), 0), log.water_goal_liters)

    profile = get_profile(db)
    if not before_goal and log.water_liters >= log.water_goal_liters:
        award_points(profile, 20)
    refresh_weekly_progress(db, profile, list(db.scalars(select(DailyLog).where(DailyLog.user_id == USER_ID).order_by(DailyLog.log_date)).all())[-7:])
    db.commit()
    db.refresh(log)
    return log


@router.get("/rewards", response_model=list[RewardOut])
def list_rewards(db: Session = Depends(get_db)) -> list[Reward]:
    return list(db.scalars(select(Reward).order_by(Reward.price)).all())


@router.post("/rewards", response_model=RewardOut)
def create_reward(payload: RewardCreateIn, db: Session = Depends(get_db)) -> Reward:
    reward = Reward(
        id=payload.title.lower().replace(" ", "-")[:48],
        title=payload.title,
        price=payload.price,
        description=payload.description,
        purchased_count=0,
    )
    db.add(reward)
    db.commit()
    db.refresh(reward)
    return reward


@router.post("/rewards/{reward_id}/buy", response_model=RewardOut)
def buy_reward(reward_id: str, db: Session = Depends(get_db)) -> Reward:
    profile = get_profile(db)
    reward = db.get(Reward, reward_id)
    if reward is None:
        raise HTTPException(status_code=404, detail="Reward not found")
    if profile.stars < reward.price:
        raise HTTPException(status_code=400, detail="Not enough stars")
    profile.stars -= reward.price
    reward.purchased_count += 1
    db.commit()
    db.refresh(reward)
    return reward


@router.get("/tasks", response_model=list[DailyTaskOut])
def list_tasks(db: Session = Depends(get_db)) -> list[DailyTask]:
    return list(db.scalars(select(DailyTask).options(selectinload(DailyTask.options))).all())


@router.post("/tasks/{task_id}/select", response_model=DailyTaskOut)
def select_task_option(task_id: str, payload: TaskSelectIn, db: Session = Depends(get_db)) -> DailyTask:
    task = db.scalars(select(DailyTask).options(selectinload(DailyTask.options)).where(DailyTask.id == task_id)).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    option_ids = {option.id for option in task.options} | {option.id.split(":", 1)[-1] for option in task.options}
    if payload.option_id not in option_ids:
        raise HTTPException(status_code=400, detail="Option does not belong to task")
    task.selected_option_id = payload.option_id
    db.commit()
    db.refresh(task)
    return task


@router.post("/tasks/{task_id}/complete", response_model=DailyTaskOut)
def complete_task(task_id: str, db: Session = Depends(get_db)) -> DailyTask:
    task = db.scalars(select(DailyTask).options(selectinload(DailyTask.options)).where(DailyTask.id == task_id)).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.completed:
        return task
    task.completed = True
    db.commit()
    db.refresh(task)
    return task


@router.get("/treat-slot", response_model=TreatSlotOut)
def read_treat_slot(db: Session = Depends(get_db)) -> TreatSlot:
    slot = db.scalars(select(TreatSlot).where(TreatSlot.user_id == USER_ID)).first()
    if slot is None:
        raise HTTPException(status_code=404, detail="Treat slot not found")
    return slot


@router.post("/treat-slot/use", response_model=TreatSlotOut)
def use_treat_slot(option: str, db: Session = Depends(get_db)) -> TreatSlot:
    slot = db.scalars(select(TreatSlot).where(TreatSlot.user_id == USER_ID)).first()
    if slot is None:
        raise HTTPException(status_code=404, detail="Treat slot not found")
    slot.status = "used"
    slot.used_at = date.today()
    slot.selected_option = option
    db.commit()
    db.refresh(slot)
    return slot


@router.post("/treat-slot/postpone", response_model=TreatSlotOut)
def postpone_treat_slot(db: Session = Depends(get_db)) -> TreatSlot:
    slot = db.scalars(select(TreatSlot).where(TreatSlot.user_id == USER_ID)).first()
    if slot is None:
        raise HTTPException(status_code=404, detail="Treat slot not found")
    slot.status = "postponed"
    slot.days_until_available = 1
    db.commit()
    db.refresh(slot)
    return slot


@router.get("/achievements", response_model=list[AchievementOut])
def list_achievements(db: Session = Depends(get_db)) -> list[Achievement]:
    return list(db.scalars(select(Achievement)).all())


@router.post("/admin/weight", response_model=WeightLogOut)
def admin_add_weight(payload: AdminWeightIn, db: Session = Depends(get_db)) -> WeightLog:
    weight = WeightLog(user_id=USER_ID, log_date=payload.log_date, weight_kg=payload.weight_kg, note=payload.note)
    db.add(weight)
    db.commit()
    db.refresh(weight)
    return weight


@router.patch("/admin/daily-log", response_model=DailyLogOut)
def admin_update_daily_log(payload: AdminDailyLogIn, db: Session = Depends(get_db)) -> DailyLog:
    log = db.scalars(select(DailyLog).where(DailyLog.user_id == USER_ID, DailyLog.log_date == payload.log_date)).first()
    if log is None:
        log = DailyLog(user_id=USER_ID, log_date=payload.log_date)
        db.add(log)
    for field in [
        "water_liters",
        "steps",
        "calories_burned",
        "nutrition_in_plan",
        "mood",
        "unplanned_food",
        "returned_to_plan",
    ]:
        value = getattr(payload, field)
        if value is not None:
            setattr(log, field, value)
    refresh_weekly_progress(db, get_profile(db), list(db.scalars(select(DailyLog).where(DailyLog.user_id == USER_ID).order_by(DailyLog.log_date)).all())[-7:])
    db.commit()
    db.refresh(log)
    return log


@router.post("/admin/points", response_model=UserProfileOut)
def admin_update_points(payload: AdminPointsIn, db: Session = Depends(get_db)) -> UserProfile:
    profile = get_profile(db)
    if payload.mode == "add":
        award_points(profile, payload.points)
    else:
        profile.stars = max(0, profile.stars - payload.points)
    db.commit()
    db.refresh(profile)
    return profile


@router.patch("/admin/treat-slot", response_model=TreatSlotOut)
def admin_update_treat_slot(payload: AdminTreatSlotIn, db: Session = Depends(get_db)) -> TreatSlot:
    slot = db.scalars(select(TreatSlot).where(TreatSlot.user_id == USER_ID)).first()
    if slot is None:
        raise HTTPException(status_code=404, detail="Treat slot not found")
    slot.status = payload.status
    slot.days_until_available = payload.days_until_available
    if payload.available_at is not None:
        slot.available_at = payload.available_at
    if payload.status != "used":
        slot.used_at = None
        slot.selected_option = None
    db.commit()
    db.refresh(slot)
    return slot
