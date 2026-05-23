import { useMemo, useState } from "react";
import { Activity, CalendarDays, Coins, Droplets, Gift, Scale, Utensils } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { ProgressBar } from "@/components/cards/ProgressBar";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { formatDate, formatNumber } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { TreatSlot } from "@/types";

type Sheet = "weight" | "water" | "steps" | "nutrition" | "points" | "reward" | "treat" | null;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function Admin() {
  const store = useAppStore();
  const today = store.dailyLogs[store.dailyLogs.length - 1];
  const [sheet, setSheet] = useState<Sheet>(null);
  const [draftNumber, setDraftNumber] = useState(0);
  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardPrice, setRewardPrice] = useState(500);
  const [rewardDescription, setRewardDescription] = useState("");
  const [treatStatus, setTreatStatus] = useState<TreatSlot["status"]>("available");
  const [treatDate, setTreatDate] = useState(today?.date ?? todayIso());

  const adminVisible = store.viewMode === "admin";

  const openNumber = (next: Exclude<Sheet, "reward" | "treat" | "nutrition" | null>, current: number) => {
    setDraftNumber(current);
    setSheet(next);
  };

  const rewardDefaults = useMemo(
    () => ({
      title: rewardTitle.trim() || "Новая награда",
      description: rewardDescription.trim() || "Добавлено вручную в админке",
      price: Math.max(1, Math.round(rewardPrice)),
    }),
    [rewardDescription, rewardPrice, rewardTitle],
  );

  if (!adminVisible) {
    return (
      <div className="space-y-4">
        <PageHeader title="Админ" subtitle="В режиме пользователя эта панель скрыта" />
        <GlassCard>
          <p className="text-sm leading-6 text-soft">Сейчас включен просмотр как пользователь. Админские действия и панель управления не показываются.</p>
        </GlassCard>
      </div>
    );
  }

  const applyNumber = async () => {
    if (sheet === "weight") await store.adminAddWeight(draftNumber);
    if (sheet === "water") await store.adminAddWater(draftNumber);
    if (sheet === "steps") await store.adminAddActivity(Math.round(draftNumber));
    if (sheet === "points") await store.adminAddPoints(Math.round(draftNumber));
    setSheet(null);
  };

  const applyReward = async () => {
    await store.adminCreateReward(rewardDefaults.title, rewardDefaults.price, rewardDefaults.description);
    setRewardTitle("");
    setRewardPrice(500);
    setRewardDescription("");
    setSheet(null);
  };

  const applyTreat = async () => {
    await store.adminSetTreatSlot(treatStatus, treatDate);
    setSheet(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Админ режим" subtitle="Точные ручные настройки без непонятных полей" />

      <GlassCard className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-soft">Баланс</p>
            <p className="text-3xl font-extrabold text-white">{formatNumber(store.profile.stars)} звезд</p>
          </div>
          <Button variant="secondary" onClick={() => openNumber("points", 20)}>
            <Coins size={18} /> Начислить
          </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <AdminTile icon={Droplets} title="Вода" value={`${today?.waterLiters.toFixed(1) ?? "0.0"} л`} text={`цель ${today?.waterGoalLiters ?? 2.5} л`} onClick={() => openNumber("water", today?.waterLiters ?? 0)} />
        <AdminTile icon={Activity} title="Шаги" value={formatNumber(today?.steps ?? 0)} text={`цель ${formatNumber(today?.activityGoal ?? 6500)}`} onClick={() => openNumber("steps", today?.steps ?? 0)} />
        <AdminTile icon={Scale} title="Вес" value={store.weightLogs.at(-1) ? `${store.weightLogs.at(-1)?.weightKg} кг` : "не задан"} text={store.weightLogs.at(-1) ? formatDate(store.weightLogs.at(-1)!.date) : "добавить взвешивание"} onClick={() => openNumber("weight", store.weightLogs.at(-1)?.weightKg ?? 70)} />
        <AdminTile icon={Utensils} title="Питание" value={today?.nutritionInPlan ? "в плане" : "сложный день"} text="переключить отметку" onClick={() => setSheet("nutrition")} />
        <AdminTile icon={CalendarDays} title="Вкусный слот" value={store.treatSlot.status} text={store.treatSlot.availableAt || "дата не задана"} onClick={() => setSheet("treat")} />
        <AdminTile icon={Gift} title="Награда" value="создать" text="товар в магазин" onClick={() => setSheet("reward")} />
      </div>

      <GlassCard className="p-4">
        <p className="mb-2 text-sm font-bold text-soft">Сегодня</p>
        <ProgressBar value={today?.waterLiters ?? 0} max={today?.waterGoalLiters ?? 2.5} className="h-2" />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold text-soft">
          <span>{today?.waterLiters.toFixed(1) ?? "0.0"} л воды</span>
          <span>{formatNumber(today?.steps ?? 0)} шагов</span>
          <span>{formatNumber(today?.caloriesBurned ?? 0)} ккал</span>
        </div>
      </GlassCard>

      <BottomSheet open={sheet === "water" || sheet === "steps" || sheet === "weight" || sheet === "points"} title="Регулировка значения" onClose={() => setSheet(null)}>
        <div className="space-y-4">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4 text-center">
            <p className="text-sm font-bold text-soft">Новое значение</p>
            <p className="mt-1 text-4xl font-extrabold text-white">{formatNumber(draftNumber)}</p>
            <input className="mt-5 w-full accent-cyan-300" type="range" min={sheet === "points" ? 1 : 0} max={sheet === "steps" ? 25000 : sheet === "weight" ? 150 : sheet === "points" ? 500 : 3} step={sheet === "weight" || sheet === "water" ? 0.1 : 1} value={draftNumber} onChange={(event) => setDraftNumber(Number(event.target.value))} />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[-10, -1, 1, 10].map((delta) => (
                <button key={delta} type="button" className="rounded-2xl bg-white/[0.06] px-2 py-2 text-xs font-bold text-white" onClick={() => setDraftNumber((value) => Math.max(0, Number((value + delta).toFixed(1))))}>
                  {delta > 0 ? "+" : ""}{delta}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={applyNumber}>Сохранить</Button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "nutrition"} title="Питание сегодня" onClose={() => setSheet(null)}>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={async () => { await store.adminSetNutrition(true); setSheet(null); }}>В плане</Button>
          <Button variant="secondary" onClick={async () => { await store.adminSetNutrition(false); setSheet(null); }}>Сложный день</Button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "reward"} title="Новая награда" onClose={() => setSheet(null)}>
        <div className="space-y-3">
          <TextInput value={rewardTitle} onChange={setRewardTitle} placeholder="Название" />
          <TextInput value={String(rewardPrice)} onChange={(value) => setRewardPrice(Number(value || 0))} placeholder="Цена в звездах" inputMode="numeric" />
          <TextInput value={rewardDescription} onChange={setRewardDescription} placeholder="Описание" />
          <Button className="w-full" onClick={applyReward}>Добавить в магазин</Button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "treat"} title="Вкусный слот" onClose={() => setSheet(null)}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(["locked", "available", "postponed"] as const).map((status) => (
              <button key={status} type="button" onClick={() => setTreatStatus(status)} className={`rounded-2xl px-3 py-3 text-xs font-bold ${treatStatus === status ? "bg-aqua text-ink" : "bg-white/[0.06] text-white"}`}>
                {status}
              </button>
            ))}
          </div>
          <input type="date" value={treatDate} onChange={(event) => setTreatDate(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-white/8 px-4 font-bold text-white outline-none" />
          <Button className="w-full" onClick={applyTreat}>Сохранить слот</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function AdminTile({ icon: Icon, title, value, text, onClick }: { icon: typeof Droplets; title: string; value: string; text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="glass min-h-[136px] rounded-[24px] p-4 text-left">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-aqua">
        <Icon size={20} />
      </div>
      <h2 className="text-sm font-black uppercase tracking-[0.08em] text-soft">{title}</h2>
      <p className="mt-2 text-xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-soft">{text}</p>
    </button>
  );
}

function TextInput({ value, onChange, placeholder, inputMode = "text" }: { value: string; onChange: (value: string) => void; placeholder: string; inputMode?: "text" | "numeric" | "decimal" }) {
  return (
    <input value={value} onChange={(event) => onChange(event.target.value)} inputMode={inputMode} className="h-12 w-full rounded-2xl border border-white/10 bg-white/8 px-4 font-bold text-white outline-none focus:border-aqua/70" placeholder={placeholder} />
  );
}
