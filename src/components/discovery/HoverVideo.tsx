"use client";

import { useRef } from "react";
import Link from "next/link";

interface HoverVideoProps {
  id: string;
  url: string;
  className?: string; // Optional custom video classes
  hasLinkWrapper?: boolean; // Whether to wrap the video in a generic <Link>
}

export default function HoverVideo({ id, url, className, hasLinkWrapper = true }: HoverVideoProps) {
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

  const videoElement = (
    <video 
      ref={videoRef}
      src={url} 
      className={className || "w-full h-auto object-cover bg-zinc-100 group-hover:brightness-95 transition-all"}
      preload="metadata"
      muted
      loop
      playsInline
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  );

  if (!hasLinkWrapper) {
    return videoElement;
  }

  return (
    <Link href={`/asset/${id}`} className="block">
      {videoElement}
    </Link>
  );
}
