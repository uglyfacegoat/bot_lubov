import { create } from "zustand";
import {
  api,
  type ApiAchievement,
  type ApiDailyLog,
  type ApiDailyTask,
  type ApiDailyTaskOption,
  type ApiMealItem,
  type ApiNutritionDay,
  type ApiReward,
  type ApiTreatSlot,
  type ApiUserProfile,
  type ApiWeightLog,
} from "@/lib/api";
import { telegram } from "@/lib/telegram";
import type {
  Achievement,
  ActivityLog,
  ActivityQuest,
  DailyLog,
  DailyTask,
  DailyTaskOption,
  MealItem,
  Mood,
  NutritionDay,
  PageId,
  Reward,
  TreatSlot,
  UserProfile,
  WeeklyReport,
  HealthIntegration,
  ViewMode,
  WeightLog,
} from "@/types";

interface AppState {
  activePage: PageId;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  viewMode: ViewMode;
  healthIntegration: HealthIntegration;
  profile: UserProfile;
  dailyLogs: DailyLog[];
  dailyTasks: DailyTask[];
  nutritionDays: NutritionDay[];
  weightLogs: WeightLog[];
  activityLogs: ActivityLog[];
  quests: ActivityQuest[];
  rewards: Reward[];
  treatSlot: TreatSlot;
  weeklyReports: WeeklyReport[];
  achievements: Achievement[];
  hydrate: () => Promise<void>;
  setPage: (page: PageId) => void;
  addWater: () => Promise<void>;
  removeWater: () => Promise<void>;
  changeWaterBy: (mode: "add" | "remove", liters: number) => Promise<void>;
  completeQuest: (id: string) => Promise<void>;
  selectDailyTaskOption: (taskId: string, optionId: string) => Promise<void>;
  completeDailyTask: (taskId: string) => Promise<void>;
  buyReward: (id: string) => Promise<void>;
  useTreatSlot: (option: string) => Promise<void>;
  postponeTreatSlot: () => Promise<void>;
  adminAddWeight: (weight: number) => Promise<void>;
  adminAddWater: (liters: number) => Promise<void>;
  adminAddActivity: (steps: number) => Promise<void>;
  adminSetNutrition: (inPlan: boolean) => Promise<void>;
  adminSetMood: (mood: Mood) => Promise<void>;
  adminMarkUnplannedFood: () => Promise<void>;
  adminAddPoints: (points: number) => Promise<void>;
  adminSpendPoints: (points: number) => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  adminSetTreatSlot: (status: TreatSlot["status"], availableAt?: string) => Promise<void>;
  adminCreateReward: (title: string, price?: number, description?: string) => Promise<void>;
}

const emptyProfile: UserProfile = {
  id: "",
  name: "",
  role: "participant",
  systemDay: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 1,
  stars: 0,
  weeklyProgressPercent: 0,
  isAdmin: false,
};

const emptyTreatSlot: TreatSlot = {
  id: "",
  status: "locked",
  availableAt: "",
  daysUntilAvailable: 0,
};

function safeMood(value: string): Mood {
  return ["calm", "good", "tired", "heavy", "inspired"].includes(value) ? (value as Mood) : "calm";
}

function safeRole(value: string): UserProfile["role"] {
  return value === "admin" || value === "viewer" || value === "participant" ? value : "participant";
}

function safeCategory(value: string): DailyTask["category"] {
  return ["movement", "food", "water", "proof", "recovery"].includes(value) ? (value as DailyTask["category"]) : "movement";
}

function optionId(id: string): string {
  return id.includes(":") ? id.split(":").pop() ?? id : id;
}

function mapProfile(item: ApiUserProfile): UserProfile {
  return {
    id: item.id,
    name: item.name,
    role: safeRole(item.role),
    systemDay: item.system_day,
    level: item.level,
    xp: item.xp,
    xpToNextLevel: item.xp_to_next_level,
    stars: item.stars,
    weeklyProgressPercent: item.weekly_progress_percent,
    isAdmin: item.is_admin,
  };
}

function mapDailyLog(item: ApiDailyLog): DailyLog {
  return {
    date: item.log_date,
    waterLiters: item.water_liters,
    waterGoalLiters: item.water_goal_liters,
    steps: item.steps,
    activityGoal: item.activity_goal,
    caloriesBurned: item.calories_burned ?? undefined,
    nutritionInPlan: item.nutrition_in_plan,
    mood: safeMood(item.mood),
    unplannedFood: item.unplanned_food,
    returnedToPlan: item.returned_to_plan,
  };
}

