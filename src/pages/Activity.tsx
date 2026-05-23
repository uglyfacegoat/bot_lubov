import { ActivitySquare, Apple, Link2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { ProgressBar } from "@/components/cards/ProgressBar";
import { formatNumber } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export function Activity() {
  const { dailyLogs, healthIntegration, setPage } = useAppStore();
  const today = dailyLogs[dailyLogs.length - 1];

  return (
    <div className="space-y-4">
      <PageHeader title="Активность" subtitle="Шаги, прогулки и будущий импорт из Apple Health" />
      <GlassCard>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-soft">Шаги сегодня</p>
            <p className="mt-1 text-4xl font-black text-white">{formatNumber(today?.steps ?? 0)}</p>
          </div>
          <p className="text-sm font-bold text-aqua">цель {formatNumber(today?.activityGoal ?? 6500)}</p>
        </div>
        <ProgressBar value={today?.steps ?? 0} max={today?.activityGoal ?? 6500} className="mt-5" />
      </GlassCard>

      <GlassCard className="p-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-aqua">
            <Apple size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Apple Health</h2>
            <p className="mt-1 text-sm leading-5 text-soft">
              Telegram Mini App не может напрямую читать HealthKit как нативное iOS-приложение. Подключим импорт через Shortcut/export или отдельный iOS bridge следующим этапом.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/[0.045] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-soft">статус</p>
            <p className="mt-1 text-sm font-extrabold text-white">{healthIntegration.status === "connected" ? "подключено" : "запланировано"}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.045] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-soft">источник</p>
            <p className="mt-1 text-sm font-extrabold text-white">ручной ввод</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose/10 text-rose">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Задания не начисляют звезды сами</h2>
            <p className="mt-1 text-sm leading-5 text-soft">Она выбирает объем и отправляет на проверку. Админ смотрит доказательство и сам начисляет звезды.</p>
          </div>
        </div>
        <Button className="w-full" variant="secondary" onClick={() => setPage("quests")}>
          <Link2 size={18} /> Открыть задания
        </Button>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <ActivitySquare className="text-aqua" size={22} />
          <p className="text-sm leading-6 text-soft">До подключения Apple Health шаги регулируются в админке вручную.</p>
        </div>
      </GlassCard>
    </div>
  );
}
