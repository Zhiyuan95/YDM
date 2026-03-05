import { supabase } from "@/lib/supabase/client";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MapPin, Calendar } from "lucide-react";

export const revalidate = 0; // Disable caching for MVP

export default async function DiscoveryPage() {
  const { data: assets, error } = await supabase
    .from("archive_assets")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Failed to load archive: {error.message}</div>;
  }

  // Generate short-lived signed URLs for each asset to view securely
  const items = await Promise.all(
    (assets || []).map(async (asset) => {
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
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20">
      
      {/* Header */}
      <header className="px-8 py-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif tracking-tight mb-4">Digital Archive</h1>
        <p className="text-zinc-500 text-lg">
          An exploration of historical and modern media. Documenting stories, places, and times.
        </p>
      </header>

      {/* Masonry Grid */}
      <main className="px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {items.length === 0 ? (
          <div className="text-center text-zinc-400 py-20 border border-dashed border-zinc-200 rounded-2xl">
            The archive is currently empty.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="break-inside-avoid relative group bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 transition-all hover:shadow-md"
              >
                {/* Media Render */}
                {item.media_type === "video" ? (
                  <video 
                    src={item.url} 
                    controls 
                    className="w-full h-auto object-cover bg-zinc-100"
                    preload="metadata"
                  />
                ) : item.media_type === "audio" ? (
                  <audio 
                    src={item.url} 
                    controls 
                    className="w-full mt-4 px-4 pb-4" 
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-auto object-cover bg-zinc-100"
                    loading="lazy"
                  />
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
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
