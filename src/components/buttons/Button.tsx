import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" &&
          "bg-gradient-to-r from-violet via-rose to-aqua text-ink shadow-[0_16px_44px_rgba(167,139,250,0.28)]",
        variant === "secondary" && "glass text-white hover:bg-white/10",
        variant === "ghost" && "text-soft hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
