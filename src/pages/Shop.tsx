import { Lock, RotateCcw, Star } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { PageHeader } from "@/components/cards/PageHeader";
import { formatNumber } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export function Shop() {
  const { profile, rewards, buyReward } = useAppStore();

  return (
    <div className="space-y-4">
      <PageHeader title="Магазин наград" subtitle="Награды можно покупать повторно" />
      <GlassCard className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-semibold text-soft">Баланс</p>
          <p className="text-3xl font-extrabold text-white">{formatNumber(profile.stars)}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/12 text-gold">
          <Star fill="currentColor" size={23} />
        </div>
      </GlassCard>
      <div className="space-y-3">
        {rewards.map((reward) => {
          const missing = reward.price - profile.stars;
          const canBuy = profile.stars >= reward.price;
          return (
            <GlassCard key={reward.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-extrabold text-white">{reward.title}</h2>
                    {reward.purchasedCount > 0 ? (
                      <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[11px] font-bold text-emerald-200">
                        куплено {reward.purchasedCount}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-5 text-soft">{reward.description}</p>
                </div>
                <p className="shrink-0 rounded-2xl bg-gold/12 px-3 py-2 text-sm font-extrabold text-gold">{reward.price}</p>
              </div>
              <Button className="mt-4 w-full" disabled={!canBuy} onClick={() => buyReward(reward.id)}>
                {canBuy ? (
                  <>
                    <RotateCcw size={18} /> Купить
                  </>
                ) : (
                  <>
                    <Lock size={18} /> Осталось {formatNumber(Math.max(missing, 0))}
                  </>
                )}
              </Button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
