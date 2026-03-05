import { createClient } from "@/lib/supabase/server";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col md:flex-row">
      <Link 
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center p-2 bg-black/40 backdrop-blur rounded-full text-zinc-300 hover:text-white transition-colors border border-white/10"
      >
        <ArrowLeft className="w-5 h-5 mx-1" />
        <span className="text-sm font-medium mr-2">Archive</span>
      </Link>

      {/* Media Presentation Side (Left) */}
      <div className="flex-1 lg:w-2/3 h-[50vh] md:h-screen relative flex items-center justify-center bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-8">
        {asset.media_type === "image" ? (
          <div className="relative w-full h-full">
             <Image 
                src={mediaUrl}
                alt={asset.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
             />
          </div>
        ) : asset.media_type === "video" ? (
          <video 
            src={mediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        ) : asset.media_type === "audio" ? (
          <div className="w-full max-w-md p-12 bg-zinc-800 rounded-3xl shadow-xl flex flex-col items-center justify-center">
             <div className="w-24 h-24 mb-8 bg-zinc-700 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-zinc-400 rounded-full" />
             </div>
             <audio src={mediaUrl} controls className="w-full outline-none" />
          </div>
        ) : (
          <div className="w-full max-w-md p-12 bg-zinc-800 rounded-3xl shadow-xl flex flex-col items-center justify-center">
             <div className="w-24 h-24 mb-8 bg-zinc-700 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-zinc-400 rounded-full" />
             </div>
          </div>
        )}
      </div>

      {/* Informational Side (Right) */}
      <div className="flex-1 lg:w-1/3 bg-zinc-950 p-8 md:p-12 lg:p-16 h-auto md:h-screen overflow-y-auto">
        <article className="max-w-md mx-auto xl:mx-0 pt-16 md:pt-16">
          <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-8 leading-tight">
            {asset.title}
          </h1>

          {(asset.year || asset.location) && (
            <div className="flex flex-col gap-4 text-sm font-medium text-zinc-400 uppercase tracking-widest mb-10 pb-8 border-b border-zinc-800">
              {asset.year && (
                 <span className="flex items-center">
                   <Calendar className="w-4 h-4 mr-3 opacity-60" /> {asset.year}
                 </span>
              )}
              {asset.location && (
                 <span className="flex items-center">
                   <MapPin className="w-4 h-4 mr-3 opacity-60" /> {asset.location}
                 </span>
              )}
            </div>
          )}

          {asset.story ? (
            <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-loose text-lg">
              {asset.story.split('\n').map((paragraph: string, i: number) => (
                 <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div className="text-zinc-600 italic mt-8 flex items-center h-32">
              <span className="w-8 h-px bg-zinc-800 mr-4" />
              Untold story. No archival records found.
            </div>
          )}
        </article>
      </div>

    </div>
  );
}
