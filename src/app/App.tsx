import { useEffect } from "react";
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
  useEffect(() => {
    telegram.init();
  }, []);

  return (
    <AppShell>
      <CurrentPage />
    </AppShell>
  );
}
