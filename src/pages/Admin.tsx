import { useState } from "react";
import {
  Activity,
  Coins,
  Droplets,
  Gift,
  Heart,
  Scale,
  Settings2,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { BottomSheet } from "@/components/modals/BottomSheet";
import { useAppStore } from "@/store/useAppStore";
import type { Mood } from "@/types";

type AdminAction =
  | "weight"
  | "water"
  | "activity"
  | "nutrition"
  | "mood"
  | "unplanned"
  | "addPoints"
  | "spendPoints"
  | "treat"
  | "reward";

const actions: Array<{ id: AdminAction; title: string; text: string; icon: typeof Scale }> = [
  { id: "weight", title: "Добавить вес", text: "Раз в неделю, только как данные", icon: Scale },
  { id: "water", title: "Добавить воду", text: "Обновить литры сегодня", icon: Droplets },
  { id: "activity", title: "Добавить активность", text: "Шаги или прогулка", icon: Activity },
  { id: "nutrition", title: "Отметить питание", text: "В плане без оценок", icon: Utensils },
  { id: "mood", title: "Отметить настроение", text: "Мягкая дневная отметка", icon: Heart },
  { id: "unplanned", title: "Внеплановая еда", text: "Честность + возвращение", icon: Sparkles },
  { id: "addPoints", title: "Начислить баллы", text: "За полезные действия", icon: Coins },
  { id: "spendPoints", title: "Списать баллы", text: "Ручная корректировка", icon: Coins },
  { id: "treat", title: "Настроить слот", text: "Сделать доступным", icon: Settings2 },
  { id: "reward", title: "Создать награду", text: "Добавить вариант в магазин", icon: Gift },
];

export function Admin() {
  const store = useAppStore();
  const [sheet, setSheet] = useState<AdminAction | null>(null);
  const [value, setValue] = useState("");

  if (!store.profile.isAdmin) {
    return (
      <div className="space-y-4">
        <PageHeader title="Админ" subtitle="Доступ закрыт" />
        <GlassCard>
          <p className="text-soft">Админский доступ выключен.</p>
        </GlassCard>
      </div>
    );
  }

  const close = () => {
    setSheet(null);
    setValue("");
  };

  const submit = () => {
    const numberValue = Number(value || 0);
    if (sheet === "weight") store.adminAddWeight(numberValue || 71.5);
    if (sheet === "water") store.adminAddWater(numberValue || 1.5);
    if (sheet === "activity") store.adminAddActivity(numberValue || 7500);
    if (sheet === "nutrition") store.adminSetNutrition(true);
    if (sheet === "mood") store.adminSetMood((value as Mood) || "good");
    if (sheet === "unplanned") store.adminMarkUnplannedFood();
    if (sheet === "addPoints") store.adminAddPoints(numberValue || 20);
    if (sheet === "spendPoints") store.adminSpendPoints(numberValue || 20);
    if (sheet === "treat") store.adminSetTreatAvailable();
    if (sheet === "reward") store.adminCreateReward(value || "Новая награда");
    close();
  };

  const numeric = ["weight", "water", "activity", "addPoints", "spendPoints"].includes(sheet ?? "");
  const showInput = numeric || sheet === "mood" || sheet === "reward";

  return (
    <div className="space-y-4">
      <PageHeader title="Админ режим" subtitle="Управление системой через backend" />
      <GlassCard>
        <p className="text-sm leading-6 text-soft">
            Здесь действия сохраняются через backend. Минусовые баллы за еду, вес или сложный день не используются.
        </p>
      </GlassCard>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => setSheet(action.id)}
              className="glass min-h-[142px] rounded-[24px] p-4 text-left"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-aqua">
                <Icon size={20} />
              </div>
              <h2 className="font-black leading-5 text-white">{action.title}</h2>
              <p className="mt-2 text-xs leading-5 text-soft">{action.text}</p>
            </button>
          );
        })}
      </div>

      <BottomSheet open={sheet !== null} title={actions.find((item) => item.id === sheet)?.title ?? "Действие"} onClose={close}>
        <div className="space-y-4">
          {showInput ? (
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-soft">
                {sheet === "mood" ? "calm, good, tired, heavy, inspired" : sheet === "reward" ? "Название награды" : "Значение"}
              </span>
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                inputMode={numeric ? "decimal" : "text"}
                className="h-13 w-full rounded-2xl border border-white/10 bg-white/8 px-4 font-bold text-white outline-none focus:border-aqua/70"
                placeholder={sheet === "reward" ? "Например: Завтрак в городе" : "Введите значение"}
              />
            </label>
          ) : (
            <p className="text-sm leading-6 text-soft">Подтвердите действие. Оно сразу сохранится в системе.</p>
          )}
          <Button className="w-full" onClick={submit}>Применить</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
