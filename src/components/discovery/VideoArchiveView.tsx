"use client";

import Link from "next/link";
import { ChevronRight, Calendar, MapPin, Play, Eye, Bookmark, PlayCircle } from "lucide-react";
import UnifiedCategoryFilter from "./UnifiedCategoryFilter";
import HoverVideo from "./HoverVideo";

export default function VideoArchiveView({ category, items, count }: { category: any, items: any[], count: number }) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-8 text-slate-500 dark:text-slate-400 font-sans">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[var(--color-primary)] font-medium">{category.label}</span>
      </nav>

      {/* Page Title & Intro */}
      <div className="mb-12 border-l-4 border-[var(--color-primary)] pl-6">
        <h2 className="text-4xl font-bold mb-3">{category.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg opacity-90 leading-relaxed font-sans">
          {category.desc}
        </p>
      </div>

      {/* Unified Search & Filter System */}
      <UnifiedCategoryFilter 
        totalCount={count}
        quickTags={[
          {label: '历史纪实', value: 'history'}, 
          {label: '民俗文化', value: 'culture'}, 
          {label: '口述历史', value: 'oral'}
        ]}
        yearOptions={[
          {label: '2000年代及之前', value: 'pre-2000'}, 
          {label: '2001-2010', value: '2000s'},
          {label: '2011至今', value: 'post-2010'}
        ]}
        locationOptions={[
          {label: '拉萨', value: '拉萨'}, 
          {label: '日喀则', value: '日喀则'},
          {label: '那曲', value: '那曲'}
        ]}
      />

      {/* List */}
      <div className="grid gap-8">
        {items.map((item) => (
          <Link key={item.id} href={`/asset/${item.id}`} className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[var(--color-primary)]/5 block">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Thumbnail with Play Icon */}
              <div className="relative lg:w-2/5 aspect-video overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
                <HoverVideo id={item.id} url={item.url} hasLinkWrapper={false} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              {/* Content */}
              <div className="p-6 lg:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold rounded uppercase tracking-wider">
                      历史纪实
                    </span>
                    {item.year && (
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 font-sans">
                        <Calendar className="w-4 h-4" /> {item.year}
                      </span>
                    )}
                    {item.location && (
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 font-sans">
                        <MapPin className="w-4 h-4" /> {item.location}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3 font-sans">
                    {item.story || "暂无描述信息。"}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto font-sans">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1 text-xs"><Eye className="w-4 h-4" /> 12.4k</span>
                    <span className="flex items-center gap-1 text-xs"><Bookmark className="w-4 h-4" /> 收藏</span>
                  </div>
                  <span className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-bold hover:bg-[var(--color-primary)]/90 transition-colors shadow-md">
                    <PlayCircle className="w-5 h-5" />
                    立即播放
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-20 text-center text-slate-500 font-sans border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
          暂无该类别档案记录。
        </div>
      )}
    </main>
  );
}
