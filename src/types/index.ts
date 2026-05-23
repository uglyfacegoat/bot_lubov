export type PageId =
  | "dashboard"
  | "progress"
  | "water"
  | "activity"
  | "treat"
  | "shop"
  | "rules"
  | "admin"
  | "levels"
  | "quests"
  | "more";

export type Mood = "calm" | "good" | "tired" | "heavy" | "inspired";

export interface UserProfile {
  id: string;
  name: string;
  role: "participant" | "viewer" | "admin";
  systemDay: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stars: number;
  weeklyProgressPercent: number;
  isAdmin: boolean;
}

export interface DailyLog {
  date: string;
  waterLiters: number;
  waterGoalLiters: number;
  steps: number;
  activityGoal: number;
  caloriesBurned?: number;
  nutritionInPlan: boolean;
  mood: Mood;
  unplannedFood?: boolean;
  returnedToPlan?: boolean;
}

export interface WeightLog {
  date: string;
  weightKg: number;
  note: string;
}

export interface WaterLog {
  date: string;
  liters: number;
  goalLiters: number;
}

export interface MealItem {
  id: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface NutritionDay {
  date: string;
  calorieGoal: number;
  proteinGoal: number;
  fatGoal: number;
  carbsGoal: number;
  meals: MealItem[];
}

export interface ActivityLog {
  date: string;
  steps: number;
  walkMinutes: number;
  workoutDone: boolean;
  stretchDone: boolean;
}

export interface MoodLog {
  date: string;
  mood: Mood;
  note: string;
}

export interface TreatSlot {
  id: string;
  status: "locked" | "available" | "used" | "postponed";
  availableAt: string;
  usedAt?: string;
  selectedOption?: string;
  daysUntilAvailable: number;
}

export interface Reward {
  id: string;
  title: string;
  price: number;
  description: string;
  purchasedCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface WeeklyReport {
  week: number;
  startDate: string;
  stabilityPercent: number;
  waterAverage: number;
  activityAverage: number;
  note: string;
}

export interface ActivityQuest {
  id: string;
  title: string;
  description: string;
  points: number;
  done: boolean;
}

export interface DailyTaskOption {
  id: string;
  label: string;
  points: number;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  category: "movement" | "food" | "water" | "proof" | "recovery";
  options: DailyTaskOption[];
  selectedOptionId?: string;
  completed: boolean;
}

export interface AdminActionPayload {
  weight?: number;
  water?: number;
  steps?: number;
  mood?: Mood;
  points?: number;
  rewardTitle?: string;
}
