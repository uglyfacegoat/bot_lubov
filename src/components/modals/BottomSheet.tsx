import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/buttons/Button";

interface BottomSheetProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/78 px-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="max-h-[calc(100dvh-32px)] w-full max-w-[430px] overflow-y-auto rounded-[28px] border border-white/10 bg-[#111118] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.72)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white">{title}</h2>
              <Button variant="secondary" className="h-12 w-12 shrink-0 rounded-full p-0" onClick={onClose} aria-label="Закрыть">
                <X size={24} />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
