"use client";

import Link from "next/link";
import { ChevronRight, History, Library, FileText, BookOpen, Download, Search } from "lucide-react";

export default function DocumentArchiveView({ category, items, count }: { category: any, items: any[], count: number }) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Breadcrumbs */}
      <nav className="py-4 font-sans mb-2">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors cursor-pointer">首页</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-[var(--color-primary)]">{category.label}</span>
        </p>
      </nav>

      {/* Page Title */}
      <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 font-sans mb-8">
            {category.desc}
          </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 overflow-x-auto font-sans">
        <div className="flex border-b border-[var(--color-primary)]/10 gap-8 whitespace-nowrap">
          <button className="flex flex-col items-center justify-center border-b-2 border-[var(--color-primary)] text-slate-900 dark:text-slate-100 pb-3 pt-2">
            <p className="text-sm font-bold tracking-wide">全部文献</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 hover:text-[var(--color-primary)] pb-3 pt-2 transition-colors">
            <p className="text-sm font-medium">珍稀古籍</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 hover:text-[var(--color-primary)] pb-3 pt-2 transition-colors">
            <p className="text-sm font-medium">经典经文</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 hover:text-[var(--color-primary)] pb-3 pt-2 transition-colors">
            <p className="text-sm font-medium">历史文献</p>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 font-sans">
        <label className="flex flex-col w-full group">
          <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-slate-800 shadow-sm border border-[var(--color-primary)]/10 group-focus-within:border-[var(--color-primary)]/40 transition-all">
            <div className="text-[var(--color-primary)]/50 flex items-center justify-center pl-4">
              <Search className="w-5 h-5" />
            </div>
            <input 
              className="w-full bg-transparent border-none focus:ring-0 px-4 text-base placeholder:text-slate-400 outline-none" 
              placeholder="搜索文献名称、作者或关键字..." 
            />
          </div>
        </label>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {items.map((item) => (
           <div key={item.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/20 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                 <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] whitespace-nowrap font-bold rounded uppercase tracking-wider font-sans">
                          {item.media_type === "document" ? "文献" : "古籍"}
                       </span>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                       </h3>
                    </div>
                    
                    {/* Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 text-sm text-slate-500 dark:text-slate-400 font-sans mt-3">
                       {item.year && (
                          <div className="flex items-center gap-1.5 truncate">
                             <History className="w-4 h-4 shrink-0" />
                             <span className="truncate">成书年份：{item.year}</span>
                          </div>
                       )}
                       {item.location && (
                          <div className="flex items-center gap-1.5 truncate">
                             <Library className="w-4 h-4 shrink-0" />
                             <span className="truncate">收藏来源：{item.location}</span>
                          </div>
                       )}
                       {item.story && (
                          <div className="flex items-center gap-1.5 col-span-1 lg:col-span-1 truncate">
                             <FileText className="w-4 h-4 shrink-0" />
                             <span className="truncate">摘要：{item.story}</span>
                          </div>
                       )}
                    </div>
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="flex items-center gap-3 mt-4 md:mt-0 md:pl-4 shrink-0 font-sans">
                    <Link href={`/read/${item.id}`} className="flex-1 md:flex-none px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/90 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                       <BookOpen className="w-4 h-4" />
                       阅读原文
                    </Link>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/20 transition-colors whitespace-nowrap">
                       <Download className="w-4 h-4" />
                       下载PDF
                    </button>
                 </div>
              </div>
           </div>
        ))}

        {items.length === 0 && (
          <div className="py-20 text-center text-slate-500 font-sans border border-dashed border-slate-300 dark:border-slate-800 rounded-xl mt-8">
            暂无该类别档案记录。
          </div>
        )}
      </div>

      {/* Pagination (Simple Demo) */}
      {items.length > 0 && (
         <div className="mt-12 flex justify-center items-center gap-4 font-sans">
            <button className="p-2 border border-[var(--color-primary)]/20 rounded-full text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 disabled:opacity-30" disabled>
               <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex gap-2">
               <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm font-bold shadow-sm">1</span>
            </div>
            <button className="p-2 border border-[var(--color-primary)]/20 rounded-full text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 disabled:opacity-30" disabled>
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      )}
    </main>
  );
}
