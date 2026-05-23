import { create } from "zustand";
import {
  achievements,
  activityLogs,
  dailyLogs,
  dailyTasks,
  nutritionDays,
  profile,
  quests,
  rewards,
  treatSlot,
  weeklyReports,
  weightLogs,
} from "@/data/mockData";
import { telegram } from "@/lib/telegram";
import type {
  ActivityLog,
  ActivityQuest,
  DailyLog,
  DailyTask,
  Mood,
  NutritionDay,
  PageId,
  Reward,
  TreatSlot,
  UserProfile,
  WeeklyReport,
  WeightLog,
} from "@/types";

interface AppState {
  activePage: PageId;
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
  achievements: typeof achievements;
  setPage: (page: PageId) => void;
  addWater: () => void;
  removeWater: () => void;
  changeWaterBy: (mode: "add" | "remove", liters: number) => void;
  completeQuest: (id: string) => void;
  selectDailyTaskOption: (taskId: string, optionId: string) => void;
  completeDailyTask: (taskId: string) => void;
  buyReward: (id: string) => void;
  useTreatSlot: (option: string) => void;
  postponeTreatSlot: () => void;
  adminAddWeight: (weight: number) => void;
  adminAddWater: (liters: number) => void;
  adminAddActivity: (steps: number) => void;
  adminSetNutrition: (inPlan: boolean) => void;
  adminSetMood: (mood: Mood) => void;
  adminMarkUnplannedFood: () => void;
  adminAddPoints: (points: number) => void;
  adminSpendPoints: (points: number) => void;
  adminSetTreatAvailable: () => void;
  adminCreateReward: (title: string) => void;
}

const today = "2026-05-23";

function todayIndex(logs: DailyLog[]) {
  const index = logs.findIndex((log) => log.date === today);
  return index === -1 ? logs.length - 1 : index;
}

function award(profileValue: UserProfile, points: number): UserProfile {
  const xp = profileValue.xp + points;
  const leveled = xp >= profileValue.xpToNextLevel;
  return {
    ...profileValue,
    stars: profileValue.stars + points,
    xp: leveled ? xp - profileValue.xpToNextLevel : xp,
    level: leveled ? profileValue.level + 1 : profileValue.level,
  };
}

export const useAppStore = create<AppState>((set) => ({
  activePage: "dashboard",
  profile,
  dailyLogs,
  dailyTasks,
  nutritionDays,
  weightLogs,
  activityLogs,
  quests,
  rewards,
  treatSlot,
  weeklyReports,
  achievements,
  setPage: (page) => {
    telegram.impact("light");
    set({ activePage: page });
  },
  addWater: () =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      const log = nextLogs[index];
      const nextValue = Math.min(Number((log.waterLiters + 0.25).toFixed(2)), log.waterGoalLiters);
      nextLogs[index] = { ...log, waterLiters: nextValue };
      const reachedGoal = log.waterLiters < log.waterGoalLiters && nextValue === log.waterGoalLiters;
      if (reachedGoal) telegram.success();
      return {
        dailyLogs: nextLogs,
        profile: reachedGoal ? award(state.profile, 20) : state.profile,
      };
    }),
  removeWater: () =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      const log = nextLogs[index];
      nextLogs[index] = { ...log, waterLiters: Math.max(Number((log.waterLiters - 0.25).toFixed(2)), 0) };
      return { dailyLogs: nextLogs };
    }),
  changeWaterBy: (mode, liters) =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      const log = nextLogs[index];
      const delta = mode === "add" ? liters : -liters;
      const nextValue = Math.min(Math.max(Number((log.waterLiters + delta).toFixed(2)), 0), log.waterGoalLiters);
      nextLogs[index] = { ...log, waterLiters: nextValue };
      return { dailyLogs: nextLogs };
    }),
  completeQuest: (id) =>
    set((state) => {
      const quest = state.quests.find((item) => item.id === id);
      if (!quest || quest.done) return state;
      telegram.success();
      return {
        quests: state.quests.map((item) => (item.id === id ? { ...item, done: true } : item)),
        profile: award(state.profile, quest.points),
      };
    }),
  selectDailyTaskOption: (taskId, optionId) =>
    set((state) => ({
      dailyTasks: state.dailyTasks.map((task) => (task.id === taskId ? { ...task, selectedOptionId: optionId } : task)),
    })),
  completeDailyTask: (taskId) =>
    set((state) => {
      const task = state.dailyTasks.find((item) => item.id === taskId);
      if (!task || task.completed) return state;
      const option = task.options.find((item) => item.id === task.selectedOptionId) ?? task.options[0];
      telegram.success();
      return {
        dailyTasks: state.dailyTasks.map((item) => (item.id === taskId ? { ...item, completed: true } : item)),
        profile: award(state.profile, option.points),
      };
    }),
  buyReward: (id) =>
    set((state) => {
      const reward = state.rewards.find((item) => item.id === id);
      if (!reward || state.profile.stars < reward.price) return state;
      telegram.success();
      return {
        rewards: state.rewards.map((item) => (item.id === id ? { ...item, purchasedCount: item.purchasedCount + 1 } : item)),
        profile: { ...state.profile, stars: state.profile.stars - reward.price },
      };
    }),
  useTreatSlot: (option) =>
    set((state) => ({
      treatSlot: {
        ...state.treatSlot,
        status: "used",
        usedAt: today,
        selectedOption: option,
      },
    })),
  postponeTreatSlot: () =>
    set((state) => ({
      treatSlot: { ...state.treatSlot, status: "postponed", daysUntilAvailable: 1 },
    })),
  adminAddWeight: (weight) =>
    set((state) => ({
      weightLogs: [...state.weightLogs, { date: today, weightKg: weight, note: "Добавлено в админке" }],
    })),
  adminAddWater: (liters) =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      nextLogs[index] = { ...nextLogs[index], waterLiters: Math.max(0, liters) };
      return { dailyLogs: nextLogs };
    }),
  adminAddActivity: (steps) =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      nextLogs[index] = { ...nextLogs[index], steps: Math.max(0, steps) };
      return { dailyLogs: nextLogs };
    }),
  adminSetNutrition: (inPlan) =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      nextLogs[index] = { ...nextLogs[index], nutritionInPlan: inPlan };
      return {
        dailyLogs: nextLogs,
        profile: inPlan ? award(state.profile, 30) : state.profile,
      };
    }),
  adminSetMood: (mood) =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      nextLogs[index] = { ...nextLogs[index], mood };
      return { dailyLogs: nextLogs, profile: award(state.profile, 10) };
    }),
  adminMarkUnplannedFood: () =>
    set((state) => {
      const index = todayIndex(state.dailyLogs);
      const nextLogs = [...state.dailyLogs];
      nextLogs[index] = { ...nextLogs[index], unplannedFood: true, returnedToPlan: true };
      return { dailyLogs: nextLogs, profile: award(state.profile, 30) };
    }),
  adminAddPoints: (points) => set((state) => ({ profile: award(state.profile, Math.max(0, points)) })),
  adminSpendPoints: (points) =>
    set((state) => ({
      profile: { ...state.profile, stars: Math.max(0, state.profile.stars - Math.max(0, points)) },
    })),
  adminSetTreatAvailable: () =>
    set((state) => ({
      treatSlot: { ...state.treatSlot, status: "available", daysUntilAvailable: 0 },
    })),
  adminCreateReward: (title) =>
    set((state) => ({
      rewards: [
        {
          id: crypto.randomUUID(),
          title,
          price: 500,
          description: "Новая награда из админки",
          purchasedCount: 0,
        },
        ...state.rewards,
      ],
    })),
}));
