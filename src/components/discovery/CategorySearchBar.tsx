"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategorySearchBar({ placeholder }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(defaultQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (query.trim()) {
      current.set("q", query.trim());
    } else {
      current.delete("q");
    }
    const search = current.toString();
    const queryStr = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${queryStr}`);
  };

  return (
    <div className="mb-6 font-sans">
      <form onSubmit={handleSearch} className="flex flex-col w-full group">
        <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-slate-800 shadow-sm border border-[var(--color-primary)]/10 group-focus-within:border-[var(--color-primary)]/40 transition-all">
          <button type="submit" className="text-[var(--color-primary)]/50 flex items-center justify-center pl-4 pr-2 hover:text-[var(--color-primary)] transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 px-2 text-base placeholder:text-slate-400 outline-none" 
            placeholder={placeholder || "搜索名称、描述或关键字..."} 
          />
        </div>
      </form>
    </div>
  );
}
