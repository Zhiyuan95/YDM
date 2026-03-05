import { createClient } from "@/lib/supabase/server";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  ChevronDown, 
  Landmark, 
  Search, 
  Menu, 
  Calendar as CalendarIcon, 
  MapPin, 
  ZoomIn, 
  Home, 
  Image as ImageIcon, 
  Film, 
  User 
} from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import Navbar from "@/components/layout/Navbar";
import HoverVideo from "@/components/discovery/HoverVideo";

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
      
      {/* Header / Navigation via Global Navbar */}
      <Navbar>
        <AuthButton />
      </Navbar>

      <main className="max-w-7xl mx-auto px-4 py-8">
         {/* Breadcrumbs */}
         <nav className="flex items-center gap-2 text-sm mb-8 text-slate-500 dark:text-slate-400 font-sans">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">首页</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--color-primary)] font-medium">{category.label}</span>
         </nav>

         {/* Page Title & Intro */}
         <div className="mb-12 border-l-4 border-[var(--color-primary)] pl-6">
            <h2 className="text-4xl font-bold mb-3">{category.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg opacity-90 leading-relaxed font-sans">
              {category.desc}
            </p>
         </div>

         {/* Filter Bar */}
         <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--color-primary)]/10 font-sans">
            <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
               <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg shadow-sm whitespace-nowrap">
                  <span className="text-sm font-medium">全部年代</span>
                  <ChevronDown className="w-4 h-4" />
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black/20 border border-[var(--color-primary)]/20 rounded-lg hover:border-[var(--color-primary)] transition-colors whitespace-nowrap">
                  <span className="text-sm font-medium">地区选择</span>
                  <ChevronDown className="w-4 h-4" />
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black/20 border border-[var(--color-primary)]/20 rounded-lg hover:border-[var(--color-primary)] transition-colors whitespace-nowrap">
                  <span className="text-sm font-medium">浏览热度</span>
                  <ChevronDown className="w-4 h-4" />
               </button>
            </div>
            <div className="text-sm text-slate-500 w-full sm:w-auto text-left sm:text-right">
                共找到 <span className="text-[var(--color-primary)] font-bold text-lg mx-1">{count || 0}</span> 份数字藏品
            </div>
         </div>

         {/* Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
               <Link key={item.id} href={`/asset/${item.id}`} className="group block cursor-pointer">
                  {/* Image/Media Container */}
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 mb-4 relative drop-shadow-sm border border-[var(--color-primary)]/5">
                     {item.media_type === "image" ? (
                        <div 
                           className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                           style={{ backgroundImage: `url('${item.url}')` }}
                        />
                     ) : item.media_type === "video" ? (
                        <HoverVideo id={item.id} url={item.url} hasLinkWrapper={false} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     ) : item.media_type === "document" ? (
                        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-12 transition-transform duration-700 group-hover:bg-zinc-200">
                           <div 
                              className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105 drop-shadow-sm" 
                              style={{ backgroundImage: `url('/document_thumbnail.png')` }}
                           />
                        </div>
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-[var(--color-primary)] transition-transform duration-700 group-hover:scale-105">
                           <span className="opacity-50 text-4xl">🎵</span>
                        </div>
                     )}
                     
                  </div>

                  {/* Metadata Info */}
                  <div>
                     <h3 className="text-lg font-bold group-hover:text-[var(--color-primary)] transition-colors mb-1 truncate">
                        {item.title}
                     </h3>
                     <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-sans mt-2">
                        {item.year && (
                           <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> {item.year}</span>
                        )}
                        {item.location && (
                           <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                        )}
                     </div>
                  </div>
               </Link>
            ))}
         </div>

         {items.length === 0 && (
            <div className="py-20 text-center text-slate-500 font-sans border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
               暂无该类别档案记录。
            </div>
         )}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] border-t border-[var(--color-primary)]/10 px-4 pb-4 pt-2 flex justify-around md:hidden z-50 font-sans shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <Link className="flex flex-col items-center gap-1 text-slate-500 hover:text-[var(--color-primary)] transition-colors" href="/">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">首页</span>
         </Link>
         <Link className={`flex flex-col items-center gap-1 transition-colors ${type === 'images' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-[var(--color-primary)]'}`} href="/images">
            <ImageIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">图片</span>
         </Link>
         <Link className={`flex flex-col items-center gap-1 transition-colors ${type === 'videos' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-[var(--color-primary)]'}`} href="/videos">
            <Film className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">视频</span>
         </Link>
         <Link className="flex flex-col items-center gap-1 text-slate-500 hover:text-[var(--color-primary)] transition-colors" href="/admin/login">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-0.5">我的</span>
         </Link>
      </nav>
    </div>
  );
}
