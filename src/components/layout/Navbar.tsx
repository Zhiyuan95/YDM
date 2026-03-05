"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLinks() {
  const pathname = usePathname();

  const links = [
    { label: "全部", value: "/" },
    { label: "图片", value: "/images" },
    { label: "视频", value: "/videos" },
    { label: "音频", value: "/audio" },
    { label: "文档", value: "/documents" },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {links.map((link) => {
        const isActive = pathname === link.value;
        return (
          <Link
            key={link.label}
            href={link.value}
            className={`text-sm font-medium transition-colors hover:text-red-900 ${
              isActive
                ? "text-red-800 border-b-2 border-red-800 pb-1"
                : "text-zinc-600"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Navbar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  // If we are in the reader or asset detail, we might want a different navbar or none,
  // but for now, we'll keep it global or just return null if needed.
  if (pathname.startsWith("/read/") || pathname.startsWith("/asset/")) {
    return null; // hide on detail pages to maintain immersion
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-100 z-50 flex items-center justify-between px-6 sm:px-10">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center space-x-2">
        {/* A simple placeholder logo using CSS */}
        <div className="flex gap-0.5">
          <div className="w-2 h-5 rounded-full bg-orange-400"></div>
          <div className="w-2 h-7 rounded-full bg-red-500 transform translate-y-1"></div>
          <div className="w-2 h-5 rounded-full bg-blue-500"></div>
        </div>
        <div className="flex flex-col ml-1 leading-none">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#5c1c1c]">
            度母之光
          </span>
          <span className="text-[0.55rem] tracking-[0.2em] text-zinc-400 font-sans uppercase uppercase mt-0.5">
            Digital Archive
          </span>
        </div>
      </Link>

      {/* Center: Navigation */}
      <Suspense fallback={<div className="w-48" />}>
        <NavLinks />
      </Suspense>

      {/* Right: Auth / Profile */}
      <div className="flex items-center">{children}</div>
    </header>
  );
}
