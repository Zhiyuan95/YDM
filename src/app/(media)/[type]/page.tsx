import { createClient } from "@/lib/supabase/server";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, Image as ImageIcon, Film, User, Music, BookOpen } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import Navbar from "@/components/layout/Navbar";
import ImageArchiveView from "@/components/discovery/ImageArchiveView";
import VideoArchiveView from "@/components/discovery/VideoArchiveView";
import AudioArchiveView from "@/components/discovery/AudioArchiveView";
import DocumentArchiveView from "@/components/discovery/DocumentArchiveView";

export const revalidate = 0;

const categoryMap: Record<string, { dbType: string, title: string, desc: string, label: string }> = {
  "images": { 
    dbType: 'image', 
    label: '图片',
    title: '图片档案馆', 
    desc: '收录历史瞬间，通过影像见证时代的变迁。在这里，每一张照片都是一段被定格的记忆。'
  },
  "videos": { 
    dbType: 'video', 
    label: '视频',
    title: '影像档案馆', 
    desc: '记录动态光影与口述历史，感受更加真实的历史脉搏与沉浸式的故事重现。'
  },
  "audio": { 
    dbType: 'audio', 
    label: '音频',
    title: '声音档案馆', 
    desc: '聆听历史的回音与那些远去的声音。保存口头传承、经文吟唱与时代原声。'
  },
  "documents": { 
    dbType: 'document', 
    label: '文档',
    title: '历史文献馆', 
    desc: '珍贵的文稿与数字档案汇编，原滋原味呈现纸面上的文字记忆。'
  }
};

interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function MediaCategoryPage({ params, searchParams }: PageProps) {
  const { type } = await params;
  const category = categoryMap[type];

  if (!category) {
    notFound();
  }

  const supabase = await createClient();
  
  // Base Query
  let query = supabase
    .from("archive_assets")
    .select("*", { count: "exact" })
    .eq("media_type", category.dbType)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const { data: assets, error, count } = await query;

  if (error) {
    return <div className="p-8 text-red-500 font-display">Failed to load archive: {error.message}</div>;
  }

  // Pre-sign URLs for display securely
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
        return { ...asset, url: "" };
      }
    })
  );

  return (
    <div className="bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] font-display text-slate-900 dark:text-slate-100 min-h-screen pb-20 md:pb-0 pt-16">
      
      <Navbar>
        <AuthButton />
      </Navbar>

      {type === 'images' && <ImageArchiveView category={category} items={items} count={count || 0} />}
      {type === 'videos' && <VideoArchiveView category={category} items={items} count={count || 0} />}
      {type === 'audio' && <AudioArchiveView category={category} items={items} count={count || 0} />}
      {type === 'documents' && <DocumentArchiveView category={category} items={items} count={count || 0} />}

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] border-t border-[var(--color-primary)]/10 px-2 pb-4 pt-2 flex justify-between md:hidden z-50 font-sans shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500 hover:text-[var(--color-primary)] transition-colors" href="/">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">首页</span>
         </Link>
         <Link className={`flex flex-1 flex-col items-center gap-1 transition-colors ${type === 'images' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-[var(--color-primary)]'}`} href="/images">
            <ImageIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">图片</span>
         </Link>
         <Link className={`flex flex-1 flex-col items-center gap-1 transition-colors ${type === 'videos' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-[var(--color-primary)]'}`} href="/videos">
            <Film className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">影像</span>
         </Link>
         <Link className={`flex flex-1 flex-col items-center gap-1 transition-colors ${type === 'documents' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-[var(--color-primary)]'}`} href="/documents">
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">文献</span>
         </Link>
         <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500 hover:text-[var(--color-primary)] transition-colors" href="/admin/login">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">我的</span>
         </Link>
      </nav>
    </div>
  );
}
