"use client";

import { Share2, Download, Maximize, Check } from "lucide-react";
import { useState } from "react";

export default function AssetActions({ mediaUrl }: { mediaUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    // Copy the current URL, which is the asset's standalone URL
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFullscreen = () => {
    const media = document.getElementById("asset-media-element");
    if (media && media.requestFullscreen) {
      media.requestFullscreen();
    }
  };

  return (
    <div className="absolute top-6 right-6 z-50 flex items-center gap-4 text-white/50">
      <button 
        onClick={handleFullscreen} 
        className="hover:text-white transition-colors p-2" 
        title="Fullscreen"
      >
        <Maximize className="w-5 h-5" />
      </button>
      
      <a 
        href={mediaUrl} 
        download 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-white transition-colors p-2" 
        title="Download Original"
      >
        <Download className="w-5 h-5" />
      </a>

      <button 
        onClick={handleCopyLink} 
        className="hover:text-white transition-colors p-2" 
        title="Copy Link"
      >
        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
