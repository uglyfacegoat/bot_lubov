import { useMemo, useState } from "react";
import { ChevronRight, Crown, Droplets, Flame, Footprints, Plus, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { MetricCard } from "@/components/cards/MetricCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { ProgressBar } from "@/components/cards/ProgressBar";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { formatNumber } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { MealItem } from "@/types";

const mealLabels: Record<MealItem["meal"], string> = {
  breakfast: "Завтрак",
  lunch: "Обед",
  dinner: "Ужин",
  snack: "Перекус",
};

export function Dashboard() {
  const [foodOpen, setFoodOpen] = useState(false);
  const { profile, dailyLogs, nutritionDays, treatSlot, setPage } = useAppStore();
  const today = dailyLogs[dailyLogs.length - 1];
  const nutrition = nutritionDays.find((day) => day.date === today.date) ?? nutritionDays[nutritionDays.length - 1];

  const totals = useMemo(
    () =>
      nutrition.meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          fat: acc.fat + meal.fat,
          carbs: acc.carbs + meal.carbs,
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 },
      ),
    [nutrition.meals],
  );

  const caloriesLeft = nutrition.calorieGoal - totals.calories;

  return (
    <div className="space-y-4">
      <PageHeader title={`Привет, ${profile.name}`} subtitle={`День системы ${profile.systemDay}`} />

      <button type="button" onClick={() => setPage("levels")} className="block w-full text-left">
        <GlassCard className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/12 text-gold">
                <Crown size={22} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Система</h2>
                <p className="text-xs text-soft">уровень {profile.level} · {profile.xp}/{profile.xpToNextLevel} XP</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-extrabold text-gold">
              {formatNumber(profile.stars)} ★
              <ChevronRight className="text-soft" size={18} />
            </div>
          </div>
          <ProgressBar value={profile.xp} max={profile.xpToNextLevel} className="h-2" />
        </GlassCard>
      </button>

      <GlassCard className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose/12 text-rose">
              <Flame size={21} />
            </div>
            <h2 className="text-[22px] font-extrabold leading-tight text-white">Питание сегодня</h2>
            <p className="mt-1 text-sm leading-5 text-soft">Ккал и БЖУ как ориентир. Без наказаний и голодовок.</p>
          </div>
          <div className="rounded-[20px] bg-white/[0.045] px-4 py-3 text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-soft">остаток</p>
            <p className="text-2xl font-extrabold text-white">{formatNumber(Math.max(caloriesLeft, 0))}</p>
          </div>
        </div>

        <div className="rounded-[22px] bg-white/[0.04] p-4">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-4xl font-extrabold leading-none text-white">{formatNumber(totals.calories)}</p>
              <p className="mt-1 text-xs font-bold text-soft">из {formatNumber(nutrition.calorieGoal)} ккал</p>
            </div>
            <p className="rounded-2xl bg-aqua/10 px-3 py-2 text-xs font-bold text-aqua">{nutrition.meals.length} записи</p>
          </div>
          <ProgressBar value={totals.calories} max={nutrition.calorieGoal} className="h-2" />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
          <Macro label="Б" value={totals.protein} goal={nutrition.proteinGoal} />
          <Macro label="Ж" value={totals.fat} goal={nutrition.fatGoal} />
          <Macro label="У" value={totals.carbs} goal={nutrition.carbsGoal} />
        </div>

        <button
          type="button"
          onClick={() => setFoodOpen(true)}
          className="mt-3 flex w-full items-center justify-between rounded-[20px] bg-white/[0.045] px-4 py-3 text-left"
        >
          <span>
            <span className="block text-sm font-bold text-white">Что съела сегодня</span>
            <span className="text-xs text-soft">открыть список еды и БЖУ</span>
          </span>
          <ChevronRight className="text-aqua" size={20} />
        </button>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={<Droplets size={20} />} label="Вода" value={`${today.waterLiters.toFixed(1)} л`} detail={`цель ${today.waterGoalLiters} л`} />
        <MetricCard icon={<Footprints size={20} />} label="Активность" value={formatNumber(today.steps)} detail="шагов сегодня" />
      </div>

      <button type="button" onClick={() => setPage("quests")} className="block w-full text-left">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-aqua/10 text-aqua">
                <Target size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-white">Задания дня</h2>
                <p className="truncate text-sm text-soft">планка, прогулка, вода, фото еды</p>
              </div>
            </div>
            <ChevronRight className="shrink-0 text-soft" size={20} />
          </div>
        </GlassCard>
      </button>

      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose/12 text-rose">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Вкусный слот</h2>
            <p className="text-sm text-soft">
              {treatSlot.status === "available" ? "доступен сегодня" : `${treatSlot.daysUntilAvailable} дня в спокойном режиме`}
            </p>
          </div>
        </div>
      </GlassCard>

      <BottomSheet open={foodOpen} title="Еда сегодня" onClose={() => setFoodOpen(false)}>
        <div className="space-y-3">
          {nutrition.meals.map((meal) => (
            <div key={meal.id} className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-aqua">{mealLabels[meal.meal]}</p>
                  <h3 className="mt-1 font-extrabold leading-5 text-white">{meal.name}</h3>
                  <p className="mt-1 text-xs text-soft">{meal.amount}</p>
                </div>
                <div className="rounded-2xl bg-rose/10 px-3 py-2 text-center">
                  <p className="text-base font-extrabold text-rose">{meal.calories}</p>
                  <p className="text-[10px] font-bold text-rose/80">ккал</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <FoodMacro label="Белки" value={meal.protein} />
                <FoodMacro label="Жиры" value={meal.fat} />
                <FoodMacro label="Углеводы" value={meal.carbs} />
              </div>
            </div>
          ))}
          <Button className="w-full" variant="secondary"><Plus size={18} /> Добавить в админке</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function FoodMacro({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/[0.045] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-soft">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-white">{value} г</p>
    </div>
  );
}

function Macro({ label, value, goal }: { label: string; value: number; goal: number }) {
  return (
    <div className="min-w-0 rounded-[18px] bg-white/[0.04] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-extrabold text-aqua">
          {label}
        </span>
        <span className="min-w-0 text-right text-[11px] font-bold leading-tight text-soft">
          <span className="block text-sm font-extrabold text-white">{value} г</span>
          <span className="block">из {goal}</span>
        </span>
      </div>
      <ProgressBar value={value} max={goal} className="h-1.5" />
    </div>
  );
}
