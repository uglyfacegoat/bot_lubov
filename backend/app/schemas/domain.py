from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class UserProfileOut(BaseModel):
    id: str
    name: str
    role: str
    system_day: int
    level: int
    xp: int
    xp_to_next_level: int
    stars: int
    weekly_progress_percent: int
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)


class DailyLogOut(BaseModel):
    id: int
    user_id: str
    log_date: date
    water_liters: float
    water_goal_liters: float
    steps: int
    activity_goal: int
    calories_burned: int | None
    nutrition_in_plan: bool
    mood: str
    unplanned_food: bool
    returned_to_plan: bool

    model_config = ConfigDict(from_attributes=True)


class MealItemOut(BaseModel):
    id: str
    name: str
    amount: str
    calories: int
    protein: int
    fat: int
    carbs: int
    meal: str

    model_config = ConfigDict(from_attributes=True)


class NutritionDayOut(BaseModel):
    id: int
    user_id: str
    log_date: date
    calorie_goal: int
    protein_goal: int
    fat_goal: int
    carbs_goal: int
    meals: list[MealItemOut]

    model_config = ConfigDict(from_attributes=True)


class WeightLogOut(BaseModel):
    id: int
    user_id: str
    log_date: date
    weight_kg: float
    note: str

    model_config = ConfigDict(from_attributes=True)


class TreatSlotOut(BaseModel):
    id: str
    user_id: str
    status: str
    available_at: date
    used_at: date | None
    selected_option: str | None
    days_until_available: int

    model_config = ConfigDict(from_attributes=True)


class RewardOut(BaseModel):
    id: str
    title: str
    price: int
    description: str
    purchased_count: int

    model_config = ConfigDict(from_attributes=True)


class DailyTaskOptionOut(BaseModel):
    id: str
    label: str
    points: int

    model_config = ConfigDict(from_attributes=True)


class DailyTaskOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    selected_option_id: str | None
    completed: bool
    options: list[DailyTaskOptionOut]

    model_config = ConfigDict(from_attributes=True)


class AchievementOut(BaseModel):
    id: str
    title: str
    description: str
    unlocked: bool

    model_config = ConfigDict(from_attributes=True)


class DashboardOut(BaseModel):
    profile: UserProfileOut
    today: DailyLogOut
    nutrition: NutritionDayOut
    treat_slot: TreatSlotOut
    daily_tasks: list[DailyTaskOut]


class ProgressDayOut(BaseModel):
    date: date
    eaten: int
    burned: int
    balance: int
    score: int
    water_liters: float
    water_goal_liters: float
    steps: int
    activity_goal: int


class ProgressOut(BaseModel):
    daily_logs: list[DailyLogOut]
    nutrition_days: list[NutritionDayOut]
    weight_logs: list[WeightLogOut]
    day_reports: list[ProgressDayOut]


class WaterChangeIn(BaseModel):
    mode: Literal["add", "remove"]
    liters: float = Field(gt=0, le=5)


class RewardCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    price: int = Field(gt=0)
    description: str = Field(min_length=1, max_length=500)


class TaskSelectIn(BaseModel):
    option_id: str


class AdminWeightIn(BaseModel):
    log_date: date
    weight_kg: float = Field(gt=20, lt=300)
    note: str = ""


class AdminDailyLogIn(BaseModel):
    log_date: date
    water_liters: float | None = None
    steps: int | None = None
    calories_burned: int | None = None
    nutrition_in_plan: bool | None = None
    mood: str | None = None
    unplanned_food: bool | None = None
    returned_to_plan: bool | None = None
