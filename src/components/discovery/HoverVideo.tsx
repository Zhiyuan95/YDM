"use client";

import React, { useRef } from "react";
import Link from "next/link";

interface HoverVideoProps {
  id: string;
  url: string;
}

export default function HoverVideo({ id, url }: HoverVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseOver = () => {
    if (videoRef.current) {
        // play() returns a promise, we catch it to avoid DOMException if user leaves fast
        videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseOut = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <Link href={`/asset/${id}`} className="block">
      <video 
        ref={videoRef}
        src={url} 
        className="w-full h-auto object-cover bg-zinc-100 group-hover:brightness-95 transition-all"
        preload="metadata"
        muted
        loop
        playsInline
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
    </Link>
  );
}
