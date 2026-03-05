"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroGalleryProps {
  images: { id: string; url: string; title: string }[];
}

export default function HeroGallery({ images }: HeroGalleryProps) {
  if (!images || images.length === 0) return null;

  // Duplicate the list to create a seamless infinite scroll effect
  const duplicatedImages = [...images, ...images];

  return (
    <div className="w-full overflow-hidden relative mb-12 -mx-4 sm:mx-0 sm:rounded-3xl border border-zinc-100 bg-zinc-50/50 shadow-inner h-48 sm:h-64 pt-4 pb-4 mask-edges">
       <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
      <div className="flex gap-4 w-max animate-scroll h-full px-4">
        {duplicatedImages.map((img, idx) => (
          <Link 
            key={`${img.id}-${idx}`} 
            href={`/asset/${img.id}`}
            className="relative h-full aspect-video rounded-2xl overflow-hidden group shadow-sm flex-shrink-0"
          >
            <Image
              src={img.url}
              alt={img.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 250px, 350px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