function mapMeal(item: ApiMealItem): MealItem {
  return {
    id: item.id,
    name: item.name,
    amount: item.amount,
    calories: item.calories,
    protein: item.protein,
    fat: item.fat,
    carbs: item.carbs,
    meal: item.meal === "breakfast" || item.meal === "lunch" || item.meal === "dinner" || item.meal === "snack" ? item.meal : "snack",
  };
}

function mapNutritionDay(item: ApiNutritionDay): NutritionDay {
  return {
    date: item.log_date,
    calorieGoal: item.calorie_goal,
    proteinGoal: item.protein_goal,
    fatGoal: item.fat_goal,
    carbsGoal: item.carbs_goal,
    meals: item.meals.map(mapMeal),
  };
}

function mapWeightLog(item: ApiWeightLog): WeightLog {
  return {
    date: item.log_date,
    weightKg: item.weight_kg,
    note: item.note,
  };
}

function mapTreatSlot(item: ApiTreatSlot): TreatSlot {
  return {
    id: item.id,
    status: item.status === "available" || item.status === "used" || item.status === "postponed" ? item.status : "locked",
    availableAt: item.available_at,
    usedAt: item.used_at ?? undefined,
    selectedOption: item.selected_option ?? undefined,
    daysUntilAvailable: item.days_until_available,
  };
}

function mapReward(item: ApiReward): Reward {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    description: item.description,
    purchasedCount: item.purchased_count,
  };
}

function mapTaskOption(item: ApiDailyTaskOption): DailyTaskOption {
  return {
    id: optionId(item.id),
    label: item.label,
    points: item.points,
  };
}

function mapDailyTask(item: ApiDailyTask): DailyTask {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: safeCategory(item.category),
    selectedOptionId: item.selected_option_id ? optionId(item.selected_option_id) : undefined,
    completed: item.completed,
    options: item.options.map(mapTaskOption),
  };
}

function mapAchievement(item: ApiAchievement): Achievement {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    unlocked: item.unlocked,
  };
}

function activityFromLogs(logs: DailyLog[]): ActivityLog[] {
  return logs.map((day) => ({
    date: day.date,
    steps: day.steps,
    walkMinutes: day.steps >= day.activityGoal ? 40 : 25,
    workoutDone: day.steps >= day.activityGoal + 1200,
    stretchDone: day.returnedToPlan || day.waterLiters >= day.waterGoalLiters,
  }));
}

function questsFromTasks(tasks: DailyTask[]): ActivityQuest[] {
  return tasks.slice(0, 4).map((task) => {
    const selected = task.options.find((option) => option.id === task.selectedOptionId) ?? task.options[0];
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      points: selected?.points ?? 0,
      done: task.completed,
    };
  });
}

function weeklyReportsFromLogs(logs: DailyLog[]): WeeklyReport[] {
  if (logs.length === 0) return [];
  return [
    {
      week: 1,
      startDate: logs[0].date,
      stabilityPercent: Math.round(
        logs.reduce((sum, day) => sum + (day.waterLiters >= day.waterGoalLiters ? 50 : 0) + (day.steps >= day.activityGoal ? 50 : 0), 0) / logs.length,
      ),
      waterAverage: Number((logs.reduce((sum, day) => sum + day.waterLiters, 0) / logs.length).toFixed(1)),
      activityAverage: Math.round(logs.reduce((sum, day) => sum + day.steps, 0) / logs.length),
      note: "РЎРІРѕРґРєР° РёР· backend",
    },
  ];
}

async function loadState() {
  const [dashboard, progress, rewards, tasks, achievements] = await Promise.all([
    api.dashboard(),
    api.progress(),
    api.rewards(),
    api.tasks(),
    api.achievements(),
  ]);

  const dailyLogs = progress.daily_logs.map(mapDailyLog);
  const dailyTasks = tasks.map(mapDailyTask);
  return {
    profile: mapProfile(dashboard.profile),
    dailyLogs,
    dailyTasks,
    nutritionDays: progress.nutrition_days.map(mapNutritionDay),
    weightLogs: progress.weight_logs.map(mapWeightLog),
    activityLogs: activityFromLogs(dailyLogs),
    quests: questsFromTasks(dailyTasks),
    rewards: rewards.map(mapReward),
    treatSlot: mapTreatSlot(dashboard.treat_slot),
    weeklyReports: weeklyReportsFromLogs(dailyLogs),
    achievements: achievements.map(mapAchievement),
  };
}

