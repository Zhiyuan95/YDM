"use client";

import Link from "next/link";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import UnifiedCategoryFilter from "./UnifiedCategoryFilter";

export default function ImageArchiveView({ category, items, count }: { category: any, items: any[], count: number }) {
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
          {label: '人物肖像', value: 'portrait'}, 
          {label: '历史事件', value: 'history'}, 
          {label: '宗教艺术', value: 'religion'}, 
          {label: '自然风光', value: 'nature'}
        ]}
        yearOptions={[
          {label: '1980年代及之前', value: 'pre-1990'}, 
          {label: '1990-2000', value: '1990s'},
          {label: '2000年之后', value: 'post-2000'}
        ]}
        locationOptions={[
          {label: '拉萨', value: '拉萨'}, 
          {label: '日喀则', value: '日喀则'},
          {label: '阿里', value: '阿里'}
        ]}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <Link key={item.id} href={`/asset/${item.id}`} className="group block cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 mb-4 relative drop-shadow-sm border border-[var(--color-primary)]/5">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: `url('${item.url}')` }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold group-hover:text-[var(--color-primary)] transition-colors mb-1 truncate">
                {item.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-sans mt-2">
                {item.year && (
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.year}</span>
                )}
                {item.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                )}
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
