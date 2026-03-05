"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onKeyDown]);

  return (
    <AnimatePresence>
      <div 
        ref={overlay} 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        onClick={onClick}
      >
        <motion.div
          ref={wrapper}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="relative w-[96vw] h-[96vh] bg-transparent rounded-sm shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 left-4 z-50 p-2 text-white hover:text-zinc-300 transition-colors flex flex-col items-center cursor-pointer mix-blend-difference"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex-1 overflow-hidden h-full flex flex-col">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
