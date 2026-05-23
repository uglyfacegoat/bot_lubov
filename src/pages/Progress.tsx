import { useMemo, useState, type ReactNode } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, ChevronLeft, ChevronRight, FileText, Flame, Footprints, Scale, TrendingDown } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { ProgressBar } from "@/components/cards/ProgressBar";
import { ChartCard } from "@/components/charts/ChartCard";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { formatDate, formatNumber } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

function ChartMeta({ label, value, tone }: { label: string; value: string; tone: "aqua" | "rose" | "violet" }) {
  const toneClass = {
    aqua: "bg-aqua/10 text-aqua",
    rose: "bg-rose/10 text-rose",
    violet: "bg-violet/10 text-violet",
  }[tone];

  return (
    <div className={`rounded-2xl px-3 py-2 text-right ${toneClass}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-80">{label}</p>
      <p className="text-sm font-extrabold">{value}</p>
    </div>
  );
}

export function Progress() {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(6);
  const { weightLogs, dailyLogs, nutritionDays } = useAppStore();
  const lastWeight = weightLogs[weightLogs.length - 1];
  const week = useMemo(() => dailyLogs.slice(-7), [dailyLogs]);
  const waterData = week.map((log) => ({ date: formatDate(log.date), value: log.waterLiters }));
  const activityData = week.map((log) => ({ date: formatDate(log.date), value: log.steps }));
  const weightData = weightLogs.map((log) => ({ date: formatDate(log.date), value: log.weightKg }));
  const weightMin = Math.floor(Math.min(...weightLogs.map((log) => log.weightKg)) * 10) / 10;
  const weightMax = Math.ceil(Math.max(...weightLogs.map((log) => log.weightKg)) * 10) / 10;
  const weightDelta = Number((weightLogs[weightLogs.length - 1].weightKg - weightLogs[0].weightKg).toFixed(1));
  const waterAverage = week.reduce((sum, day) => sum + day.waterLiters, 0) / week.length;
  const stepsAverage = Math.round(week.reduce((sum, day) => sum + day.steps, 0) / week.length);

  const dayReports = useMemo(
    () =>
      week.map((day) => {
        const nutrition = nutritionDays.find((item) => item.date === day.date);
        const eaten = nutrition?.meals.reduce((sum, meal) => sum + meal.calories, 0) ?? 1750;
        const burned = day.caloriesBurned ?? Math.round(1850 + day.steps * 0.045);
        const balance = burned - eaten;
        const score =
          (day.waterLiters >= day.waterGoalLiters ? 30 : 0) +
          (day.steps >= day.activityGoal ? 30 : 0) +
          (balance >= 0 ? 25 : 10) +
          (day.nutritionInPlan ? 15 : 8);

        return { day, eaten, burned, balance, score };
      }),
    [nutritionDays, week],
  );
  const selectedReport = dayReports[Math.min(selectedIndex, dayReports.length - 1)];

  return (
    <div className="space-y-4">
      <PageHeader title="Прогресс" subtitle="По дням, без оценки себя весом" />

      <GlassCard className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet/15 text-violet">
              <TrendingDown size={22} />
            </div>
            <h2 className="text-xl font-extrabold leading-tight text-white">Тренд спокойный</h2>
            <p className="mt-2 text-sm leading-6 text-soft">Смотрим неделю целиком: еда, вода, активность, баланс.</p>
          </div>
          <div className="rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-right">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-soft">вес</p>
            <p className="mt-1 text-xl font-extrabold text-white">{lastWeight.weightKg} кг</p>
            <p className="text-xs text-soft">{formatDate(lastWeight.date)}</p>
          </div>
        </div>
        <Button className="mt-5 w-full" variant="secondary" onClick={() => setReportOpen(true)}>
          <FileText size={18} /> Открыть дни недели
        </Button>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4">
          <Scale className="mb-3 text-aqua" size={21} />
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-soft">следующее</p>
          <p className="mt-2 text-xl font-extrabold text-white">25 мая</p>
          <p className="mt-1 text-xs text-soft">раз в неделю</p>
        </GlassCard>
        <GlassCard className="p-4">
          <CalendarDays className="mb-3 text-rose" size={21} />
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-soft">дней в отчете</p>
          <p className="mt-2 text-xl font-extrabold text-white">{dayReports.length}</p>
          <p className="mt-1 text-xs text-soft">подробные карточки</p>
        </GlassCard>
      </div>

      <ChartCard title="Вес по неделям" meta={<ChartMeta label="тренд" value={`${weightDelta} кг`} tone="violet" />}>
        <ResponsiveContainer>
          <AreaChart data={weightData} margin={{ top: 8, right: 10, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[weightMin, weightMax]} tickFormatter={(value) => Number(value).toFixed(1)} tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} кг`, "Вес"]} contentStyle={{ background: "#11111b", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16 }} />
            <Area type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} fill="#a78bfa33" dot={{ r: 4, fill: "#a78bfa" }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Вода за 7 дней, л" meta={<ChartMeta label="среднее" value={`${waterAverage.toFixed(1)} л`} tone="aqua" />}>
        <ResponsiveContainer>
          <BarChart data={waterData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 2.5]} tickCount={5} tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} л`, "Вода"]} contentStyle={{ background: "#11111b", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16 }} />
            <Bar dataKey="value" fill="#74d8ff" radius={[10, 10, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Активность за 7 дней" meta={<ChartMeta label="среднее" value={formatNumber(stepsAverage)} tone="rose" />}>
        <ResponsiveContainer>
          <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000)}к`} tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip formatter={(value) => [formatNumber(Number(value)), "Шаги"]} contentStyle={{ background: "#11111b", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16 }} />
            <Area type="monotone" dataKey="value" stroke="#ff8fc7" strokeWidth={3} fill="#ff8fc733" dot={{ r: 3, fill: "#ff8fc7" }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <BottomSheet open={reportOpen} title="Дни недели" onClose={() => setReportOpen(false)}>
        <div className="space-y-4">
          <div className="rounded-[22px] bg-white/[0.04] p-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedIndex((value) => Math.max(value - 1, 0))}
                disabled={selectedIndex === 0}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-white disabled:opacity-35"
              >
                <ChevronLeft size={22} />
              </button>
              <div className="min-w-0 text-center">
                <p className="text-xl font-extrabold text-white">{selectedReport ? formatDate(selectedReport.day.date) : ""}</p>
                <p className="text-xs font-bold text-soft">{selectedIndex + 1} из {dayReports.length}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex((value) => Math.min(value + 1, dayReports.length - 1))}
                disabled={selectedIndex === dayReports.length - 1}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-white disabled:opacity-35"
              >
                <ChevronRight size={22} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {dayReports.map((report, index) => (
                <button
                  key={report.day.date}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`h-2 rounded-full ${index === selectedIndex ? "bg-aqua" : "bg-white/12"}`}
                  aria-label={formatDate(report.day.date)}
                />
              ))}
            </div>
          </div>

          {selectedReport ? (
            <DayReportCard
              day={selectedReport.day}
              eaten={selectedReport.eaten}
              burned={selectedReport.burned}
              balance={selectedReport.balance}
              score={selectedReport.score}
            />
          ) : null}
        </div>
      </BottomSheet>
    </div>
  );
}

