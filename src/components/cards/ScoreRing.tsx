import { motion } from "framer-motion";
import { clamp } from "@/lib/utils";

interface ScoreRingProps {
  value: number;
  label: string;
  size?: number;
}

export function ScoreRing({ value, label, size = 118 }: ScoreRingProps) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = clamp(value, 0, 100);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 112 112" className="absolute inset-0 -rotate-90">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="10" />
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeLinecap="round"
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="12" x2="100" y1="12" y2="100">
            <stop stopColor="#74d8ff" />
            <stop offset="0.48" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#ff8fc7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <p className="text-3xl font-black leading-none text-white">{progress}%</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-soft">{label}</p>
      </div>
    </div>
  );
}
