"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface FilterOption {
  label: string;
  value: string;
}

interface UnifiedCategoryFilterProps {
  placeholder?: string;
  quickTags?: FilterOption[];
  yearOptions?: FilterOption[];
  locationOptions?: FilterOption[];
  totalCount: number;
}

export default function UnifiedCategoryFilter({
  placeholder = "搜索名称、描述或关键字...",
  quickTags = [],
  yearOptions = [],
  locationOptions = [],
  totalCount = 0
}: UnifiedCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Read current URL state
  const currentQuery = searchParams.get('q') || '';
  const currentTag = searchParams.get('tag') || '';
  const currentYear = searchParams.get('year') || '';
  const currentLocation = searchParams.get('location') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [localQuery, setLocalQuery] = useState(currentQuery);

  // Sync Search Bar
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: localQuery.trim() });
  };

  // Generic param updater
  const updateParams = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    const search = current.toString();
    const queryStr = search ? `?${search}` : "";
    router.push(`${pathname}${queryStr}`, { scroll: false });
  };

  return (
    <div className="mb-10 font-sans flex flex-col gap-4">
      
      {/* 1. Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col w-full group">
        <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-slate-800 shadow-sm border border-[var(--color-primary)]/10 group-focus-within:border-[var(--color-primary)]/40 transition-all">
          <button type="submit" className="text-[var(--color-primary)]/50 flex items-center justify-center pl-4 pr-2 hover:text-[var(--color-primary)] transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <input 
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 px-2 text-base placeholder:text-slate-400 outline-none" 
            placeholder={placeholder} 
          />
        </div>
      </form>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-primary)]/10 pb-6">
        
        {/* 2. Quick Tag Pills (Scrollable horizontally) */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex-1 w-full md:w-auto">
          <button 
            onClick={() => updateParams({ tag: null })}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors border ${
              !currentTag 
                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)]'
            }`}
          >
            全部
          </button>
          {quickTags.map((tag) => (
            <button 
              key={tag.value}
              onClick={() => updateParams({ tag: tag.value })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors border ${
                currentTag === tag.value 
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' 
                  : 'bg-[var(--color-primary)]/5 dark:bg-slate-800 border-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* 3. Dimensional Select Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
          
          {/* Year Select (If options provided) */}
          {yearOptions.length > 0 && (
            <div className="relative group/select block">
              <select 
                value={currentYear}
                onChange={(e) => updateParams({ year: e.target.value === 'all' ? null : e.target.value })}
                className="appearance-none bg-white dark:bg-black/20 border border-[var(--color-primary)]/20 rounded-lg pl-4 pr-10 py-1.5 text-sm font-medium hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors cursor-pointer text-slate-700 dark:text-slate-200 w-full sm:w-auto"
              >
                <option value="all">全部年代</option>
                {yearOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover/select:text-[var(--color-primary)] transition-colors" />
            </div>
          )}

          {/* Location Select (If options provided) */}
          {locationOptions.length > 0 && (
            <div className="relative group/select block">
              <select 
                value={currentLocation}
                onChange={(e) => updateParams({ location: e.target.value === 'all' ? null : e.target.value })}
                className="appearance-none bg-white dark:bg-black/20 border border-[var(--color-primary)]/20 rounded-lg pl-4 pr-10 py-1.5 text-sm font-medium hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors cursor-pointer text-slate-700 dark:text-slate-200 w-full sm:w-auto"
              >
                <option value="all">全部地区</option>
                {locationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover/select:text-[var(--color-primary)] transition-colors" />
            </div>
          )}

          {/* Sort Select */}
          <div className="relative group/select block">
            <select 
              value={currentSort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="appearance-none bg-white dark:bg-black/20 border border-[var(--color-primary)]/20 rounded-lg pl-4 pr-10 py-1.5 text-sm font-medium hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors cursor-pointer text-slate-700 dark:text-slate-200 w-full sm:w-auto"
            >
              <option value="newest">最新上传</option>
              <option value="oldest">最早记录</option>
              <option value="popular">浏览热度</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover/select:text-[var(--color-primary)] transition-colors" />
          </div>

        </div>
      </div>
      
      {/* Result Count Status */}
      <div className="text-sm text-slate-500 flex items-center justify-end font-display">
         共找到 <span className="text-[var(--color-primary)] font-bold text-lg mx-1 tabular-nums">{totalCount}</span> 份数字藏品
      </div>

    </div>
  );
}