function DayReportCard({
  day,
  eaten,
  burned,
  balance,
  score,
}: {
  day: { date: string; waterLiters: number; waterGoalLiters: number; steps: number };
  eaten: number;
  burned: number;
  balance: number;
  score: number;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-aqua">{formatDate(day.date)}</p>
          <h3 className="mt-1 text-xl font-extrabold text-white">Прогресс дня</h3>
          <p className="mt-1 text-sm text-soft">{score}% по действиям</p>
        </div>
        <p className={`rounded-2xl px-3 py-2 text-center text-sm font-extrabold ${balance >= 0 ? "bg-emerald-300/10 text-emerald-200" : "bg-rose/10 text-rose"}`}>
          {balance >= 0 ? "-" : "+"}{Math.abs(balance)}
          <span className="block text-[10px]">ккал</span>
        </p>
      </div>
      <ProgressBar value={score} className="mb-4 h-2" />
      <div className="grid grid-cols-2 gap-2 text-sm">
        <DayStat icon={<Flame size={15} />} label="съедено" value={`${formatNumber(eaten)} ккал`} />
        <DayStat icon={<Flame size={15} />} label="сожжено" value={`${formatNumber(burned)} ккал`} />
        <DayStat icon={<DropletsIcon />} label="вода" value={`${day.waterLiters.toFixed(1)} / ${day.waterGoalLiters} л`} />
        <DayStat icon={<Footprints size={15} />} label="шаги" value={formatNumber(day.steps)} />
      </div>
    </div>
  );
}

function DayStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.045] px-3 py-3">
      <div className="mb-1 flex items-center gap-2 text-aqua">{icon}<span className="text-[11px] font-bold uppercase tracking-[0.1em] text-soft">{label}</span></div>
      <p className="text-sm font-extrabold text-white">{value}</p>
    </div>
  );
}

function DropletsIcon() {
  return <span className="text-[15px] leading-none">л</span>;
}
