import { createClient } from "@/lib/supabase/server";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AssetActions from "@/components/discovery/AssetActions";
import AssetNavigation from "@/components/discovery/AssetNavigation";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: asset } = await supabase
    .from("archive_assets")
    .select("*")
    .eq("id", id)
    .single();

  if (!asset) {
    notFound();
  }

  if (asset.status !== "published") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      notFound();
    }
  }

  if (asset.media_type === "document") {
    // Documents use the specialized Reader View
    redirect(`/read/${asset.id}`);
  }

  let mediaUrl = "";
  if (asset.media_type === "image") {
    mediaUrl = `/api/image/${asset.id}`;
  } else {
    try {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: asset.storage_path,
      });
      mediaUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (e) {
      console.error("Failed to generate secure media url");
      mediaUrl = "";
    }
  }

  // Identify adjacent assets for Next/Prev chronological navigation
  const { data: nextItem } = await supabase
    .from("archive_assets")
    .select("id")
    .eq("status", "published")
    .gt("created_at", asset.created_at)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  const { data: prevItem } = await supabase
    .from("archive_assets")
    .select("id")
    .eq("status", "published")
    .lt("created_at", asset.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-black text-zinc-900 font-sans overflow-hidden">
      <Link 
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center p-2 text-white/50 hover:text-white transition-colors"
        title="Return to Archive"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Media Presentation Side (Left - Dark) */}
      <div className="flex-1 lg:w-[80%] relative flex items-center justify-center p-8 min-h-[50vh] md:min-h-screen overflow-hidden group">
        <AssetActions mediaUrl={mediaUrl} />
        <AssetNavigation prevId={prevItem?.id} nextId={nextItem?.id} />
        
        {asset.media_type === "image" ? (
           <div className="relative w-full h-full pointer-events-none">
             <Image 
                id="asset-media-element"
                src={mediaUrl}
                alt={asset.title}
                fill
                className="object-contain pointer-events-auto"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
             />
          </div>
        ) : asset.media_type === "video" ? (
          <video 
            id="asset-media-element"
            src={mediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        ) : asset.media_type === "audio" ? (
          <div className="w-full max-w-md p-12 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl flex flex-col items-center justify-center">
             <div className="w-24 h-24 mb-8 bg-zinc-800 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-zinc-500 rounded-full" />
             </div>
             <audio src={mediaUrl} controls className="w-full outline-none" />
          </div>
        ) : null}
      </div>

      {/* Informational Side (Right - Light) */}
      <div className="w-full lg:w-[20%] bg-white p-8 overflow-y-auto custom-scrollbar lg:border-l border-zinc-200 min-w-[300px]">
        <article className="pt-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-8 leading-snug text-zinc-900">
            {asset.title}
          </h1>

          {(asset.year || asset.location) && (
            <div className="flex flex-col gap-5 text-xs font-bold text-zinc-800 uppercase tracking-widest mb-8">
              {asset.year && (
                 <div>
                   <span className="block text-[10px] text-zinc-400 mb-1 font-semibold">YEAR</span>
                   <span className="text-sm">{asset.year}</span>
                 </div>
              )}
              {asset.location && (
                 <div>
                   <span className="block text-[10px] text-zinc-400 mb-1 font-semibold">LOCATION</span>
                   <span className="text-sm">{asset.location}</span>
                 </div>
              )}
              <div>
                 <span className="block text-[10px] text-zinc-400 mb-1 font-semibold">ASSET ID</span>
                 <span className="font-mono text-sm">{asset.id.split('-')[0]}</span>
              </div>
            </div>
          )}

          <div className="mt-8 text-sm text-zinc-700 leading-relaxed border-t border-zinc-100 pt-6">
            {asset.story ? (
              asset.story.split('\n').map((paragraph: string, i: number) => (
                 <p key={i} className="mb-4">{paragraph}</p>
              ))
            ) : (
              <span className="italic opacity-50">Untold story. No archival records found.</span>
            )}
          </div>
        </article>
      </div>

    </div>
  );
}
