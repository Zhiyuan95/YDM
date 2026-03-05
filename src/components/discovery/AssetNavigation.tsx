"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function AssetNavigation({ nextId, prevId }: { nextId?: string, prevId?: string }) {
  const router = useRouter();

  const handleNext = useCallback(() => {
    if (nextId) router.replace(`/asset/${nextId}`, { scroll: false });
  }, [nextId, router]);

  const handlePrev = useCallback(() => {
    if (prevId) router.replace(`/asset/${prevId}`, { scroll: false });
  }, [prevId, router]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input (just in case)
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <>
      {prevId && (
        <button 
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-2 text-white/30 hover:text-white transition-colors group"
          title="Previous Asset (Arrow Left)"
        >
          <ChevronLeft className="w-10 h-10 group-active:scale-95 transition-transform" strokeWidth={1.5} />
        </button>
      )}
      {nextId && (
        <button 
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-2 text-white/30 hover:text-white transition-colors group"
          title="Next Asset (Arrow Right)"
        >
          <ChevronRight className="w-10 h-10 group-active:scale-95 transition-transform" strokeWidth={1.5} />
        </button>
      )}
    </>
  );
}
