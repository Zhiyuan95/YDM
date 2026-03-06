"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroGalleryProps {
  images: { id: string; url: string; title: string }[];
  children?: React.ReactNode;
}

export default function HeroGallery({ images, children }: HeroGalleryProps) {
  if (!images || images.length === 0) return null;

  // Duplicate the list to create a seamless infinite scroll effect
  const duplicatedImages = [...images, ...images];

  return (
    <div className="w-full relative  h-[50vh] min-h-[450px] lg:h-[60vh] flex items-center overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slowPan {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-slowPan {
          animation: slowPan 60s linear infinite;
        }
        .animate-slowPan:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />

      {/* Sliding Images Container (Shifted right logically by gradient) */}
      <div className="absolute inset-0 z-0 flex gap-4 w-max animate-slowPan px-4 opacity-60">
        {duplicatedImages.map((img, idx) => (
          <Link
            key={`${img.id}-${idx}`}
            href={`/asset/${img.id}`}
            className="relative h-full aspect-[21/9] sm:aspect-video rounded-none overflow-hidden group shadow-sm flex-shrink-0"
          >
            <Image
              src={img.url}
              alt={img.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={idx < 2}
            />
          </Link>
        ))}
      </div>

      {/* Heavy Gradient Overlay to make left side black for text readability */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-[#7A1F1F] via-[#8C1D18]/80 to-[#C9A227]/10 pointer-events-none"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#7A1F1F] via-transparent to-[#8C1D18]/40 pointer-events-none" />

      {/* Text Overlay Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 sm:px-12 md:px-16 flex flex-col justify-center h-full text-white">
        {children}
      </div>
    </div>
  );
}
