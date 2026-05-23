import type { ReactNode } from "react";
import { GlassCard } from "@/components/cards/GlassCard";

interface ChartCardProps {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, meta, children }: ChartCardProps) {
  return (
    <GlassCard className="p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-base font-extrabold text-white">{title}</h2>
        {meta ? <div className="shrink-0">{meta}</div> : null}
      </div>
      <div className="h-60 min-h-60 w-full min-w-0">{children}</div>
    </GlassCard>
  );
}
