import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import AuthButton from "@/components/auth/AuthButton";
import SearchBar from "@/components/discovery/SearchBar";
import TimelineSlider from "@/components/discovery/TimelineSlider";
import HeroGallery from "@/components/discovery/HeroGallery";
import Link from "next/link";
import { ImageIcon, Film, FileType } from "lucide-react";

export const revalidate = 0;

export default async function LandingPage() {
  const supabase = await createClient();

  // Fetch images specifically for the hero moving gallery (limit to 10 recent images)
  const { data: galleryAssets } = await supabase
    .from("archive_assets")
    .select("id, title")
    .eq("media_type", "image")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);

  const galleryImages = (galleryAssets || []).map((asset) => ({
    id: asset.id,
    title: asset.title,
    url: `/api/image/${asset.id}`,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20 relative pt-16">
      <Navbar>
        <AuthButton />
      </Navbar>

      {/* Hero Banner / Gallery */}
      <div className="relative w-full">
        {galleryImages.length > 0 ? (
          <HeroGallery images={galleryImages}>
            <div className="max-w-2xl text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight mb-6 leading-tight drop-shadow-lg text-white">
                度母之光
                <span className="block text-2xl md:text-3xl text-white/80 mt-2 font-light">
                  Digital Archive
                </span>
              </h1>
              <p className="text-white/90 text-lg sm:text-xl font-light leading-relaxed mb-8 drop-shadow-md">
                An exploration of historical and modern media. Documenting stories, places, and times.
              </p>
            </div>
          </HeroGallery>
        ) : (
          <div className="w-full h-[50vh] min-h-[450px] bg-black flex flex-col justify-center px-8 sm:px-16 text-white">
            <div className="max-w-2xl relative z-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight mb-6 leading-tight">
                度母之光
                <span className="block text-2xl md:text-3xl text-zinc-400 mt-2 font-light">
                  Digital Archive
                </span>
              </h1>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto z-50 relative">
        <SearchBar />
      </div>

      {/* Fortepan Style Timeline */}
      <div className="mt-8 mb-16">
        <TimelineSlider startYear={1900} endYear={new Date().getFullYear()} />
      </div>

      <main className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Browse Collections styled like Category Pages */}
        <div className="mb-16 border-l-4 border-red-800 pl-6">
           <h2 className="text-4xl font-bold mb-3 text-zinc-900">Browse Collections</h2>
           <p className="text-zinc-600 max-w-2xl text-lg opacity-90 leading-relaxed font-sans mb-8">
             根据媒体类型探索我们的数字档案，所有的音视频影像均独立进行分类展示。
           </p>

           <div className="flex flex-wrap gap-4 w-full md:w-auto mt-6">
              <Link href="/images" className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm hover:border-red-800 hover:text-red-800 transition-all min-w-[140px] justify-center group">
                 <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-red-800 transition-colors" />
                 <span className="text-base font-bold text-zinc-700 group-hover:text-red-800 transition-colors">图片</span>
              </Link>
              <Link href="/videos" className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm hover:border-red-800 hover:text-red-800 transition-all min-w-[140px] justify-center group">
                 <Film className="w-5 h-5 text-zinc-400 group-hover:text-red-800 transition-colors" />
                 <span className="text-base font-bold text-zinc-700 group-hover:text-red-800 transition-colors">视频</span>
              </Link>
              <Link href="/audio" className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm hover:border-red-800 hover:text-red-800 transition-all min-w-[140px] justify-center group">
                 <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">🎵</span>
                 <span className="text-base font-bold text-zinc-700 group-hover:text-red-800 transition-colors">音频</span>
              </Link>
              <Link href="/documents" className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm hover:border-red-800 hover:text-red-800 transition-all min-w-[140px] justify-center group">
                 <FileType className="w-5 h-5 text-zinc-400 group-hover:text-red-800 transition-colors" />
                 <span className="text-base font-bold text-zinc-700 group-hover:text-red-800 transition-colors">文献</span>
              </Link>
           </div>
        </div>

        {/* Intro text separated and placed below collections */}
        <section className="mt-16 pt-16 border-t border-zinc-200 flex flex-col md:flex-row gap-8 lg:gap-16 font-serif">
          <div className="flex-1 font-sans text-zinc-600 text-lg leading-[1.8] space-y-6 max-w-3xl">
             <p>This digital repository was created to preserve and share the profound spiritual heritage, stories, and historical moments captured over time. The archive expands through donations from researchers, centers, and photographers, along with public collections.</p>
             <p>All historical materials are digitized in high resolution and made accessible for everyone to browse and download, free of charge.</p>
          </div>
        </section>

      </main>
    </div>
  );
}
