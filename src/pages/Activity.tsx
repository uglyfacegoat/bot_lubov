import { Check, Dumbbell, Footprints, Sparkles, Wind } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { ProgressBar } from "@/components/cards/ProgressBar";
import { formatNumber } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const icons = {
  steps: Footprints,
  walk: Wind,
  stretch: Sparkles,
  training: Dumbbell,
};

export function Activity() {
  const { dailyLogs, quests, completeQuest } = useAppStore();
  const today = dailyLogs[dailyLogs.length - 1];

  return (
    <div className="space-y-4">
      <PageHeader title="Активность" subtitle="Движение как забота, не наказание" />
      <GlassCard>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-soft">Шаги сегодня</p>
            <p className="mt-1 text-4xl font-black text-white">{formatNumber(today.steps)}</p>
          </div>
          <p className="text-sm font-bold text-aqua">цель {formatNumber(today.activityGoal)}</p>
        </div>
        <ProgressBar value={today.steps} max={today.activityGoal} className="mt-5" />
      </GlassCard>

      <div className="space-y-3">
        {quests.map((quest) => {
          const Icon = icons[quest.id as keyof typeof icons] ?? Sparkles;
          return (
            <GlassCard key={quest.id} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-violet">
                <Icon size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-black text-white">{quest.title}</h2>
                <p className="text-sm text-soft">{quest.description}</p>
                <p className="mt-1 text-xs font-bold text-gold">+{quest.points} звезд</p>
              </div>
              <Button
                className="h-11 w-11 rounded-full p-0"
                variant={quest.done ? "secondary" : "primary"}
                onClick={() => completeQuest(quest.id)}
                disabled={quest.done}
                aria-label="Отметить выполнено"
              >
                <Check size={18} />
              </Button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