function todayDate(logs: DailyLog[]): string {
  return logs[logs.length - 1]?.date ?? new Date().toISOString().slice(0, 10);
}

export const useAppStore = create<AppState>((set, get) => ({
  activePage: "dashboard",
  isHydrated: false,
  isLoading: false,
  error: null,
  viewMode: "user",
  healthIntegration: {
    provider: "apple-health",
    status: "planned",
  },
  profile: emptyProfile,
  dailyLogs: [],
  dailyTasks: [],
  nutritionDays: [],
  weightLogs: [],
  activityLogs: [],
  quests: [],
  rewards: [],
  treatSlot: emptyTreatSlot,
  weeklyReports: [],
  achievements: [],
  hydrate: async () => {
    set({ isLoading: true, error: null });
    try {
      const next = await loadState();
      set({ ...next, isHydrated: true, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Не удалось загрузить данные",
      });
    }
  },
  setPage: (page) => {
    telegram.impact("light");
    set({ activePage: page });
  },
  setViewMode: (mode) => set({ viewMode: mode, activePage: "dashboard" }),
  addWater: async () => get().changeWaterBy("add", 0.25),
  removeWater: async () => get().changeWaterBy("remove", 0.25),
  changeWaterBy: async (mode, liters) => {
    await api.changeWater(mode, liters);
    telegram.impact("light");
    await get().hydrate();
  },
  completeQuest: async (id) => {
    await get().completeDailyTask(id);
  },
  selectDailyTaskOption: async (taskId, optionId) => {
    const task = mapDailyTask(await api.selectTaskOption(taskId, optionId));
    set((state) => {
      const dailyTasks = state.dailyTasks.map((item) => (item.id === taskId ? task : item));
      return { dailyTasks, quests: questsFromTasks(dailyTasks) };
    });
  },
  completeDailyTask: async (taskId) => {
    const task = mapDailyTask(await api.completeTask(taskId));
    telegram.impact("medium");
    set((state) => {
      const dailyTasks = state.dailyTasks.map((item) => (item.id === taskId ? task : item));
      return { dailyTasks, quests: questsFromTasks(dailyTasks) };
    });
    await get().hydrate();
  },
  buyReward: async (id) => {
    await api.buyReward(id);
    telegram.success();
    await get().hydrate();
  },
  useTreatSlot: async (option) => {
    set({ treatSlot: mapTreatSlot(await api.useTreatSlot(option)) });
  },
  postponeTreatSlot: async () => {
    set({ treatSlot: mapTreatSlot(await api.postponeTreatSlot()) });
  },
  adminAddWeight: async (weight) => {
    await api.adminWeight(todayDate(get().dailyLogs), weight);
    await get().hydrate();
  },
  adminAddWater: async (liters) => {
    await api.adminDailyLog(todayDate(get().dailyLogs), { water_liters: Math.max(0, liters) });
    await get().hydrate();
  },
  adminAddActivity: async (steps) => {
    await api.adminDailyLog(todayDate(get().dailyLogs), { steps: Math.max(0, steps) });
    await get().hydrate();
  },
  adminSetNutrition: async (inPlan) => {
    await api.adminDailyLog(todayDate(get().dailyLogs), { nutrition_in_plan: inPlan });
    await get().hydrate();
  },
  adminSetMood: async (mood) => {
    await api.adminDailyLog(todayDate(get().dailyLogs), { mood });
    await get().hydrate();
  },
  adminMarkUnplannedFood: async () => {
    await api.adminDailyLog(todayDate(get().dailyLogs), { unplanned_food: true, returned_to_plan: true });
    await get().hydrate();
  },
  adminAddPoints: async (points) => {
    set({ profile: mapProfile(await api.adminPoints("add", Math.max(1, points))) });
  },
  adminSpendPoints: async (points) => {
    set({ profile: mapProfile(await api.adminPoints("spend", Math.max(1, points))) });
  },
  adminSetTreatSlot: async (status, availableAt) => {
    const today = todayDate(get().dailyLogs);
    const targetDate = availableAt || today;
    const diff = Math.max(0, Math.ceil((new Date(targetDate).getTime() - new Date(today).getTime()) / 86400000));
    set({ treatSlot: mapTreatSlot(await api.adminTreatSlot({ status, days_until_available: diff, available_at: targetDate })) });
  },
  adminCreateReward: async (title, price = 500, description = "Награда добавлена в админке") => {
    await api.createReward(title, price, description);
    await get().hydrate();
  },
}));
