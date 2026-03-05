"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";

interface DocumentReaderProps {
  content: string;
  title: string;
  year?: number | null;
  location?: string | null;
  story?: string | null;
}

export default function DocumentReader({ content, title, year, location, story }: DocumentReaderProps) {
  // Font size scale: 0 is default. Negative means smaller, positive means larger.
  const [fontScale, setFontScale] = useState(0);

  const increaseFont = () => setFontScale((s) => Math.min(s + 1, 4));
  const decreaseFont = () => setFontScale((s) => Math.max(s - 1, -2));

  // Determine prose size class based on scale
  let proseSizeClass = "prose-base";
  if (fontScale === -2) proseSizeClass = "prose-sm";
  if (fontScale === -1) proseSizeClass = "prose-base text-sm";
  if (fontScale === 0) proseSizeClass = "prose-base";
  if (fontScale === 1) proseSizeClass = "prose-lg";
  if (fontScale === 2) proseSizeClass = "prose-xl";
  if (fontScale === 3) proseSizeClass = "prose-2xl";
  if (fontScale === 4) proseSizeClass = "prose-2xl text-2xl";

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-200">
      {/* Top Header & Controls */}
      <header className="sticky top-0 z-10 bg-[#fafafa]/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors"
            aria-label="Back to Archive"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Archive</span>
          </Link>
          
          <div className="flex items-center space-x-1 bg-white border border-zinc-200 rounded-full p-1 shadow-sm">
            <button 
              onClick={decreaseFont}
              disabled={fontScale === -2}
              className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30 transition-all"
              aria-label="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-zinc-400 w-6 text-center select-none cursor-default">
              A
            </span>
            <button 
              onClick={increaseFont}
              disabled={fontScale === 4}
              className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30 transition-all"
              aria-label="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 sm:py-24 px-6 sm:px-12">
        <article className="max-w-3xl mx-auto">
          {/* Metadata Section */}
          <header className="mb-16 italic text-center text-zinc-600 font-serif">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-zinc-900 mb-6 leading-tight">
              {title}
            </h1>
            
            <div className="flex justify-center space-x-6 text-sm">
              {year && <span>{year}</span>}
              {location && <span>{location}</span>}
            </div>

            {story && (
              <p className="mt-8 text-base text-zinc-500 leading-relaxed max-w-xl mx-auto not-italic">
                {story}
              </p>
            )}
          </header>

          <hr className="w-16 border-t border-zinc-300 mx-auto mb-16" />

          {/* Markdown Body */}
          <div 
            className={`prose prose-zinc mx-auto transition-all duration-300 ${proseSizeClass} focus:outline-none`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      
      {/* Minimal Footer */}
      <footer className="py-12 text-center text-zinc-400 text-sm">
        <p>YDM Digital Archive</p>
      </footer>
    </div>
  );
}
