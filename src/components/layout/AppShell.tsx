import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Droplets, Home, MoreHorizontal, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { PageId } from "@/types";

const navItems: Array<{ id: PageId; label: string; icon: typeof Home }> = [
  { id: "dashboard", label: "Главная", icon: Home },
  { id: "progress", label: "Прогресс", icon: BarChart3 },
  { id: "water", label: "Вода", icon: Droplets },
  { id: "shop", label: "Магазин", icon: ShoppingBag },
  { id: "more", label: "Еще", icon: MoreHorizontal },
];

export function AppShell({ children }: { children: ReactNode }) {
  const activePage = useAppStore((state) => state.activePage);
  const setPage = useAppStore((state) => state.setPage);
  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);

  return (
    <div className="relative z-10 mx-auto min-h-svh max-w-[460px] overflow-hidden bg-[#07070d] shadow-[0_0_90px_rgba(0,0,0,0.62)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 mx-auto h-56 max-w-[460px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,143,199,0.1),transparent_66%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto h-36 max-w-[460px] bg-[radial-gradient(circle_at_50%_100%,rgba(116,216,255,0.07),transparent_62%)]" />
      <main className="safe-bottom relative px-4 pt-5">
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.04] p-1">
          <button
            type="button"
            onClick={() => setViewMode("user")}
            className={`rounded-xl px-3 py-2 text-xs font-bold ${viewMode === "user" ? "bg-aqua text-ink" : "text-soft"}`}
          >
            Как пользователь
          </button>
          <button
            type="button"
            onClick={() => setViewMode("admin")}
            className={`rounded-xl px-3 py-2 text-xs font-bold ${viewMode === "admin" ? "bg-gold text-ink" : "text-soft"}`}
          >
            Как админ
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[460px] border-t border-white/10 bg-[#090910] px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected =
              activePage === item.id ||
              ((activePage === "activity" ||
                activePage === "treat" ||
                activePage === "rules" ||
                activePage === "admin" ||
                activePage === "levels" ||
                activePage === "quests") &&
                item.id === "more");
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                className={cn(
                  "relative flex h-[58px] flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold text-soft transition focus:outline-none",
                  selected && "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
                )}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
