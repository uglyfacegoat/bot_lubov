import { CalendarPlus, CheckCircle2, Clock, IceCreamBowl } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { useAppStore } from "@/store/useAppStore";

const options = ["Роллы", "Бургер", "Пицца", "Десерт", "Ресторан", "Другое"];

export function TreatSlot() {
  const { treatSlot, useTreatSlot: applyTreatSlot, postponeTreatSlot } = useAppStore();

  return (
    <div className="space-y-4">
      <PageHeader title="Вкусный слот" subtitle="Это часть плана, а не срыв" />
      <GlassCard className="text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-rose/15 text-rose">
          {treatSlot.status === "used" ? <CheckCircle2 size={34} /> : <IceCreamBowl size={34} />}
        </div>
        {treatSlot.status === "used" ? (
          <>
            <h2 className="text-2xl font-black text-white">Слот использован</h2>
            <p className="mt-3 text-sm leading-6 text-soft">
              Завтра обычный режим. Не урезаем еду, не отрабатываем тренировкой, не наказываем себя.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white">
              {treatSlot.status === "available" ? "Доступен сегодня" : `${treatSlot.daysUntilAvailable} дня до слота`}
            </h2>
            <p className="mt-3 text-sm leading-6 text-soft">
              Вкусная еда запланирована заранее, поэтому она не ломает систему.
            </p>
          </>
        )}
      </GlassCard>

      {treatSlot.status === "available" ? (
        <GlassCard>
          <h2 className="mb-4 text-lg font-black text-white">Выбрать вариант</h2>
          <div className="grid grid-cols-2 gap-3">
            {options.map((option) => (
              <Button key={option} variant="secondary" onClick={() => applyTreatSlot(option)}>
                {option}
              </Button>
            ))}
          </div>
          <Button className="mt-3 w-full" variant="ghost" onClick={postponeTreatSlot}>
            <CalendarPlus size={18} /> Перенести
          </Button>
        </GlassCard>
      ) : treatSlot.status !== "used" ? (
        <GlassCard>
          <div className="flex items-center gap-3">
            <Clock className="text-aqua" size={22} />
            <p className="text-sm leading-6 text-soft">Можно открыть слот в админке или дождаться запланированной даты.</p>
          </div>
        </GlassCard>
      ) : null}
    </div>
  );
}
