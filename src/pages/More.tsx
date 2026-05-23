import { Crown, Dumbbell, HeartHandshake, Settings, Sparkles, ScrollText, Target } from "lucide-react";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { useAppStore } from "@/store/useAppStore";
import type { PageId } from "@/types";

const items: Array<{ page: PageId; title: string; text: string; icon: typeof Dumbbell }> = [
  { page: "activity", title: "Активность", text: "Квесты движения", icon: Dumbbell },
  { page: "quests", title: "Задания дня", text: "Выбор объема и звезд", icon: Target },
  { page: "levels", title: "Уровни", text: "Дорога до 20 уровня", icon: Crown },
  { page: "treat", title: "Вкусный слот", text: "Запланированная радость", icon: Sparkles },
  { page: "rules", title: "Правила", text: "Без наказаний и стыда", icon: ScrollText },
  { page: "admin", title: "Админ", text: "Ручное управление данными", icon: Settings },
];

export function More() {
  const setPage = useAppStore((state) => state.setPage);

  return (
    <div className="space-y-4">
      <PageHeader title="Еще" subtitle="Дополнительные разделы" />
      <GlassCard className="flex items-center gap-3">
        <HeartHandshake className="text-rose" size={24} />
        <p className="text-sm leading-6 text-soft">Система построена на поддержке: действия дают звезды, но вес не дает баллы.</p>
      </GlassCard>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.page} type="button" onClick={() => setPage(item.page)} className="glass flex w-full items-center gap-4 rounded-[24px] p-5 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-aqua">
                <Icon size={22} />
              </div>
              <div>
                <h2 className="font-black text-white">{item.title}</h2>
                <p className="text-sm text-soft">{item.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
