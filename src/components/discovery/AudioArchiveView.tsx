"use client";

import Link from "next/link";
import { ChevronRight, Calendar, MapPin, Play } from "lucide-react";
import UnifiedCategoryFilter from "./UnifiedCategoryFilter";

export default function AudioArchiveView({ category, items, count }: { category: any, items: any[], count: number }) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8 font-sans">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[var(--color-primary)] font-medium">{category.label}</span>
      </nav>

      {/* Page Title & Filter */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl font-sans mb-6">
          {category.desc}
        </p>

        {/* Unified Search & Filter System */}
        <UnifiedCategoryFilter 
          placeholder="搜索音频名称、录制地或关键字..."
          totalCount={count}
          quickTags={[
            {label: '民间歌谣', value: 'folksong'}, 
            {label: '僧侣诵经', value: 'chanting'}, 
            {label: '格萨尔王传', value: 'gesar'}, 
            {label: '生活劳作', value: 'labor'}
          ]}
          locationOptions={[
            {label: '拉萨', value: '拉萨'}, 
            {label: '果洛', value: '果洛'}
          ]}
        />
      </div>

      {/* Audio List */}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900/40 rounded-xl p-6 border border-[var(--color-primary)]/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 group cursor-pointer block">
                <Link href={`/asset/${item.id}`} className="absolute inset-0 z-30"></Link>
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/40 to-transparent z-10 pointer-events-none"></div>
                <div className="w-full h-full bg-slate-800 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <span className="text-5xl opacity-50">🎵</span>
                </div>
                <button className="absolute inset-0 m-auto w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-20 pointer-events-none">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                    <Link href={`/asset/${item.id}`} className="hover:text-[var(--color-primary)] transition-colors max-w-[80%]">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                    </Link>
                    <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded whitespace-nowrap font-sans">音频记录</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2 font-sans">
                    {item.story || "暂无描述信息。"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-sm font-sans">
                  <div className="flex flex-wrap items-center gap-4">
                    {item.year && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>录制年份: {item.year}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-4 h-4" />
                        <span>地点: {item.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Waveform Visualization (Mock) */}
                  <div className="flex items-end gap-1 h-8 max-w-[200px] opacity-70">
                    {[20, 40, 60, 30, 50, 80, 40, 20, 10, 20, 30, 10].map((h, i) => (
                      <div key={i} className="w-1 rounded-full transition-all" style={{ height: `${h}%`, backgroundColor: h >= 50 ? 'var(--color-primary)' : 'rgba(212, 17, 17, 0.2)' }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-20 text-center text-slate-500 font-sans border border-dashed border-slate-300 dark:border-slate-800 rounded-xl mt-8">
          暂无该类别档案记录。
        </div>
      )}
    </main>
  );
}
