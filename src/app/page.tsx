import { createClient } from "@/lib/supabase/server";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MapPin, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "@/components/auth/AuthButton";
import SearchBar from "@/components/discovery/SearchBar";
import TimelineSlider from "@/components/discovery/TimelineSlider";
import HoverVideo from "@/components/discovery/HoverVideo";
import HeroGallery from "@/components/discovery/HeroGallery";

export const revalidate = 0; // Disable caching for MVP

interface PageProps {
  searchParams: Promise<{
    q?: string;
    title?: string;
    story?: string;
    yearStart?: string;
    yearEnd?: string;
    location?: string;
    mediaType?: string;
  }>;
}

export default async function DiscoveryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  
  let query = supabase
    .from("archive_assets")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,story.ilike.%${params.q}%`);
  }
  if (params.title) query = query.ilike("title", `%${params.title}%`);
  if (params.story) query = query.ilike("story", `%${params.story}%`);
  if (params.yearStart) query = query.gte("year", parseInt(params.yearStart));
  if (params.yearEnd) query = query.lte("year", parseInt(params.yearEnd));
  if (params.location) query = query.ilike("location", `%${params.location}%`);
  if (params.mediaType) {
    query = query.in("media_type", params.mediaType.split(","));
  }

  const { data: assets, error } = await query;

  if (error) {
    return <div className="p-8 text-red-500">Failed to load archive: {error.message}</div>;
  }

  // Fetch images specifically for the hero moving gallery (limit to 10 recent images)
  const { data: galleryAssets } = await supabase
    .from("archive_assets")
    .select("id, title")
    .eq("media_type", "image")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);
    
  const galleryImages = (galleryAssets || []).map(asset => ({
    id: asset.id,
    title: asset.title,
    url: `/api/image/${asset.id}`
  }));

  // Generate short-lived signed URLs for Video/Audio safely to support range-requests.
  // Images will use our stable /api/image proxy to utilize Next.js Image caching.
  const items = await Promise.all(
    (assets || []).map(async (asset) => {
      if (asset.media_type === "image") {
        return { ...asset, url: `/api/image/${asset.id}` };
      }
      if (asset.media_type === "document") {
        return { ...asset, url: "" };
      }
      
      try {
        const command = new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: asset.storage_path,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { ...asset, url };
      } catch (e) {
        console.error("Failed to sign url for", asset.id);
        return { ...asset, url: "" };
      }
    })
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20 relative">
      
      {/* Top Navigation / Auth / User Management */}
      <div className="absolute top-6 right-6 sm:right-8 z-10">
        <AuthButton />
      </div>

      {/* Header */}
      <header className="px-4 sm:px-8 py-16 pt-24 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif tracking-tight mb-4">度母之光</h1>
        <p className="text-zinc-500 text-lg mb-12">
          An exploration of historical and modern media. Documenting stories, places, and times.
        </p>

        {galleryImages.length > 0 && <HeroGallery images={galleryImages} />}
        
        <SearchBar />
      </header>

      {/* Fortepan Style Timeline */}
      <TimelineSlider startYear={1900} endYear={new Date().getFullYear()} />

      {/* Masonry Grid */}
      <main className="px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto min-h-screen">
        {items.length === 0 ? (
          <div className="text-center text-zinc-400 py-20 border border-dashed border-zinc-200 rounded-2xl">
            No results found.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="break-inside-avoid relative group bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Media Render */}
                {item.media_type === "document" ? (
                  <Link href={`/read/${item.id}`} className="block">
                    <div className="w-full bg-zinc-100 flex flex-col items-center justify-center py-20 px-8 text-zinc-400 group-hover:bg-zinc-200 transition-colors">
                      <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span className="text-sm font-medium">Read Document</span>
                    </div>
                  </Link>
                ) : item.media_type === "video" ? (
                  <HoverVideo id={item.id} url={item.url} />
                ) : item.media_type === "audio" ? (
                  <audio 
                    src={item.url} 
                    controls 
                    className="w-full mt-4 px-4 pb-4" 
                  />
                ) : (
                  <Link href={`/asset/${item.id}`} className="block">
                    <Image 
                      src={item.url} 
                      alt={item.title}
                      width={800}
                      height={800}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ width: '100%', height: 'auto' }}
                      className="bg-zinc-100 group-hover:brightness-95 transition-all"
                    />
                  </Link>
                )}

                {/* Overlay / Info */}
                <div className="p-5">
                  <h3 className="font-medium text-lg mb-2 leading-tight">{item.title}</h3>
                  
                  {(item.year || item.location) && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-3 font-medium">
                      {item.year && (
                         <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {item.year}</span>
                      )}
                      {item.location && (
                         <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {item.location}</span>
                      )}
                    </div>
                  )}

                  {item.story && (
                    <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {item.story}
                    </p>
                  )}
                  {item.media_type === "document" && (
                     <div className="mt-4 pt-4 border-t border-zinc-100">
                        <Link href={`/read/${item.id}`} className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors">
                          Open Reader
                        </Link>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
