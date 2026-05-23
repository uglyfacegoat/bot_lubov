from __future__ import annotations

from datetime import date

from sqlalchemy import Boolean, Date, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="participant")
    system_day: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    xp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    xp_to_next_level: Mapped[int] = mapped_column(Integer, nullable=False, default=500)
    stars: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    weekly_progress_percent: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class DailyLog(Base):
    __tablename__ = "daily_logs"
    __table_args__ = (UniqueConstraint("user_id", "log_date", name="uq_daily_logs_user_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.id"), nullable=False, index=True)
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    water_liters: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    water_goal_liters: Mapped[float] = mapped_column(Float, nullable=False, default=2.5)
    steps: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    activity_goal: Mapped[int] = mapped_column(Integer, nullable=False, default=6500)
    calories_burned: Mapped[int] = mapped_column(Integer, nullable=True)
    nutrition_in_plan: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    mood: Mapped[str] = mapped_column(String(32), nullable=False, default="calm")
    unplanned_food: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    returned_to_plan: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped[UserProfile] = relationship()


class NutritionDay(Base):
    __tablename__ = "nutrition_days"
    __table_args__ = (UniqueConstraint("user_id", "log_date", name="uq_nutrition_days_user_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.id"), nullable=False, index=True)
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    calorie_goal: Mapped[int] = mapped_column(Integer, nullable=False)
    protein_goal: Mapped[int] = mapped_column(Integer, nullable=False)
    fat_goal: Mapped[int] = mapped_column(Integer, nullable=False)
    carbs_goal: Mapped[int] = mapped_column(Integer, nullable=False)

    meals: Mapped[list[MealItem]] = relationship(back_populates="nutrition_day", cascade="all, delete-orphan")


class MealItem(Base):
    __tablename__ = "meal_items"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    nutrition_day_id: Mapped[int] = mapped_column(ForeignKey("nutrition_days.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(240), nullable=False)
    amount: Mapped[str] = mapped_column(String(120), nullable=False)
    calories: Mapped[int] = mapped_column(Integer, nullable=False)
    protein: Mapped[int] = mapped_column(Integer, nullable=False)
    fat: Mapped[int] = mapped_column(Integer, nullable=False)
    carbs: Mapped[int] = mapped_column(Integer, nullable=False)
    meal: Mapped[str] = mapped_column(String(32), nullable=False)

    nutrition_day: Mapped[NutritionDay] = relationship(back_populates="meals")


class WeightLog(Base):
    __tablename__ = "weight_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.id"), nullable=False, index=True)
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    note: Mapped[str] = mapped_column(String(240), nullable=False, default="")


class TreatSlot(Base):
    __tablename__ = "treat_slots"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="locked")
    available_at: Mapped[date] = mapped_column(Date, nullable=False)
    used_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    selected_option: Mapped[str | None] = mapped_column(String(120), nullable=True)
    days_until_available: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class Reward(Base):
    __tablename__ = "rewards"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    purchased_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class DailyTask(Base):
    __tablename__ = "daily_tasks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    selected_option_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    options: Mapped[list[DailyTaskOption]] = relationship(back_populates="task", cascade="all, delete-orphan")


class DailyTaskOption(Base):
    __tablename__ = "daily_task_options"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    task_id: Mapped[str] = mapped_column(ForeignKey("daily_tasks.id"), nullable=False, index=True)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)

    task: Mapped[DailyTask] = relationship(back_populates="options")


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    unlocked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
