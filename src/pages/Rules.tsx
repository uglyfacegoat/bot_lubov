import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";

const rules = [
  "Взвешиваемся только 1 раз в неделю",
  "Вес это данные, а не оценка",
  "Вкусный слот это часть плана, а не срыв",
  "После вкусного слота ничего не отрабатываем",
  "Внеплановая еда не означает, что день провален",
  "Голодовки запрещены",
  "Тренировки не используются как наказание",
  "Если тяжело, план корректируется, а не ужесточается",
  "Главная цель стабильность, а не идеальность",
  "Мы делаем это вместе",
];

export function Rules() {
  return (
    <div className="space-y-4">
      <PageHeader title="Правила системы" subtitle="Поддержка, стабильность, честность" />
      <div className="space-y-3">
        {rules.map((rule, index) => (
          <GlassCard key={rule} className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet/15 text-violet">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-soft">Правило {index + 1}</p>
              <p className="mt-1 font-bold leading-6 text-white">{rule}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
