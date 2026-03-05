"use client";

import React, { useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface TimelineSliderProps {
  startYear?: number;
  endYear?: number;
}

export default function TimelineSlider({ startYear = 1900, endYear = 2026 }: TimelineSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const currentYearStart = searchParams.get("yearStart");
  const currentYearEnd = searchParams.get("yearEnd");
  
  // A simple heuristic: if start and end are the same, that's our selected single year.
  const selectedYear = (currentYearStart === currentYearEnd && currentYearStart) 
    ? parseInt(currentYearStart) 
    : null;

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const handleYearClick = (year: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedYear === year) {
      // Toggle off
      params.delete("yearStart");
      params.delete("yearEnd");
    } else {
      // Toggle on
      params.set("yearStart", year.toString());
      params.set("yearEnd", year.toString());
    }
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Auto-scroll to selected year on mount if any
  useEffect(() => {
    if (selectedYear && scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector(`[data-year="${selectedYear}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedYear]);

  return (
    <div className="w-full border-t border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 mb-12 shadow-sm">
      <div 
        ref={scrollRef}
        className="flex items-center overflow-x-auto hide-scrollbar px-8 py-4 space-x-1 sm:space-x-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        
        {years.map(year => {
          const isSelected = selectedYear === year;
          // Show bold indicator for decades
          const isDecade = year % 10 === 0;

          return (
            <button
               key={year}
               data-year={year}
               onClick={() => handleYearClick(year)}
               className={`relative flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                 isSelected 
                  ? "bg-zinc-900 text-white font-semibold shadow-md transform scale-105" 
                  : isDecade 
                    ? "font-semibold text-zinc-900 hover:bg-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
               }`}
            >
              {year}
              {isDecade && !isSelected && (
                 <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-zinc-300 rounded-full transform -translate-x-1/2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
