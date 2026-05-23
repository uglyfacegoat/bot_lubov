const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://bot-lubov-api.onrender.com/api";

export interface ApiUserProfile {
  id: string;
  name: string;
  role: string;
  system_day: number;
  level: number;
  xp: number;
  xp_to_next_level: number;
  stars: number;
  weekly_progress_percent: number;
  is_admin: boolean;
}

export interface ApiDailyLog {
  id: number;
  user_id: string;
  log_date: string;
  water_liters: number;
  water_goal_liters: number;
  steps: number;
  activity_goal: number;
  calories_burned: number | null;
  nutrition_in_plan: boolean;
  mood: string;
  unplanned_food: boolean;
  returned_to_plan: boolean;
}

export interface ApiMealItem {
  id: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meal: string;
}

export interface ApiNutritionDay {
  id: number;
  user_id: string;
  log_date: string;
  calorie_goal: number;
  protein_goal: number;
  fat_goal: number;
  carbs_goal: number;
  meals: ApiMealItem[];
}

export interface ApiWeightLog {
  id: number;
  user_id: string;
  log_date: string;
  weight_kg: number;
  note: string;
}

export interface ApiTreatSlot {
  id: string;
  user_id: string;
  status: string;
  available_at: string;
  used_at: string | null;
  selected_option: string | null;
  days_until_available: number;
}

export interface ApiReward {
  id: string;
  title: string;
  price: number;
  description: string;
  purchased_count: number;
}

export interface ApiDailyTaskOption {
  id: string;
  label: string;
  points: number;
}

export interface ApiDailyTask {
  id: string;
  title: string;
  description: string;
  category: string;
  selected_option_id: string | null;
  completed: boolean;
  options: ApiDailyTaskOption[];
}

export interface ApiAchievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface ApiDashboard {
  profile: ApiUserProfile;
  today: ApiDailyLog;
  nutrition: ApiNutritionDay;
  treat_slot: ApiTreatSlot;
  daily_tasks: ApiDailyTask[];
}

export interface ApiProgress {
  daily_logs: ApiDailyLog[];
  nutrition_days: ApiNutritionDay[];
  weight_logs: ApiWeightLog[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/health"),
  dashboard: () => request<ApiDashboard>("/dashboard"),
  progress: () => request<ApiProgress>("/progress"),
  rewards: () => request<ApiReward[]>("/rewards"),
  tasks: () => request<ApiDailyTask[]>("/tasks"),
  achievements: () => request<ApiAchievement[]>("/achievements"),
  treatSlot: () => request<ApiTreatSlot>("/treat-slot"),
  changeWater: (mode: "add" | "remove", liters: number) =>
    request<ApiDailyLog>("/water/change", {
      method: "POST",
      body: JSON.stringify({ mode, liters }),
    }),
  buyReward: (rewardId: string) =>
    request<ApiReward>(`/rewards/${rewardId}/buy`, {
      method: "POST",
    }),
  createReward: (title: string, price = 500, description = "Новая награда из админки") =>
    request<ApiReward>("/rewards", {
      method: "POST",
      body: JSON.stringify({ title, price, description }),
    }),
  selectTaskOption: (taskId: string, optionId: string) =>
    request<ApiDailyTask>(`/tasks/${taskId}/select`, {
      method: "POST",
      body: JSON.stringify({ option_id: optionId }),
    }),
  completeTask: (taskId: string) =>
    request<ApiDailyTask>(`/tasks/${taskId}/complete`, {
      method: "POST",
    }),
  useTreatSlot: (option: string) =>
    request<ApiTreatSlot>(`/treat-slot/use?option=${encodeURIComponent(option)}`, {
      method: "POST",
    }),
  postponeTreatSlot: () =>
    request<ApiTreatSlot>("/treat-slot/postpone", {
      method: "POST",
    }),
  adminWeight: (date: string, weightKg: number, note = "Добавлено в админке") =>
    request<ApiWeightLog>("/admin/weight", {
      method: "POST",
      body: JSON.stringify({ log_date: date, weight_kg: weightKg, note }),
    }),
  adminDailyLog: (
    date: string,
    payload: Partial<{
      water_liters: number;
      steps: number;
      calories_burned: number;
      nutrition_in_plan: boolean;
      mood: string;
      unplanned_food: boolean;
      returned_to_plan: boolean;
    }>,
  ) =>
    request<ApiDailyLog>("/admin/daily-log", {
      method: "PATCH",
      body: JSON.stringify({ log_date: date, ...payload }),
    }),
  adminPoints: (mode: "add" | "spend", points: number) =>
    request<ApiUserProfile>("/admin/points", {
      method: "POST",
      body: JSON.stringify({ mode, points }),
    }),
  adminTreatSlot: (payload: { status: "locked" | "available" | "used" | "postponed"; days_until_available: number; available_at?: string }) =>
    request<ApiTreatSlot>("/admin/treat-slot", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
