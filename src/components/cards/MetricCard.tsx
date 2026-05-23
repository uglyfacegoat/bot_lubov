import type { ReactNode } from "react";
import { GlassCard } from "@/components/cards/GlassCard";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}

export function MetricCard({ icon, label, value, detail }: MetricCardProps) {
  return (
    <GlassCard className="min-h-[116px] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8 text-aqua">
        {icon}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-soft">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs text-soft">{detail}</p>
    </GlassCard>
  );
}
