"use client";

import React, { useState, useTransition } from "react";
import { Search, SlidersHorizontal, MapPin, Calendar, FileType, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [story, setStory] = useState(searchParams.get("story") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [yearStart, setYearStart] = useState(searchParams.get("yearStart") || "");
  const [yearEnd, setYearEnd] = useState(searchParams.get("yearEnd") || "");
  const [mediaType, setMediaType] = useState(searchParams.get("mediaType") || "");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (title) params.set("title", title);
    if (story) params.set("story", story);
    if (location) params.set("location", location);
    if (yearStart) params.set("yearStart", yearStart);
    if (yearEnd) params.set("yearEnd", yearEnd);
    if (mediaType) params.set("mediaType", mediaType);

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setQuery("");
    setTitle("");
    setStory("");
    setLocation("");
    setYearStart("");
    setYearEnd("");
    setMediaType("");
    router.push("/");
  };

  const hasActiveFilters = !!(query || title || story || location || yearStart || yearEnd || mediaType);

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 relative z-20">
      <form 
        onSubmit={handleSearch}
        className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-full rounded-2xl border border-zinc-200 p-2 flex flex-col sm:flex-row items-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
      >
        <div className="flex-1 flex items-center w-full px-4 py-2 sm:py-0">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="搜索故事、标题或事件..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400 font-medium text-lg leading-relaxed"
          />
          {hasActiveFilters && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="ml-2 text-zinc-400 hover:text-zinc-900 p-1 bg-zinc-100 rounded-full transition-colors"
               aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex sm:flex-row w-full sm:w-auto mt-2 sm:mt-0 px-2 sm:px-0 gap-2">
          <div className="hidden sm:block w-px h-8 bg-zinc-200 mx-2 self-center"></div>
          
          <button 
            type="button" 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-3 sm:py-2.5 rounded-full text-sm font-medium transition-colors ${
              isAdvancedOpen || hasActiveFilters 
                ? "bg-zinc-100 text-zinc-900" 
                : "text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            高级搜索 
          </button>
          
          <button 
            type="submit" 
            className="flex-1 sm:flex-none bg-[var(--color-primary)] text-white px-8 py-3 sm:py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-background-light)] hover:text-[var(--color-primary)] transition-colors shadow-sm"
          >
            探索
          </button>
        </div>
      </form>

      {/* Advanced Filter Panel Dropdown */}
      {isAdvancedOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden transform-gpu origin-top animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* Title */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                <Search className="w-4 h-4 mr-2 text-zinc-400" /> 标题
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="标题包含..."
                className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Story */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                <FileType className="w-4 h-4 mr-2 text-zinc-400" /> 故事
              </label>
              <input 
                type="text" 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="故事包含..."
                className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
              />
            </div>
            
            {/* Location */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 mr-2 text-zinc-400" /> 位置 / 地理
              </label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="位置包含..."
                className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Time / Year */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                <Calendar className="w-4 h-4 mr-2 text-zinc-400" /> 时间 / 年代
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder="从 (YYYY)"
                  value={yearStart}
                  onChange={(e) => setYearStart(e.target.value)}
                  className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400 text-center"
                />
                <span className="text-zinc-300">-</span>
                <input 
                  type="number" 
                  placeholder="到 (YYYY)"
                  value={yearEnd}
                  onChange={(e) => setYearEnd(e.target.value)}
                  className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400 text-center"
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                <FileType className="w-4 h-4 mr-2 text-zinc-400" /> 材料类型
              </label>
              <select 
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all text-zinc-900 cursor-pointer appearance-none"
              >
                <option value="">所有格式</option>
                <option value="image">Photography & Images</option>
                <option value="video">Moving Pictures (Video)</option>
                <option value="audio">Oral Histories (Audio)</option>
                <option value="document">Texts & Documents</option>
              </select>
            </div>

          </div>
          
          {/* Action Footer */}
          <div className="bg-zinc-50/80 backdrop-blur border-t border-zinc-100 px-8 py-4 flex justify-between items-center">
            <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
               Deep Archival Search
            </span>
            <button 
              onClick={() => {
                handleSearch();
                setIsAdvancedOpen(false);
              }}
               className="text-sm font-medium px-6 py-2 bg-white border border-zinc-200 shadow-sm rounded-full text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              应用筛选
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
