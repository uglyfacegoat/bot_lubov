import { CheckCircle2, Dumbbell, Footprints, GlassWater, Heart, Video } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { useAppStore } from "@/store/useAppStore";
import type { DailyTask } from "@/types";

const icons: Record<DailyTask["category"], typeof Dumbbell> = {
  movement: Footprints,
  food: Heart,
  water: GlassWater,
  proof: Video,
  recovery: Dumbbell,
};

export function Quests() {
  const { dailyTasks, selectDailyTaskOption, completeDailyTask } = useAppStore();

  return (
    <div className="space-y-4">
      <PageHeader title="Задания дня" subtitle="Можно выбрать объем и получить звезды" />
      {dailyTasks.map((task) => {
        const Icon = icons[task.category];
        const selected = task.options.find((option) => option.id === task.selectedOptionId) ?? task.options[0];
        return (
          <GlassCard key={task.id} className="p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aqua/10 text-aqua">
                <Icon size={21} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-white">{task.title}</h2>
                <p className="mt-1 text-sm leading-5 text-soft">{task.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {task.options.map((option) => {
                const active = option.id === selected.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectDailyTaskOption(task.id, option.id)}
                    className={`rounded-2xl px-3 py-3 text-left ${active ? "bg-aqua text-ink" : "bg-white/[0.045] text-white"}`}
                  >
                    <p className="text-xs font-extrabold">{option.label}</p>
                    <p className="mt-1 text-[11px] font-bold opacity-80">+{option.points} ★</p>
                  </button>
                );
              })}
            </div>
            <Button className="mt-4 w-full" disabled={task.completed} onClick={() => completeDailyTask(task.id)}>
              {task.completed ? <CheckCircle2 size={18} /> : null}
              {task.completed ? "Выполнено" : `Отметить: +${selected.points} звезд`}
            </Button>
          </GlassCard>
        );
      })}
    </div>
  );
}
