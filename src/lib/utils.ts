import { clsx, type ClassValue } from "clsx";
import type { Mood } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function calculateDailyPoints(input: {
  waterDone?: boolean;
  activityDone?: boolean;
  nutritionInPlan?: boolean;
  moodLogged?: boolean;
  honestUnplannedFood?: boolean;
  returnedToPlan?: boolean;
}) {
  const raw =
    (input.waterDone ? 20 : 0) +
    (input.activityDone ? 25 : 0) +
    (input.nutritionInPlan ? 30 : 0) +
    (input.moodLogged ? 10 : 0) +
    (input.honestUnplannedFood ? 10 : 0) +
    (input.returnedToPlan ? 20 : 0);

  return clamp(raw, 0, 120);
}

export function moodLabel(mood: Mood) {
  const labels: Record<Mood, string> = {
    calm: "спокойно",
    good: "хорошо",
    tired: "устала",
    heavy: "тяжело",
    inspired: "вдохновенно",
  };

  return labels[mood];
}
