import { useState } from "react";
import { Droplets } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { ProgressBar } from "@/components/cards/ProgressBar";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export function Water() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState(0.25);
  const { dailyLogs, changeWaterBy } = useAppStore();
  const today = dailyLogs[dailyLogs.length - 1];
  const week = dailyLogs.slice(-7);

  const apply = () => {
    changeWaterBy(mode, amount);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Вода сегодня" subtitle="Цель 2.5 литра" />
      <GlassCard className="p-4">
        <div className="rounded-[26px] bg-white/[0.04] p-5 text-center">
          <p className="text-sm font-bold text-soft">выпито</p>
          <p className="mt-1 text-6xl font-extrabold leading-none text-white">{today.waterLiters.toFixed(1)}</p>
          <p className="mt-2 text-sm font-bold text-aqua">из {today.waterGoalLiters} л</p>
          <ProgressBar value={today.waterLiters} max={today.waterGoalLiters} className="mt-5 h-2" />
        </div>
        <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
          <Droplets size={18} /> Изменить воду
        </Button>
      </GlassCard>

      <GlassCard className="p-4">
        <h2 className="mb-4 text-base font-extrabold text-white">История недели</h2>
        <div className="grid grid-cols-7 gap-2">
          {week.map((day) => (
            <div key={day.date} className="text-center">
              <div className="flex h-24 items-end justify-center rounded-2xl bg-white/[0.04] p-1">
                <div
                  className="w-full rounded-xl bg-gradient-to-t from-aqua to-violet"
                  style={{ height: `${Math.max((day.waterLiters / day.waterGoalLiters) * 100, 10)}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] font-bold text-soft">{formatDate(day.date)}</p>
              <p className="text-[10px] text-aqua">{day.waterLiters.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <BottomSheet open={open} title="Изменить воду" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setMode("add")}
              className={`rounded-[16px] px-4 py-3 text-sm font-bold ${mode === "add" ? "bg-aqua text-ink" : "text-soft"}`}
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={() => setMode("remove")}
              className={`rounded-[16px] px-4 py-3 text-sm font-bold ${mode === "remove" ? "bg-rose text-ink" : "text-soft"}`}
            >
              Убавить
            </button>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4 text-center">
            <p className="text-sm font-bold text-soft">количество</p>
            <p className="mt-1 text-5xl font-extrabold text-white">{amount.toFixed(2)} л</p>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-5 w-full accent-cyan-300"
            />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[0.25, 0.5, 0.75, 1].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className="rounded-2xl bg-white/[0.06] px-2 py-2 text-xs font-bold text-white"
                >
                  {value} л
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={apply}>
            Применить
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
