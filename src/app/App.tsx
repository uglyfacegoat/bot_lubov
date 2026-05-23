import { useEffect } from "react";
import { Button } from "@/components/buttons/Button";
import { GlassCard } from "@/components/cards/GlassCard";
import { AppShell } from "@/components/layout/AppShell";
import { telegram } from "@/lib/telegram";
import { Activity } from "@/pages/Activity";
import { Admin } from "@/pages/Admin";
import { Dashboard } from "@/pages/Dashboard";
import { Levels } from "@/pages/Levels";
import { More } from "@/pages/More";
import { Progress } from "@/pages/Progress";
import { Quests } from "@/pages/Quests";
import { Rules } from "@/pages/Rules";
import { Shop } from "@/pages/Shop";
import { TreatSlot } from "@/pages/TreatSlot";
import { Water } from "@/pages/Water";
import { useAppStore } from "@/store/useAppStore";

function CurrentPage() {
  const activePage = useAppStore((state) => state.activePage);

  if (activePage === "progress") return <Progress />;
  if (activePage === "water") return <Water />;
  if (activePage === "activity") return <Activity />;
  if (activePage === "treat") return <TreatSlot />;
  if (activePage === "shop") return <Shop />;
  if (activePage === "rules") return <Rules />;
  if (activePage === "admin") return <Admin />;
  if (activePage === "levels") return <Levels />;
  if (activePage === "quests") return <Quests />;
  if (activePage === "more") return <More />;
  return <Dashboard />;
}

export default function App() {
  const hydrate = useAppStore((state) => state.hydrate);
  const isHydrated = useAppStore((state) => state.isHydrated);
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.error);

  useEffect(() => {
    telegram.init();
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <AppShell>
        <div className="flex min-h-[70svh] items-center">
          <GlassCard className="w-full p-5 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-aqua/25 border-t-aqua" />
            <h1 className="text-xl font-extrabold text-white">{isLoading ? "Загружаю данные" : "Backend подключается"}</h1>
            <p className="mt-2 text-sm leading-6 text-soft">
              {error ? "Render мог уснуть. Первый запуск на free-тарифе иногда занимает до минуты." : "Берём актуальные цифры из Supabase через API."}
            </p>
            {error ? (
              <Button className="mt-4 w-full" onClick={() => void hydrate()}>
                Повторить
              </Button>
            ) : null}
          </GlassCard>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <CurrentPage />
    </AppShell>
  );
}
