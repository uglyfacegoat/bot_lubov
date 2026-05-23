import { Check, Crown, Lock, Star } from "lucide-react";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { ProgressBar } from "@/components/cards/ProgressBar";
import { useAppStore } from "@/store/useAppStore";

const levels = Array.from({ length: 20 }, (_, index) => {
  const level = index + 1;
  return {
    level,
    stars: level <= 5 ? level * 10 : 50 + (level - 5) * 15,
    title: level % 5 === 0 ? "Большая награда" : level % 3 === 0 ? "Бонус стабильности" : "Новый уровень",
  };
});

export function Levels() {
  const profile = useAppStore((state) => state.profile);

  return (
    <div className="space-y-4">
      <PageHeader title="Дорога уровней" subtitle="За стабильность, воду, активность и честность" />
      <GlassCard className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-soft">Текущий уровень</p>
            <p className="text-3xl font-extrabold text-white">{profile.level}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/12 text-gold">
            <Crown size={24} />
          </div>
        </div>
        <ProgressBar value={profile.xp} max={profile.xpToNextLevel} className="h-2" />
        <p className="mt-2 text-xs text-soft">{profile.xp}/{profile.xpToNextLevel} XP до уровня {profile.level + 1}</p>
      </GlassCard>

      <div className="space-y-3">
        {levels.map((item) => {
          const done = item.level < profile.level;
          const active = item.level === profile.level;
          return (
            <div key={item.level} className="relative pl-8">
              <div className="absolute left-[14px] top-0 h-full w-px bg-white/10" />
              <div className={`absolute left-0 top-5 flex h-7 w-7 items-center justify-center rounded-full border ${done ? "border-emerald-300 bg-emerald-300 text-ink" : active ? "border-aqua bg-aqua text-ink" : "border-white/12 bg-[#15151d] text-soft"}`}>
                {done ? <Check size={15} /> : active ? <Star size={14} fill="currentColor" /> : <Lock size={13} />}
              </div>
              <GlassCard className={`p-4 ${active ? "border-aqua/35" : ""}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-soft">Уровень {item.level}</p>
                    <h2 className="mt-1 text-base font-extrabold text-white">{item.title}</h2>
                  </div>
                  <div className="rounded-2xl bg-gold/12 px-3 py-2 text-sm font-extrabold text-gold">
                    +{item.stars} ★
                  </div>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
