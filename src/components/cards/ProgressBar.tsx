import { motion } from "framer-motion";
import { clamp, cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
  const percent = clamp((value / max) * 100, 0, 100);
  return (
    <div className={cn("h-3 overflow-hidden rounded-full bg-white/10", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-violet via-rose to-aqua"
      />
    </div>
  );
}
