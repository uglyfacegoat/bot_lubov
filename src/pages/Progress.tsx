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

  const week = useMemo(() => dailyLogs.slice(-7), [dailyLogs]);
  const lastWeight = weightLogs.at(-1);
  const hasWeight = weightLogs.length > 0;
  const hasWeek = week.length > 0;
  const waterData = week.map((log) => ({ date: formatDate(log.date), value: log.waterLiters }));
  const activityData = week.map((log) => ({ date: formatDate(log.date), value: log.steps }));
  const weightData = weightLogs.map((log) => ({ date: formatDate(log.date), value: log.weightKg }));
  const weightValues = weightLogs.map((log) => log.weightKg);
  const weightMin = hasWeight ? Math.floor(Math.min(...weightValues) * 10) / 10 : 0;
  const weightMax = hasWeight ? Math.ceil(Math.max(...weightValues) * 10) / 10 : 1;
  const weightDelta = hasWeight ? Number((weightLogs.at(-1)!.weightKg - weightLogs[0].weightKg).toFixed(1)) : 0;
  const waterAverage = hasWeek ? week.reduce((sum, day) => sum + day.waterLiters, 0) / week.length : 0;
  const stepsAverage = hasWeek ? Math.round(week.reduce((sum, day) => sum + day.steps, 0) / week.length) : 0;

  const dayReports = useMemo(
    () =>
      week.map((day) => {
        const nutrition = nutritionDays.find((item) => item.date === day.date);
        const eaten = nutrition?.meals.reduce((sum, meal) => sum + meal.calories, 0) ?? 0;
        const burned = day.caloriesBurned ?? 0;
        const balance = burned - eaten;
        const score =
          (day.waterLiters >= day.waterGoalLiters ? 30 : 0) +
          (day.steps >= day.activityGoal ? 30 : 0) +
          (eaten > 0 || burned > 0 ? (balance >= 0 ? 25 : 10) : 0) +
          (day.nutritionInPlan ? 15 : 8);

        return { day, eaten, burned, balance, score };
      }),
    [nutritionDays, week],
  );
  const selectedReport = dayReports.length > 0 ? dayReports[Math.min(selectedIndex, dayReports.length - 1)] : null;

  return (
    <div className="space-y-4">
      <PageHeader title="Прогресс" subtitle="Данные по дням без оценки себя весом" />

      <GlassCard className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet/15 text-violet">
              <TrendingDown size={22} />
            </div>
            <h2 className="text-xl font-extrabold leading-tight text-white">Стартовая точка</h2>
            <p className="mt-2 text-sm leading-6 text-soft">Сейчас прогресс чистый. Когда появятся вода, активность, питание и вес, графики начнут заполняться.</p>
          </div>
          <div className="rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-right">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-soft">вес</p>
            <p className="mt-1 text-xl font-extrabold text-white">{lastWeight ? `${lastWeight.weightKg} кг` : "нет"}</p>
            <p className="text-xs text-soft">{lastWeight ? formatDate(lastWeight.date) : "добавить в админке"}</p>
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
          <p className="mt-2 text-xl font-extrabold text-white">по плану</p>
          <p className="mt-1 text-xs text-soft">раз в неделю</p>
        </GlassCard>
        <GlassCard className="p-4">
          <CalendarDays className="mb-3 text-rose" size={21} />
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-soft">дней в отчете</p>
          <p className="mt-2 text-xl font-extrabold text-white">{dayReports.length}</p>
          <p className="mt-1 text-xs text-soft">карточки по датам</p>
        </GlassCard>
      </div>

      <ChartCard title="Вес по неделям" meta={<ChartMeta label="тренд" value={hasWeight ? `${weightDelta} кг` : "нет данных"} tone="violet" />}>
        {hasWeight ? (
          <ResponsiveContainer>
            <AreaChart data={weightData} margin={{ top: 8, right: 10, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[weightMin, weightMax]} tickFormatter={(value) => Number(value).toFixed(1)} tick={{ fill: "#a7a3b7", fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} кг`, "Вес"]} contentStyle={{ background: "#11111b", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16 }} />
              <Area type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} fill="#a78bfa33" dot={{ r: 4, fill: "#a78bfa" }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartText text="Первое взвешивание появится здесь после добавления в админке." />
        )}
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
          {selectedReport ? (
            <>
              <div className="rounded-[22px] bg-white/[0.04] p-3">
                <div className="flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setSelectedIndex((value) => Math.max(value - 1, 0))} disabled={selectedIndex === 0} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-white disabled:opacity-35">
                    <ChevronLeft size={22} />
                  </button>
                  <div className="min-w-0 text-center">
                    <p className="text-xl font-extrabold text-white">{formatDate(selectedReport.day.date)}</p>
                    <p className="text-xs font-bold text-soft">{Math.min(selectedIndex + 1, dayReports.length)} из {dayReports.length}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedIndex((value) => Math.min(value + 1, dayReports.length - 1))} disabled={selectedIndex >= dayReports.length - 1} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-white disabled:opacity-35">
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
              <DayReportCard day={selectedReport.day} eaten={selectedReport.eaten} burned={selectedReport.burned} balance={selectedReport.balance} score={selectedReport.score} />
            </>
          ) : (
            <EmptyChartText text="Пока нет дневных данных." />
          )}
        </div>
      </BottomSheet>
    </div>
  );
}

function DayReportCard({ day, eaten, burned, balance, score }: { day: { date: string; waterLiters: number; waterGoalLiters: number; steps: number }; eaten: number; burned: number; balance: number; score: number }) {
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

function EmptyChartText({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center px-6 text-center">
      <p className="text-sm leading-6 text-soft">{text}</p>
    </div>
  );
}
